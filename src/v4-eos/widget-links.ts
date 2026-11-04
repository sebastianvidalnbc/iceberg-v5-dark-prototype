// Widget references on a page. A top-level section with `widgetSlug` shows the
// content of a saved Widget (widget-create.ts), so editing the Widget updates every
// page that references it. Overriding the section on a page sets `moduleDetached`
// and the page keeps its own copy (the Local override in docs/page-slugs-and-templates.md).
import { WIDGET_CONFIGS, type StructureNode } from "./data";
import { buildPlaceholderSection } from "./layouts";
import { cloneWithNewIds } from "./structureOps";
import { productionWidgetId } from "./widget-create";

export const WIDGET_BADGE = "Widget";

// The section a widget renders: the first top-level section of its structure.
export function widgetRootOf(slug: string): StructureNode | undefined {
  return WIDGET_CONFIGS[productionWidgetId(slug)]?.structure[0];
}

// A fresh top-level reference to a widget, labelled as the caller asks. Its
// children are a copy of the widget's current content (new ids, so the same
// widget can appear on a page more than once).
export function buildWidgetReference(slug: string, label?: string): StructureNode {
  const root = widgetRootOf(slug);
  const base = root ? cloneWithNewIds(root) : buildPlaceholderSection(label ?? slug);
  return {
    ...base,
    label: label ?? base.label,
    widgetSlug: slug,
    badge: WIDGET_BADGE,
    badgeTone: "info",
    moduleDetached: undefined,
    fromTemplate: undefined,
  };
}

// Turn a page section into a reference to a widget it was saved as. Keeps the
// section's id, label and content (the content is the widget's content).
export function asWidgetReference(section: StructureNode, slug: string): StructureNode {
  return {
    ...section,
    widgetSlug: slug,
    badge: WIDGET_BADGE,
    badgeTone: "info",
    moduleDetached: undefined,
    fromTemplate: undefined,
  };
}

// Re-read the content of linked sections from their widgets. Overridden sections
// (`moduleDetached`) keep their own copy. `slug` limits the refresh to one widget.
export function refreshReferences(nodes: StructureNode[], slug?: string): StructureNode[] {
  return nodes.map((n) => {
    if (!n.widgetSlug || n.moduleDetached) return n;
    if (slug && n.widgetSlug !== slug) return n;
    // Unknown widgets keep their section as it is rather than being emptied.
    if (!(productionWidgetId(n.widgetSlug) in WIDGET_CONFIGS)) return n;
    return { ...buildWidgetReference(n.widgetSlug, n.label), id: n.id };
  });
}

// True when a page has at least one reference to this widget that is not overridden.
export function hasLiveReference(nodes: StructureNode[], slug: string): boolean {
  return nodes.some((n) => n.widgetSlug === slug && !n.moduleDetached);
}
