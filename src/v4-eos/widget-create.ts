import { PRODUCTION_WIDGETS, type ProductionWidget } from "./production-widgets";
import { TOP50_VARIANT_TEMPLATES, TOP50_WIDGET_SECTIONS } from "./widget-top50";
import { widgetVariantsFor } from "./widget-variants";
import {
  WIDGET_CONFIGS,
  type PreviewData,
  type StructureNode,
  type TreeNode,
} from "./data";
import { buildLayoutNode, buildPlaceholderSection, getLayoutDef } from "./layouts";
import { cloneWithNewIds } from "./structureOps";

// Widget registry shared by the Widgets list, the editor collection and the
// editor itself. A widget is a saved section: production widgets (the CMS list,
// mirrored) and widgets saved from a page section in this session ("Save as
// widget", or "+" on the Widgets list). Layouts are not widgets; they are the
// library that creates sections (see layouts.ts).

const CREATED: ProductionWidget[] = [];

export function productionWidgetId(slug: string): string {
  return `wg-prod-${slug.replace(/^\//, "")}`;
}

export function allWidgets(): ProductionWidget[] {
  return [...CREATED, ...PRODUCTION_WIDGETS];
}

function emptyWidgetPreview(slug: string): PreviewData {
  return {
    title: "Empty widget",
    subtitle: slug,
    tone: "neutral",
    body: "No sections yet. Start from a layout to build this widget.",
  };
}

function registerConfig(id: string, slug: string, structure: StructureNode[] = []): void {
  WIDGET_CONFIGS[id] = {
    id,
    name: slug,
    structure,
    previewData: emptyWidgetPreview(slug),
    defaultSelectionId: structure[0]?.id ?? "",
  };
}

// Production widgets used by the starter templates carry real content, so a
// page that references them shows a footer and a header. The rest stay empty
// until sections are added in the editor.
const SEEDED_PRODUCTION: Record<string, () => StructureNode[]> = {
  "/seo-footer": () => {
    const def = getLayoutDef("seo-footer");
    return def ? [buildLayoutNode(def)] : [];
  },
  "/header": () => [buildPlaceholderSection("Header")],
};

// The 50 most recently used widgets carry the section captured from their
// published variant. Their rendered preview is not captured, so the preview
// says so rather than showing an empty widget.
const TOP50_PREVIEW: PreviewData = {
  title: "Preview not captured",
  subtitle: "Production render",
  tone: "neutral",
  body: "The rendered production preview is not captured. The structure shows the published variant's section.",
};

for (const w of PRODUCTION_WIDGETS) {
  const id = productionWidgetId(w.slug);
  const sections = TOP50_WIDGET_SECTIONS[w.slug];
  if (sections && !SEEDED_PRODUCTION[w.slug]) {
    registerConfig(id, w.slug, sections.map((label) => buildPlaceholderSection(label)));
    WIDGET_CONFIGS[id].previewData = TOP50_PREVIEW;
  } else {
    registerConfig(id, w.slug, SEEDED_PRODUCTION[w.slug]?.() ?? []);
  }
}

// Captured variant template -> the V5 layout that renders it. A template with no
// layout here (e.g. SPORTS CONTENT OFFERING) keeps its name as a placeholder.
const TEMPLATE_LAYOUT: Record<string, string> = {
  Banner: "banner",
  "Video rail": "video-multiple",
  "Footer SEO (IA)": "seo-footer",
  "Plan Picker - Multi Difference": "plan-picker-multi-diff",
};

// One captured variant section ("section-1" in production), built from its template.
function variantSection(template: string): StructureNode {
  const def = getLayoutDef(TEMPLATE_LAYOUT[template] ?? "");
  if (def) {
    const node = buildLayoutNode(def);
    node.label = "section-1";
    return node;
  }
  const node = buildPlaceholderSection("section-1");
  if (template) node.role = template;
  return node;
}

// Each variant is its own editor workspace (production opens a variant, not the
// widget). Its structure is the section captured from that variant's editor; a
// variant with no captured template falls back to the widget's section.
for (const w of PRODUCTION_WIDGETS) {
  const sections = TOP50_WIDGET_SECTIONS[w.slug];
  for (const v of widgetVariantsFor(w.slug)) {
    const template = TOP50_VARIANT_TEMPLATES[v.id];
    const structure =
      template !== undefined
        ? [variantSection(template)]
        : (sections ?? []).map((label) => buildPlaceholderSection(label));
    registerConfig(v.id, v.name, structure);
    if (sections) WIDGET_CONFIGS[v.id].previewData = TOP50_PREVIEW;
  }
}

// Flat collection for the editor's left pane (Pages-style: one row per widget).
export function widgetCollectionTree(): TreeNode[] {
  return allWidgets().map((w) => ({
    id: productionWidgetId(w.slug),
    label: w.slug,
    type: "page",
    kind: "path",
    children: [],
  }));
}

function listDate(ts: number): string {
  const d = new Date(ts);
  const wd = d.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" });
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mon = d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
  const yy = String(d.getUTCFullYear()).slice(2);
  return `${wd} ${dd} ${mon} ${yy}`;
}

// A name becomes a slug: "Hero Promo" -> "/hero-promo". Null when nothing usable is left.
function slugFor(name: string): string | null {
  const slug = `/${name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
  return slug === "/" ? null : slug;
}

// A slug that no widget uses yet: "/hero-promo", then "/hero-promo-2", …
function uniqueSlug(base: string): string {
  let slug = base;
  for (let i = 2; allWidgets().some((w) => w.slug === slug); i++) slug = `${base}-${i}`;
  return slug;
}

function registerCreated(slug: string, format: "HTML" | "JSON", structure: StructureNode[]): string {
  const now = Date.now();
  CREATED.unshift({
    slug,
    format,
    status: "Draft",
    created: listDate(now),
    modified: "just now",
    createdAt: now,
    modifiedAt: now,
  });
  const id = productionWidgetId(slug);
  registerConfig(id, slug, structure);
  return id;
}

// "+" on the Widgets list (production's Create new Widget dialog): a blank HTML or
// JSON widget. Production has no separate name, so the name becomes the slug
// (`Hero Promo` -> `/hero-promo`). Sections are added in the editor. Returns the
// new widget's editor id, or an error for the dialog to show.
export function createBlankWidget(
  name: string,
  format: "HTML" | "JSON",
): { id: string } | { error: string } {
  const slug = slugFor(name);
  if (!slug) return { error: "Enter a name with at least one letter or number." };
  if (allWidgets().some((w) => w.slug === slug)) {
    return { error: `A widget with the slug ${slug} already exists.` };
  }
  return { id: registerCreated(slug, format, []) };
}

// "Save as widget" on a page section: the section's content becomes a saved
// widget, named from the section label. Returns the new widget's slug. The page
// keeps its own copy until the caller turns the section into a reference.
export function saveSectionAsWidget(section: StructureNode): string {
  const slug = uniqueSlug(slugFor(section.label) ?? "/widget");
  const content: StructureNode = {
    ...cloneWithNewIds(section),
    widgetSlug: undefined,
    moduleDetached: undefined,
    fromTemplate: undefined,
    badge: undefined,
    badgeTone: undefined,
  };
  registerCreated(slug, "HTML", [content]);
  return slug;
}
