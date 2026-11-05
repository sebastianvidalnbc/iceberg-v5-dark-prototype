// Variants for widgets (the "Variants for /slug" list). Lists are captured from the
// live CMS: /basket-upsell-config (live, read 5 Nov 2026) and the 50 most recently
// used widgets (widget-top50.ts). Author names are not captured.
import { TOP50_WIDGET_VARIANTS } from "./widget-top50";

export interface WidgetVariant {
  id: string;
  name: string;
  qaStatus: "Approved" | "In review" | "—";
  published: boolean;
  /** Scheduled release day, or null when not scheduled. */
  scheduledAt: Date | null;
  createdDate: string;
  modifiedDate: string;
  modifiedBy: string;
  /** Layout widgets only: the section heading this variant starts with. */
  heading?: string;
}

const PRODUCTION_VARIANTS: Record<string, WidgetVariant[]> = {
  // The retention widget's variant carries its configuration (Widget Settings,
  // Journey Flows); its config is registered in widget-create.ts.
  "/retention-service-config-us": [
    {
      id: "wg-qa-republish",
      name: "qa-republish-Copy of default",
      qaStatus: "—",
      published: true,
      scheduledAt: null,
      createdDate: "Fri 02 Oct 26",
      modifiedDate: "Fri 02 Oct 26",
      modifiedBy: "—",
    },
  ],
  "/basket-upsell-config": [
    {
      id: "wv-basket-copy-of-variant-1",
      name: "Copy of variant 1",
      qaStatus: "—",
      published: true,
      scheduledAt: null,
      createdDate: "Mon 20 Jul 26",
      modifiedDate: "Mon 20 Jul 26",
      modifiedBy: "—",
    },
    {
      id: "wv-basket-variant-1",
      name: "variant 1",
      qaStatus: "—",
      published: false,
      scheduledAt: null,
      createdDate: "Tue 19 May 26",
      modifiedDate: "Tue 19 May 26",
      modifiedBy: "—",
    },
  ],
};

// Variant lists keyed by widget slug (leading slash included).
export const WIDGET_VARIANTS: Record<string, WidgetVariant[]> = {
  ...PRODUCTION_VARIANTS,
  ...TOP50_WIDGET_VARIANTS,
};

export function widgetVariantsFor(slug: string): WidgetVariant[] {
  return WIDGET_VARIANTS[slug] ?? [];
}
