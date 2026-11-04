// Element registry — the V4 analog of real Iceberg's element manifest.
//
// In production Iceberg the editor loads two catalogs at boot (see
// features/editor/elements): `elements.modules[_id].metaData.items` (module
// field schemas) and `elements.layouts[_id].optionData` (section/layout option
// schemas). Every element TYPE (`_id`) maps to (a) an authoring SCHEMA and
// (b) a preview RENDERER. Instances stored on the artifact
// (`placeholder.content` / `section.settings`) carry only VALUES, keyed by
// field id — never the schema.
//
// V4 mirrors that separation: each Structure node is an element INSTANCE that
// carries its authored VALUES in `node.content`; the SCHEMA is resolved here,
// by the node's `objectType`, from this single registry. This is what makes the
// right panel schema-driven (not hand-built per node) and what lets edits be
// written back onto the instance the way `updatePlaceholderContentByPath` does.
import type {
  ResolvedProperties,
  SectionRole,
  StructureNode,
  StructureObjectType,
} from "./data";
import {
  behavioursState,
  cadenceSchema,
  categorySchema,
  contentAreaSchema,
  contentBlockSchema,
  controlSchema,
  featureSchema,
  productSchema,
  sectionOptionsSchema,
} from "./previews";

// How an element participates in the editor. Mirrors the real distinction
// between layouts (sections), modules (leaf components), and the collection /
// notice authoring affordances the CMS renders.
export type ElementKind =
  | "section" // a page Section (layout) → metadata panel + design mode
  | "module" // a leaf component with an editable field schema
  | "collection" // an ordered list of child instances (+Add / Paste)
  | "notice"; // a deliberate "no configured content" instance

// The preview RENDERER role — the analog of elements-streamly's
// module-registry-async (element type → React render). The in-process preview
// renderer (previewModel.ts + LivePreview/renderer) switches on this instead of
// re-deriving from labels.
export type PreviewRole =
  | "plan-picker" // renders the product-card grid
  | "product" // a single product card
  | "message" // an error / notice copy block
  | "hero" // title + subtitle band
  | "passthrough"; // structural node; render is driven by its subtree

// A single element definition: its kind, the type eyebrow shown in Properties,
// an optional collection item noun, its preview role, and a SCHEMA builder that
// returns the field DEFINITIONS + DEFAULT values (no per-instance data). The
// builder receives the instance so design-mode-dependent schemas
// (e.g. Section Options) can branch, exactly like the real option schemas.
export interface ElementDefinition {
  type: StructureObjectType;
  kind: ElementKind;
  eyebrow?: string;
  itemNoun?: string;
  preview: PreviewRole;
  // Child types this element may contain (documents the containment rules the
  // real section→placeholder→module hierarchy enforces). Advisory in the
  // prototype; consumed by the +Add affordance's allowed list.
  allowedChildren?: StructureObjectType[];
  build?: (node: StructureNode, parent: StructureNode | null) => ResolvedProperties;
}

const metadata = (node: StructureNode): ResolvedProperties => ({
  kind: "metadata",
  data: {
    eyebrow: "SECTION",
    name: node.label,
    role: node.role,
    sectionId: node.sectionId ?? node.id,
    design: node.design ?? "Custom",
    designOptions: ["Custom", "Intelligent authoring"],
    intelligentAffordance: (node.design ?? "Custom") === "Intelligent authoring",
  },
});

const collection = (
  eyebrow: string,
  itemNoun: string,
): ElementDefinition["build"] =>
  (node) => ({
    kind: "collection",
    data: {
      eyebrow: eyebrow || node.label.toUpperCase(),
      name: node.label,
      itemNoun,
      items: (node.children ?? []).map((c) => ({ id: c.id, label: c.label })),
      max: node.maxChildren ?? maxChildrenFor(node.objectType),
    },
  });

const fields = (
  builder: (node: StructureNode, parent: StructureNode | null) => ResolvedProperties,
): ElementDefinition["build"] => builder;

// The registry. Keyed by element TYPE, exactly like elements.modules /
// elements.layouts. Adding a new element type = one entry here (schema +
// preview role), never a new branch scattered across the app.
export const ELEMENT_REGISTRY: Partial<
  Record<StructureObjectType, ElementDefinition>
> = {
  // --- Sections (layouts) --------------------------------------------------
  "page-section": {
    type: "page-section",
    kind: "section",
    preview: "passthrough",
    allowedChildren: [
      "content-area",
      "section-content",
    ],
    build: fields((node) => metadata(node)),
  },
  "content-area": {
    type: "content-area",
    kind: "module",
    preview: "hero",
    build: fields((node) => contentAreaSchema(node.label)),
  },
  "content-block": {
    type: "content-block",
    kind: "module",
    preview: "hero",
    build: fields((node) => ({ kind: "fields", data: contentBlockSchema(node.label) })),
  },
  behaviours: {
    type: "behaviours",
    kind: "module",
    preview: "passthrough",
    build: fields((node, parent) => behavioursState(parent?.label ?? node.label)),
  },
  "section-options": {
    type: "section-options",
    kind: "module",
    preview: "passthrough",
    build: fields((node, parent) => ({
      kind: "fields",
      data: sectionOptionsSchema(node.design ?? parent?.design),
    })),
  },

  // --- Collections ---------------------------------------------------------
  "section-content": {
    type: "section-content",
    kind: "collection",
    preview: "passthrough",
    itemNoun: "Variation",
    allowedChildren: ["variation"],
    build: collection("SECTION CONTENT", "Variation"),
  },
  categories: {
    type: "categories",
    kind: "collection",
    preview: "passthrough",
    itemNoun: "Category",
    allowedChildren: ["category"],
    build: collection("CATEGORIES", "Category"),
  },
  "variant-categories": {
    type: "variant-categories",
    kind: "collection",
    preview: "passthrough",
    itemNoun: "Category",
    allowedChildren: ["category"],
    build: collection("VARIANT CATEGORIES", "Category"),
  },
  products: {
    type: "products",
    kind: "collection",
    preview: "plan-picker",
    itemNoun: "Product",
    allowedChildren: ["product"],
    build: collection("PRODUCTS", "Product"),
  },
  "plan-picker-data": {
    type: "plan-picker-data",
    kind: "collection",
    preview: "plan-picker",
    itemNoun: "Plan",
    allowedChildren: ["product", "plan"],
    build: collection("PLAN PICKER DATA", "Plan"),
  },
  "product-features-list": {
    type: "product-features-list",
    kind: "collection",
    preview: "passthrough",
    itemNoun: "Feature",
    allowedChildren: ["feature"],
    build: collection("PRODUCT FEATURES", "Feature"),
  },
  "price-cadence": {
    type: "price-cadence",
    kind: "collection",
    preview: "passthrough",
    itemNoun: "Cadence",
    allowedChildren: ["cadence"],
    build: collection("PRICE CADENCE", "Cadence"),
  },
  pricing: {
    type: "pricing",
    kind: "collection",
    preview: "passthrough",
    itemNoun: "Pricing Option",
    allowedChildren: ["pricing-option"],
    build: collection("PRICING", "Pricing Option"),
  },

  // --- Leaf modules (field schemas) ---------------------------------------
  variation: {
    type: "variation",
    kind: "module",
    preview: "passthrough",
    allowedChildren: ["categories", "variant-categories"],
    build: fields((node) => {
      // Predecision is a deliberate empty variation (real Iceberg's "no
      // configured content" state) until content is added.
      if (node.label.toLowerCase() === "predecision" && !node.children?.length) {
        return {
          kind: "notice",
          data: {
            eyebrow: "CONTENT VARIATION",
            name: node.label,
            message: "This variation has no configured content.",
            detail: "Add a module or duplicate the Control variation to populate it.",
          },
        };
      }
      return { kind: "fields", data: controlSchema(node.label) };
    }),
  },
  category: {
    type: "category",
    kind: "module",
    preview: "hero",
    allowedChildren: ["products", "plan-picker-data"],
    build: fields((node) => ({ kind: "fields", data: categorySchema(node.label) })),
  },
  product: {
    type: "product",
    kind: "module",
    preview: "product",
    eyebrow: "PRODUCT",
    allowedChildren: ["product-features-list", "price-cadence"],
    build: fields((node) => ({ kind: "fields", data: productSchema(node.label) })),
  },
  plan: {
    type: "plan",
    kind: "module",
    preview: "product",
    eyebrow: "PRODUCT",
    allowedChildren: ["product-features-list", "price-cadence"],
    build: fields((node) => ({ kind: "fields", data: productSchema(node.label) })),
  },
  feature: {
    type: "feature",
    kind: "module",
    preview: "passthrough",
    build: fields((node) => ({ kind: "fields", data: featureSchema(node.label) })),
  },
  cadence: {
    type: "cadence",
    kind: "module",
    preview: "passthrough",
    build: fields((node) => ({ kind: "fields", data: cadenceSchema(node.label) })),
  },
  "pricing-option": {
    type: "pricing-option",
    kind: "module",
    preview: "passthrough",
    build: fields((node) => ({ kind: "fields", data: cadenceSchema(node.label) })),
  },

  // --- Schema-driven elements (built from the real layout schemas) ---------
  // A `tabs` collection: add/remove items up to tabsConfig.maxSize. Its panel is
  // resolved live in classifyNode; allowedChildren enables the +Add affordance
  // (the shell builds the actual item from the collection's stored childSchema).
  "schema-collection": {
    type: "schema-collection",
    kind: "collection",
    preview: "passthrough",
    itemNoun: "Item",
    allowedChildren: ["schema-item"],
    build: collection("", "Item"),
  },
  // One collection item / a schema fields node: the panel comes verbatim from
  // node.props (set at build time); these builds are just a non-empty fallback.
  "schema-item": {
    type: "schema-item",
    kind: "module",
    // Passthrough: whether an item renders as a product card is decided by its
    // collection's noun in previewModel (products/plans/cards), not the type —
    // so feature/bundle items aren't mistaken for cards.
    preview: "passthrough",
    build: fields((node) => node.props ?? { kind: "fields", data: { eyebrow: "ITEM", name: node.label, fields: [] } }),
  },
  "schema-fields": {
    type: "schema-fields",
    kind: "module",
    preview: "passthrough",
    build: fields((node) => node.props ?? { kind: "fields", data: { eyebrow: "SECTION CONTENT", name: node.label, fields: [] } }),
  },

  // --- Widget: Retention Service config ------------------------------------
  // Mirrors the real elements-streamly retention-service jsonSchema: Journey
  // Flows (fields) → Offers (tabs, minSize 0) → Segmentation (objectListDropdown:
  // Offer Type → Category Title → Segment Names) → Survey Responses (tabs,
  // minSize 1). Collections resolve live from children; leaves carry props.
  "widget-config": {
    type: "widget-config",
    kind: "module",
    preview: "passthrough",
    build: fields((node) => node.props ?? { kind: "fields", data: { eyebrow: "WIDGET SETTINGS", name: node.label, fields: [] } }),
  },
  "journey-flows": {
    type: "journey-flows",
    kind: "module",
    preview: "passthrough",
    build: fields((node) => node.props ?? { kind: "fields", data: { eyebrow: "JOURNEY FLOWS", name: node.label, fields: [] } }),
  },
  offers: {
    type: "offers",
    kind: "collection",
    preview: "passthrough",
    itemNoun: "Offer Type",
    allowedChildren: ["offer-group"],
    build: collection("OFFERS", "Offer Type"),
  },
  "offer-group": {
    type: "offer-group",
    kind: "collection",
    preview: "passthrough",
    itemNoun: "Offer",
    allowedChildren: ["offer"],
    build: collection("OFFER TYPE", "Offer"),
  },
  offer: {
    type: "offer",
    kind: "module",
    preview: "passthrough",
    eyebrow: "OFFER",
    build: fields((node) => node.props ?? { kind: "fields", data: { eyebrow: "OFFER", name: node.label, fields: [] } }),
  },
  segmentation: {
    type: "segmentation",
    kind: "collection",
    preview: "passthrough",
    itemNoun: "Offer Type",
    allowedChildren: ["segmentation-group"],
    build: collection("SEGMENTATION", "Offer Type"),
  },
  "segmentation-group": {
    type: "segmentation-group",
    kind: "collection",
    preview: "passthrough",
    itemNoun: "Category Title",
    allowedChildren: ["segmentation-category"],
    build: collection("OFFER TYPE", "Category Title"),
  },
  "segmentation-category": {
    type: "segmentation-category",
    kind: "collection",
    preview: "passthrough",
    itemNoun: "Segment Name",
    allowedChildren: ["segment-name"],
    build: collection("CATEGORY TITLE", "Segment Name"),
  },
  "segment-name": {
    type: "segment-name",
    kind: "module",
    preview: "passthrough",
    build: fields((node) => node.props ?? { kind: "fields", data: { eyebrow: "SEGMENT NAME", name: node.label, fields: [{ label: "Segment Name", value: node.label }] } }),
  },
  "survey-responses": {
    type: "survey-responses",
    kind: "collection",
    preview: "passthrough",
    itemNoun: "Response",
    allowedChildren: ["survey-response"],
    build: collection("SURVEY RESPONSES", "Response"),
  },
  "survey-response": {
    type: "survey-response",
    kind: "module",
    preview: "passthrough",
    eyebrow: "SURVEY RESPONSE",
    build: fields((node) => node.props ?? { kind: "fields", data: { eyebrow: "SURVEY RESPONSE", name: node.label, fields: [] } }),
  },
};

// Container child caps — the tabsConfig.maxSize analog from the real plan-picker
// schema (`plans`/`categories` cap at 4). Undefined ⇒ unlimited.
export const MAX_CHILDREN: Partial<Record<StructureObjectType, number>> = {
  products: 4,
  "plan-picker-data": 4,
  categories: 4,
  "variant-categories": 4,
  // Product List (features) tabs — schema tabsConfig.maxSize.
  "product-features-list": 4,
};

// Look up an element definition by type.
export function getElementDef(
  type: StructureObjectType | undefined,
): ElementDefinition | undefined {
  return type ? ELEMENT_REGISTRY[type] : undefined;
}

// The child element type a collection instantiates when the author clicks
// "Add {itemNoun}" (the first allowed child in the registry).
export function allowedChildType(
  type: StructureObjectType | undefined,
): StructureObjectType | undefined {
  return getElementDef(type)?.allowedChildren?.[0];
}

// The max number of children a container accepts (undefined ⇒ unlimited).
export function maxChildrenFor(
  type: StructureObjectType | undefined,
): number | undefined {
  return type ? MAX_CHILDREN[type] : undefined;
}

// The preview render role for a node's element type (defaults to passthrough so
// unknown/structural nodes are driven by their subtree).
export function previewRoleFor(node: StructureNode): PreviewRole {
  return getElementDef(node.objectType)?.preview ?? "passthrough";
}

// Section role eyebrow passthrough (used by the preview hero band).
export function roleEyebrow(node: StructureNode): SectionRole | undefined {
  return node.role;
}
