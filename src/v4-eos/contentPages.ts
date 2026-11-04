// Streamly Content Pages — one territory template (content-page-us), not a
// slug tree. ATOM supplies the title; this config is the shell around every
// watch URL. Field ids follow the production CMS form (cms-schema + passes).

export type PassType = "free" | "select" | "premium" | "starz";

export interface PassConfig {
  passType: PassType;
  enabled: boolean;
  title: string;
  ctaLabel: string;
  upcomingCtaLabel: string;
  ctaUrl: string;
  breadcrumbLabel: string;
  breadcrumbUrl: string;
  termsModule: string;
  optionalWidget1: string;
  optionalWidget2: string;
  optionalWidget3: string;
  customFaqTitle: string;
}

export interface ContentPageFaqAnswer {
  textBeginning: string;
  afterTitleText: string;
  urlText: string;
  textEnd: string;
}

export interface ContentPageI18n {
  watch: string;
  details: string;
  aboutSeries: string;
  aboutEpisode: string;
  aboutMovie: string;
  ratings: string;
  cast: string;
  crew: string;
  director: string;
  producer: string;
  genre: string;
  studio: string;
  releaseDate: string;
  runtime: string;
  streaming: string;
  comingSoon: string;
  unavailable: string;
  comingSoonLabel: string;
  streamingUntil: string;
  season: string;
  seasons: string;
  episode: string;
  episodes: string;
  seasonSymbol: string;
  episodeSymbol: string;
  minuteSymbol: string;
  series: string;
  movies: string;
  getPremium: string;
  mins: string;
  viewAll: string;
  audioDescribedAltText: string;
  closedCaptionedAltText: string;
  dolbyVisionAltText: string;
  showMoreText: string;
  showFewerText: string;
  selectSeasonLabel: string;
  heroButtonAria: string;
  heroCriticsAria: string;
  heroFanAria: string;
  heroDescriptionReadMore: string;
  heroDescriptionReadLess: string;
  recommendationsTitle: string;
  faqTitle: string;
  faqHowWatchTitle: string;
  faqHowWatchShowAnswer: ContentPageFaqAnswer;
  faqHowWatchMovieAnswer: ContentPageFaqAnswer;
  faqWhereWatchTitle: string;
  faqWhereWatchShowAnswer: ContentPageFaqAnswer;
  faqWhereWatchMovieAnswer: ContentPageFaqAnswer;
  faqHowLongTitle: string;
  faqHowLongAnswer: ContentPageFaqAnswer;
  faqSeasonsTitle: string;
  faqSeasonsSingleAnswer: ContentPageFaqAnswer;
  faqSeasonsPluralAnswer: ContentPageFaqAnswer;
  showSubheading: string;
  movieSubheading: string;
  seriesMetadataTitle: string;
  seriesMetadataTitleFallback: string;
  seasonMetadataTitle: string;
  seasonMetadataTitleFallback: string;
  programmeMetadataTitle: string;
  programmeMetadataTitleFallback: string;
  episodeMetadataTitle: string;
  episodeMetadataTitleFallback: string;
  episodeMetadataDescription: string;
  episodeMetadataDescriptionFallback: string;
  episodeMetadataKeywords: string;
  episodeMetadataOgTitle: string;
}

export interface ContentPageConfig {
  enabled: boolean;
  filterRecommendedCarousel: boolean;
  enableCustomFaq: boolean;
  legal: string;
  skipLinkMain: string;
  skipLinkFooter: string;
  faqSuccessRedirect: string;
  devicesHref: string;
  allMonthlyPlansHref: string;
  freeEpisodesHref: string;
  premiumEpisodesHref: string;
  mixedEpisodesHref: string;
  freeEpisodesText: string;
  premiumEpisodesText: string;
  allPlansBtnText: string;
  premiumBtnText: string;
  mixedBtnText: string;
  freeBtnText: string;
  emailPlaceholder: string;
  carouselTv: string;
  carouselMovies: string;
  carouselKids: string;
  carouselNews: string;
  videoEnd1: string;
  videoEnd2: string;
  videoPause1: string;
  videoPause2: string;
  videoPauseCta: string;
  videoPauseHref: string;
  whatIsWidget: string;
  extraWidget1: string;
  extraWidget2: string;
  extraWidget3: string;
  footerNavWidget: string;
  stickyBannerWidget: string;
  experiments: boolean;
  i18n: ContentPageI18n;
  passes: PassConfig[];
}

export type AtomKind = "series" | "movie" | "episode";

export interface AtomTitle {
  id: string;
  slug: string;
  title: string;
  kind: AtomKind;
  genre: string;
  year: string;
  rating: string;
  seasons?: number;
  episodes?: number;
  runtime?: string;
  synopsis: string;
  tags: string[];
  poster: AtomPosterId;
}

export type AtomPosterId =
  | "scorpion-king"
  | "the-office"
  | "snapped"
  | "office-pilot";

export type ContentPageStatus = "Draft" | "Published";

export interface ContentPageRecord {
  id: string;
  slug: string;
  name: string;
  territory: string;
  locale: string;
  status: ContentPageStatus;
  created: string;
  modified: string;
  editedBy: string;
  config: ContentPageConfig;
}

export type OutlineGroupId =
  | "overview"
  | "widgets"
  | "memberships"
  | `pass-${PassType}`
  | "filter-recommended"
  | "faq-override"
  | "territory-pages"
  | "accessibility"
  | "urls"
  | "texts"
  | "episodes"
  | "button-text"
  | "email-capture"
  | "carousels"
  | "video"
  | "translation-copy"
  | "i18n"
  | "i18n-hero"
  | "i18n-recommended"
  | "i18n-faq"
  | "i18n-subheadings"
  | "i18n-meta";

export interface OutlineNode {
  id: OutlineGroupId;
  label: string;
  hint?: string;
  selectable?: boolean;
  // Material Symbol shown in the top-level outline row (subitems have none).
  icon?: string;
  children?: OutlineNode[];
}

export const ATOM_TITLES: AtomTitle[] = [
  {
    id: "scorpion-king",
    slug: "watch-online/movies/action-and-adventure/the-scorpion-king/7603de33-38c0-3485-a3f2-af9f51365abf",
    title: "The Scorpion King",
    kind: "movie",
    genre: "Action",
    year: "2002",
    rating: "PG-13",
    runtime: "1h 32m",
    synopsis:
      "A desert warrior rises against an evil army and becomes a legend in this adventure set before the world of The Mummy.",
    tags: ["Action", "Adventure", "Fantasy"],
    poster: "scorpion-king",
  },
  {
    id: "the-office",
    slug: "watch-online/tv/comedy/the-office/office-us",
    title: "The Office",
    kind: "series",
    genre: "Comedy",
    year: "2005",
    rating: "TV-14",
    seasons: 9,
    episodes: 201,
    synopsis:
      "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
    tags: ["Comedy", "Mockumentary"],
    poster: "the-office",
  },
  {
    id: "snapped",
    slug: "watch-online/tv/snapped/7569022312246115112",
    title: "Snapped",
    kind: "series",
    genre: "True Crime",
    year: "2004",
    rating: "TV-14",
    seasons: 32,
    episodes: 480,
    synopsis:
      "Profiles of women accused of murder, reconstructed from interviews, archives, and case files.",
    tags: ["True Crime", "Documentary"],
    poster: "snapped",
  },
  {
    id: "office-s1e1",
    slug: "watch-online/tv/comedy/the-office/s1/pilot",
    title: "The Office · Pilot",
    kind: "episode",
    genre: "Comedy",
    year: "2005",
    rating: "TV-14",
    runtime: "22m",
    synopsis:
      "A documentary crew arrives at the Scranton branch as a new downsizing consultant unsettles the staff.",
    tags: ["Comedy", "Episode"],
    poster: "office-pilot",
  },
];

export const DEFAULT_ATOM_ID = "scorpion-king";

const pass = (
  passType: PassType,
  title: string,
  ctaLabel: string,
  ctaUrl: string,
): PassConfig => ({
  passType,
  enabled: true,
  title,
  ctaLabel,
  upcomingCtaLabel: "Coming soon",
  ctaUrl,
  breadcrumbLabel: "Plans",
  breadcrumbUrl: "/plans",
  termsModule: "content-page-terms",
  optionalWidget1: "",
  optionalWidget2: "",
  optionalWidget3: "",
  customFaqTitle: "",
});

export const DEFAULT_CONTENT_PAGE: ContentPageConfig = {
  enabled: true,
  filterRecommendedCarousel: false,
  enableCustomFaq: false,
  legal: "Cancel anytime. Restrictions apply. See terms for details.",
  skipLinkMain: "Skip to main content",
  skipLinkFooter: "Skip to footer",
  faqSuccessRedirect: "/plans",
  devicesHref: "/devices",
  allMonthlyPlansHref: "/plans/all-monthly",
  freeEpisodesHref: "/free",
  premiumEpisodesHref: "/plans/premium",
  mixedEpisodesHref: "/plans",
  freeEpisodesText: "Free episodes available",
  premiumEpisodesText: "Premium episodes",
  allPlansBtnText: "See all plans",
  premiumBtnText: "Go Premium",
  mixedBtnText: "See plans",
  freeBtnText: "Watch free",
  emailPlaceholder: "Email address",
  carouselTv: "atom/recs/tv-fallback",
  carouselMovies: "atom/recs/movies-fallback",
  carouselKids: "atom/recs/kids-fallback",
  carouselNews: "atom/recs/news-fallback",
  videoEnd1: "Ready to keep watching?",
  videoEnd2: "Pick a plan to unlock this title.",
  videoPause1: "Paused",
  videoPause2: "Continue with a Streamly plan.",
  videoPauseCta: "See plans",
  videoPauseHref: "/plans",
  whatIsWidget: "what-is-streamly",
  extraWidget1: "",
  extraWidget2: "",
  extraWidget3: "",
  footerNavWidget: "footer-nav",
  stickyBannerWidget: "",
  experiments: false,
  i18n: {
    watch: "Watch",
    details: "Details",
    aboutSeries: "About this Series",
    aboutEpisode: "About this Episode",
    aboutMovie: "About this Movie",
    ratings: "Ratings",
    cast: "Cast",
    crew: "Crew",
    director: "Director",
    producer: "Producer",
    genre: "Genre",
    studio: "Studio",
    releaseDate: "Release Date",
    runtime: "Runtime",
    streaming: "Streaming",
    comingSoon: "Coming Soon",
    unavailable: "Unavailable",
    comingSoonLabel: "",
    streamingUntil: "Streaming until {{date}}",
    season: "Season",
    seasons: "Seasons",
    episode: "Episode",
    episodes: "Episodes",
    seasonSymbol: "",
    episodeSymbol: "",
    minuteSymbol: "",
    series: "Series",
    movies: "Movies",
    getPremium: "Watch on Streamly",
    mins: "Mins",
    viewAll: "View all",
    audioDescribedAltText: "Audio Described",
    closedCaptionedAltText: "Closed Captioned",
    dolbyVisionAltText: "Dolby Vision",
    showMoreText: "",
    showFewerText: "",
    selectSeasonLabel: "",
    heroButtonAria: "Watch on Streamly",
    heroCriticsAria: "Rotten Tomatoes critics score",
    heroFanAria: "Rotten Tomatoes fan score",
    heroDescriptionReadMore: "Read More",
    heroDescriptionReadLess: "Read Less",
    recommendationsTitle: "You May Also Like",
    faqTitle: "Frequently Asked Questions",
    faqHowWatchTitle: "How can I watch {{title}}?",
    faqHowWatchShowAnswer: {
      textBeginning:
        "Download the Streamly app and start streaming full episodes of",
      afterTitleText: ".",
      urlText: "View the full list of supported devices",
      textEnd: ".",
    },
    faqHowWatchMovieAnswer: {
      textBeginning: "Download the Streamly app and start streaming",
      afterTitleText: ".",
      urlText: "View the full list of supported devices",
      textEnd: ".",
    },
    faqWhereWatchTitle: "Where can I watch {{title}}?",
    faqWhereWatchShowAnswer: {
      textBeginning: "You can watch",
      afterTitleText: "on Streamly. Just",
      urlText: "sign up",
      textEnd: "and stream every episode.",
    },
    faqWhereWatchMovieAnswer: {
      textBeginning: "You can watch",
      afterTitleText: "on Streamly. Just",
      urlText: "sign up",
      textEnd: "and stream every episode.",
    },
    faqHowLongTitle: "How long is {{title}}?",
    faqHowLongAnswer: {
      textBeginning: "has a running time of {{duration}}. Stream it on",
      afterTitleText: ".",
      urlText: "",
      textEnd: "",
    },
    faqSeasonsTitle: "How many seasons of {{title}} are there?",
    faqSeasonsSingleAnswer: {
      textBeginning: "There is currently {{availableSeasonCount}} season of",
      afterTitleText: "available for streaming on Streamly.",
      urlText: "",
      textEnd: "",
    },
    faqSeasonsPluralAnswer: {
      textBeginning: "Streamly currently has {{availableSeasonCount}} seasons of",
      afterTitleText: "available for streaming.",
      urlText: "",
      textEnd: "",
    },
    showSubheading: "Watch Full Episodes of {{title}}",
    movieSubheading: "Watch {{title}}",
    seriesMetadataTitle: "Watch {{title}} | Streamly",
    seriesMetadataTitleFallback: "Watch Streamly Streaming Online",
    seasonMetadataTitle:
      "Watch {{title}} Season {{season}} Streaming Online | Streamly",
    seasonMetadataTitleFallback: "Watch Streamly Streaming Online",
    programmeMetadataTitle: "Watch {{title}} | Streamly",
    programmeMetadataTitleFallback: "Watch Streamly Streaming Online",
    episodeMetadataTitle:
      "Watch {{title}} Season {{seasonNumber}}, Episode {{episodeNumber}}: {{episodeName}} | Streamly",
    episodeMetadataTitleFallback: "Watch Streamly Streaming Online",
    episodeMetadataDescription:
      "Streamly is your go-to streaming service for watching {{title}} Season {{seasonNumber}}, Episode {{episodeNumber}}: {{episodeName}}. Watch now!",
    episodeMetadataDescriptionFallback:
      "Streamly is your go-to streaming service for hit movies, TV shows, and live sports. Stream Streamly Originals, ACME and BrandP favorites, blockbuster films, NFL, Premier League, Big Ten Football, and more!",
    episodeMetadataKeywords:
      "{{title}} Season {{seasonNumber}}, Episode {{episodeNumber}}, Watch Title Season {{seasonNumber}}, Episode {{episodeNumber}}, Stream {{title}} Season {{seasonNumber}}, Episode {{episodeNumber}}, {{episodeName}}",
    episodeMetadataOgTitle:
      "Watch {{title}} Season {{seasonNumber}} Episode {{episodeNumber}}: {{episodeName}} on Streamly",
  },
  passes: [
    pass("select", "Select", "Start Select", "/checkout/select"),
    pass("premium", "Premium / Premium Plus", "Go Premium", "/checkout/premium"),
    pass("starz", "STARZ", "Add STARZ", "/checkout/starz"),
    pass("free", "Free", "Watch free", "/free"),
  ],
};

// Production Iceberg Content Page form headings, in source order. Only the
// tabbed/grouped sections become nested tree nodes.
export const CONTENT_PAGE_OUTLINE: OutlineNode[] = [
  { id: "overview", label: "Content Page", icon: "article" },
  { id: "widgets", label: "Content Page Widgets", icon: "widgets" },
  {
    id: "memberships",
    label: "Memberships",
    icon: "card_membership",
    selectable: false,
    children: [
      { id: "pass-select", label: "Select" },
      { id: "pass-premium", label: "Premium / Premium Plus" },
      { id: "pass-starz", label: "STARZ" },
    ],
  },
  {
    id: "filter-recommended",
    label: "Recommended Carousel Filter",
    icon: "filter_alt",
  },
  { id: "faq-override", label: "FAQ Override", icon: "help" },
  { id: "territory-pages", label: "Content Pages for Territory", icon: "public" },
  { id: "accessibility", label: "Accessibility - Skip Links", icon: "accessibility_new" },
  { id: "urls", label: "PDP URLs", icon: "link" },
  {
    id: "texts",
    label: "Texts",
    icon: "text_fields",
    selectable: false,
    children: [
      { id: "episodes", label: "Episode Text" },
      { id: "button-text", label: "Button Text" },
      { id: "email-capture", label: "Email Capture" },
      { id: "video", label: "Video Text" },
    ],
  },
  { id: "carousels", label: "Content Page Carousels", icon: "view_carousel" },
  {
    id: "translation-copy",
    label: "Translation Copy",
    icon: "translate",
    selectable: false,
    children: [
      { id: "i18n", label: "Common Words" },
      { id: "i18n-hero", label: "Hero Copy" },
      { id: "i18n-recommended", label: "Recommended Copy" },
      { id: "i18n-faq", label: "FAQ Copy" },
      { id: "i18n-subheadings", label: "Subheadings" },
      { id: "i18n-meta", label: "Meta Copy" },
    ],
  },
];

export const CONTENT_PAGE_OUTLINE_DEFAULT_OPEN = new Set<OutlineGroupId>([
  "memberships",
  "texts",
  "translation-copy",
]);

export function atomById(id: string): AtomTitle {
  return ATOM_TITLES.find((t) => t.id === id) ?? ATOM_TITLES[0];
}

export function passByType(
  config: ContentPageConfig,
  type: PassType,
): PassConfig {
  return config.passes.find((p) => p.passType === type) ?? config.passes[0];
}

export function outlineLabel(id: OutlineGroupId): string {
  const walk = (nodes: OutlineNode[]): string | null => {
    for (const n of nodes) {
      if (n.id === id) return n.label;
      if (n.children) {
        const hit = walk(n.children);
        if (hit) return hit;
      }
    }
    return null;
  };
  return walk(CONTENT_PAGE_OUTLINE) ?? "Overview";
}

export function interpolate(template: string, title: string): string {
  return template.replace(/\{\{title\}\}/g, title);
}

function cloneConfig(base: ContentPageConfig = DEFAULT_CONTENT_PAGE): ContentPageConfig {
  return structuredClone(base);
}

function usContentPageConfig(): ContentPageConfig {
  const config = cloneConfig();
  return {
    ...config,
    whatIsWidget: "",
    extraWidget1: "trailer-rail",
    extraWidget2: "what-is-streamly",
    extraWidget3: "",
    footerNavWidget: "seo-footer",
    stickyBannerWidget: "sticky-banner-widget-data",
    experiments: false,
    legal: "",
    skipLinkMain: "",
    skipLinkFooter: "",
    faqSuccessRedirect: "",
    devicesHref: "/devices",
    allMonthlyPlansHref: "/plans/all-monthly",
    freeEpisodesHref: "/plans/all-monthly",
    premiumEpisodesHref: "/plans/all-monthly",
    mixedEpisodesHref: "/plans/all-monthly",
    freeEpisodesText: "Sign up for Streamly to watch this episode.",
    premiumEpisodesText: "Sign up for Streamly to watch this episode.",
    allPlansBtnText: "Get Started",
    premiumBtnText: "Get Started",
    mixedBtnText: "Get Started",
    freeBtnText: "Get Started",
    emailPlaceholder: "",
    videoEnd1: "",
    videoEnd2: "",
    videoPause1: "",
    videoPause2: "",
    videoPauseCta: "",
    videoPauseHref: "",
    carouselTv: "Bloodthirsty",
    carouselMovies: "Bloodthirsty",
    carouselKids: "Bloodthirsty",
    carouselNews: "Bloodthirsty",
    passes: config.passes.map((membership) =>
      membership.passType === "select"
        ? {
            ...membership,
            ctaLabel: "Get Started",
            upcomingCtaLabel: "",
            ctaUrl: "#ib-section-content-pages-plan-picker-with-select",
            breadcrumbLabel: "",
            breadcrumbUrl: "",
            termsModule: "",
            optionalWidget1: "content-pages-plan-picker-with-select",
            optionalWidget2: "",
            optionalWidget3: "",
          }
        : membership,
    ),
  };
}

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "template";
}

const SEED_CONTENT_PAGES: ContentPageRecord[] = [
  {
    id: "content-page-us",
    slug: "content-page-us",
    name: "US template",
    territory: "United States",
    locale: "en-US",
    status: "Published",
    created: "Mon 12 Oct 26",
    modified: "Mon 12 Oct 26",
    editedBy: "Editor D",
    config: usContentPageConfig(),
  },
  {
    id: "content-page-uk",
    slug: "content-page-uk",
    name: "UK template",
    territory: "United Kingdom",
    locale: "en-GB",
    status: "Draft",
    created: "Tue 22 Sep 26",
    modified: "Fri 02 Oct 26",
    editedBy: "Editor B",
    config: cloneConfig(),
  },
];

type Listener = () => void;
let records: ContentPageRecord[] = SEED_CONTENT_PAGES;
const listeners = new Set<Listener>();

export function subscribeContentPages(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function listContentPages(): ContentPageRecord[] {
  return records;
}

export function getContentPage(id: string): ContentPageRecord | undefined {
  return records.find((page) => page.id === id);
}

export function createContentPage(input: {
  name: string;
  territory: string;
  locale: string;
}): ContentPageRecord {
  const base = `content-page-${slugify(input.territory)}`;
  let slug = base;
  let n = 2;
  while (records.some((page) => page.slug === slug)) {
    slug = `${base}-${n++}`;
  }
  const page: ContentPageRecord = {
    id: slug,
    slug,
    name: input.name.trim(),
    territory: input.territory.trim(),
    locale: input.locale.trim() || "en-US",
    status: "Draft",
    created: "Just now",
    modified: "Just now",
    editedBy: "Editor D",
    config: cloneConfig(),
  };
  records = [page, ...records];
  listeners.forEach((fn) => fn());
  return page;
}

