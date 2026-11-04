# `src/ui` — shared design system

The proposed reusable Iceberg design system: **design tokens + primitives +
composable patterns**, consumed by both prototypes (`src/v1`, `src/v2`). It is
written in plain React + TypeScript + CSS custom properties — no Tailwind, no
CSS-in-JS, no third-party component kit.

## The dependency rule

```
        src/ui        (this folder — foundation)
          ↑
   ┌──────┴──────┐
 src/v1        src/v2  (consumers)
```

`src/v1` and `src/v2` import from `src/ui`. **`src/ui` must never import from
`src/v1` or `src/v2`.** This one-way rule is what keeps the system reusable and
extractable. It currently holds: `src/ui` has zero imports from the prototypes.

## What belongs here / what doesn't

**Belongs:** generic, app-agnostic UI — tokens, primitives, and cross-prototype
patterns that make no assumption about Iceberg's data model or routing.

**Does not belong:** application compositions and domain logic. These stay with
their prototype:

- V1's recursive content editor, sidebar, and scenarios → `src/v1`
- V2's Explorer, Live Preview, Properties, WorkspaceShell → `src/v2`

If a component needs to know about pages, tabs, widgets, retention offers, or a
specific route, it is a composition — keep it in the prototype, built *from* the
primitives here.

## Inventory (exported via `index.ts`)

| Category | Components |
|---|---|
| **Tokens** | `tokens.css` (color, type, spacing, radius, border, shadow, control height, focus, motion), `foundations.ts` (catalog data) |
| **Primitives** | Button/IconButton, TextInput/SearchInput, Textarea, Select, Checkbox, Radio, Switch, DateInput, Badge/StatusDot, Icon |
| **Patterns** | Field/FieldGroup, TreeRow, Collection/CollectionHeader, Section, Indicators (Status/ItemCount/Validation), EmptyState, Callout, Loading, Tabs, SegmentedControl, Breadcrumb, Nav |
| **Overlays** | Menu/DropdownMenu, Tooltip, Popover, ConfirmationDialog, Toast |
| **Utilities** | `useHashRoute` |
| **Catalog** | `DesignSystem.tsx` + `docs/*` (renders the `#/design-system` route) |

## Maturity

Two tiers, both real:

- **Exercised in a prototype** — used by V1 and/or V2 in live screens, so the API
  has been pressure-tested against actual authoring flows.
- **Cataloged** — demonstrated in the `#/design-system` catalog with its
  variants/sizes/states, but not yet wired into every prototype screen.

The catalog is the source of truth for each component's supported
variants, sizes, and states (default / focus / disabled / error / selected /
success where relevant).

## Conventions

- **Tokens are canonical.** Components reference CSS custom properties, never raw
  hex or arbitrary spacing. Change a design decision in `tokens.css`, not in a
  component.
- **BEM-ish class names.** Shared primitives use `.ui-*`; V2-local workspace
  styles that happen to live in `ui.css` use the `.ui-ws-*` namespace to stay
  clearly distinct (e.g. the feature-rich shared `.ui-tree-row` primitive vs.
  V2's lightweight `.ui-ws-tree__row`).
- **Accessibility is built in.** Focus rings on every interactive element,
  status is never color-only (always paired with text/icon), correct roles and
  `aria-*` wiring in Field, Menu, Switch, TreeRow, etc.
- **Legacy token aliases** in `tokens.css` exist only for V1's `index.css`
  back-compat and are marked as such — do not use them for new work.

## Preparing for extraction (`@acme/iceberg-ui`)

The long-term goal is for this folder to become a standalone package usable by
other internal apps. It is **not** a package yet — do not publish. Status of the
known blockers:

- ✅ **No prototype imports.** `src/ui` never imports from `src/v1`/`src/v2`.
- ✅ **No prototype data.** No hardcoded Iceberg domain content in primitives.
- ✅ **No routing coupling.** Only `useHashRoute` touches the URL, and it is a
  generic, opt-in hook (not required by any primitive).
- ⚠️ **Global CSS, not scoped.** `ui.css`/`tokens.css` are global stylesheets, and
  a few `.ui-ws-*` (V2-local) rules currently live in `ui.css`. Before packaging,
  split V2-local rules out and decide on a CSS delivery strategy (single import
  vs. per-component) so consumers get only what they use.
- ⚠️ **Barrel-only entry.** Everything ships through `index.ts`. Packaging should
  keep tree-shaking in mind (side-effect-free exports, explicit CSS import).

None of these block current prototype use; they are the checklist for a future
extraction pass.
