# Eos Design System (v1)

> **Primary source of truth (visual & components):**
> [Eos Library v1.0 on Figma](https://www.figma.com/design/N8BwUZPaO2artCvrsarVK2/Eos---Library-v1.0?node-id=554-5314&m=dev)
> File key `N8BwUZPaO2artCvrsarVK2` · Canonical entry node **`554:5314`** (Dev Mode).
> This document records Eos *implementation rules* (default dense density) for product work. **When Figma and this doc disagree, Figma wins.**
> **Status:** Shipping Eos defaults. Supersedes experimental M3 field/nav trials (56px fields, Roboto, pill nav icons, non-standard brand accents).
> **Principle:** Dense, light-mode authoring UI. Color is reserved for brand, icons, and functional states.
> **Branding:** Eos only — do not ship product-specific authoring tool names in shared design system materials.

---

## 1. Typography (Eos)

Typography is foundational to Eos: hierarchy, readability, accessibility, and a consistent visual language.
**Family for Eos products:** **Inter only** (400 / 500 / 600 / 700).
**Do not use Roboto** in product UI (including forms and body copy). Emphasised styles increase prominence while keeping the same size and line height as the standard counterpart.

**Eos rule:** Product UI ships a single family — Inter. Do not mix Roboto (or dual Inter+Roboto stacks) into forms, labels, tables, or chrome. Historical M3 trials that used Roboto are obsolete; see **Appendix A**.

```css
font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### 1.1 Design principles

| Principle | Intent |
|-----------|--------|
| **Clarity first** | Structure reads before content; hierarchy is obvious at a glance |
| **Consistent hierarchy** | Same content type → same type style across Eos products |
| **Accessibility by default** | Legible across sizes, distances, and densities |
| **Purposeful emphasis** | Highlight importance; never substitute for hierarchy |

### 1.2 Type scale overview

Five categories, top → bottom:

```
Display → Headline → Title → Body → Label
```

Move progressively through the scale; avoid skipping multiple levels.

### 1.3 Display

Highest impact. Short, high-value content only.

| Style | Size | Line height | Usage |
|-------|------|-------------|--------|
| **Display Large** | 57px | 67px | Hero messaging, dashboard KPIs, landing statements, large numerals |
| **Display Medium** | 45px | 52px | Analytics summaries, workspace introductions, major callouts |
| **Display Small** | 36px | 44px | Section heroes, large content introductions, feature highlights |

**Guidance:** Keep concise; avoid multi-line paragraphs; use sparingly in product chrome.

### 1.4 Headline

Primary page / workflow hierarchy.

| Style | Size | Line height | Usage |
|-------|------|-------------|--------|
| **Headline Large** | 32px | 40px | Page titles, workspace titles, primary destinations |
| **Headline Medium** | 28px | 36px | Major sections, large content regions, modal titles |
| **Headline Small** | 24px | 32px | Secondary sections, content groups, nested workflows |

**Guidance:** Prefer one Headline Large per page; keep hierarchy consistent in a flow; never use Headline for body copy.

#### Emphasised headlines

Same size/line height; extra prominence only.

| Style | Size | Line height |
|-------|------|-------------|
| Headline Large Emphasised | 32px | 40px |
| Headline Medium Emphasised | 28px | 36px |
| Headline Small Emphasised | 24px | 32px |

**Use:** Featured content, editorial moments, selected states, high-priority messaging.
**Avoid:** Overuse, multiple emphasised headings nearby, emphasis as a fix for weak IA.

### 1.5 Title

Between Headline and Body — organises information-rich UI.

| Style | Size | Line height | Usage |
|-------|------|-------------|--------|
| **Title Large** | 22px | 28px | Card headers, module titles, major content groups |
| **Title Medium** | 16px | 24px | Panel headings, form sections, sidebar groups |
| **Title Small** | 14px | 20px | Compact sections, dense layouts, supporting groups |

**Guidance:** Introduce sections with Titles; do not replace page-level Headlines with Titles.

#### Emphasised titles

| Style | Size | Line height |
|-------|------|-------------|
| Title Large Emphasised | 22px | 28px |
| Title Medium Emphasised | 16px | 24px |
| Title Small Emphasised | 14px | 20px |

**Use:** Selected groups, featured modules, active panels, editorial / promo treatments.

### 1.6 Body

Default reading styles.

| Style | Size | Line height | Usage |
|-------|------|-------------|--------|
| **Body Large** | 16px | 24px | Primary content, long-form, help text, documentation |
| **Body Medium** | 14px | 20px | Secondary copy, supporting descriptions, **table cells**, metadata panels |
| **Body Small** | 12px | 16px | Captions, supplemental info, metadata, dense environments |

**Guidance:** Body Large is the default for reading; limit line length; space paragraphs adequately.

### 1.7 Label

Controls, navigation, metadata, dense UI.

| Style | Size | Line height | Usage |
|-------|------|-------------|--------|
| **Label Large** | 14px | 20px | Buttons, tabs, navigation, form labels (primary) |
| **Label Medium** | 12px | 16px | Secondary labels, input helpers, supporting metadata |
| **Label Small TV16** | 12px | 16px | Television / broadcast / distance-viewing |
| **Label XSmall** | 10px | 16px | Utility info, dense metadata, technical values |
| **Label Badge** | 9px | 16px | Status badges, tags, counters, chips |

**Guidance:** Labels stay concise; no paragraphs; **Label Large** is the default button style.

### 1.8 Emphasis guidelines

Emphasis is an **enhancement**, not a hierarchy level.

| Do | Don’t |
|----|--------|
| Featured content, active selections, editorial, important messages | Every heading on a page |
| Pair with clear scale + layout | Decorative use only |
| | Compensate for weak hierarchy |

Establish hierarchy with: **(1) type scale → (2) layout → (3) spacing → (4) content structure**. Emphasis is last.

### 1.9 Accessibility

| Topic | Requirement |
|-------|-------------|
| **Contrast** | Body ≥ **4.5:1**; large text ≥ **3:1** (WCAG) |
| **Line length** | Optimal **45–75** characters; max **90** |
| **Alignment** | Prefer left for body and headings; center Display/Headline sparingly; avoid justified |

### 1.10 Component → type mapping

| Component | Typography |
|-----------|------------|
| Hero banner | Display Large |
| KPI statistic | Display Medium |
| Dashboard metric | Display Small |
| Page / workspace title | Headline Large |
| Section header | Headline Medium |
| Subsection header | Headline Small |
| Card title | Title Large |
| Panel / form section | Title Medium |
| Primary content | Body Large |
| Supporting content / table body | Body Medium |
| Metadata / captions | Body Small |
| Button text | Label Large |
| Form label / helper | Label Medium / Label Medium |
| Badge / chip / counter | Label Badge |
| Nav rail item label (80px rail) | Label XSmall |
| Monospace IDs (Clip ID) | Body Small + `ui-monospace` |

### 1.11 Density notes (system default)

Eos product UI uses **dense** control heights as the system default. Map product chrome to the scale above; common defaults:

| Surface / chrome | Eos type style |
|--------------------|-----------|
| `html` / shell density | Prefer Body Medium or Label Large at **13–14px** equivalent reading; still load Inter only |
| Tool topbar title | Title Medium (16/24) or Headline Small when page-level |
| Detail H1 | Headline Small (24/32) |
| Table cells | Body Medium (14/20) |
| Buttons / chips / tabs | Label Large (14/20); chip height stays **36** or **32** per §3 |
| Field labels / hints | Label Medium (12/16) |
| Nav under icon | Label XSmall (10/16) |
| OpsHub title | Title Medium (16/24), 500 |
| Env switcher label | Label Medium (12/16) |

Tokens (optional CSS custom properties for theming):

```css
--type-display-lg: 57px / 67px;
--type-display-md: 45px / 52px;
--type-display-sm: 36px / 44px;
--type-headline-lg: 32px / 40px;
--type-headline-md: 28px / 36px;
--type-headline-sm: 24px / 32px;
--type-title-lg: 22px / 28px;
--type-title-md: 16px / 24px;
--type-title-sm: 14px / 20px;
--type-body-lg: 16px / 24px;
--type-body-md: 14px / 20px;
--type-body-sm: 12px / 16px;
--type-label-lg: 14px / 20px;
--type-label-md: 12px / 16px;
--type-label-xs: 10px / 16px;
--type-label-badge: 9px / 16px;
```

### 1.12 Philosophy

Eos Typography balances expressive storytelling with enterprise usability — predictable across apps, dashboards, workflows, and broadcast. Apply the scale consistently so products stay coherent, readable, and recognisably Eos.

---

## 2. Design Tokens

### 2.1 Color — light mode only

Surfaces and chrome stay **white / light gray**. Color appears only on **brand, icons, selection, and status**.

**Eos rule:** Prefer cool neutral white/gray surfaces (`#ffffff`, `#f5f5f5`, `#f0f0f0`, `#eeeeee`). Do **not** use warm off-whites as default chrome. Product interactive accent is always **`#1a73e8`** (`--brand` / `--brand-accent`). Do **not** use alternate brand hues for primary buttons, selection, or focus rings. OpsHub environment accents (PROD / PROTON / etc.) are reserved for the OpsHub bar only — see §3.5.1 and Appendix A.

```css
:root {
  /* Surfaces — white / light gray only (no warm off-white chrome) */
  --bg: #f5f5f5;
  --surface: #ffffff;
  --surface-container: #f5f5f5;
  --surface-high: #eeeeee;
  --sidebar: #f0f0f0;
  --sidebar-active: #e8e8e8;

  /* Text (neutral) */
  --text: #131416;
  --text-on-surface: #131416;
  --text-variant: #5f6368;
  --text-sec: #5f6368;
  --text-muted: #757575;
  --text-soft: #757575;

  /* Borders (neutral) */
  --outline: rgba(0, 0, 0, 0.23);
  --outline-variant: #c4c4c4;
  --border: #e0e0e0;
  --border-strong: #c4c4c4;

  /* Brand & functional only */
  --brand: #1a73e8;
  --brand-accent: #1a73e8;
  --selected-bg: #e8f0fe;
  --selected-border: #1a73e8;
  --chip-bg: #f1f3f4;
  --danger: #d93025;
  --success: #2e7d32;
}
```

### 2.2 Spacing scale (2–4–8–12–16)

Primary scale for padding, gaps, and margins. Section spacing may use 24 / 32 / 40.

**Eos rule:** Spacing is **tokenized**, not freeform. Pad, gap, and margin choices must land on **2 → 4 → 8 → 12 → 16** (plus optional section steps 24 / 32 / 40). Mixed one-off spacing from earlier trials is not allowed in new work.

| Token | Value | Typical use |
|-------|-------|-------------|
| `--space-0` | **2px** | Tight icon↔label gap in nav |
| `--space-1` | **4px** | Dense stack gaps, small pad |
| `--space-2` | **8px** | Control gaps, chip padding-x mid |
| `--space-3` | **12px** | Control horizontal padding, row pad |
| `--space-4` | **16px** | Panel/card padding, button pad-x |
| `--space-6` | **24px** | Content gutters, section gaps |
| `--space-8` | **32px** | Large section separation |
| `--space-10` | **40px** | Empty states |

Avoid off-scale values (e.g. 6px, 10px, 14px, 18px, 20px) unless proportional to a token (e.g. half of button height for pill radius).

### 2.3 Radii & elevation

| Token | Value | Use |
|-------|-------|-----|
| `--radius-field` / `--radius-xs` | 4px | Inputs, chips, small controls |
| `--radius-sm` / `--radius` | 8px | Cards, panels, menus, nav hit area |
| `--radius-md` | 12px | Status pills |
| `--radius-lg` | 16px | Reserved (not used for nav icon shells) |
| Pill buttons | `calc(var(--btn-height-std) / 2)` | Filled / outline CTAs |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,.08)` | Cards |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,.12)` | Menus, toasts |

### 2.4 Control heights

```css
--btn-height-std: 36px;   /* primary / outline buttons */
--btn-height-sm:  32px;   /* compact / dense actions */
--btn-height-lg:  40px;   /* optional large CTA (rare) */
--control-h:      36px;   /* text fields, search, chips */
--toolbar-h:      48px;   /* topbar + filter toolbar */
--nav-w:          80px;   /* navigation rail */
```

**Eos rule:** Default interactive density is **36px** for text fields, search, standard buttons, and toolbar filter chips (`--control-h` / `--btn-height-std`). Use **32px** only for explicitly dense actions and menu rows (`--btn-height-sm`). Do **not** ship 56px M3-style fields or 40px as the default primary button height (40px remains optional large CTA only). Align toolbar chips to the same 36px control row as search — not a shorter M3 chip height sitting below the field.

---

## 3. Components

### 3.1 Navigation rail

| Property | Spec |
|----------|------|
| Width | **80px** (`--nav-w`) |
| Background | `--sidebar` (`#f0f0f0`) |
| Item width | 64px, centered in rail |
| Icon size | **22×22px** (strict) |
| Icon containers | **None** — no 56×32 pills / rounded icon shells |
| Label | 10px / 500 / 12px lh, under icon (Label XSmall) |
| Idle color | `--text-soft` |
| Hover | `rgba(0,0,0,.05)` fill on item; text `--text` |
| Active | `--sidebar-active` fill; font-weight 600 |
| Item radius | `--radius-sm` (8px) on full item, not on icon alone |

**Eos rule:** Keep the rail at **80px** with bare **22px** icons. Do **not** wrap icons in 56×32 (or similar) pill containers, and do not default to 24px icons inside shells. Active state is a light gray hit area on the whole item — not a branded fill on an icon capsule.

### 3.2 Buttons

| Variant | Height | Pad-x | Radius | Font | Fill / border |
|---------|--------|-------|--------|------|----------------|
| `.btn-filled` | `--btn-height-std` **36px** | 16px | half height (pill) | Label Large | `--brand` `#1a73e8`, white text |
| `.btn-outline` | **36px** | 16px | pill | Label Large | white + `--border-strong` |
| `.btn-compact` | `--btn-height-sm` **32px** | 12px | inherits / compact | Label Medium | Dense chrome |
| Icons in buttons | 16px | — | — | — | `currentColor` |

Disabled filled: `opacity: .38`. Error/success use `--danger` / `--success` only for status UI and toasts, not as default button color. Primary CTA height is **36px** by default — not 40px.

### 3.3 Text fields & search

| Property | Spec |
|----------|------|
| Height | **`--control-h` (36px)** — not 56px |
| Border | 1px `--outline` (`rgba(0,0,0,.23)`) |
| Radius | `--radius-field` (4px) |
| Font | Inter **13px** / 400 |
| Pad-x | 12px (search: 40px left for icon) |
| Focus | border + 1px ring `--brand-accent` |
| Error | `.is-error` → `--danger` border + ring |
| Label | Inter 12px / 600, `--text-sec` |
| Hint | Inter 12px / 400, `--text-soft` |

### 3.4 Chips (toolbar / filter triggers)

| Property | Spec |
|----------|------|
| Height | **`--control-h` (36px)** — same row as search |
| Pad-x | 12px |
| Radius | 4px (`--radius-field`) |
| Font | Label Large (14 / 20) or dense 13 / 500 as implemented |
| Border | `--border-strong` |
| Active | `--selected-bg` + `--brand-accent` border/text |
| Leading/trailing icons | ~18px |

Toolbar filter **triggers** share the 36px control row with search. Shorter 32px chips are allowed only for compact chrome (e.g. secondary filter bar density) or OpsHub env — not as the default toolbar search-row chip (see §2.4).

### 3.5 Toolbar & topbar

| Region | Height | Notes |
|--------|--------|-------|
| `.opshub-bar` | **48px** | **Canonical** global chrome (see §3.5.1) |
| `.topbar` | **48px** | In-tool title row; surface white |
| `.toolbar` | **48px** | Search + chip dropdowns; single row |

### 3.5.1 OpsHub bar (canonical)

**Figma:** Eos Library → *Opshub bar* component set (e.g. node `449:14633` and environment / Dock|Overlay variants under the library). Start from the library hub: [Eos Library v1.0 · `554:5314`](https://www.figma.com/design/N8BwUZPaO2artCvrsarVK2/Eos---Library-v1.0?node-id=554-5314&m=dev).
**Implement as Dock on black** for Eos authoring tools. Do **not** invent gradient “OH” marks or generic dark navy bars.

| Property | Spec |
|----------|------|
| Height | **48px** (`--toolbar-h`) |
| Background (Dock) | **`#000000`** |
| Horizontal pad | **18px** |
| Left lockup | 24×24 peacock/GS mark + **“OpsHub”** 16px / 500 / 24px lh / 0.15 tracking · Inter (or product sans) · white |
| Right cluster | Env switcher → App menu (24px) → Account (32px hit, 24px icon) · gap **12px** |

**Environment switcher (single-select):**

| Env | Badge | Accent |
|-----|-------|--------|
| Production | `PROD` | `#a82424` |
| Proton | `PROTON` | `#6200a3` |
| Stable-INT | `STB-INT` | `#246058` |
| INT-NFT | `INT-NFT` | `#275996` |

- Control height **32px**, pill radius **64px**, border 1px (white/α on Dock; env accent on Overlay light bars).
- Contents: mini peacock mark + **badge chip** (8px bold label on white or filled bar) + label `Peacock: {Env}` (12px / 500) + 18px chevron.
- Menu: surface popover, one option selected at a time; Escape / outside click closes.
- **Tokens:** `--opshub`, `--opshub-fg`, `--opshub-env-prod|proton|stable|intnft`.

**Positions in Figma (document both; prefer Dock in app shells):**

- **Dock** — black bar over content; white type/icons.
- **Overlay** — light bar + colored env outline (e.g. Production `#a82424` on white).

**Implementation class name (suggested):** `.opshub-bar` — match Figma structure (left lockup, env control, app menu, account). Validate against Dev Mode on the library file above.

### 3.6 Selection, resizer, toast

- **List selected:** `--selected-bg` + inset 3px `--brand-accent`
- **Resizer:** 8px hit; idle transparent; hover/active 3px `--brand-accent`
- **Toast:** 13px Inter; default `#323232`; success/error semantic colors; bottom 24px centered

### 3.7 Data tables (filter toolbar)

- Search 36px (pill OK); pinned filter chips **32px**; **All Filters** + **Clear all** (Clear all only when active).
- Chip popover: checkbox/radio list + **Clear** / **Done** (Flights-style).
- **No** standalone “Showing N results” above the grid — put range in the **footer**:
  `Showing 1–10 of 25 clips` · adjacent to page size + pager.
- Dense rows: 13px type, borders `#e0e0e0`, header gray, selected row `#e8e8e8`.

---

## 4. Layout patterns

```
[ OpsHub 48px — full width ]
[ Nav 80px ][ Main
              Topbar 48px (optional tool chrome)
              Toolbar 48px
              Content: List | Resizer | Detail
                       or Card table + footer meta ]
```

- App: `height: 100vh`; no page scroll on shell
- Responsive ≤840px: stack list over detail; hide resizer
- State-driven UI: mutate `state` → `renderList()` / `renderDetail()` / `renderTable()`

---

## 5. Interaction rules (unchanged)

1. Central `state` object; no ad-hoc DOM style for feature logic
2. Dropdowns: outside click / Escape closes; single-select closes on pick
3. Empty / unchanged form: disable submit or error toast + `.is-error`
4. Toasts auto-dismiss ~3200ms
5. OpsHub env switcher: one environment active; badge + label stay in sync

---

## 6. Design source of truth (Figma)

All visual and component detail is owned in **Eos Library v1.0**. Do not treat local prototypes, HTML demos, or application code as design authority.

| Resource | Role |
|----------|------|
| [Eos Library v1.0](https://www.figma.com/design/N8BwUZPaO2artCvrsarVK2/Eos---Library-v1.0?node-id=554-5314&m=dev) | **Primary source of truth** — full library; entry node `554:5314` |
| File key | `N8BwUZPaO2artCvrsarVK2` |
| OpsHub bar | Library component set (e.g. `449:14633` and Dock/Overlay × env variants) |
| Tables / selection rows | Library table components (e.g. `488:8901`) |
| This document (`design.md`) | Eos *engineering & token rules* for implementation; subordinate to Figma |

**Workflow:** Inspect the linked Figma file in Dev Mode → apply tokens and component rules from §§1–5 → ship product UI. Update this doc when Eos conventions change; update Figma when visuals or components change.

### AI / contributor checklist

- [ ] Design inspection starts from [Eos Library · `554:5314`](https://www.figma.com/design/N8BwUZPaO2artCvrsarVK2/Eos---Library-v1.0?node-id=554-5314&m=dev) — **Figma over local mocks**
- [ ] **Eos** branding only in shared design-system materials
- [ ] **Inter only** — no Roboto in product UI
- [ ] Type uses Eos scale (Display → Headline → Title → Body → Label); see **§1**
- [ ] Buttons → **Label Large**; table body → **Body Medium**; page title → **Headline Large/Small** as appropriate
- [ ] Emphasis only for featured / active / priority — not every heading
- [ ] Controls **36px** (`--control-h` / `--btn-height-std`); toolbar search-row chips **36px**
- [ ] Compact actions **32px** (`--btn-height-sm`; OpsHub env pill, dense menus)
- [ ] Nav **80px**, icons **22px**, **no** icon pills; nav captions **Label XSmall**
- [ ] OpsHub bar **48px black Dock**, env PROD/PROTON/STB-INT/INT-NFT with accent table above
- [ ] Table count lives in **footer** only (`Showing a–b of n clips`)
- [ ] Surfaces white/gray (not warm off-white); brand accent **`#1a73e8`** only
- [ ] Spacing on **2-4-8-12-16** tokens
- [ ] Body contrast ≥ 4.5:1; line length ~45–75 characters where practical
- [ ] See **Appendix A** if porting UI from older M3 experiments

---

## 7. Verified component specs — Eos Workset (list family)

> **Source:** Figma **Eos – Workset**, file key `YgLwZNnExyyvfUVcyyelzh`, page
> `76:2` "02 Components / Content & navigation". This is a different file from
> the Library (`N8BwUZPaO2artCvrsarVK2`) above.
> **Verified** = read via Figma MCP `get_design_context` on 2026-10-12/13.
> **Implemented** = shipped in V4 commit `cec39cc`. Node map:
> `docs/FIGMA-COMPONENT-MAP.md`. Reuse these values; don't re-inspect Figma for them.

### 7.1 Type styles (verified, Figma names)

| Eos style | Font | Size / line | Weight | V4 token |
|---|---|---|---|---|
| Body/Medium | Inter | 14 / 20 | 400 | `--type-body-md-*` |
| Body/Small | Inter | 12 / 16 | 400 | `--type-body-sm-*` |
| Label/Large Emphasised | Inter | 14 / 20 | 600 | `--type-label-lg-*` + `font-semibold` |
| Label/Medium | Inter | 12 / 16 | 500 | `--type-label-md-*` + `font-medium` |
| Label/XSmall | Inter | 10 / 16 | 500 | `--type-label-xs-*` |

### 7.2 Figma variables seen → V4 tokens

| Figma var (fallback) | V4 token | Match |
|---|---|---|
| `--surface` (#fff) | `--color-bg-surface` | exact |
| `--surface-high` (#eee) | `--color-bg-hover` | exact |
| `--surface-hover` (rgba(0,0,0,.08)) | `--color-bg-hover` (#eee) | **approx** (≈ same on white) |
| `--selected-bg` (#e8f0fe) | `--color-bg-selected` | exact |
| `--brand-accent` / `--focus-ring` (#1a73e8) | `--color-action-primary` / `--color-focus-ring` | exact |
| `--text` (#131416) | `--color-text-primary` / `text-foreground` | exact |
| `--text-sec` (#5f6368) | `--color-text-secondary` | exact |
| `--text-disabled` (rgba(0,0,0,.38)) | none → `text-foreground/40` | **approx, no token** |
| `--border` (#e0e0e0) | `--color-border-default` | exact |
| `--space-3` (12) / `--radius-sm` (8) / `--radius-xs` (4) | same names | exact |

### 7.3 List item (`117:424`) — verified

- Height **44** (one line), **60** (two line), **76** (three line; focus variant 80).
- `padding-x 12` (`--space-3`), `gap 12`, `radius 8`, background `--surface`.
- Copy column: primary Body/Medium `--text`, truncate to 1 line; secondary
  Body/Small `--text-sec`, may wrap to 2 lines.
- States: **Hover** bg `--surface-hover` · **Focus** 2px solid `--focus-ring`
  border · **Selected** bg `--selected-bg` + **3px** full-height left bar
  `--brand-accent` · **Disabled** primary text `--text-disabled`.
- Rules (Figma description): one primary row action; a trailing
  Icon/Checkbox/Radio/Switch is a separate target when it does something
  different; align three-line accessories to the top.

### 7.4 List accessory (`116:201`) — verified

Slot height **32**. Widths: Icon 24 (24px glyph) · Avatar 24 (24px circle,
`--surface-high`, initials Label/XSmall `--text-sec`) · Image 32 (32px
thumbnail, radius 4, `--surface-high`, 16px glyph) · Checkbox 24 · Radio 24 ·
Switch **44** · Label **48** (Label/Medium `--text-sec`, e.g. "Meta").
Hide the slot when absent.

### 7.5 Switch (`72:168`) — verified

Hit area **48×36** (padding-x 4, radius 18). Track **40×24**, radius 12.
- Off: fill `#EEEEEE`, 1px stroke `#C4C4C4`, thumb **18px** circle `#5F6368`
  (centre x 13, so 4px inset).
- On: brand-blue track, white thumb on the right. Seen in the screenshot only;
  the exact On SVG was not fetched.
- V4: `ui/switch.tsx` `size="lg"` (used by `SwitchField`). The thumb travel
  of 14px is derived from the geometry.

### 7.6 List subheader (`117:6210`) — verified

Height **36**, Label/Large Emphasised, `--text`.
Inset=Full: `padding-x 12` · Inset=Content: `padding-left 60`, `padding-right 12`.
Sticky=Off bg `--surface`; Sticky=On bg `--surface-high`, pinned until the next
subheader. Don't use as a page heading.

### 7.7 List divider (`117:6194`) — verified

1px `--border`. Inset=Full spans the container; Inset=Content `padding-left 48`.
Decorative only; doesn't split one semantic list.

### 7.8 List (`118:534`) — verified

Container: `--surface` bg, 1px `--border`, radius 8, `overflow: clip`, rows
full-width. Patterns: Basic · Divided · Grouped (subheaders) · Nested (indent
once, max 2 levels) · Selection (leading checkbox = primary action) · Switches
(trailing switch = independent action). Virtualize at about 100+ rows.

### 7.9 V4 adaptations (decisions, not Figma specs)

- Properties rows use **`--inspector-pad-x` (12px)** horizontal inset on all
  inspector rows (aligned with Eos list item padding).
- Text/select/textarea/radio fields have **no Eos list equivalent**. V4 uses
  **Pattern A** (`PropertyRow`, label above control) or **Pattern B**
  (`CompactPropertyRow`, label + control on one row for short fields).
- Collapsible group headers use inspector section type (**14px semibold**) with a
  **20px chevron**; borders separate headed groups only (spacing-first within
  groups).
- All-caps data headers are displayed in sentence case (acronyms kept).
- The panel-level **“Properties”** chrome is removed; **`InspectorHeader`**
  shows contextual “Selected {kind}” + element title instead of stacked uppercase
  eyebrows.

### 7.11 V4 inspector tokens (scoped extensions)

Defined in `ui-lib/tokens.css` — not part of the published Eos library. Used
only by `ui/property.tsx` and the Properties regions.

| Token | Value / maps to | Why |
|-------|-----------------|-----|
| `--inspector-title-*` | `--type-title-md` (16/24 semibold) | Element title; Eos Title/Medium fits the inspector primary heading without the old 22px title-lg object header. |
| `--inspector-kind-*` | `--type-body-sm` (12/16) | Secondary “Selected …” line; no Eos “context label” role at this size. |
| `--inspector-section-*` | `--type-title-sm` (14/20 semibold) | Section accordions; lighter than list subheader 36px rows for compact density. |
| `--inspector-row-min-h` | 36px | Aligns with `--control-height-md`; list rows at 44px were too tall for an inspector. |
| `--inspector-gap-*`, `--inspector-pad-*` | 4–12px on `--space-*` | Consistent vertical rhythm without per-field margins. |
| `--inspector-label-*` | `--type-label-md` (12/16 medium) | Field captions; shared by stacked, compact, and list rows. |
| `--inspector-value-*` | `--type-body-md` (14/20 regular) | Control values, collection row titles, callout leads. |
| `--inspector-help-*` | `--type-body-sm` (12/16 regular) | Helpers, empty copy, metadata slug. |

Apply roles via `inspectorType` in `ui/property.tsx` (kind / title / section /
fieldLabel / value / help / meta).

**Dense V4 density (Swiss grid pass).** Eos has no control height below 32px,
so fields use `--control-height-sm` (32px). These V4-only values are not Eos
tokens: Structure and preview gutter `--grid-gutter` 12px, Properties side inset
`--inspector-side` 24px, inspector padding 8px, section gap 8px, section headers
28px, tree rows `--structure-tree-row-h` 26px. Labels stay above their controls.
Helper text moves behind the label's info icon; only validation errors render
under a control.

### 7.13 V4 Structure tree (Explorer)

Tokens: `--structure-tree-size` (13px), `--structure-tree-lh`, `--structure-tree-row-h`
(32px), `--structure-tree-pad-x`. Components: `structure-tree-row.tsx`,
`structure-tree-visual.ts` (type → icon + label weight + section breaks).

Content Pages outline (`regions/ContentPageOutline.tsx`, `regions/content-page-outline.css`)
is a boxed WAI-ARIA tree following the MUI X Tree Item slot anatomy
(`cp-tree-item` root, `__content`, `__icon-container`, `__label`, `__trailing`,
`__group-transition`), styled in plain CSS over Eos tokens. It does not use
`StructureTreeRow`. Each item is a white container (36px minimum, 8px radius
(`--radius-sm`, same as the Widgets tab boxes), 1px subtle inset border) with 1px between containers. Labels are 14/20: top-level
medium, nested regular. Hover uses `--color-bg-hover`. Selection uses
`--color-bg-selected` (no accent bar). Only selectable items get
`aria-selected`. Memberships, Texts, and Translation Copy are expandable-only
groups with a left chevron that rotates when open. Selectable items show a right
chevron. Nested items are inset 32px. Keyboard follows the tree pattern (roving
tabindex; arrows, Home/End, Enter/Space) with a 2px `--color-focus-ring` on the
focused item. Pages / Widgets Structure trees are unaffected.

### 7.12 V4 authoring-shell typography (`chromeType`)

`ui/chrome-type.ts` — panel eyebrows/titles, structure tree labels (14/20),
preview toolbar controls, and breadcrumb copy. Keeps Explorer / preview / panel
headers aligned with Properties inspector roles without sharing component trees.

Components: `InspectorHeader`, `InspectorBody`, `CompactPropertyRow`,
`InspectorCallout`. Legacy `ObjectHeader` delegates to `InspectorHeader`.

### 7.10 Known inconsistencies

- §2.4 says text fields are 36px. Properties inputs (`ui/form-controls.tsx`
  `FIELD`) now use **`--control-height-md` (36px)**; checkbox/radio/select
  visuals are still not verified against Workset.
- `--color-border-subtle` (rgba(0,0,0,.06)) is still used in parts of the
  Properties panel (asset picker, feature items) and in other regions; Eos
  dividers use `--border` (#e0e0e0).
- Checkbox (`72:122`), Radio, Avatar and Image accessories are **not yet
  verified** in V4. The checkbox is still the stock shadcn one.
- Default shadcn `Switch` sizes (`default`/`sm`) are not Eos. Only `lg` is.

---

## Appendix A — Design evolution & learnings

This appendix records why current Eos density and palette look the way they do. **Normative rules live in §§1–5 and Figma.** Use this section when migrating older experiments or reviewing PRs that reintroduce discarded patterns.

### A.1 Context

An earlier direction explored Material 3–like density and dual typefaces in authoring tools. That trial informed density goals but is **not** the shipping Eos system. Current Eos product work follows Inter-only type, 36px standard controls, bare 80px rails, neutral white/gray surfaces, and brand **`#1a73e8`** — validated in [Eos Library v1.0](https://www.figma.com/design/N8BwUZPaO2artCvrsarVK2/Eos---Library-v1.0?node-id=554-5314&m=dev).

### A.2 Comparison (former experiment → Eos default)

| Former experiment (do not ship) | Eos default (keep) | Spec home |
|---------------------------------|----------------------|-----------|
| Roboto + Inter (or Roboto forms) | **Inter only** | §1 |
| 56px M3 text fields | **36px** form + toolbar controls (`--control-h`) | §2.4, §3.3 |
| 40px as default primary buttons | **36px** standard buttons (`--btn-height-std`) | §2.4, §3.2 |
| Short M3 filter chips off the search row | **36px** toolbar chips aligned to search | §2.4, §3.4 |
| Nav icon pills ~56×32, 24px icons in shells | **No pills**; **22px** icons; **80px** rail | §3.1 |
| Warm surfaces / non-standard brand accents | **White/gray** surfaces; brand **`#1a73e8`** | §2.1 |
| Mixed / ad-hoc spacing | **2–4–8–12–16** (+ 24/32/40 section) tokens | §2.2 |

### A.3 Migration checklist (for legacy UI)

When updating screens built under the former experiment:

1. Replace Roboto and dual stacks with **Inter** (weights 400–700) and map type to §1.
2. Collapse field/button/search/chip heights to **36px** defaults; use **32px** only for compact chrome.
3. Rebuild the nav rail without icon pills; icons **22px**, width **80px**.
4. Retint surfaces to the white/gray palette; set interactive brand to **`#1a73e8`**.
5. Re-audit padding/gaps against the spacing scale.
6. Re-check OpsHub bar against Figma Dock variants (black bar, env badges) — §3.5.1.
7. Confirm Figma still matches intent; Library wins if this appendix drifts from current library visuals.

### A.4 What to leave behind

- Non-`#1a73e8` defaults for primary buttons, selection, or focus rings in standard product chrome
- 56px filled text fields as the default form density
- Pill-shaped nav icon containers
- “Placeholder” OpsHub logos (e.g. gradient “OH” tiles) instead of the library lockup
- Product-specific names in shared Eos design-system documentation

Eos is intentionally dense and neutral so product UIs stay fast to scan; expressive Display/Headline moments still follow §1 when marketing or dashboard surfaces need them.
