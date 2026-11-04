// Page templates and the managed / custom state of a page built from one.
//
// - A template is an ordered list of steps. A step is either a section copied
//   from a layout (the IA library) or a reference to a saved Widget (for example
//   global navigation and the footer, which are widgets in the CMS).
// - A page built from a template has one top-level section per step. Copied
//   sections are marked `fromTemplate`; referenced sections carry `widgetSlug`.
// - Overriding a referenced or copied section on the page sets `moduleDetached`.
//   Adding, removing or reordering sections also makes the page custom.
// - The page keeps its template origin (templateId) either way.
import { buildLayoutNode, getLayoutDef } from "./layouts";
import { VARIANTS, type StructureNode, type VariantWorkspace } from "./data";
import { ancestorIdsOf } from "./structureOps";
import { buildWidgetReference } from "./widget-links";

export type TemplateStep = { layoutId: string } | { widgetSlug: string };

export interface PageTemplate {
  id: string;
  name: string;
  steps: TemplateStep[];
}

// Sports sections = the real /sports page (Edit Page snapshot, 3 Nov 2026). The
// footer is the saved /seo-footer widget.
export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: "sports",
    name: "Sports",
    steps: [
      { layoutId: "faqs" },
      { layoutId: "carousel" },
      { layoutId: "sle-carousel" },
      { layoutId: "hero" },
      { widgetSlug: "/seo-footer" },
    ],
  },
];

export function templateById(id: string | undefined): PageTemplate | undefined {
  return id ? PAGE_TEMPLATES.find((t) => t.id === id) : undefined;
}

// Fresh top-level sections for a template: copies for layout steps, references
// for widget steps.
export function instantiateTemplate(template: PageTemplate): StructureNode[] {
  return template.steps.flatMap((step): StructureNode[] => {
    if ("widgetSlug" in step) return [buildWidgetReference(step.widgetSlug)];
    const def = getLayoutDef(step.layoutId);
    return def ? [{ ...buildLayoutNode(def), fromTemplate: true }] : [];
  });
}

// Pages built from a template. These are sample pages; each one is a variant
// under its route in PAGES_TREE and is registered into VARIANTS below.
const TEMPLATE_PAGES: { variantId: string; templateId: string }[] = [
  { variantId: "sports-template", templateId: "sports" },
];

for (const { variantId, templateId } of TEMPLATE_PAGES) {
  const template = templateById(templateId);
  if (!template) continue;
  const structure = instantiateTemplate(template);
  VARIANTS[variantId] = {
    id: variantId,
    name: template.name,
    structure,
    previewData: {
      title: `${template.name} template`,
      subtitle: `${structure.length} sections`,
      tone: "neutral",
      body: "Built from the template. Override a section to make it custom, or add, remove or reorder sections to make this page custom.",
    },
    defaultSelectionId: structure[0]?.id ?? "",
    templateId,
  } satisfies VariantWorkspace;
}

// A step's key and a section's key match when they come from the same layout
// schema or reference the same widget.
function keyOfStep(step: TemplateStep): string | null {
  if ("widgetSlug" in step) return `widget:${step.widgetSlug}`;
  const def = getLayoutDef(step.layoutId);
  return def ? `layout:${def.schemaId}` : null;
}

function keyOfNode(node: StructureNode): string {
  return node.widgetSlug ? `widget:${node.widgetSlug}` : `layout:${node.schemaId ?? ""}`;
}

// A duplicated or pasted top-level section is a new copy, not the template's or
// the widget's, so it is unlinked. `before` is the structure prior to the operation.
export function unlinkNewRoots(before: StructureNode[], after: StructureNode[]): StructureNode[] {
  const known = new Set(before.map((n) => n.id));
  return after.map((n) =>
    known.has(n.id) ? n : { ...n, widgetSlug: undefined, fromTemplate: undefined, badge: undefined, badgeTone: undefined },
  );
}

// Editing anywhere inside a referenced or template section overrides it: mark its
// top-level section as overridden. Returns the same array when nothing changes.
export function markModuleEdited(nodes: StructureNode[], nodeId: string): StructureNode[] {
  const rootId = ancestorIdsOf(nodes, nodeId)[0] ?? nodeId;
  const root = nodes.find((n) => n.id === rootId);
  if (!root || !(root.widgetSlug || root.fromTemplate) || root.moduleDetached) return nodes;
  return nodes.map((n) => (n.id === rootId ? { ...n, moduleDetached: true } : n));
}

// --- Page state --------------------------------------------------------------

export type PageState =
  | { kind: "none" }
  | { kind: "template"; template: PageTemplate }
  | { kind: "custom"; template: PageTemplate; reason: string };

// A page is a template page while its sections are exactly the template's steps,
// in order, none overridden. Anything else makes it custom.
export function pageStateOf(structure: StructureNode[], templateId: string | undefined): PageState {
  const template = templateById(templateId);
  if (!template) return { kind: "none" };
  if (structure.some((n) => n.moduleDetached)) {
    return { kind: "custom", template, reason: "A section was overridden" };
  }
  if (structure.some((n) => !n.widgetSlug && !n.fromTemplate)) {
    return { kind: "custom", template, reason: "A custom section was added" };
  }
  const expected = template.steps.map(keyOfStep);
  const actual = structure.map(keyOfNode);
  if (actual.length !== expected.length) {
    return { kind: "custom", template, reason: "Sections were added or removed" };
  }
  if (actual.some((key, i) => key !== expected[i])) {
    return { kind: "custom", template, reason: "Sections were reordered" };
  }
  return { kind: "template", template };
}

// --- Widget usage -------------------------------------------------------------

// Pages whose top-level sections still reference this Widget (not overridden).
// Reads the shared sample data (VARIANTS), so edits made in the session are not counted.
export function pagesUsingWidget(slug: string): VariantWorkspace[] {
  return Object.values(VARIANTS).filter((v) =>
    v.structure.some((n) => n.widgetSlug === slug && !n.moduleDetached),
  );
}
