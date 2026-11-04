# `renderer/` — Streamly customer-facing preview

This folder renders the **customer output** shown inside the Iceberg V4 preview
iframe. It is deliberately isolated from the rest of the app.

## The isolation contract

1. **Two design systems, never mixed.**
   - The authoring UI (OpsHub bar, Explorer, Properties, dialogs) is **Eos**.
   - Everything in this folder is **Streamly Commerce** — the customer render.
   - **No Eos tokens/styles leak in here, and no Streamly (`--pk-*`) tokens leak
     out into the editor.**

2. **`brand.css` owns all brand styling.** It is self-contained and scoped under
   `.ui-brand`. Every value carries an inline provenance tag:
   `[VERIFIED]` · `[OBSERVED]` · `[FROM SCREENSHOT]` · `[APPROX]` ·
   `[PROTOTYPE-LOCAL]` · `[UNVERIFIED]`. See `.commerce-fidelity/FIDELITY-QA.md`
   for the full element-by-element lineage.

3. **No proprietary assets.** Streamly ships **Streamly Sans TF** (proprietary) —
   we do **not** bundle or reference it. `renderer.html` loads **Plus Jakarta
   Sans** as a documented open-source *substitute*; the type *geometry* is
   verified, the typeface is a stand-in.

4. **Brand assets** in `assets/` are approved SVGs exported from the Commerce UI
   Kit (Streamly wordmark, Commerce checkmark).

5. **Editor affordances are a separate overlay.** Selection / hover / pick-mode
   outlines live at the bottom of `brand.css` under the `PREVIEW EDITOR OVERLAY`
   header and use **only** `--preview-editor-*` tokens — never a `--pk-*` token.
   They are `outline`-based so toggling selection never shifts the composition.

## Files

| File | Role |
|---|---|
| `BrandRender.tsx` | Renders the preview DOM from the derived `PreviewModel`. |
| `brand.css` | All Streamly brand styling + the isolated editor overlay. |
| `components/CommerceWebButton.tsx` | Faithful Commerce UI Kit Web Button (primary/secondary/tertiary × compact/tablet-mobile/desktop). |
| `assets/streamly-wordmark.svg` | Approved Streamly wordmark. |
| `assets/commerce-check.svg` | Approved Commerce checkmark. |

## Where the data comes from

`BrandRender` never reads the raw structure tree. It consumes the read-only
`PreviewModel` derived in `src/v4-eos/previewModel.ts` from the selected
variant. The renderer is a pure view: it styles what the model gives it.
Pricing-block rows are **data-gated** (render only when the corresponding schema
field is authored).

## Verified Figma sources

- Commerce UI Kit — `EpM4nZGcDrbLmGhl2et7TUqW` (Nav `45799:659`, Web Button,
  Checkmark, Toolkit Typography Specimen `63956:33500`).
- IA Plan Picker — `roOR88JWhOcpVLuXQGzfgG` (Plan Card `11051:8463`).

## If you touch this folder

- Keep new values tagged with a provenance marker.
- Do **not** import Eos/shadcn/Tailwind styles here.
- Prefer verifying against a Figma node over eyeballing; if you can't, tag it
  `[PROTOTYPE-LOCAL]` and note why.
