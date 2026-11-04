# CMS author efficiency — workshop pain points

Source of truth for contrasting future Iceberg work against what authors actually
said. Do not invent Channel Manager, HITL, or AI patterns that are not in this
file. Do not treat this list as a backlog to implement unasked.

**Source:** FigJam [Iceberg Efficiency](https://www.figma.com/board/Ozm3N4A0NhmdcIv8QCGrH4/Iceberg-Efficiency) (`Ozm3N4A0NhmdcIv8QCGrH4`). Outcome of the **CMS Author Efficiency Working Session, 7 April 2026**. Voices on the board: merchandisers and publishing tools (Gemma Abrahams, Nimrah Qamar, Mia Z, Clara, Lee McMullan, Alex). Markets: **NOW GB/IE** and **Streamly**.

Priority they already drew: **high value × high frequency × high effort**.

## How to use this file

When changing Iceberg authoring UX, IA, workflows, or prototype scope:

1. Name which pain point(s) the change helps, ignores, or risks making worse.
2. Prefer reducing time, repetition, or error on a named task over chrome polish that does not move those numbers.
3. Keep NOW (multi-page, widgets, QA sets) and Streamly (assets, homepage experiments, partnerships) distinct when a change only serves one.

## Pain points

### 1. One-by-one work that should be many-at-once

Authors update, QA, schedule, and experiment on **sets of pages**, but Iceberg is built for one page at a time.

- Multi-page create / update / QA / schedule (entertainment, sports, onebox).
- NOW: about **2 hours a day** QAing a set of pages; schedule-a-set is ~2 minutes once QA is done.
- Group scheduling for campaigns; bulk activity.
- Copy/paste **between GB and IE** is unreliable — sometimes blanks the template.
- Copy/paste of variants inside A/B modules.
- Multi-page A/B (hero image/copy, flexi-merch, FAQ, carousels, content promo rails).

### 2. Assets are a daily tax (Streamly)

Everyday BAU, not a rare task:

- Sourcing assets: **30 min–1 h**
- Sizing assets: **30 min–1 h**
- Upload via **CyberDuck**: 5 min + **15–30 min wait**

Asked for: native crop, recommended sizes in the template, DAM / centralized media, image inputs shared across templates.

### 3. Central Management does not reach the placements they edit

- CTA label and legal lines are not centrally managed on every template (e.g. missing on hero / content promo hero).
- **No Plan Picker CTA-label override increased manual workload ~25%.**
- Plan picker: drag-and-drop sales panels between tabs still requested.
- Offer / voucher changes: voucher code broken with **no Iceberg alert**; easy to forget the same code with a different label.
- Widgets not reliably shared between territories.

### 4. Experiment vs targeting is muddy and expensive

- Streamly: A/B **setup 1–3 h**, execution 1–3 h, QA 30 min — weekly BAU.
- Multi-page experiment **~5 hours** to create; ~2 hours to update; ~1 hour to end.
- Homepage experiments (Streamly) and multi-page experimentation (NOW) sit in high-value / high-effort.
- They want **native targeting** (unknown / known / ECHP) so not every difference has to be an Experiments (or Coframe) test.
- Publish checklist already warns Experiments **slows the page** and should be on only when needed.

### 5. Publish / QA is easy to get wrong

- No “are you sure?” when publishing with **QA still outstanding**.
- Failed-QA emails mix **GB and IE**; cannot assign a QAer; no notify-on-status-change.
- Two editors can work the same artifact with **no concurrency lock**.
- Save / undo only last 1–3 changes in the current variant.
- **Stable-int does not reflect production**, so QA/UAT is untrustworthy.
- Time spent in Stable-Int was listed as a gap to measure.

### 6. Bespoke content pages cost too much for the lifecycle

- Single entertainment bespoke page: **~3 hours**; a set: **~6 hours** (monthly).
- Pre / during / post-premiere (and sports post-event) states are still hand-built.
- Opportunity they wrote: **stop creating bespoke pages**; populate templates from ATOM URL / content metadata; full pre / current / post state support.

### 7. Finding work, redirects, and in-CMS alerts are weak

High-frequency, relatively low-effort if built:

- Page search / filter; collection / catalogue discovery.
- Redirects: create/update (~5 min) plus **tracking dates** (~10 min+); traffic tracking.
- Alerts: page isn’t displaying; voucher isn’t working; scheduled but not QA’d.
- Automated SEO footer; structured metadata on a set of pages; accessibility checks on a set of pages.

### 8. Process around Iceberg, not only inside it

- Help docs, release notes, in-app “what will change in my day-to-day.”
- Bug vs new request / definition of done.
- Ready-to-test pages covering templates; shared test scripts.
- Roadmap of Iceberg changes visible to authors.
- Time still unmeasured: localization, SEO properties, sitemap / broken links, page-performance review, extra Experiments tasks.

## Time they already quantified (order of magnitude)

| Cadence | NOW GB/IE (approx.) | Streamly (examples) |
|---|---|---|
| Daily | ~2 h 15 m (page updates, set QA, set schedule) | Small updates 1–10 m; assets 1–2 h; QA 10–30 m |
| Weekly | ~8 h 50 m (onebox, rails, carousels, ECHP, widgets) | A/B 1–3 h setup + 1–3 h run; new partnership page ~2 h |
| 2–3 weeks | ~6 h 20 m (hero, flexi-merch, a11y) | Redirects, homepage 1–2 h, partnership/T&C |
| Monthly | ~17 h 50 m (bespoke sets, offer changes) | New landing 1–2 h; season refresh 1–1.5 h |

Numbers are workshop estimates, not telemetry. Use them as relative weight, not as SLAs.

## Opportunities they already named (not a build list)

- Native targeting (unknown / known / ECHP).
- Centralized config, variables, bulk actions, reusable templates.
- Reduce / remove bespoke content pages; ATOM → template population.
- Full content-page states (pre / current / post).
- Simpler modelling for non-template layouts and experiments.
- Review end-to-end experimentation UX.
- More reliable Stable-int (prod dump / production-like data).
- Sports coverage depth on event pages.
- Plan Picker CTA override (the 25% manual-work item).

## Contrast checklist

Before calling a change done, answer:

- Does this reduce **repetition across pages** (bulk, CM, copy/paste, schedule)?
- Does this cut **asset prep** or **QA/publish risk**?
- Does this help **NOW multi-page** work, **Streamly homepage/experiments**, or both?
- Does this add chrome that authors did not ask for, while leaving a named pain untouched?
