# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Streamly / ACME commerce content authors. They compose and manage customer-facing
commerce pages — plan pickers, offer cards, and their variants — inside the
Iceberg CMS, working through a Pages/Structure explorer, a live preview, and a
schema-driven properties panel. QA reviewers and admins act on the same surfaces
via the QA → Publish workflow.

## Product Purpose

Iceberg is the authoring tool for Streamly commerce pages. It lets authors
assemble pages from schema-defined layouts (plan pickers, offer cards, product
features), edit their content in structured property forms, preview the real
customer result live, and move work through a QA and publish workflow — without
hand-coding pages.

## Positioning

Schema-driven authoring paired with a live, isolated customer-facing preview: the
editor renders the actual Streamly page in a separate iframe document synchronized
over postMessage, and lets authors preview MVT/A-B variations and per-audience
results in place. The authoring chrome and the customer render are deliberately
different design systems, so the preview reads as a faithful customer artifact
rather than an editor mock.

## Operating Context

- Three-region editor: left **Explorer** (resizable Pages tree + Structure
  tree), center **Live Preview** (isolated Streamly renderer with device /
  audience / MVT controls, click-to-select, highlight, and a live accessibility
  score), right **Properties** (schema-driven forms).
- Top action bar mirrors the real Iceberg editor: Publish, Send To QA, Save
  (validation-gated), QA Review, QA Notes, CSS, JSON-LD, Settings.
- Hash-routed views: Pages / Widgets lists, Variants lists, and the editor, with
  a persistent left nav rail across all levels (Pages, Widgets, Content Pages,
  Event Pages, Central Mgmt, QA Queue, Experiments, Scheduled Pages, Redirects,
  Services CMS, Help).
- **V4-eos** is the active workstream: the V2 prototype migrated to the Eos
  design system, progressively gaining real-Iceberg authoring behavior.

## Capabilities and Constraints

- Schema-driven structure and property editing derived from the real Iceberg
  schema (layouts, modules, validations).
- Live preview sync (CMS ↔ renderer over postMessage), Pick Section /
  click-to-select round-trip, device presets, audience overlay, MVT override.
- Validation gating on Save (required fields must be complete).
- Structure editing: drag-reorder among siblings; add / duplicate / copy /
  paste / disable / delete; add-layout page building from the schema catalog.
- Retention / services-config authoring — the **widget** context, distinct from
  the **page** context: a widget's Services CMS configuration is authored as a
  tree of offers, segments, and surveys, with `retention-service-config` items
  prioritized at the top. Nodes preserve authored order (not alphabetical), and
  the widget context exposes a restricted row-action set (a minimal
  rename / copy / paste rather than the full page-context menu).
- Deployment: pushes to `main` build and deploy the prototype through GitHub
  Actions to `https://sebastianvidalnbc.github.io/iceberg-v4-eos-prototype/`.

## Brand Commitments

- **Two design systems stay strictly separate and must not bleed into each
  other** (binding constraint): **Eos** owns the authoring UI (the editor
  chrome); the **Streamly Commerce UI Kit** owns the customer-facing preview.
- Product name: Iceberg.

## Evidence on Hand

- CMS author efficiency pain points from the 7 Apr 2026 workshop, recorded in
  `AUTHOR-EFFICIENCY.md` (FigJam Iceberg Efficiency). Future authoring work
  should be contrasted against that file, not treated as an unsolicited backlog.
- Real Iceberg schema and layout definitions extracted from the source app
  (`iceberg-commerce-main`), driving structure + properties.
- Figma sources of visual truth: the **Eos Library** (authoring UI) and the
  **Streamly Commerce UI Kit** / IA Plan Picker (customer preview).
- Sample data: Pages (`/plans`, `/plans/all-monthly`, variants), plan-picker
  products (Select / Premium / Premium Plus), product features, and offers.
- Absence future work must not fabricate: **Streamly Sans TF** (the brand font)
  is proprietary and not available to this prototype; the preview uses a
  documented substitute recorded in the renderer, not the real face.

## Product Principles

- Preserve product truth — routes, IA, data model, and authoring behavior — as
  the tool evolves; apply Eos as the visual layer for the chrome rather than
  reinterpreting the product.
- Keep the customer preview a faithful Streamly artifact, isolated from the
  editor's design system.
- Author by schema, not by hand: what is editable, and how, is governed by the
  real Iceberg schema.
- Make the live result and its correctness (validation, accessibility) visible
  while authoring.

## Accessibility & Inclusion

- Target standard: **WCAG 2.1 AA** for the authoring chrome.
- The editor surfaces a live accessibility readout — a tri-state Pass / Review /
  Fail "semáforo" chip with score and locale — so authors see conformance while
  they work, not only at review time.
