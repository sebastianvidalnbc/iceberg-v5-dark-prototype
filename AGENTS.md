# Working in this repository

This repository contains only the V4 Iceberg CMS UX prototype. The application
source is `src/v4-eos/`; sample data is illustrative and there is no backend.

## Read on demand

- Current state and open work: `docs/CURRENT-PROGRESS.md`
- Eos component specifications: `docs/eos-design-system.md`
- Figma-to-code mapping: `docs/FIGMA-COMPONENT-MAP.md`
- Eos ownership: `docs/eos-adoption.md`, `docs/eos-component-consumers.md`
- Authoring pain points: `AUTHOR-EFFICIENCY.md`
- Customer preview constraints: `src/v4-eos/renderer/README.md`

## Implementation constraints

- Reuse `src/v4-eos/ui/` and `src/v4-eos/ui-lib/` before adding components.
- Use Eos tokens from `src/v4-eos/ui-lib/tokens.css`, not raw values.
- Preserve editor behavior: selection, expand/collapse, reorder, live preview,
  validation, and keyboard focus.
- Keep Streamly renderer styling isolated. Do not use Eos tokens in
  `src/v4-eos/renderer/` or Streamly tokens outside it.
- For authoring UX or IA changes, state which named pain point in
  `AUTHOR-EFFICIENCY.md` the change helps, ignores, or risks worsening.

## Validate

```bash
npm run typecheck
npm run build
```

GitHub Pages deploys automatically from `main`. Do not commit, push, or deploy
without explicit user permission.
