import type { StructureNode } from "./data";
import { buildLayoutNode, buildPlaceholderSection, getLayoutDef } from "./layouts";
import { setSectionTitle } from "./layout-samples";
import { buildWidgetReference } from "./widget-links";

// Starter templates for the "Create new Page" popup. Each step is one of:
//   - a section copied from a catalog layout (layoutId),
//   - a reference to a saved Widget (widgetSlug), for sections that are shared,
//   - a custom placeholder section when neither fits.
export interface StarterStep {
  label: string;
  /** Catalog layout id. Omit for a custom placeholder section. */
  layoutId?: string;
  /** Production widget slug (CMS), when no picker layout fits. */
  widgetSlug?: string;
}

export interface StarterTemplate {
  id: string;
  name: string;
  steps: StarterStep[];
}

// Bumped when a starter's steps change. Stored on each created page as
// templateVersion (origin only): later template edits never rewrite pages.
export const STARTER_TEMPLATE_VERSION = 1;

const nav: StarterStep = { label: "Global navigation", widgetSlug: "/header" };
const footer: StarterStep = { label: "Footer", widgetSlug: "/seo-footer" };
const step = (label: string, layoutId?: string): StarterStep => ({ label, layoutId });

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: "home-discovery",
    name: "Home / Discovery",
    steps: [
      nav,
      step("Hero", "hero"),
      step("Continue Watching", "carousel"),
      step("Recommended rail", "carousel"),
      step("Featured brands rail", "logo-grid"),
      step("New & Coming Soon rail", "carousel"),
      step("Promo banner", "banner"),
      footer,
    ],
  },
  {
    id: "collection-curated-shelf",
    name: "Collection / Curated Shelf",
    steps: [
      nav,
      step("Collection hero / title", "hero"),
      step("Intro copy", "what-is"),
      step("Featured rail", "carousel"),
      step("Curated content rails", "content-promotional-rail"),
      step("Optional FAQ", "faqs"),
      footer,
    ],
  },
  {
    id: "browse-catalog",
    name: "Browse Catalog",
    steps: [
      nav,
      step("Page title"),
      step("Category tabs"),
      step("Filter / sort toolbar", "filtered-grid"),
      step("Results grid", "content-grid"),
      step("Empty / loading / error states"),
      footer,
    ],
  },
  {
    id: "brand-network-hub",
    name: "Brand / Network Hub",
    steps: [
      nav,
      step("Brand masthead", "hero"),
      step("Featured hero", "hero"),
      step("Brand tabs"),
      step("Current / featured rail", "carousel"),
      step("Shows rail", "carousel"),
      step("Movies / specials rail", "carousel"),
      footer,
    ],
  },
  {
    id: "sports-live-event-hub",
    name: "Sports / Live Event Hub",
    steps: [
      nav,
      step("Live now / next event", "sle-carousel"),
      step("Live / Upcoming / Replays tabs"),
      step("Schedule or event rail", "sports-fixture"),
      step("League / team links", "logo-grid"),
      step("On-demand sports rails", "carousel"),
      footer,
    ],
  },
  {
    id: "channels-linear-guide",
    name: "Channels / Linear Guide",
    steps: [
      nav,
      step("Now playing channel"),
      step("Channel filters"),
      step("Channel grid / rail", "logo-grid"),
      step("Schedule / EPG", "channels-guide"),
      step("Watch now action"),
      footer,
    ],
  },
  {
    id: "movie-detail",
    name: "Movie Detail",
    steps: [
      nav,
      step("Backdrop / artwork", "key-art-synopsis"),
      step("Title metadata"),
      step("Play / trailer CTA"),
      step("Save / share actions"),
      step("Related content rail", "carousel"),
      step("Credits", "cast-layout"),
      footer,
    ],
  },
  {
    id: "series-detail",
    name: "Series Detail",
    steps: [
      nav,
      step("Backdrop / artwork", "key-art-synopsis"),
      step("Series metadata"),
      step("Play CTA"),
      step("Season selector"),
      step("Episode list", "seasons-episodes"),
      step("Related content rail", "carousel"),
      step("Credits", "cast-layout"),
      footer,
    ],
  },
  {
    id: "marketing-plans",
    name: "Marketing / Plans",
    steps: [
      { label: "Navigation", widgetSlug: "/header" },
      step("Campaign hero", "hero"),
      step("Benefits", "usp"),
      step("Plan / offer comparison", "plan-picker-multi-diff"),
      step("Content proof", "usp"),
      step("FAQ", "faqs"),
      step("Legal", "text-tcs"),
      footer,
    ],
  },
];

export function starterById(id: string): StarterTemplate | undefined {
  return STARTER_TEMPLATES.find((t) => t.id === id);
}

// Builds the editor structure for a starter. Widget steps reference the saved
// widget; layout steps are copies with the layout's sample content; the section
// keeps the step's own label.
export function instantiateStarter(template: StarterTemplate): StructureNode[] {
  return template.steps.map((s) => {
    if (s.widgetSlug) return buildWidgetReference(s.widgetSlug, s.label);
    const def = s.layoutId ? getLayoutDef(s.layoutId) : undefined;
    if (!def) return buildPlaceholderSection(s.label);
    const node = buildLayoutNode(def);
    if (RAIL_TITLE_LAYOUTS.has(def.id)) setSectionTitle(node, railTitle(s.label));
    return { ...node, label: s.label };
  });
}

// Rails and grids are titled from their template step, so "Shows rail" reads
// "Shows" on the page while the editor keeps the step name.
const RAIL_TITLE_LAYOUTS = new Set([
  "carousel",
  "sle-carousel",
  "content-grid",
  "logo-grid",
  "content-promotional-rail",
  "highlights",
  "cast-layout",
  "seasons-episodes",
]);

export function railTitle(label: string): string {
  const t = label.replace(/\s*\/?\s*(rails?|grid)$/i, "").trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : label;
}
