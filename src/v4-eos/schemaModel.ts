// Schema engine — turns the REAL Iceberg layout schemas (extracted from the
// elements-streamly package into schemas/layoutSchemas.json) into (a) Structure
// tree subtrees and (b) the schema-driven Properties panels those nodes render.
//
// This is the V4 analog of how production Iceberg drives its editor: a layout's
// `optionData` (+ `globalLayoutOptionData`) is a recursive field tree where
//   • leaf fields (mentionsInput / select / iconSelect / rich-text-2 …) become
//     editable rows in the right panel,
//   • `tabs` fields become CHILD COLLECTIONS in the Structure tree (each tab an
//     item you can add/remove up to tabsConfig.maxSize),
//   • `schema-switcher` fields become a selector plus the chosen option's fields,
//   • presentational fields (section-heading / comment / hr) become group heads.
//
// The schema supplies field DEFINITIONS and DEFAULT values; per-instance edits
// live on `node.content` (keyed by field label) exactly like placeholder.content.
import rawSchemas from "./schemas/layoutSchemas.json";
import type {
  ObjectProperties,
  PropertyField,
  PropertyGroup,
  StructureNode,
} from "./data";

// --- Raw schema shapes (as extracted) --------------------------------------
interface RawSelectOption {
  label?: string;
  value?: string;
  default?: boolean;
}
interface RawField {
  id?: string;
  _id?: string;
  name?: string;
  type?: string;
  validations?: { type?: string }[];
  selectOptions?: RawSelectOption[];
  defaultValue?: unknown;
  default?: unknown;
  useToggle?: boolean;
  tabsConfig?: { minSize?: number; maxSize?: number };
  // `items` = a tab's per-item field schema, OR a switcher's option groups.
  items?: RawField[];
}
interface RawSchema {
  _id: string;
  name: string;
  layoutType?: string;
  globalLayoutOptionData?: RawField[];
  optionData?: RawField[];
}

const SCHEMAS = rawSchemas as unknown as Record<string, RawSchema>;

export function getLayoutSchema(id: string): RawSchema | null {
  return SCHEMAS[id] ?? null;
}
export function hasLayoutSchema(id: string): boolean {
  return id in SCHEMAS;
}

// Fresh, collision-proof ids for every node in a newly built subtree.
let seq = 0;
const uid = (p: string): string =>
  `${p}-${Date.now().toString(36)}-${(seq++).toString(36)}`;

// --- Field type classification ---------------------------------------------
const HIDDEN = new Set(["hidden", "hiddenField"]);
const PRESENTATIONAL = new Set([
  "section-heading",
  "sectionHeading",
  "subHeading",
  "subheading",
  "heading",
  "comment",
  "hr",
  "sectionTitle",
  "divider",
]);
const TEXTAREA = new Set(["rich-text-2", "richText", "rich-text", "textarea"]);
const SELECTISH = new Set([
  "select",
  "svgSelect",
  "multiDeviceSelector",
  "alignmentSelector",
  "roundedCornersSelector",
  "dropdown",
]);
const ASSETISH = new Set([
  "iconSelect",
  "mediaValidator",
  "atomImageSelector",
  "atomLogoSelector",
  "atomVideoSelector",
  "atomCollectionSelector",
  "moduleInstanceSelector",
  "imageUpload",
  "svgUpload",
]);
const SWITCHER = new Set(["schema-switcher", "itemSwitcher", "toggleItemSwitcher"]);

function fieldLabel(f: RawField): string {
  return (f.name || f.id || f._id || "Field").toString();
}
function isRequired(f: RawField): boolean {
  return (f.validations ?? []).some((v) => v?.type === "required");
}
function selectOptionLabels(f: RawField): string[] {
  return (f.selectOptions ?? []).map(
    (o) => (o.label ?? o.value ?? "").toString(),
  );
}
function selectDefault(f: RawField): string | undefined {
  const d = (f.selectOptions ?? []).find((o) => o.default);
  if (d) return (d.label ?? d.value ?? "").toString();
  return undefined;
}
function defaultValueOf(f: RawField): string {
  const dv = f.defaultValue ?? f.default;
  if (dv == null) return "";
  if (typeof dv === "boolean") return dv ? "true" : "false";
  if (typeof dv === "object") return "";
  return String(dv);
}

// A single leaf field → the PropertyField the panel renders. Returns null for
// fields that don't render as an editable row (hidden).
function mapLeafField(f: RawField): PropertyField | null {
  const type = f.type ?? "text";
  if (HIDDEN.has(type)) return null;

  const label = fieldLabel(f);
  const required = isRequired(f);

  if (TEXTAREA.has(type)) {
    return { label, value: defaultValueOf(f), kind: "textarea", required };
  }
  if (SELECTISH.has(type)) {
    const options = selectOptionLabels(f);
    return {
      label,
      value: selectDefault(f) ?? options[0] ?? "",
      kind: "select",
      options,
      required,
    };
  }
  if (ASSETISH.has(type)) {
    return { label, value: defaultValueOf(f), kind: "asset", required };
  }
  if (type === "checkbox") {
    return {
      label,
      value: defaultValueOf(f) || "false",
      kind: f.useToggle ? "switch" : "checkbox",
      required,
    };
  }
  // text-like default (small / medium / mentionsInput / hrefSelector / number /
  // alt-text / date-picker / colour-picker / streamly-voucher-url / …).
  return { label, value: defaultValueOf(f), kind: "text", required };
}

// Expand a schema-switcher into a selector field + the default option's fields.
// (Static: switching the selector doesn't swap fields in the prototype — the
// panel shows the default option's fields, which is enough to author them.)
function expandSwitcher(f: RawField): {
  fields: PropertyField[];
  children: StructureNode[];
} {
  const groups = f.items ?? [];
  const def = groups.find((g) => (g as RawField & { default?: boolean }).default) ?? groups[0];
  const options = groups.map((g) => fieldLabel(g));
  const selector: PropertyField = {
    label: fieldLabel(f),
    value: def ? fieldLabel(def) : options[0] ?? "",
    kind: "select",
    options,
    required: isRequired(f),
  };
  const { groups: optGroups, children } = partitionFields(def?.items ?? []);
  const fields = [selector, ...optGroups.flatMap((g) => g.fields)];
  return { fields, children };
}

// Split a flat field list into (a) grouped property fields for the node itself
// and (b) child collection nodes for any `tabs` fields. Presentational fields
// open a new titled group; the rest accumulate into the current group.
function partitionFields(fields: RawField[]): {
  groups: PropertyGroup[];
  children: StructureNode[];
} {
  const groups: PropertyGroup[] = [];
  const children: StructureNode[] = [];
  let current: PropertyField[] = [];
  let header: string | undefined;

  const flush = () => {
    if (current.length) groups.push({ header, fields: current });
    current = [];
  };

  for (const f of fields) {
    const type = f.type ?? "text";
    if (HIDDEN.has(type)) continue;
    if (type === "tabs") {
      children.push(buildCollectionNode(f));
      continue;
    }
    if (PRESENTATIONAL.has(type)) {
      flush();
      header = fieldLabel(f);
      continue;
    }
    if (SWITCHER.has(type)) {
      const ex = expandSwitcher(f);
      current.push(...ex.fields);
      children.push(...ex.children);
      continue;
    }
    const pf = mapLeafField(f);
    if (pf) current.push(pf);
  }
  flush();
  return { groups, children };
}

function singularize(s: string): string {
  if (/ies$/i.test(s)) return s.replace(/ies$/i, "y");
  if (/s$/i.test(s) && !/ss$/i.test(s)) return s.slice(0, -1);
  return s;
}

// A human item noun for a collection's "Add {noun}" — derived from the item's
// primary text field (e.g. "Product Title" → "Product") or the tab name.
function nounForItems(itemFields: RawField[], tabName: string): string {
  const textish = itemFields.find((f) =>
    ["mentionsInput", "small", "medium", "text", "rich-text-2", "richText"].includes(
      f.type ?? "",
    ),
  );
  if (textish) {
    const stripped = fieldLabel(textish)
      .replace(/\b(Title|Name|Label|Text)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    if (stripped) return stripped;
    return fieldLabel(textish);
  }
  return singularize(tabName);
}

// How many items to seed a freshly built collection with, so the tree/preview
// isn't empty. Respects the schema min/max (single-diff plans → 3, etc.).
function seedCount(min: number, max: number | undefined): number {
  const cap = max ?? 3;
  return Math.max(min, Math.min(3, cap));
}

// A `tabs` field → a Structure collection node. Its children are seeded item
// nodes; the item schema is stored on `childSchema` so "Add {noun}" can build
// more, and the cap is stored on `maxChildren` (tabsConfig.maxSize).
function buildCollectionNode(tab: RawField): StructureNode {
  const itemFields = tab.items ?? [];
  const min = tab.tabsConfig?.minSize ?? 0;
  const max = tab.tabsConfig?.maxSize;
  const noun = nounForItems(itemFields, fieldLabel(tab));
  const n = seedCount(min, max);
  const children: StructureNode[] = [];
  for (let i = 0; i < n; i++) children.push(buildItemNode(itemFields, noun, i));
  return {
    id: uid("col"),
    label: fieldLabel(tab),
    objectType: "schema-collection",
    itemNoun: noun,
    childSchema: itemFields,
    maxChildren: max,
    defaultExpanded: false,
    children,
  };
}

// One collection item → a Structure node carrying its own fields (as node.props)
// and any nested collections (as children).
function buildItemNode(
  itemFields: RawField[],
  noun: string,
  index: number,
): StructureNode {
  const { groups, children } = partitionFields(itemFields);
  const label = `${noun} ${index + 1}`;
  return {
    id: uid("item"),
    label,
    objectType: "schema-item",
    defaultExpanded: false,
    props: {
      kind: "fields",
      data: { eyebrow: noun.toUpperCase(), name: label, groups },
    },
    children: children.length ? children : undefined,
  };
}

// Build a fresh item for a collection node's "Add {noun}" action, from the item
// schema stashed on the node at build time. Falls back to a bare node if the
// collection wasn't schema-built.
export function buildSchemaChild(collection: StructureNode): StructureNode | null {
  const itemFields = collection.childSchema as RawField[] | undefined;
  if (!itemFields) return null;
  const noun = collection.itemNoun ?? "Item";
  const index = collection.children?.length ?? 0;
  return buildItemNode(itemFields, noun, index);
}

// Build a section's own field panel (as ObjectProperties) from a flat field list.
function fieldsPanel(
  fields: RawField[],
  eyebrow: string,
  name: string,
): { data: ObjectProperties; children: StructureNode[] } {
  const { groups, children } = partitionFields(fields);
  return { data: { eyebrow, name, groups }, children };
}

// Build a full page-section subtree from a real layout schema. The section root
// is a metadata node; its children are Section Options (globalLayoutOptionData)
// and Section Content (optionData: section-level fields + tab collections).
export function buildSectionFromSchema(
  schemaId: string,
  label: string,
  role?: string,
): StructureNode | null {
  const schema = getLayoutSchema(schemaId);
  if (!schema) return null;

  const sectionId = uid("section");
  const children: StructureNode[] = [];

  // Section Options ← globalLayoutOptionData (Select Background, Embed Headers…).
  const global = schema.globalLayoutOptionData ?? [];
  if (global.length) {
    const { data } = fieldsPanel(global, "SECTION OPTIONS", "Section Options");
    children.push({
      id: uid("so"),
      label: "Section Options",
      objectType: "section-options",
      props: { kind: "fields", data },
    });
  }

  // Section Content ← optionData (heading/description + Plan Picker Data tabs…).
  const option = schema.optionData ?? [];
  const content = fieldsPanel(option, "SECTION CONTENT", "Section Content");
  children.push({
    id: uid("sc"),
    label: "Section Content",
    objectType: "schema-fields",
    defaultExpanded: true,
    props: { kind: "fields", data: content.data },
    children: content.children.length ? content.children : undefined,
  });

  return {
    id: uid("sec"),
    label,
    objectType: "page-section",
    sectionId,
    role: role ?? schema.name,
    design: "Custom",
    schemaId,
    defaultExpanded: true,
    children,
  };
}
