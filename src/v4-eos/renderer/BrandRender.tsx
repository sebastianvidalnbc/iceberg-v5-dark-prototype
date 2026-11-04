import { useState } from "react";
import type {
  PreviewModel,
  PreviewCard,
  PreviewSection,
  PreviewItem,
} from "../previewModel";
import { CommerceWebButton } from "./components/CommerceWebButton";
import { widgetArtUrl } from "../widget-art";
// Dummy placeholder wordmark (stands in for the real brand logo).
import streamlyLogo from "./assets/streamly-wordmark.svg";
// Verified Commerce checkmark (44540:975, 24×24, green-500 #05AC3F).
import commerceCheck from "./assets/commerce-check.svg";

// Customer-facing brand render (Streamly), living INSIDE the preview iframe. It
// renders the WHOLE variant as a vertical stack of sections (like a Figma frame
// showing every element), NOT just the selected layer. Each selectable element
// carries a `data-node-id` so the CMS can (a) outline the selected node and
// (b) receive a Pick Section click that selects it. Styling inherits the real
// Streamly design system from brand.css (dark canvas, gold CTA, branded cards).

// Feature-bullet check — the VERIFIED Commerce checkmark asset (Notifications
// canvas 43369:459 → _Viewing Notification Icon → Type=Checkmark 44540:975,
// 24×24, glyph fill primitives/brand/green-500 #05AC3F). Real vector, not a
// hand-drawn glyph. NOTE: this is the notification success check (green) — the
// only verified check asset available; a plan-picker-specific feature icon is
// not yet verified, so its colour/style may change once that source arrives.
function Check() {
  return (
    <img
      className="ui-brand__check"
      src={commerceCheck}
      alt=""
      aria-hidden="true"
    />
  );
}

function BrandCard({
  card,
  selectedId,
  onPick,
}: {
  card: PreviewCard;
  selectedId: string | null;
  onPick: (nodeId: string) => void;
}) {
  return (
    <li className="ui-brand__card-li">
      <article
        className="ui-brand__card"
        data-node-id={card.id}
        data-featured={card.badge ? "true" : undefined}
        data-selected={card.id === selectedId ? "true" : undefined}
        onClick={(e) => {
          e.stopPropagation();
          onPick(card.id);
        }}
      >
        {card.badge ? <span className="ui-brand__badge">{card.badge}</span> : null}
        <div className="ui-brand__card-top">
          {/* Product Logo (schema "Product Logo") — the product/brand mark above
              the title. Rendered from the bundled Streamly wordmark asset when a
              logo is authored on the card. */}
          {card.logo ? (
            <img className="ui-brand__card-logo" src={streamlyLogo} alt="" />
          ) : null}
          <div className="ui-brand__card-head">
            {card.eyebrow ? (
              <p className="ui-brand__card-eyebrow">{card.eyebrow}</p>
            ) : null}
            <div className="ui-brand__card-title">
              <h3 className="ui-brand__name">{card.title}</h3>
            </div>
          </div>
          {card.description ? <p className="ui-brand__desc">{card.description}</p> : null}
          {card.features.length > 0 ? (
            <ul className="ui-brand__features">
              {card.features.map((f, i) => (
                <li
                  key={f.id ?? i}
                  data-node-id={f.id}
                  data-selected={f.id && f.id === selectedId ? "true" : undefined}
                  onClick={
                    f.id
                      ? (e) => {
                          e.stopPropagation();
                          onPick(f.id!);
                        }
                      : undefined
                  }
                >
                  <span className="ui-brand__feature-icon">
                    <Check />
                  </span>
                  <span className="ui-brand__feature-text">{f.text}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {card.price ||
        card.priceStrike ||
        card.priceSavings ||
        card.priceDetails ||
        card.cta ? (
          <div className="ui-brand__card-bottom">
            {/* [VERIFIED] IA pricing block (Plan Card 11051:8479): savings eyebrow
                → strikethrough + offer price + cadence → offer details, then the
                full-width WebButtonPrimary CTA. Each row renders only when the
                corresponding field is authored. */}
            {card.price ||
            card.priceStrike ||
            card.priceSavings ||
            card.priceDetails ? (
              <div className="ui-brand__pricing">
                {card.priceSavings ? (
                  <p className="ui-brand__price-savings">{card.priceSavings}</p>
                ) : null}
                {card.price || card.priceStrike ? (
                  <p className="ui-brand__price-row" aria-label={card.priceAria}>
                    {card.priceStrike ? (
                      <span className="ui-brand__price-strike">
                        {card.priceStrike}
                      </span>
                    ) : null}
                    {card.price ? (
                      <span className="ui-brand__price">{card.price}</span>
                    ) : null}
                    {(card.priceCadenceText ?? card.priceCadence) ? (
                      <span className="ui-brand__cadence">
                        {card.priceCadenceText ?? `/${card.priceCadence}`}
                      </span>
                    ) : null}
                  </p>
                ) : null}
                {card.priceDetails ? (
                  <p className="ui-brand__price-details">{card.priceDetails}</p>
                ) : null}
              </div>
            ) : null}
            {card.cta ? (
              <CommerceWebButton
                buttonType="primary"
                size="desktop"
                block
                href={card.ctaHref}
              >
                {card.cta}
              </CommerceWebButton>
            ) : null}
          </div>
        ) : null}
      </article>
      {/* [VERIFIED] Per-card legal (schema "Description - Legal" / "Legal
          Description") renders OUTSIDE and BELOW the card as fine print. */}
      {card.legal ? <p className="ui-brand__card-legal">{card.legal}</p> : null}
    </li>
  );
}

// The product-card grid.
function PlanCards({
  cards,
  selectedId,
  onPick,
}: {
  cards: PreviewCard[];
  selectedId: string | null;
  onPick: (nodeId: string) => void;
}) {
  return (
    <ol className="ui-brand__cards" data-count={cards.length}>
      {cards.map((card) => (
        <BrandCard key={card.id} card={card} selectedId={selectedId} onPick={onPick} />
      ))}
    </ol>
  );
}

// Plans / Bundles segmented toggle — shown when a plan picker has 2+ categories
// (the real Streamly category switcher). Switching swaps the rendered card set.
function Plans({
  section,
  selectedId,
  onPick,
}: {
  section: PreviewSection;
  selectedId: string | null;
  onPick: (nodeId: string) => void;
}) {
  const cats = section.categories;
  const [active, setActive] = useState(0);
  if (cats && cats.length > 1) {
    const idx = Math.min(active, cats.length - 1);
    const activeCards = cats[idx]?.cards ?? [];
    return (
      <>
        <div
          className="ui-brand__cat-toggle"
          role="tablist"
          aria-label="Categories"
          onClick={(e) => e.stopPropagation()}
        >
          {cats.map((c, i) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={i === idx}
              className="ui-brand__cat-tab"
              data-active={i === idx ? "true" : undefined}
              onClick={(e) => {
                e.stopPropagation();
                setActive(i);
              }}
            >
              {c.title}
            </button>
          ))}
        </div>
        {activeCards.length ? (
          <PlanCards cards={activeCards} selectedId={selectedId} onPick={onPick} />
        ) : (
          <p className="ui-brand__cat-empty">No plans in this category yet.</p>
        )}
      </>
    );
  }
  const cards = cats && cats.length === 1 ? cats[0].cards : section.cards;
  return cards.length ? (
    <PlanCards cards={cards} selectedId={selectedId} onPick={onPick} />
  ) : null;
}

// --- Non-plan-picker layout bodies (schematic, on-brand) -------------------

function Faq({ items }: { items: PreviewItem[] }) {
  return (
    <div className="ui-brand__faq">
      {items.map((it, i) => (
        <details key={i} className="ui-brand__faq-item" open={i === 0}>
          <summary>{it.title}</summary>
          {it.body ? <p>{it.body}</p> : null}
        </details>
      ))}
    </div>
  );
}

// An item with artwork: a poster (title + copy under the image) or a logo tile
// (the logo carries its own name, so no caption). Logos are the "logo-" files.
function ArtTile({ item }: { item: PreviewItem }) {
  const logo = /^logo-/.test(item.image ?? "");
  return (
    <figure className={logo ? "ui-brand__art ui-brand__art--logo" : "ui-brand__art"}>
      <img className="ui-brand__art-img" src={widgetArtUrl(item.image ?? "")} alt="" loading="lazy" />
      {!logo && item.title ? <figcaption className="ui-brand__tile-label">{item.title}</figcaption> : null}
      {!logo && item.body ? <span className="ui-brand__tile-sub">{item.body}</span> : null}
    </figure>
  );
}

function Rail({ items }: { items: PreviewItem[] }) {
  return (
    <div className="ui-brand__rail">
      {items.map((it, i) =>
        it.image ? (
          <ArtTile key={i} item={it} />
        ) : (
          <div key={i} className="ui-brand__tile ui-brand__tile--wide">
            <span className="ui-brand__tile-label">{it.title}</span>
            {it.body ? <span className="ui-brand__tile-sub">{it.body}</span> : null}
          </div>
        ),
      )}
    </div>
  );
}

function Grid({ items }: { items: PreviewItem[] }) {
  return (
    <div className="ui-brand__grid">
      {items.map((it, i) =>
        it.image ? (
          <ArtTile key={i} item={it} />
        ) : (
          <div key={i} className="ui-brand__tile">
            <span className="ui-brand__tile-label">{it.title}</span>
          </div>
        ),
      )}
    </div>
  );
}

function Comparison({ items }: { items: PreviewItem[] }) {
  return (
    <div className="ui-brand__compare">
      <div className="ui-brand__compare-head">
        <span />
        <span>Free</span>
        <span>Premium</span>
        <span>Premium+</span>
      </div>
      {items.map((it, i) => (
        <div key={i} className="ui-brand__compare-row">
          <span className="ui-brand__compare-feat">{it.title}</span>
          <span className="ui-brand__compare-cell" data-on={i > 0 ? undefined : "true"}>
            {i === 0 ? "✓" : "—"}
          </span>
          <span className="ui-brand__compare-cell" data-on="true">✓</span>
          <span className="ui-brand__compare-cell" data-on="true">✓</span>
        </div>
      ))}
    </div>
  );
}

function Footer({ items }: { items: PreviewItem[] }) {
  return (
    <div className="ui-brand__footcols">
      {items.map((it, i) => (
        <div key={i} className="ui-brand__footcol">
          <p className="ui-brand__footcol-h">{it.title}</p>
          {it.body ? <p className="ui-brand__footcol-b">{it.body}</p> : null}
        </div>
      ))}
    </div>
  );
}

function Steps({ items }: { items: PreviewItem[] }) {
  return (
    <div className="ui-brand__steps">
      {items.map((it, i) => (
        <div key={i} className="ui-brand__step">
          <span className="ui-brand__step-num">{i + 1}</span>
          <div>
            <p className="ui-brand__step-h">{it.title}</p>
            {it.body ? <p className="ui-brand__step-b">{it.body}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function Countdown() {
  const units = [
    { n: "02", l: "Days" },
    { n: "11", l: "Hrs" },
    { n: "45", l: "Min" },
    { n: "30", l: "Sec" },
  ];
  return (
    <div className="ui-brand__countdown">
      {units.map((u) => (
        <div key={u.l} className="ui-brand__count-unit">
          <span className="ui-brand__count-n">{u.n}</span>
          <span className="ui-brand__count-l">{u.l}</span>
        </div>
      ))}
    </div>
  );
}

function BrandSection({
  section,
  selectedId,
  onPick,
}: {
  section: PreviewSection;
  selectedId: string | null;
  onPick: (nodeId: string) => void;
}) {
  const { kind } = section;
  const showHeader = kind !== "footer";
  // Hero and banner take their background artwork, under a dark scrim so the
  // white copy and CTA stay readable. Light backgrounds keep the flat colour.
  const art =
    (kind === "hero" || kind === "banner") && section.background !== "light" && section.image
      ? section.image
      : undefined;
  return (
    <section
      className="ui-brand__section"
      data-kind={kind}
      data-bg={section.background}
      data-align={section.alignment}
      data-node-id={section.nodeId}
      data-selected={section.nodeId === selectedId ? "true" : undefined}
      data-art={art ? "true" : undefined}
      style={
        art
          ? {
              backgroundImage: `linear-gradient(90deg, rgba(8,8,14,0.85) 0%, rgba(8,8,14,0.45) 60%, rgba(8,8,14,0.15) 100%), url("${widgetArtUrl(art)}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
      onClick={() => onPick(section.nodeId)}
    >
      {showHeader && (section.eyebrow || section.title || section.subtitle) ? (
        <div className="ui-brand__head">
          {section.eyebrow ? (
            <p className="ui-brand__section-eyebrow">{section.eyebrow}</p>
          ) : null}
          {section.title ? <h2 className="ui-brand__title">{section.title}</h2> : null}
          {section.subtitle ? (
            <p className="ui-brand__subtitle">{section.subtitle}</p>
          ) : null}
        </div>
      ) : null}

      {kind === "plans" ? (
        <Plans section={section} selectedId={selectedId} onPick={onPick} />
      ) : null}

      {kind === "hero" ? (
        <div className="ui-brand__hero-cta">
          <CommerceWebButton buttonType="primary" size="desktop" href={section.ctaHref}>
            {section.cta ?? "Get Started"}
          </CommerceWebButton>
        </div>
      ) : null}

      {kind === "banner" ? (
        <div className="ui-brand__banner-cta">
          <CommerceWebButton buttonType="primary" size="desktop" href={section.ctaHref}>
            {section.cta ?? "Learn more"}
          </CommerceWebButton>
        </div>
      ) : null}

      {kind === "faq" ? <Faq items={section.items} /> : null}
      {kind === "rail" ? <Rail items={section.items} /> : null}
      {kind === "grid" ? <Grid items={section.items} /> : null}
      {kind === "comparison" ? <Comparison items={section.items} /> : null}
      {kind === "footer" ? <Footer items={section.items} /> : null}
      {kind === "steps" ? <Steps items={section.items} /> : null}
      {kind === "countdown" ? <Countdown /> : null}

      {kind === "message" && section.message ? (
        <div className="ui-brand__message">{section.message}</div>
      ) : null}

      {section.disclaimer ? (
        <p className="ui-brand__disclaimer">{section.disclaimer}</p>
      ) : null}
    </section>
  );
}

export function BrandRender({
  model,
  selectedId,
  pickMode,
  onPick,
}: {
  model: PreviewModel;
  selectedId: string | null;
  pickMode: boolean;
  onPick: (nodeId: string) => void;
}) {
  return (
    <div className="ui-brand" data-pick={pickMode ? "true" : undefined}>
      <header className="ui-brand__header">
        <img className="ui-brand__logo-img" src={streamlyLogo} alt="Streamly" />
        <div className="ui-brand__nav">
          <CommerceWebButton buttonType="secondary" size="compact">
            Sign In
          </CommerceWebButton>
          <CommerceWebButton buttonType="primary" size="compact">
            Get Started
          </CommerceWebButton>
        </div>
      </header>

      {model.sections.map((section) => (
        <BrandSection
          key={section.nodeId}
          section={section}
          selectedId={selectedId}
          onPick={onPick}
        />
      ))}

      {model.sections.length === 0 ? (
        <div className="ui-brand__empty">Select a variant to preview the page.</div>
      ) : null}
    </div>
  );
}
