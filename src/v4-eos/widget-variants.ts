// Variants for widgets (the "Variants for /slug" list). Production variants were
// captured for /basket-upsell-config.


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

// Captured from production "Variants for /basket-upsell-config".
const PRODUCTION_VARIANTS: Record<string, WidgetVariant[]> = {
  "/basket-upsell-config": [
    {
      id: "wv-basket-dummy",
      name: "Dummy Widget",
      qaStatus: "—",
      published: false,
      scheduledAt: null,
      createdDate: "Tue 20 Oct 26",
      modifiedDate: "Wed 21 Oct 26",
      modifiedBy: "Editor E",
    },
    {
      id: "wv-basket-copy-of-variant-1",
      name: "Copy of variant 1",
      qaStatus: "—",
      published: true,
      scheduledAt: null,
      createdDate: "Mon 20 Jul 26",
      modifiedDate: "Mon 20 Jul 26",
      modifiedBy: "Editor H",
    },
    {
      id: "wv-basket-variant-1",
      name: "variant 1",
      qaStatus: "—",
      published: false,
      scheduledAt: null,
      createdDate: "Tue 19 May 26",
      modifiedDate: "Tue 19 May 26",
      modifiedBy: "Editor H",
    },
  ],
};

// Sample variants for a handful of layouts, keyed by layout id (the widget's slug
// is worked out from the layout, so a suffixed slug still lines up).
export const WIDGET_VARIANTS: Record<string, WidgetVariant[]> = {
  ...PRODUCTION_VARIANTS,
};

export function widgetVariantsFor(slug: string): WidgetVariant[] {
  return WIDGET_VARIANTS[slug] ?? [];
}
