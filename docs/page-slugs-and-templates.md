# Page slugs and templates

Working notes for the Pages "Create page" popup. Source for the slug tree is the
Pages list export from 3 Nov 2026. Source for the page types is
`iceberg-commerce-main.zip` (Downloads).

## Slug tree (top level → subpages)

| Top level | Subpages | Notes |
|---|---|---|
| `/faqs` | 1 | `Brands` |
| `/offer` | 10 | blackfriday, brandn, reba-fans, brandq-at-brandr2026, brandn-2-months, bravo-insider-offer, dish, brandgoffer1, cox-customer-offer, streamly-2024 |
| `/brando` | 1 | `limit` |
| `/offer-terms` | ~70 | Separate tree from `/offer`. Includes offer-terms, young-adult, teacher, student, military, medical-first-responder, brand offers |
| `/news` | 1 | `presidential-election` |
| `/test` | 8 | lee, sv, meg, zsu-test, sean, jb, elizabeth, testjb1 |
| `/stream-movies` | ~67 | Movie pages |
| `/campaign` | 1 | `films` |
| `/stream-tv` | ~110 | Show pages |
| `/dr` | 16 | suits, the-valley, top-chef, oppenheimer, and others |
| `/stream-event` | 6 | national-dog-show, macys-thanksgiving-parade, emmy-awards, eurovision, live-mas-live, bravocon |
| `/partners` | 1 | `brandiupgrade` |
| `/plans` | 12 | plans, subscribe-to-watch, all-monthly-test, all-monthly, brandt-tv-and-streamly, subscribe, testing-variant, all-annual, premium-monthly, channels, sports, premium-annual |
| `/soccer` | 1 | `en-espanol` |
| `/add-ons` | 3 | brandy, brandy-test, partnerships-template |
| `/error` | 4 | non-adult-profile, basketfail-signedout, basketfail-signedin, maintenance |
| `/sweepstakes` | 1 | `meundies` |
| `/quick-access` | 1 | `terms` |
| `/bundle` | 1 | `brandt-tv` |
| `/voting-terms` | 1 | `love-island` |
| `/stream-news` | 1 | `morning-news-live` |

All other slugs are standalone top-level pages (for example `/home`, `/terms`,
`/Brands`, `/teacher`, and the `/qa-…` pages).

## Page types found in code

- **Page schemas (containers)**, from `packages/iceberg-commerce-elements-streamly/src/core/schemas.ts`:
  `base-us` (ACME US Layout), `content-page-us`, `channel-page-us`, `event-page-us`.
  The create endpoint (`apps/iceberg-commerce-api/app/routes/api/page-api.ts`, `create`)
  takes a `slug` and a `layout`, which is the page schema `_id`.
- **Section templates that name a use case**: `section-ia-faqs` (FAQ),
  `section-ia-sports-fixture` and `section-ia-regional-sports-network` (sports).
  No news-specific section or page schema exists in the code.
- **Existing pages**: `pages.json` (81 records) contains only `pageType: "web"` pages on the
  `polyatomic` and `base-roi` layouts. It does not define FAQ, sports, or news page types.

## Open questions

- No module list exists in code for "FAQ page", "Sports page", or "News page". These
  would be authored compositions of section templates. Screenshots of a production
  FAQ, sports, and news page would give the module order for each template.
- The "+" on Pages (`PagesView.tsx`, `aria-label="Create page"`) has no handler in the
  prototype yet.

## Templates from CMS section lists (15 screenshots, 3 Nov 2026)

Section names are the CMS structure labels, top to bottom. `empty` is a placeholder
section, `section-N` is an unnamed section, and `(IA)` marks an information-architecture
template section.

| Family | Example slug | Module order |
|---|---|---|
| Sports | `/soccer/en-espanol` | Hero → Soccer Leagues → SLE Carousel IA → Plan Picker → Sports Offering Module → Filtered grid → FAQs → SEO footer |
| News | `/news/presidential-election` | Offer → Breadcrumbs → Hero → Stream debates → ACME News NOW companion → Coming Soon → Plan picker → News content rail → Politics rail → Docs → FAQs |
| News (landing) | `/stream-news/morning-news-live` | Sticky nav → Offer banner → Hero → Latest headlines → Always-on → Local affiliates → Shutter → FAQs → What is Streamly? → Footer |
| Movie | `/stream-movies/minions-and-monsters` | Offer → Hero → empty → Plan picker → Description → Cast → Video → Merchandising → You May Also Like → New movies rail |
| TV show | `/stream-tv/law-and-order` | Offer → Hero (IA) → empty → Plan picker → Description (IA) → brandt → Episodes (IA) → Videos → Cast (IA) |
| Event | `/stream-event/national-dog-show` | Offer → Hero (IA) → empty → Plan picker → Description (IA) → carousels |
| Campaign grid | `/campaign/films` | empty → Hero → Grid → empty → Plan picker → carousels |
| Direct response / landing | `/dr/suits` | Offer → empty → Hero control/variant → Trailer → Show description → Whole Lot More → D/M rails → Plan picker → Device fam → FAQs → SEO footer |
| Partner / bundle / add-on | `/partners/brandiupgrade`, `/bundle/brandt-tv`, `/add-ons/brandy` | Hero → value sections → Plan picker → Steps / Instructions → FAQ |
| Plan page | `/plans/all-monthly` | Title → See What → Premium card → empty |
| Terms / sweepstakes | `/offer-terms/military`, `/sweepstakes/meundies` | T&C (IA) → empty sections |
| Error | `/error/non-adult-profile` | section-1 … section-6 (no named modules) |

Notes:
- No screenshot shows a standalone FAQ page. FAQs appear as a section at the end of
  sports, news, direct-response, and bundle pages.
- Sports and news have the clearest repeatable structure. Both start with an offer or
  hero and end with FAQs and a footer.

## Real module structure (rendered page snapshots, ICEBERG 2.0 folder)

Source: `Iceberg - Edit Page - faqs_Brands.html` (OneDrive, ICEBERG 2.0/ICEBERG).
This is the only full page-level snapshot available; the rest are CMS screenshots.

**FAQ template (`/faqs/Brands`), top to bottom:**
1. Header (`ia-header`, with nav logo and buttons)
2. Section 1 (`section-custom`):
   - Rich text: "Frequently Asked Questions" (title)
   - Rich text: "1) Brands World Elite and World Legend" (group heading)
   - FAQs (`streamly-faqs`)
3. Section 2 (`section-custom`):
   - Rich text (group heading)
   - FAQs (`streamly-faqs`)
   - Footer (`streamly-footer`)

Section layouts used: `section-client-custom-layout`, `section_default`, `section-streamly-catalogue`, `section-ia-header`.
Page layout: `base-us`.

**Widget pool:** `Iceberg - Widget List.html` (ICEBERG 2.0) lists 259 reusable widgets with
slugs, e.g. `/faqs`, `/dr-faq`, `/footer`, `/seo-footer`, `/header`, `/hero-banner`,
`/sports-offering-module-new`, `/sports-banner-module`, `/shutter-sports`, `/trailer-rail`,
`/filtered-grid-generic`, and plan pickers. It lists widgets, not which page uses which one.

**News template (`/news/presidential-election`, layout `base-us`, pageType `web`)**
Source: `Archive 2.zip` > `Iceberg - Edit Page - news_presidential-election.html`. The page JSON
(`__NEXT_DATA__` > `fetchPreviewPage`) holds the full layout, so this is exact, not inferred.

Fixed (every page): `cookie-banner`, `header`, `footer` widgets.

Dynamic sections, top to bottom (`label` = editor section name):
1. Breadcrumbs (rich text)
2. Coming Soon (rich text + saved section)
3. FAQs (rich text + `streamly-faqs`)
4. ACME News NOW Companion Module (saved section)
5. News content rail (saved section; carousel `/news/news-in-the-newsroom`, `titleArt169`)
6. Plan picker (widget `plan-picker-copy-dr`)
7. Politics in TV and Movies (saved section; carousel `/news/election-2024---politics-in-tv-film`)
8. Offer (widget `offer-banner`)
9. Hero (rich text + saved section + rich text)
10. Stream debates (saved sections: VP debate, Pres debate, and a rich text block)
11. Docs (saved section; carousel `/news/election-thought-provoking-docs`)
12. Empty sections 12–18 (`section-12` … `section-18`, no modules)
13. What is Streamly? (widget `what-is-streamly`)
14. SEO footer (widget `seo-footer`)

Saved sections (`S-…`, referenced by `section-reference` modules) hold the reusable blocks
for Mobile/Desktop companion, Text Information, Image + Text, CTA, Title, Header, Logo and CTA,
DNC, RNC, Coming Soon, and Copy. Each saved section has its own rich-text, button, or image modules.

Module types on this page: `streamly-polyatomic-rich-text`, `streamly-faqs`, `streamly-carousel`,
`streamly-button`, `responsive-image`, `section-reference`, plus widget slots.

**Exact FAQ structure from the same JSON (`faqs/Brands`, in `Iceberg - Edit Page - faqs_Brands.html`):**
Fixed: `cookie-banner`, `header`, `footer` widgets. Dynamic: section-2 "Brands World FAQs" (rich text + `streamly-faqs`);
section-1 "Brands World Elite FAQs" (2 rich text + `streamly-faqs`). The other 18 dynamic sections
are empty. The rendered-HTML reading above is incomplete,
so use this JSON for FAQ.

**Sports template (`/sports`, layout `base-us`, pageType `web`)**
Source: `Sports.zip` > `Iceberg - Edit Page - sports.html`, exact from the page JSON.
Note: this is the `/sports` landing page, not `/soccer/en-espanol`.

Fixed: `cookie-banner`, `header`, `footer` widgets.

Dynamic sections, top to bottom (`label` = editor section name):
1. section-12, section-4, section-11, section-17: empty
2. seo-footer (saved section) → widget `seo-footer` (saved in the page's saved-sections list)
3. Devices (widget `commerce-device-icons`)
4. Student Discount Banner (widget `generic-student-discount-banner`)
5. section-15: empty
6. FAQ (IA) (`section-ia-faqs`): "Frequently Asked Questions", 4 FAQs in `settings.faqs`
7. Documentary Carousel (`section-ia-carousel`)
8. section-1: empty
9. SLE IA (`section-ia-sle-carousel`): "Nonstop Live Sports and Events", LIVE/REPLAY badges,
   collection `/iceberg/iceberg-sports-sle-carousel-module`, max 15
10. section-10: empty
11. Promo Banner (widget `sports-pop-up-banner`)
12. section-8: empty
13. Hero IA (`section-ia-hero-template`, `templateVariant: sports`): headline "Stream LIVE Sports & Events", GET STARTED CTA
14. section-9: empty
15. Variant 1 - Sports Imagery: 7 saved sections (Header, Mini Games, Mini-Games image, Channels image,
    Channels copy, Subhead, Channels text)
16. Plan Picker (widget `content-pages-plan-picker-no-select`)
17. section-3: empty

Saved-section (`S-…`) blocks use `streamly-polyatomic-rich-text` and `responsive-image`.

**Widgets on sports:** `cookie-banner`, `header`, `footer`, `seo-footer`, `commerce-device-icons`,
`generic-student-discount-banner`, `sports-pop-up-banner`, `content-pages-plan-picker-no-select`.

**Data gap:** section-ia-carousel (Documentary) has no collection in its settings, so its carousel
source is unknown from this file. The SLE carousel is `/iceberg/iceberg-sports-sle-carousel-module`.

## Proposed architecture (3 Nov 2026, not built yet)

Glossary, checked against the production Help > Glossary article (written 2023, may be stale):

- **Page**: consists of 20 sections. Confirmed in the editor (every sampled page shows 20 section slots).
- **Section**: a container of modules or widgets.
- **Module**: a content container built by the team (e.g. Plan Picker, Button, FAQs, Carousel). A module is not a widget.
- **Widget**: a bundle of modules that can be reused on multiple pages. Composed from a section of a page.
- **Central Management**: a single module reused across pages (e.g. Button module). Managed under Central Mgmt.
- **Layout**: the rules of page assembly (default, custom, programmatic).
- **Bespoke page**: a custom page editors create, such as the home page. Not the same as the editor's "Custom" design option.
- **Programmatic page**: a pre-defined layout with auto-generated content (e.g. title pages for film/TV, sports SLE, category pages).
- **Content Page**: a separate CMS menu (Content Pages). The Help glossary does not define it, so the earlier definition here (global, locked modules) is unverified.
- **Variant**: not in the glossary. Observed: each published page has exactly one published variant; drafts have none.

**Evidence from the page JSON:** global references are visible. Widget slots (`widget`) and saved-section
references (`section-reference` to `S-…`) are global. Inline modules are local to the page.
- FAQ (`faqs/Brands`): 3 global widget slots, 5 inline modules (rich text, `streamly-faqs`), no references.
- News (`news/presidential-election`): 7 global widget slots, 34 saved-section references, 30 inline modules (excluding empty placeholders).
- Sports (`sports`): 8 global widget slots, 8 saved-section references, 4 `section-ia-*` templates, 5 inline rich text + 2 images.

**Data still needed** to confirm module sets and the custom-page rule:
1. **Content Pages list**: the "Content Pages" tab in the CMS (Page List nav). Save as "Webpage, Complete"
   (`Iceberg - Content Pages.html`). This tells us which pages are global content pages.
2. **One content-page snapshot** (Edit Page, Webpage Complete): confirms that a content page has a fixed set of modules.
3. **Parent template snapshots** for news and FAQ: `/news` and `/faqs`. Comparing them with the child pages
   (`/news/presidential-election`, `/faqs/Brands`) shows which changes make a page custom.

**Efficiency pain points (per `AUTHOR-EFFICIENCY.md`):** helps #1 (one template change reaches a set of pages),
#6 (stop building bespoke pages from scratch), #3 (global widgets shared across territories).
Risk: custom pages drift from their template. Pain #5 (no concurrency lock) is not addressed.

## Content model (UX architect, 4 Nov 2026)

- **Widget**: a globally managed reusable unit (Hero, Banner, Carousel, FAQ, Plan Picker). One definition, used on many pages, maintained from the Widgets area.
- **Layout**: the reusable arrangement of Widget placements. The Layout picker is the catalog (`LAYOUT_CATALOG`).
- **Page composition**: an ordered list of Layouts and Widgets. The page owns sequence, placement and page-specific values, and references global definitions.
- **Template**: a starter preset, not a live parent. After creation the page owns its composition. Origin is kept as `templateId` and `templateVersion`; later template edits never rewrite existing pages.
- **Managed page**: fixed structure, operator edits content only. **Custom page**: owns its structure (add, remove, reorder, configure). Starts blank, from a template, or by duplicating a page.
- **Local override / detachment**: editing a global Widget on one page makes a visible local override with source id and revision. Reattach restores propagation.

**Rule of thumb:** global definitions are reusable; pages own composition and values; templates set lineage; references enable propagation; overrides narrow it; detachment makes independent ownership.

**Open product decision (Development):** global changes propagate automatically, on publish with an update review, or only when an operator applies them. Recommended: versioned changes with an operator-visible update/preview step.

### Where the prototype stands

- Widgets list: one row per catalog layout (`layout-widgets.ts`). Same set as the Layout picker.
- Template steps linked to a catalog Widget get `widgetSlug` on the section. Global navigation and Navigation link to the CMS production widget `/header`. Steps with no catalog or CMS match are custom placeholders: Page title, Category tabs, Empty / loading / error states, Brand tabs, Live / Upcoming / Replays tabs, Now playing channel, Channel filters, Watch now action, Title metadata, Play / trailer CTA, Save / share actions, Series metadata, Play CTA, Season selector.
- Origin: `templateId` and `templateVersion` stored on created pages.
- Overrides: `moduleDetached` marks a detached module. Reattach and the source revision are not built yet.
