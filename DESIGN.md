---
name: Iceberg Authoring Chrome
description: The Eos-based design system for the Iceberg CMS editor UI (authoring chrome only; the Streamly customer preview is a separate, isolated world).
colors:
  opshub: "#ffffff"
  iceberg-blue: "#01699b"
  iceberg-blue-hover: "#004b73"
  iceberg-blue-bg: "#e2eff5"
  iceberg-blue-border: "#8fbdd5"
  surface: "#fcf8f8"
  surface-container-low: "#f7f3f2"
  surface-container-high: "#ebe7e7"
  elevated: "#ffffff"
  selected: "#dbeaf3"
  app-backdrop: "#ece7e6"
  preview-matte: "#e5e2e1"
  nav-chrome: "#f4f0ef"
  text-primary: "#1c1b1b"
  text-secondary: "#45474a"
  text-muted: "#76777a"
  text-inverse: "#ffffff"
  border-subtle: "rgba(0, 0, 0, 0.06)"
  border-default: "rgba(0, 0, 0, 0.12)"
  border-strong: "rgba(0, 0, 0, 0.22)"
  success: "#146c43"
  success-bg: "#e6f2ea"
  warning: "#8a5a00"
  warning-bg: "#fbf0d9"
  danger: "#ba1a1a"
  danger-bg: "#fceceb"
  experiment: "#6d40a8"
  experiment-bg: "#f0e7fb"
  toast: "#2f3133"
  scrim: "rgba(0, 0, 0, 0.4)"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.15
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.15
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.15
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "0.06em"
  icon:
    fontFamily: "Material Symbols Rounded"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "100px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  "2xl": "24px"
  "3xl": "32px"
components:
  button-primary:
    backgroundColor: "{colors.iceberg-blue}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.pill}"
    height: "32px"
    padding: "0 12px"
  button-primary-hover:
    backgroundColor: "{colors.iceberg-blue-hover}"
    textColor: "{colors.text-inverse}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.pill}"
    height: "32px"
    padding: "0 12px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.pill}"
    height: "32px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    height: "32px"
    padding: "0 12px"
  tree-row-selected:
    backgroundColor: "{colors.selected}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    height: "28px"
  badge-live:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.success}"
    rounded: "{rounded.pill}"
---

# Design System: Iceberg Authoring Chrome

## Overview

**Creative North Star: "The Quiet Workbench"**

Iceberg's editor is a calm, precise authoring surface where the work — the live
Streamly page — is the hero and the chrome recedes around it. The design system is
built on Eos (Material 3), rendered in a warm-neutral light scheme, with a single
brand accent (Iceberg Blue) reserved for meaning. It is an **Operate**-mode tool:
scanability, consistency, and a stable "where am I / how do I get back" spine
outrank expression. Personality lives in precise details — a hairline divider, a
tonal step, an instant tooltip — not in decoration.

The surface language is tonal, not bordered. A short warm-neutral ladder
(elevated `#ffffff` → surface `#fcf8f8` → container-low `#f7f3f2` →
container-high `#ebe7e7`) carries hierarchy so panels read as inset sheets on a
deeper app backdrop, separated by tone and space before any line is drawn.
Depth is flat at rest; a shadow appears only when a layer genuinely floats.

This system dresses the **authoring chrome only**. The customer-facing preview is
Streamly's own design world, rendered in an isolated iframe, and the two must
never borrow each other's tokens. The chrome deliberately avoids the look of a
generic dark admin dashboard, heavy outlined cards, and any resemblance to the
Streamly consumer UI it edits.

**Key Characteristics:**
- Warm-neutral M3 surfaces with a single blue accent used sparingly.
- Tone-and-space hierarchy over borders; hairlines only where needed.
- Flat at rest; shadow only for floating layers.
- Dense, consistent, keyboard-reachable Operate-mode ergonomics.
- Material Symbols iconography throughout.

## Colors

A warm-neutral surface ladder carries the whole chrome; one blue accent carries
all meaning.

### Primary
- **Iceberg Blue** (`#01699b`): the only accent. Primary actions, links,
  selection accent bars, tabs, and focus. Hover deepens to **Deep Iceberg Blue**
  (`#004b73`); ghost/selected fills use the pale tint (`#e2eff5`) and mid outline
  (`#8fbdd5`).

### Neutral
- **Surface** (`#fcf8f8`): primary panel surface (Explorer, Properties, controls).
- **Surface Container Low** (`#f7f3f2`): app/chrome background and recessed fills.
- **Surface Container High** (`#ebe7e7`): hover surface.
- **Elevated** (`#ffffff`): floating layers — menus, popovers, dialogs, grabbers.
- **Selected** (`#dbeaf3`): selected-row fill (a low-chroma Iceberg-blue tint).
- **App Backdrop** (`#ece7e6`): the deeper ground the floating shell sits on.
- **Preview Matte** (`#e5e2e1`): neutral field behind the customer preview frame.
- **Text** — primary `#1c1b1b`, secondary `#45474a`, muted `#76777a`, inverse
  `#ffffff` (on accent/dark fills).
- **Borders** — subtle `rgba(0,0,0,0.06)` (in-surface hairlines), default
  `rgba(0,0,0,0.12)`, strong `rgba(0,0,0,0.22)` (dividers, grabbers).

### Status (the "semáforo" + lifecycle)
- **Success** `#146c43` on `#e6f2ea` — LIVE, accessibility Pass.
- **Warning** `#8a5a00` on `#fbf0d9` — Loading, accessibility Review.
- **Danger** `#ba1a1a` on `#fceceb` — errors, destructive actions, a11y Fail.
- **Experiment** `#6d40a8` on `#f0e7fb` — a muted M3-lineage violet marking
  experimental/beta layouts (the "Experiment" lifecycle badge). Rendered as a
  solid violet pill with inverse text so it reads as a marker, not a readout.

**Status hues are a semantic family, distinct from the accent.** Success,
warning, danger, and experiment carry *meaning*; only Iceberg Blue carries
*action*. Adding a status hue does not break the single-accent rule.

### Named Rules
**The Iceberg Blue Rule.** The blue appears only on action, selection, links,
tabs, and focus — never as a decorative fill. Everything else stays warm-neutral.
Its rarity is what makes it read as "actionable."

**The Two-System Rule.** These tokens dress the authoring chrome only. The
customer preview is Streamly's world; it must never adopt these tokens, and this
chrome must never adopt Streamly's.

## Typography

**UI Font:** Inter (with `-apple-system, Segoe UI, Roboto` fallbacks).
**Mono:** `ui-monospace, SFMono-Regular, Menlo` — for IDs, CSS, and JSON-LD.

**Icon Font:** Material Symbols Outlined — the Eos icon set. Every glyph is a
Material Symbol; icons are never Unicode or emoji.

**Character:** One neutral, highly legible face across the entire tool. Hierarchy
comes from size, weight, and case — not from a second family. The scale is
compact (11–20px) to keep dense authoring surfaces scannable.

### Hierarchy
- **Display** (Inter 600, 20px, 1.15): the largest in-tool voice — preview state
  titles, catalog specimen headings.
- **Headline** (Inter 600, 16px, 1.15): dialog titles, empty-state leads.
- **Title** (Inter 600, 14px, 1.15): object names, primary row emphasis.
- **Body** (Inter 400, 13px, 1.5): default UI text, tree rows, field values.
- **Caption** (Inter 400, 12px, muted): helper text, counts, dropdown labels.
- **Label** (Inter 600, 11px, 1.15, +0.06em, UPPERCASE): panel eyebrows and
  section headers.

### Named Rules
**The Eyebrow Rule.** Panel/section titles that are peers in the hierarchy look
identical — 11px semibold uppercase, `+0.06em`, muted — so PAGES, STRUCTURE, and
PROPERTIES read as one level, never three sizes.

## Layout

A floating three-region editor sits on the app backdrop: **Explorer** (resizable
width; a resizable Pages/Structure vertical split) · a drag **grabber** · **Live
Preview** (fills remaining space, edge-to-edge) · **Properties** (fixed ~380–460px,
left hairline divider). The rail + workspace read as inset sheets (radius `16px`)
on the deeper `#ece7e6` ground.

Spacing is a 4px base scale (4/8/12/16/20/24/32). Density is high but breathable:
28px tree rows, 32px controls, 12–16px panel padding, 16px between field rows and
between section wrappers. Below **900px** the Properties panel collapses to full
width. Resize handles carry a strong-hairline divider with a dotted grabber pill.

## Elevation & Depth

Depth is **tonal-first**. Surfaces are flat at rest and separated by the warm
surface ladder plus spacing. A drop shadow is reserved for layers that genuinely
float above the plane.

### Shadow Vocabulary
- **Elevation 1** (`0 1px 3px 1px rgba(0,0,0,.15), 0 1px 2px 0 rgba(0,0,0,.3)`):
  menus, popovers, dialogs, tooltips, grabber pills.
- **Elevation 2** (`0 2px 6px 2px rgba(0,0,0,.15), 0 1px 2px 0 rgba(0,0,0,.3)`):
  the highest floating layers.

Modal overlays dim the plane with a neutral **Scrim** (`rgba(0,0,0,0.4)` light /
`0.6` dark) — never a tinted or cool-blue wash.

### Named Rules
**The Tonal-First Rule.** Reach for a tone step or spacing before a border, and a
border before a shadow. Resting surfaces never carry a shadow; a shadow means
"this floats."

## Shapes

Corner language by role: **pill** (`100px`) for buttons, badges, and the nav icon
pill; **`16px`** for floating shell surfaces (rail + workspace); **`12px`** for
cards, panels, menus; **`8px`** for inputs, chips, and tree rows. Borders are
hairlines (`1px`) in the subtle/default/strong roles; the strong role marks
dividers and resize handles.

### Named Rules
**The Pill-CTA Rule.** Interactive buttons are fully pill; content containers are
softly rounded (8–16px). The two never swap.

## Components

### Buttons
- **Shape:** pill (`100px`). Sizes: sm (32px, the workspace default), default
  (36px), icon-sm (32px square).
- **Primary:** Iceberg Blue fill, inverse text — reserved for the single most
  decisive action.
- **Secondary:** surface fill, strong hairline border, primary text — the default
  for editor action bars (Publish, Send To QA, Save).
- **Ghost:** transparent, tonal hover fill — icon-only tools (CSS, JSON-LD,
  Settings, QA).
- **Hover / Focus:** primary deepens to `#004b73`; focus shows a 3px Iceberg-blue
  ring at 30% alpha.

### Chips / Badges
- **Style:** pill, status-tinted (bg = status `*-bg`, text = status color).
- **Signature:** the LIVE badge (success) and the accessibility **semáforo** —
  a tri-state chip (Pass/Review/Fail → green/amber/red) showing score + locale.

### Cards / Containers / Panels
- **Corner:** panels/menus `12px`; floating shell `16px`.
- **Background:** surface `#fcf8f8` on the app backdrop; elevated `#ffffff` for
  menus/dialogs.
- **Shadow:** none at rest (see Elevation); float layers use Elevation 1.
- **Border:** avoided; internal separation is a `rgba(0,0,0,0.06)` hairline.
- **Padding:** 12–16px.

### Inputs / Fields
- **Style:** surface fill, `8px` radius, subtle hairline outline (quiet well, not
  a heavy box).
- **Focus:** 3px Iceberg-blue ring (30% alpha).
- **Error:** danger border + inline danger helper text.

### Navigation (rail)
- **Style:** narrow vertical rail; each item is an icon inside a pill target.
  Hover = tonal pill; active = Iceberg-blue-tint pill with a filled Material
  Symbol. An **instant** dark tooltip (`#2f3133`, inverse text) appears beside the
  icon on hover/focus — no native-title delay.

### Signature — Structure tree row
28px rows, 16px-per-level indentation, a drag grip + disclosure chevron, an inline
rename field, and a **sticky overflow menu** pinned to the viewport's right edge
(4px clear of the scrollbar) with a gradient fade that dissolves long labels
underneath it. Selection is shown by BOTH a `#dbeaf3` fill AND a left blue accent
bar (never color alone).

## Do's and Don'ts

### Do:
- **Do** separate hierarchy with the surface ladder + spacing before reaching for
  a border, and a border before a shadow.
- **Do** reserve Iceberg Blue (`#01699b`) for action, selection, and focus only.
- **Do** keep editor action-bar CTAs secondary; use a filled primary only for the
  single decisive action.
- **Do** render panel/section titles as 11px uppercase eyebrows.
- **Do** use Material Symbols for every icon.
- **Do** signal selection with a redundant cue (fill + accent bar), never color
  alone.

### Don't:
- **Don't** nest a bordered container inside another bordered container (no
  container-in-container wells).
- **Don't** let the editor chrome resemble the Streamly customer UI, or import
  Streamly tokens into it (and vice-versa).
- **Don't** use pure `#ffffff` body text or pure-black borders; use the token
  roles.
- **Don't** put a shadow on a resting surface.
- **Don't** introduce a second *accent* hue — Iceberg Blue owns action alone.
  (Semantic *status* hues — success/warning/danger/experiment — are a separate,
  intentional family and are exempt.)
