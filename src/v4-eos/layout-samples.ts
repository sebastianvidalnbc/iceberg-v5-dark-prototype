// Sample content for a layout as it is added from the Layout Picker, so a new
// section lands looking like the design (named plans, prices, badges, bullets)
// instead of empty fields. Values are written into each field's default and
// the rest is still editable. Matching is by field label, in priority order:
// the first rule that matches decides, and anything unmatched stays empty.
import type { PropertyField, StructureNode } from "./data";
import { isNameField } from "./structure-panel";
import { BACKDROPS, LOGOS, LOGO_NAMES, POSTERS, SHOW_META, SHOW_TITLES } from "./widget-art";

export const PLAN_NAMES = ["Premium", "Premium Plus", "Premium Plus Ad-Free"];
export const PLAN_PRICES = ["$5.99", "$12.99", "$12.99"];
export const STRIKE_PRICES = ["$9.99", "$14.99", "$14.99"];
const BADGES = ["Most popular", "Best value", "Best value"];
const CADENCES = ["Monthly", "Annual"];
export const FEATURES = [
  "Access to thousands of hours of content",
  "Stream on multiple devices",
  "Download content for offline viewing",
  "Ad-free streaming",
  "Everything in Premium",
  "Exclusive Streamly Originals",
];
export const PLAN_DESCRIPTIONS = [
  "Stream thousands of shows and movies with limited ads.",
  "Everything in Premium, plus ad-free streaming and exclusive Originals.",
  "Everything in Premium Plus, with no ads at all.",
];
const CATEGORY_NAMES = ["Plans", "Bundles", "Offers"];
const CADENCE_PRICES = ["$5.99/month", "$59.99/year"];
const SEO_HEADINGS = ["Shows & movies", "Sports", "Account"];
const SEO_LINKS = ["Premium plans", "Help center", "Privacy"];
const SECTION_HEADINGS: Record<string, string> = {
  hero: "Stream the best of Streamly",
  "content-banner": "Stream the best of Streamly",
  faqs: "Frequently asked questions",
  carousel: "Trending now",
  "content-grid": "Popular right now",
  "cast-layout": "Cast & crew",
};
const FAQ_QUESTIONS = ["What is included?", "Can I cancel anytime?", "Which devices can I use?"];
const FAQ_ANSWERS = [
  "Thousands of hours of shows, movies and live sports, with limited ads on Premium.",
  "Yes. Cancel anytime from your account settings and keep access until the end of the billing period.",
  "Stream on your phone, tablet, computer and TV, on multiple devices at once.",
];
const GENERIC_DESCRIPTION = "Stream the latest shows, movies and live sports, all in one place.";
export const LEGAL =
  "Offer subject to terms and conditions. Plans renew automatically until cancelled. Terms apply.";
const VOUCHER_ERROR = "This code can't be applied. Check the code and try again.";
const PLAN_HEADING = "Pick a Plan. Cancel Anytime.";

const pick = <T,>(list: T[], index: number): T => list[index % list.length];

interface SampleContext {
  planish: boolean;
  // Position of the field's owning node among its siblings (plan 1, 2, 3…).
  index: number;
  isItem: boolean;
  sectionTitle: string;
}

// The sample value for one field, or null to leave it empty.
export function sampleFor(label: string, ctx: SampleContext): string | null {
  const l = label.toLowerCase();
  const { index, planish } = ctx;

  if (/voucher error/.test(l)) return VOUCHER_ERROR;
  if (/legal|disclaimer|terms/.test(l)) return LEGAL;
  if (/href|url/.test(l)) return "/plans";
  // Ids, icons and images, aria and alt text, query params, and choice or
  // configuration controls: never sample these.
  if (
    /aria|\balt\b|alt tag|icon|image|logo|asset|upload|video|svg|background|\bid\b|remove|query|maintain|parameter|suffix|symbol|font|orientation|alignment|embed|display|enable|toggle|check|choose|select|type|template|tier|variant|field|metadata|'/.test(
      l,
    )
  )
    return null;
  if (/cta|button|call to action|link text/.test(l)) return planish ? "Get started" : "Learn more";
  if (/offer detail/.test(l) && /description|rte/.test(l)) return GENERIC_DESCRIPTION;
  if (/offer detail/.test(l)) return "Save 25%";
  if (/\brte\b|description/.test(l)) return planish ? pick(PLAN_DESCRIPTIONS, index) : GENERIC_DESCRIPTION;
  if (/previous|strike/.test(l)) return pick(STRIKE_PRICES, index);
  if (/badge/.test(l)) return pick(BADGES, index);
  if (/cadence/.test(l) && /subtext|title|label|billing/.test(l)) return pick(CADENCES, index);
  if (/cadence/.test(l) && !/price/.test(l)) return pick(CADENCES, index);
  if (/price/.test(l)) return pick(PLAN_PRICES, index);
  if (/eyebrow|kicker/.test(l)) return planish ? "Premium plan" : "Featured";
  if (/category title/.test(l)) return pick(CATEGORY_NAMES, index);
  if (/faq.*(question|title)|question/.test(l)) return pick(FAQ_QUESTIONS, index);
  if (/faq.*content|answer/.test(l)) return pick(FAQ_ANSWERS, index);
  if (/payment option cadence/.test(l) && /price/.test(l)) return pick(CADENCE_PRICES, index);
  if (/feature|bullet|benefit|perk|highlight/.test(l)) return pick(FEATURES, index);
  if (/subheadline|subtitle|summary|copy|body/.test(l))
    return planish ? pick(PLAN_DESCRIPTIONS, index) : GENERIC_DESCRIPTION;
  if (/title|name|heading|headline|header/.test(l)) {
    if (!ctx.isItem) return ctx.sectionTitle;
    if (planish) return pick(PLAN_NAMES, index);
    if (/heading/.test(l)) return pick(SEO_HEADINGS, index);
    if (/title/.test(l)) return pick(SEO_LINKS, index);
    return null;
  }
  return null;
}

// Realistic per-layout copy and artwork. Fictional titles only (no real IP).
// A layout without an entry here keeps the generic sampleFor copy.
interface CopyItem {
  title: string;
  body?: string;
}

interface WidgetCopy {
  title?: string;
  subtitle?: string;
  cta?: string;
  // Section background image (hero / banner / key art), a widget-art file name.
  backdrop?: string;
  items?: CopyItem[];
  // Thumbnail for each authored item, by item index.
  itemArt?: "posters" | "logos";
}

const showItems = (n: number): CopyItem[] =>
  Array.from({ length: n }, (_, i) => ({
    title: SHOW_TITLES[i % SHOW_TITLES.length],
    body: SHOW_META[i % SHOW_META.length],
  }));

export const WIDGET_COPY: Record<string, WidgetCopy> = {
  hero: {
    title: "Stream the best of Streamly",
    subtitle: "Blockbuster movies, hit originals and live sports, all in one place.",
    cta: "Start your free trial",
    backdrop: BACKDROPS[0],
  },
  banner: {
    title: "Save 25% on Premium Plus",
    subtitle: "Limited-time offer for new subscribers. Ad-free streaming, live sports and Originals.",
    cta: "Get the deal",
    backdrop: BACKDROPS[2],
  },
  "key-art-synopsis": {
    title: SHOW_TITLES[0],
    subtitle: "A coastal family drama about the people who keep a town running.",
    cta: "Watch now",
    backdrop: BACKDROPS[1],
  },
  carousel: { title: "Trending now", items: showItems(8), itemArt: "posters" },
  "sle-carousel": {
    title: "Live & upcoming",
    subtitle: "Watch live sports, replays and highlights.",
    cta: "Watch now",
    items: showItems(6),
    itemArt: "posters",
  },
  "content-grid": { title: "Popular right now", items: showItems(6), itemArt: "posters" },
  "filtered-grid": {
    title: "All shows",
    subtitle: "Filter by genre, year and rating.",
    items: showItems(8),
    itemArt: "posters",
  },
  "content-promotional-rail": { title: "More to watch", items: showItems(6), itemArt: "posters" },
  highlights: { title: "Editors' picks", items: showItems(6), itemArt: "posters" },
  "logo-grid": {
    title: "Featured partners",
    subtitle: "Watch your favourite teams, networks and leagues on Streamly.",
    items: LOGO_NAMES.map((title) => ({ title })),
    itemArt: "logos",
  },
  faqs: {
    title: "Frequently asked questions",
    items: FAQ_QUESTIONS.map((title, i) => ({ title, body: FAQ_ANSWERS[i] })),
  },
  usp: {
    title: "Why Streamly",
    items: [
      { title: "Thousands of hours", body: "Shows, movies and Originals added every week." },
      { title: "Live sports", body: "Premier League, WWE and more, live and on demand." },
      { title: "Watch anywhere", body: "Stream on your phone, tablet, laptop and TV." },
      { title: "Cancel anytime", body: "Change or cancel your plan from your account." },
    ],
  },
  "cast-layout": {
    title: "Cast & crew",
    items: [
      { title: "Maya Chen", body: "as Dr. Ruth Calder" },
      { title: "Cast Member One", body: "as Character One" },
      { title: "Lena Brooks", body: "as Jo Mercer" },
      { title: "Theo Park", body: "as Kit Dunmore" },
    ],
  },
  "what-is": { title: "What is Streamly?", subtitle: "Stream shows, movies and live sports in one app." },
  "channels-guide": { title: "Live channels", subtitle: "What's on now and coming up next." },
};

// Field-label roles. Section-level fields take one value each (first match);
// item-level fields take the item's copy by position.
const SECTION_TITLE =
  /^(header title( - h2)?|headline|heading( - h1)?|header|title|faq heading|plan picker title|text information)$/;
const SECTION_SUB =
  /^(subheadline|subtitle|subheader|subhead( - h2)?|sub-header|sub-heading|subheading|description|details text)$/;
const ITEM_TITLE = /(title|name|question|heading)/;
const ITEM_BODY = /(description|synopsis|content|answer|metadata|copy|body|subtitle)/;
const ITEM_SKIP = /(url|href|link|image|aria|alt|logo|icon|button|cta|switch|suffix|label)/;

// Bare label: qualifiers such as "(optional)" stripped, lower case.
const bareLabel = (label: string): string =>
  label.toLowerCase().replace(/\s*\(.*\)\s*$/, "").trim();

function copyFor(
  label: string,
  isItem: boolean,
  index: number,
  copy: WidgetCopy,
  used: Set<string>,
): string | null {
  const bare = bareLabel(label);
  if (isItem) {
    const item = copy.items?.length ? copy.items[index % copy.items.length] : undefined;
    if (!item || ITEM_SKIP.test(bare)) return null;
    if (ITEM_TITLE.test(bare)) return item.title;
    if (ITEM_BODY.test(bare)) return item.body ?? null;
    return null;
  }
  // A role the layout's copy owns is written once; repeats and roles without
  // copy stay empty ("") rather than picking up generic filler.
  if (bare === "primary cta" && copy.cta) {
    if (used.has("cta")) return "";
    used.add("cta");
    return copy.cta;
  }
  if (SECTION_TITLE.test(bare) && copy.title) {
    if (used.has("title")) return "";
    used.add("title");
    return copy.title;
  }
  if (SECTION_SUB.test(bare)) {
    if (!copy.subtitle || used.has("sub")) return "";
    used.add("sub");
    return copy.subtitle;
  }
  return null;
}

// Artwork for an asset field: item thumbnails from the layout's art set, and
// the section background (hero / banner / key art) from the copy backdrop.
function artFor(label: string, isItem: boolean, index: number, copy: WidgetCopy): string | null {
  const l = label.toLowerCase();
  if (/alt|aria|logo|icon|video|svg/.test(l)) return null;
  if (isItem) {
    if (!copy.itemArt || !/image|thumbnail|artwork|poster/.test(l)) return null;
    const list = copy.itemArt === "logos" ? LOGOS : POSTERS;
    return list[index % list.length];
  }
  if (copy.backdrop && /background|image|artwork|key art/.test(l)) return copy.backdrop;
  return null;
}

// Fill every empty field in a freshly built layout section: artwork, then
// realistic copy for the layout, then the generic label-based sample.
export function fillSampleContent(root: StructureNode, layoutId: string, layoutName: string): void {
  const planish = /plan|payment|comparison|pricing/.test(layoutId);
  const sectionTitle = planish ? PLAN_HEADING : SECTION_HEADINGS[layoutId] ?? layoutName;
  const copy = WIDGET_COPY[layoutId];
  const used = new Set<string>();

  const walk = (node: StructureNode, index: number, isItem: boolean) => {
    const props = node.props;
    if (props?.kind === "fields") {
      for (const group of props.data.groups ?? []) {
        for (const field of group.fields as PropertyField[]) {
          if (field.value) continue;
          if (field.kind === "asset") {
            const art = copy ? artFor(field.label, isItem, index, copy) : null;
            if (art) field.value = art;
            continue;
          }
          if (field.kind && field.kind !== "text" && field.kind !== "textarea") continue;
          const value =
            (copy && copyFor(field.label, isItem, index, copy, used)) ??
            sampleFor(field.label, { planish, index, isItem, sectionTitle });
          if (value) field.value = value;
        }
      }
      if (isItem) {
        const named = (props.data.groups ?? [])
          .flatMap((g) => g.fields)
          .find((f) => isNameField(node, f.label) && f.value.trim());
        if (named) node.label = named.value.trim();
      }
    }
    (node.children ?? []).forEach((child, i) =>
      walk(child, i, child.objectType === "schema-item"),
    );
  };
  walk(root, 0, false);
}

// Sets a section's own title (first title-like field, never an item's) to the
// given text. Used to name a rail after its template step.
export function setSectionTitle(root: StructureNode, title: string): void {
  let done = false;
  const walk = (node: StructureNode, isItem: boolean) => {
    if (isItem || done) return;
    if (node.props?.kind === "fields") {
      for (const group of node.props.data.groups ?? []) {
        for (const field of group.fields as PropertyField[]) {
          if (done) return;
          if (field.kind && field.kind !== "text" && field.kind !== "textarea") continue;
          if (SECTION_TITLE.test(bareLabel(field.label))) {
            field.value = title;
            done = true;
          }
        }
      }
    }
    for (const child of node.children ?? []) walk(child, child.objectType === "schema-item");
  };
  walk(root, false);
}
