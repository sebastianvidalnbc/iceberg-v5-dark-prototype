# Current progress — handoff

Last updated 2026-10-14. V4 was extracted into the standalone
`iceberg-v4-eos-prototype` repository as a clean source snapshot.

## State of the redesign

V4 (`src/v4-eos/`) is the active prototype: Iceberg authoring rebuilt on Eos.
It covers Home, Pages → Variants → Page editor, Widgets → Widget editor, Content
Pages → Content Pages editor, and an in-app Design System catalog. The editors
share a three-region layout (Explorer / Live Preview / Properties) with a
Streamly customer render in an isolated iframe.

## Completed (recent, newest first)

- **Properties panel on the Eos list family** (`cec39cc`). Pages, Widgets and
  Content Pages:
  - Switch fields become List items (44px, 60px with help) with a trailing
    Eos switch (40×24 track, 18px thumb).
  - Checkbox fields use the Selection pattern (leading checkbox, whole row
    clickable).
  - Read-only values (Territory, Last modified, Section ID) are two-line
    items. Status badges sit in a trailing Label accessory.
  - Group headers are List subheaders (36px, 14 semibold) with a trailing
    collapse chevron, separated by full-width dividers.
  - Collections (Products, Offers) are an Eos List: bordered, radius 8,
    44px rows, family dot in the leading slot, hover-revealed reorder/delete.
  - Text/select/textarea fields stack a 12px Label/Medium caption above the
    control. This replaced the old 130px two-column layout.
  - Files: `ui/property.tsx` (`ListItem`, `ListAccessory`, `ListDivider`,
    `PropertySection`, `PropertyRow`, `PropertyRows`), `ui/switch.tsx`
    (`size="lg"`), `ui/form-controls.tsx` (`id` on Switch/Checkbox
    fields), `regions/Properties.tsx`, `regions/ContentPageProperties.tsx`,
    `regions/catalog/sections.tsx`.
- Tree labels in Pages Structure and Content Pages outline unified at Inter
  14px regular, set on the `ui/tree-row.tsx` label (`43c7526`).
- Preview toolbar bar is white, matching the Properties header.
- Content Pages editor added (`43c7526`); Eos Overlay OpsHub chrome and
  icon-only rail (`cae2f4a`); browse table columns aligned with production
  (`3dcc17e`); broad Eos alignment pass (`c6add5e`).
- Earlier: live preview wired to authored properties for all layouts;
  retention widget editor restructure; Home KPI dashboard; accessibility score
  chip; resizable Pages/Structure split.

## Key decisions

- V4 stays self-contained under `src/v4-eos/`.
- Figma wins over docs. Workset list specs are recorded in
  `docs/eos-design-system.md` §7. The V4 adaptations (4px inset column,
  stacked field labels, subheader chevron, sentence-case headers) are listed
  in §7.9.
- The renderer (Streamly) and the authoring UI (Eos) never share tokens.
- UX changes must name the `AUTHOR-EFFICIENCY.md` pain point they help, ignore
  or risk. The Properties redesign was consistency work and didn't target one.

## Known issues / gaps

- Properties text inputs are 28px; the Eos doc says fields are 36px.
  Unreconciled (`ui/form-controls.tsx` `FIELD`).
- Checkbox, radio and select are not verified against Eos Workset specs.
- `--color-border-subtle` remains in some Properties pieces (asset picker,
  feature icon tile, feature item separators) next to the `--border` dividers.
- Inline feature-bullet editor (`InlineFeatureCollections`) was only
  re-padded, not redesigned to list specs.
- `MetadataBody` and `NoticeBody` cards ("Intelligent authoring", notice box)
  still use pre-Eos card styling.
- The user's screenshot from 2026-10-12, which marked specific Eos elements to
  use, was unreadable. The whole list family was used instead; confirm with
  the user if a narrower set was meant.

## Suggested next steps

1. Confirm with the user which Eos elements the 2026-10-12 screenshot meant.
2. Verify the Eos text field, checkbox and select in Figma (Library or Workset),
   record them in §7, then reconcile `form-controls.tsx`.
3. Bring the inline feature editor and Metadata/Notice cards onto list or
   card specs (Workset Card `76:133` is a known, uninspected node).
4. Replace remaining `--color-border-subtle` in Properties with Eos `--border`
   where they act as dividers.
