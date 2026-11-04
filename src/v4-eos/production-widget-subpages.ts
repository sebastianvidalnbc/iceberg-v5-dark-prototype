// Subpages of production widgets: the pages each widget is used on, shown when
// a Widgets row is expanded in production. Captured from screenshots on 21 Oct
// 2026 (sign-in to production was not available for a full export), so only
// the widgets below are populated. Other widgets show "not captured yet".
//
// /content-pages-plan-picker-no-select: the screenshot is cut off after the
// 27th entry, so the real list may be longer.
export interface WidgetSubpage {
  name: string;
  status: "Published" | "Draft";
}

export const PRODUCTION_WIDGET_SUBPAGES: Record<string, WidgetSubpage[]> = {
  "/content-pages-plan-picker-no-select": [
    { name: "campaign/films -- 3.1 Mar refresh", status: "Draft" },
    { name: "campaign/films -- 4.1 april refresh", status: "Draft" },
    { name: "stream-movies/gabbys-dollhouse-the-movie -- 2.13 plan picker", status: "Draft" },
    { name: "collections/harry-potter-movies/harry-potter-and-the-prisoner-of-azkaban -- plan picker", status: "Draft" },
    { name: "collections/harry-potter-movies/harry-potter-and-the-sorcerers-stone -- page updates", status: "Draft" },
    { name: "collections/harry-potter-movies/harry-potter-and-the-chamber-of-secrets -- plan picker", status: "Draft" },
    { name: "collections/harry-potter-movies/harry-potter-and-the-order-of-the-phoenix -- page updates", status: "Draft" },
    { name: "collections/harry-potter-movies/harry-potter-and-the-deathly-hallows-part-1 -- plan picker", status: "Draft" },
    { name: "stream-movies/dr-seuss-the-grinch-2018 -- plan picker", status: "Published" },
    { name: "stream-movies/the-hunger-games-mockingjay-part-2 -- plan picker", status: "Published" },
    { name: "collections/harry-potter-movies/harry-potter-and-the-half-blood-prince -- plan picker", status: "Draft" },
    { name: "stream-movies/love-actually -- plan picker", status: "Published" },
    { name: "stream-tv/casey-anthony-where-the-truth-lies -- NextJS migration CSS clean up", status: "Draft" },
    { name: "stream-tv/love-undercover -- NextJS migration CSS clean up", status: "Draft" },
    { name: "stream-tv/law-and-order-organized-crime -- NextJS migration CSS clean up", status: "Draft" },
    { name: "stream-tv/real-housewives-ultimate-girls-trip -- NextJS migration CSS clean up", status: "Draft" },
    { name: "stream-tv/the-tattooist-of-auschwitz -- NextJS migration CSS clean up", status: "Draft" },
    { name: "stream-tv/the-day-of-the-jackal -- NextJS migration CSS clean up", status: "Draft" },
    { name: "stream-tv/laid -- NextJS migration CSS clean up", status: "Draft" },
    { name: "stream-tv/snl-50-the-homecoming-concert -- NextJS migration CSS clean up", status: "Draft" },
    { name: "universal -- 2.26 remove faq underlining", status: "Draft" },
    { name: "stream-tv/apples-never-fall -- NextJS migration CSS clean up v2", status: "Draft" },
    { name: "stream-tv/matthew-perry-a-hollywood-tragedy -- NextJS migration CSS clean up", status: "Draft" },
    { name: "stream-tv/poker-face -- NextJS migration CSS clean up", status: "Draft" },
    { name: "stream-tv/love-island-games -- NextJS migration CSS clean up", status: "Draft" },
    { name: "collections/horror-movies -- 3.12 IA grid", status: "Draft" },
    { name: "stream-movies/jurassic-world -- Copy of 3.10 logo size", status: "Draft" },
  ],
  "/homepage-sports-pop-up-banner": [
    { name: "home -- 0925 tile wall and banner update", status: "Draft" },
    { name: "home -- 0928 banner copy update", status: "Draft" },
    { name: "home -- 10.02 sports updates and banner", status: "Draft" },
    { name: "home -- 10.7 zenapse ON", status: "Draft" },
    { name: "home -- (Iceberg Dev Test) 10.13 Streamly Emphasis Test LAUNCH", status: "Draft" },
    { name: "home -- 10.3 merch updates", status: "Draft" },
    { name: "home -- 10.14 Streamly Emphasis test launch", status: "Draft" },
    { name: "home -- BF Messaging", status: "Draft" },
    { name: "home -- 10.15 Trending Rail V3 test", status: "Draft" },
    { name: "home -- 10.13 zenapse OFF", status: "Draft" },
    { name: "home -- 10.13 Streamly Emphasis Test LAUNCH", status: "Draft" },
    { name: "home -- trending rail", status: "Draft" },
    { name: "home -- Copy of 10.15 Trending Rail V3 test", status: "Draft" },
    { name: "home -- Trending Rail launch", status: "Published" },
    { name: "home -- Copy testing", status: "Draft" },
    { name: "home -- qa-uat-3584", status: "Draft" },
  ],
};
