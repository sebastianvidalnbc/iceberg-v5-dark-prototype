# Iceberg V4 → Eos Adoption

> **Status: readiness pass (documentation only).**
> This is the durable architectural record for aligning Iceberg V4 with the
> organization's **Eos** design system (Material foundations / MUI + Eos tokens,
> components, patterns).
>
> **We have NOT started the MUI/Eos migration.** No MUI, no `@emotion`, no
> approximate Eos theme, no invented tokens. The live V4 prototype behaves and
> looks identical to the `v4-pre-eos-adoption` checkpoint.

- **Checkpoint tag:** `v4-pre-eos-adoption`
- **Commit:** `becfa790be443834081a4311078fc99dba992e31`
- **Branch:** `main`
- Companion doc: [`eos-component-consumers.md`](./eos-component-consumers.md) (call-site inventory)

---

## 1. Ownership boundary

The guiding principle: **Iceberg consumes Eos. Iceberg does not become a
foundational design system.**

### EOS OWNS (generic system layer)
Iceberg should not define these independently — it should consume them from Eos.

- **Foundations:** color, typography, spacing, radius, elevation, focus, motion,
  generic status semantics (success / warning / info / error).
- **Primitives:** Button, IconButton, Input, Search, Textarea, Select, Checkbox,
  Switch, Radio, Badge/Chip, Menu, Tooltip, Dialog, Tabs, generic
  Table/DataGrid, generic form primitives (Field / Label / helper text / error).

### ICEBERG COMPOSES FROM EOS (authoring patterns, built on Eos primitives)
Iceberg-local for now; some may later be proposed back to Eos (see
[Potential Eos contributions](#8-potential-eos-contributions)). These must be
**composed from** Eos primitives, never fork them.

- AppNav (application rail)
- Explorer
- Structure Tree / TreeRow
- Properties inspector
- PropertyRow
- PropertySection
- PanelHeader
- Collection editing (add / remove / reorder items)
- Resizable workspace (panel grid + drag handle)
- Dense authoring toolbars
- Selection / inspector (master–detail) patterns

### ICEBERG OWNS (domain product behavior — never pushed into Eos)

- Pages, Widgets
- Page → Variant → Structure model
- Sections, Section Content, Predecision / Control, Variant Categories
- Products, Product Features, Price Cadence
- Live preview (Streamly render + `postMessage` renderer)
- PASS / validation, publishing
- Drag/drop, copy/paste, duplicate, rename, disable
- Retention widget, Offers, Segmentation, Survey Responses
- Pick Section / click-to-select
- MVT / audience / device logic
- Layout Picker + `layoutSchemas.json` schema engine

### Explicit non-goal

> **Do NOT create or extract `@acme/iceberg-ui`.**
> `src/v4-eos/ui-lib/README.md` frames `ui-lib` as a future standalone Iceberg
> design-system package ("Preparing for extraction (`@acme/iceberg-ui`)"). That
> ambition is **retired**: it would fork the org design system. Iceberg consumes
> Eos instead. The `ui-lib` folder is treated as legacy to be migrated onto Eos,
> not published or grown.

---

## 2. Current component duplication (migration tracking)

V4 currently ships **two parallel primitive systems**. Column **A** =
`src/v4-eos/ui/**` (shadcn / Radix / Tailwind, used by the editor). Column **B**
= `src/v4-eos/ui-lib/**` (bespoke React + CSS, used by browse chrome). **FUTURE**
= the single Eos/MUI-backed target. **Do not consolidate yet** (see
[§13 note](#note-do-not-consolidate-onto-shadcn-first)).

| Primitive | A · `src/v4-eos/ui/**` | B · `src/v4-eos/ui-lib/**` | Active in V4? | FUTURE (Eos/MUI) |
|---|---|---|---|---|
| Button | `button.tsx` (cva + Radix `Slot`) | `Button.tsx` (`.ui-btn`) | **Both** | Eos `Button` |
| IconButton | (via `button` `size="icon"`) | `Button.tsx` → `IconButton` | **B only** | Eos `IconButton` |
| Input | `input.tsx` | `TextInput.tsx` | **Both** | Eos `TextField` |
| Search | `panel.tsx` → `SearchInput` | `TextInput.tsx` → `SearchInput` | **Both** | Eos `TextField` + adornment |
| Textarea | `textarea.tsx` | `Textarea.tsx` | **A only** (B dead) | Eos `TextField multiline` |
| Select | `select.tsx` (Radix, portal) | `Select.tsx` (native `<select>`) | **Both** | Eos `Select` / `Autocomplete` |
| Checkbox | `checkbox.tsx` | `Checkbox.tsx` | **A only** (B dead) | Eos `Checkbox` |
| Switch | `switch.tsx` | `Switch.tsx` | **A only** (B dead) | Eos `Switch` |
| Radio | `radio-group.tsx` | `Radio.tsx` | **A only** (B dead) | Eos `Radio` / `RadioGroup` |
| Badge | `badge.tsx` | `Badge.tsx` (+ `StatusDot`) | **Both** | Eos `Chip` / `Badge` |
| Menu | `dropdown-menu.tsx`, `context-menu.tsx` (Radix) | `Menu.tsx` | **A only** (B dead) | Eos `Menu` / `MenuItem` |
| Tooltip | `tooltip.tsx` (Radix) | `Tooltip.tsx` | **Neither at runtime** (rail uses CSS tooltip) | Eos `Tooltip` |
| Dialog | `dialog.tsx` (Radix) | `ConfirmationDialog.tsx` | **A only** (B dead) | Eos `Dialog` |
| Tabs | — | `Tabs.tsx`, `SegmentedControl.tsx` | **Neither** (preview toggle is bespoke in `BrandRender`) | Eos `Tabs` |
| Field / Label | `label.tsx` | `Field.tsx` | **A only** (`label` via `form-controls`; B dead) | Eos `FormControl` / `FormLabel` |
| Separator | `separator.tsx` | — | **A only** | Eos `Divider` |

> Full consumer lists are in
> [`eos-component-consumers.md`](./eos-component-consumers.md).

---

## 3. Recommended future adapter seam

**Do not implement yet.** When the real Eos APIs arrive, both current systems
should be migrated onto a **single seam** rather than either being kept.

### Proposed location

```
src/v4-eos/
  eos/                 ← the ONLY place Iceberg imports Eos/MUI primitives
    index.ts           ← barrel re-export
    Button.tsx         ← thin adapter ONLY where an API gap must be isolated
    TextField.tsx
    Select.tsx
    Checkbox.tsx
    Switch.tsx
    Radio.tsx
    Badge.tsx
    Menu.tsx
    Tooltip.tsx
    Dialog.tsx
    Tabs.tsx
    theme.ts           ← wires the canonical Eos theme/tokens (Phase 1)
```

### Why a seam (and why thin)

- **Single import surface.** Iceberg compositions import from `@/v4-eos/eos`
  only. Swapping the underlying Eos version/API touches the seam, not ~15
  call sites per primitive.
- **Isolates API gaps.** An adapter exists only where Eos's API differs from
  what Iceberg needs (e.g. a `variant`/`size` name map, an icon-only convenience
  wrapper). Where Eos's component is a drop-in, the seam simply **re-exports** it
  — no wrapper, no styling, no logic.
- **No speculative components.** Until Eos APIs are known, `eos/` does not
  exist. Creating it now would mean guessing APIs, which is explicitly out of
  scope.

### Dependency direction (target)

```
Eos package (tokens + MUI components)
        ↓
src/v4-eos/eos/  (thin adapter seam — only where useful)
        ↓
Iceberg compositions (Explorer, Properties, TreeRow, workspace, preview chrome)
        ↓
Iceberg workflows (Pages/Widgets, Sections, PASS, publishing, drag/drop …)
```

The current `ui/**` (shadcn) and `ui-lib/**` (bespoke) both collapse **into** the
`eos/` seam during migration; neither survives as a parallel system.

---

## 4. Token classification

Current source of truth: `src/v4-eos/ui-lib/tokens.css` (`:root` / light =
Eos-derived M3 values; `theme.css` re-aliases them to Tailwind/shadcn variable
names; `styles/eos.css` applies Eos shape/component overlays). **No token values
are changed in this pass.**

Legend: **CONFIRMED EOS** (matches an Eos artifact we can cite) ·
**EOS-DERIVED / INFERRED** (read from the Eos Figma but not verified against a
package export) · **ICEBERG-SPECIFIC** (deliberate product decision) ·
**UNKNOWN / NEEDS EOS SOURCE** (must be confirmed before we treat as canonical).

### COLOR
| Token(s) | Value(s) | Consumers | Classification |
|---|---|---|---|
| `--color-bg-canvas/surface/panel/subtle/elevated/hover/control` | warm-neutral M3 ladder (`#f7f3f2` … `#ffffff`) | `eos.css` shell, `ui.css`, editor Tailwind (`bg-[var(--color-bg-*)]`) | EOS-DERIVED / INFERRED |
| `--color-text-primary/secondary/muted/inverse` | `#1c1b1b`/`#45474a`/`#76777a`/`#fff` | app-wide text | EOS-DERIVED / INFERRED |
| `--color-border-default/strong/subtle` | `rgba(0,0,0,.12/.22/.06)` | panels, tables, dividers | EOS-DERIVED / INFERRED |
| `--color-action-primary(+-hover/-bg/-border)` | Iceberg blue `#01699b` / `#004b73` | primary buttons, links, selection, focus, tree accent | **ICEBERG-SPECIFIC** ⚑ |
| `--color-bg-selected`, `--color-nav-chrome-active-bg` | blue tint `#dbeaf3` | tree/nav selection | **ICEBERG-SPECIFIC** ⚑ |
| `--color-status-danger(+-bg)` | `#ba1a1a` | error states, PASS | EOS-DERIVED (Eos "Error") |
| `--color-status-success/warning/info(+-bg)` | `#146c43` / `#8a5a00` / `#151719` | badges, validation | **UNKNOWN / NEEDS EOS SOURCE** ⚑ |
| `--color-toast-bg(+-hover)` | `#2f3133` | Toast (dead in V4) | EOS-DERIVED (inverse-surface) |
| `--color-bg-app`, `--color-bg-preview-canvas` | `#ece7e6` / `#e5e2e1` | floating shell backdrop, preview matte | EOS-DERIVED / INFERRED |

### TYPOGRAPHY
| Token(s) | Value(s) | Consumers | Classification |
|---|---|---|---|
| `--font-sans` | `Inter, …` | app-wide | **UNKNOWN** ⚑ (Inter vs Roboto unresolved; Roboto is loaded but unbound) |
| `--font-mono` | system mono | codes/ids | EOS-DERIVED / INFERRED |
| `--text-xs..xl` | 11/12/13/14/16/20 | app-wide | **UNKNOWN / NEEDS EOS SOURCE** ⚑ (not mapped to Eos type-role names) |
| `--fw-medium/semibold/bold`, `--lh-tight/normal` | 500/600/700, 1.15/1.5 | app-wide | EOS-DERIVED / INFERRED |

### SPACING
| Token(s) | Value(s) | Consumers | Classification |
|---|---|---|---|
| `--space-1..8` | 4/8/12/16/20/24/32 | shell, panels, CSS | **CONFIRMED EOS-aligned** (Material 4px grid) |
| `--indent-0..4` | 0/16/32/48/64 | tree indentation | ICEBERG-SPECIFIC (composition detail) |

### RADIUS
| Token(s) | Value(s) | Consumers | Classification |
|---|---|---|---|
| `--radius-sm/md`, `--radius-pill` | 8 / 12 / 100 | buttons, cards, menus | EOS-DERIVED (M3 shape) |
| `--radius-lg` | 16 | floating rail + workspace surfaces | **EOS-DERIVED / INFERRED** ⚑ (self-labeled "EOS-DERIVED") |

### ELEVATION
| Token(s) | Value(s) | Consumers | Classification |
|---|---|---|---|
| `--elevation-1/2` | M3-style drop shadows | menus, dialogs, tooltips | **EOS-DERIVED / NEEDS EOS SOURCE** ⚑ |

### FOCUS
| Token(s) | Value(s) | Consumers | Classification |
|---|---|---|---|
| `--focus-ring-width` | 3px | all focusable elements | EOS-DERIVED / INFERRED |
| `--color-focus-ring`, `--focus-ring` | rides `--color-action-primary` (blue) | all focusable elements | **ICEBERG-SPECIFIC** ⚑ (ring color inherits the Iceberg-blue accent) |

### STATUS
See COLOR (`--color-status-*`). Danger = EOS-DERIVED; success/warning/info =
**UNKNOWN / NEEDS EOS SOURCE** ⚑.

### CONTROL SIZE
| Token(s) | Value(s) | Consumers | Classification |
|---|---|---|---|
| `--control-height-sm/md/lg` | 32 / 40 / 48 | `ui-lib` controls, `eos.css` | **UNKNOWN / CONFLICT** ⚑ (shadcn `ui/button` uses 36/32/40 = `h-9`/`h-8`/`h-10`; the two systems disagree) |
| `--control-pad-x` | 12 | controls | EOS-DERIVED / INFERRED |

### MOTION
| Token(s) | Value(s) | Consumers | Classification |
|---|---|---|---|
| `--motion-fast/normal/slow`, `--ease-standard` | 120/160/240ms, `ease-out` | hovers, disclosure, tooltips | **EOS-DERIVED / NEEDS EOS SOURCE** ⚑ |

### LAYOUT
| Token(s) | Value(s) | Consumers | Classification |
|---|---|---|---|
| `--z-sticky/nav/dropdown/overlay` | 5/20/100/1000 | stacking | ICEBERG-SPECIFIC |
| *(no breakpoint tokens)* | — | workspace grid is fixed (`${explorerWidth}px 6px minmax(0,1fr) 380px`) | **UNKNOWN / NEEDS EOS SOURCE** ⚑ (panel/responsive rules) |

---

## 5. Speculative values — flagged, not changed

Per the audit, the following are **not** authoritative Eos and must be confirmed
before we treat them as canonical. They are **left in place unchanged** (removing
or "normalizing" them now would be guessing):

1. **Iceberg blue** action/accent (`--color-action-primary` family, focus ring,
   selection tints) — a deliberate product accent; Eos M3 primary is near-black.
2. **success / warning / info** status colors — Eos only confirms **Error**.
3. **Typography ramp** (`--text-*` sizes, weights) — not mapped to Eos type roles.
4. **Inter vs Roboto** — `--font-sans` is Inter; Roboto is loaded but unbound.
5. **Large radius** (`--radius-lg: 16px`) — inferred for floating surfaces.
6. **Elevation values** (`--elevation-1/2`) — claimed M3, unverified.
7. **Motion values** (durations + easing).
8. **Canonical control heights** — 32/40/48 vs shadcn 36/32/40 conflict.
9. **Responsive / panel rules** — no breakpoint tokens; fixed grid widths
   (Explorer resizable, Properties hard-coded 380px).

---

## 6. Migration-risk classification (per primitive)

Determined from the actual implementations. **LOW** = simple/native/presentational;
**MEDIUM** = variant/API/style mapping; **HIGH** = portal/focus/state/interaction
behavior to preserve.

| Primitive | Risk | Why (from code) |
|---|---|---|
| Textarea | **LOW** | Plain control; A-only, thin. |
| Field / Label | **LOW** | Presentational; `label.tsx` + `form-controls`. |
| Separator | **LOW** | Presentational; → `Divider`. |
| Input / Search | **LOW–MEDIUM** | Two impls; Search adds pill + adornment styling. |
| Button | **MEDIUM** | Two impls; variant/size/height name mapping (see control-height conflict). |
| IconButton | **MEDIUM** | `ui-lib`-only; maps to Eos `IconButton` + a11y label contract. |
| Badge | **LOW–MEDIUM** | Two impls; `Chip` mapping; blocked on status roles. |
| Checkbox | **MEDIUM** | Controlled state + indeterminate; a11y wiring. |
| Switch | **MEDIUM** | Controlled state; `useToggle` field mapping. |
| Radio | **MEDIUM** | Group semantics; controlled value. |
| Tabs | **MEDIUM** | Primitive currently unused; preview toggle is bespoke — keep behavior. |
| Tooltip | **MEDIUM** | No runtime consumer (rail uses CSS tooltip); low footprint but portal/positioning differ. |
| Select | **MEDIUM–HIGH** | **Two very different impls** — Radix portal (`ui/select`) vs native `<select>` (`ui-lib/Select`); unify onto one Eos control. |
| Table / DataGrid | **MEDIUM–HIGH** | CSS tables + the **80+ item Widget/Offers** case (perf, filter, reorder-index integrity). |
| Menu | **HIGH** | Radix `dropdown-menu` + `context-menu` behind `row-actions`; portal/focus/keyboard + copy/paste/rename/duplicate integration. |
| Dialog | **HIGH** | Radix portal + focus-trap; drives the Layout Picker. |

---

## 7. Design System catalog readiness (`#/design-system`)

Route renders `src/v4-eos/regions/DesignSystem.tsx` (live shadcn specimens).
`src/v4-eos/ui-lib/DesignSystem.tsx` + `ui-lib/docs/*` are **not routed in V4**.

| Item shown / present | Bucket | Notes for when Eos connects |
|---|---|---|
| Colors, Typography, tokens (Foundations) | **EOS FOUNDATION** | Re-point swatches to canonical Eos tokens. |
| Button, Input, Select, Checkbox, Switch, Radio, Badge (Actions/Status/Form) | **EOS PRIMITIVE** | Re-render from the `eos/` seam once it exists. |
| TreeRow, PropertyRow, Properties inspector, PanelHeader, Explorer patterns, Collection editor, Preview toolbar, resizable workspace | **ICEBERG PATTERN** | Not yet documented in the catalog — **add an "Iceberg patterns" section**, composed from Eos. |
| Title **"Iceberg V2 UI"** | **STALE** | Rename to V4 / Eos. |
| Copy: "one **dark**, cohesive component layer" / "base for future internal tools" | **STALE** | V4 is light Eos; and Iceberg is **not** a foundation for other tools (that's Eos). |
| `ui-lib/DesignSystem.tsx` + `ui-lib/docs/*` + `foundations.ts` | **STALE / OBSOLETE** | Unrouted clone of the old shared catalog; candidate for removal (report-only, §10). |

**Do not visually update the catalog in this pass.** Target end-state: one catalog
rendering the real components, split **EOS** vs **ICEBERG PATTERN**, plus a
"potential Eos contributions" section.

---

## 8. Potential Eos contributions

Iceberg-local patterns that *may* be generic enough to propose to Eos later.
**Do not promote automatically** — each needs a confirmed Eos gap + a second
consumer:

- **TreeRow** (depth, disclosure, grip, selection, drop states)
- **Property inspector / PropertyRow / PropertySection**
- **PanelHeader** (eyebrow / sub / actions)
- **Resizable workspace** (panel grid + drag handle)
- **Collection editor** (add / remove / reorder)
- **Contextual detail panel** (selection → inspector)
- **Validation indicator** (required/error signaling)
- **Dense authoring toolbar** (compact control cluster)

---

## 9. Blocking Eos Inputs

Questions for **Agustina / Saad** before any implementation begins. Written for a
design + engineering conversation, not just a technical dump.

1. **Consumption** — What repository/package should product teams install to get
   Eos (name + version)? Is there an official MUI theme package?
2. **Tokens/theme source** — What is the canonical token/theme source of truth
   (a published theme object, a token JSON, a Figma variables export)?
3. **Production-ready components** — Which Eos components are production-ready
   today, and which are still in progress?
4. **Variant & size names** — What are the canonical component **variant** and
   **size** names? (We currently have conflicting names across two systems.)
5. **Typography** — What is the canonical type ramp (role names + px/line-height/
   weight) and font family? Inter, Roboto, or both — and where does each apply?
6. **Status roles** — What roles exist for **success / warning / info / error**?
   (We only have Error confirmed.)
7. **Product accent** — May an application define a product accent such as
   **Iceberg blue** for primary/selection/focus, or must primary follow the Eos
   near-black?
8. **Control heights** — What is the canonical control-height scale? (We have a
   32/40/48 vs 36/32/40 conflict.)
9. **Layout/responsive** — What panel/grid/responsive guidance exists (breakpoints,
   min/max panel widths, behavior at 1440 vs 1920)?
10. **Icons** — What icon library/taxonomy should products use (Material Symbols
    set + naming)?
11. **Figma** — What is the Figma library and its naming model (for eventual
    Figma ↔ code / Code Connect alignment)?
12. **Data tables** — Does Eos provide a **Table/DataGrid**, and is it suitable
    for large lists (the 80+ item Widget/Offers case)?
13. **Platform chrome** — Is the **OpsHub top bar** an Eos/platform-owned
    component Iceberg should import rather than reimplement?

---

## 10. Future migration checklist

**Do not execute in this pass.**

- **Phase 0 — Receive canonical Eos artifacts.** Package(s), theme/tokens, component
  APIs, Figma library, docs. Answers to [Blocking Eos Inputs](#9-blocking-eos-inputs).
- **Phase 1 — Connect canonical Eos theme/tokens.** Replace local
  Eos-derived/inferred values with the authoritative Eos values; resolve the
  flagged speculative items (§5).
- **Phase 2 — Establish the adapter seam** (`src/v4-eos/eos/`, §3).
- **Phase 3 — Migrate lowest-risk primitives:** Button, Input, Textarea, Checkbox,
  Switch, Radio.
- **Phase 4 — Migrate interaction-heavy primitives:** Select, Menu, Tooltip,
  Dialog, Tabs.
- **Phase 5 — Migrate shared application chrome:** Table/DataGrid, navigation
  primitives, status, panel headers, form patterns.
- **Phase 6 — Keep Iceberg patterns, rebuilt/composed using Eos:** Explorer,
  TreeRow, Properties, Collection editing, workspace/resizer, preview toolbar.
- **Phase 7 — Align responsive/panel rules** to Eos guidance.
- **Phase 8 — Update the living Design System catalog:** EOS components,
  ICEBERG patterns, potential Eos contributions.

### Note: do NOT consolidate onto shadcn first

An earlier audit suggested a "Phase 1.5" that first consolidates both primitive
systems onto shadcn, then later migrates to Eos. **That is rejected** — it causes
a double migration. Instead, wait for the real Eos APIs, then migrate **both**
current systems directly onto the single Eos-backed seam.

---

## 11. Dead / obsolete code (report-only — not removed in this pass)

Confirmed by repository-wide search; **no removals performed**. All are
V4-local (`src/v4-eos/**` is a self-contained clone), but per the readiness-pass
rules these are reported first for approval.

- **`lucide-react`** — referenced only in a comment in `ui/msym.tsx`; **no code
  imports it in V4.** ⚠️ It is a **shared root `package.json` dependency** (may be
  used by `src/v1`/`src/v2`), so **do not remove without checking those**
  prototypes. Report-only.
- **Dead `ui-lib` primitives in V4** (present but never imported outside
  `ui-lib`): `Textarea`, `Checkbox`, `Switch`, `Radio`, `Menu`, `Tooltip`,
  `Popover`, `ConfirmationDialog`, `Tabs`, `SegmentedControl`, `DateInput`,
  `Callout`, `Toast`, `Loading`, `Collection`, `Field`, `TreeRow`, `Nav`,
  `Indicators`, and `TextInput`'s `TextInput` export (only `SearchInput` is used).
- **Unrouted V4 catalog clone:** `ui-lib/DesignSystem.tsx`, `ui-lib/docs/*`,
  `ui-lib/foundations.ts` (the routed catalog is `regions/DesignSystem.tsx`).
- **Stale catalog copy:** "Iceberg V2 UI" title + "dark" wording in
  `regions/DesignSystem.tsx` (V4 is light Eos).

> **Actively used `ui-lib` in V4** (keep until migrated onto Eos): `Button`/
> `IconButton`, `TextInput`→`SearchInput`, `Select`, `Badge`/`StatusDot`, `Icon`,
> `Breadcrumb`, `EmptyState`, `IcebergLogo`, `OpsHubLogo`, `useHashRoute`.

---

## 12. Surprising architecture findings

- **Two full primitive systems coexist**, split by area: the **editor** is
  shadcn/Radix (`ui/**`); the **browse chrome** is bespoke `ui-lib`. Most of
  `ui-lib`'s primitives are **dead clones** in V4.
- **Zero MUI/Material components.** "Material" today = the Material Symbols font
  + M3-derived token *values* only.
- **`ui-lib` was explicitly aiming to become `@acme/iceberg-ui`** — directly
  opposite the Eos direction (now retired; see §1 non-goal).
- **Control-height conflict** between the two systems (32/40/48 vs 36/32/40).
- **`Select` has two incompatible implementations** (Radix portal vs native).
- **`lucide-react` is a dead dependency** in V4 (comment-only reference).
