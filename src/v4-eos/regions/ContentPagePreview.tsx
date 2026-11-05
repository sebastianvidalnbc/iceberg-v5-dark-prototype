import "./content-page-preview.css";
import { SelectField } from "@/v4-eos/ui/form-controls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/v4-eos/ui/select";
import { AtomPoster, posterWash } from "./AtomPoster";
import {
  ATOM_TITLES,
  interpolate,
  passByType,
  type AtomTitle,
  type ContentPageConfig,
  type PassType,
} from "../contentPages";

const PASS_OPTIONS: { label: string; value: PassType }[] = [
  { label: "Select", value: "select" },
  { label: "Premium", value: "premium" },
  { label: "BRANDY", value: "brandy" },
  { label: "Free", value: "free" },
];

function Recs({ label }: { label: string }) {
  return (
    <section>
      <h2 className="cp-preview__sub">{label}</h2>
      <div className="cp-preview__grid">
        {["One", "Two", "Three", "Four"].map((n) => (
          <div key={n} className="cp-preview__tile">
            <span>{label} {n}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TitlePage({
  title,
  config,
  passType,
}: {
  title: AtomTitle;
  config: ContentPageConfig;
  passType: PassType;
}) {
  const pass = passByType(config, passType);
  const about =
    title.kind === "movie" ? config.i18n.aboutMovie : config.i18n.aboutSeries;
  const sub =
    title.kind === "movie"
      ? interpolate(config.i18n.movieSubheading, title.title)
      : interpolate(config.i18n.showSubheading, title.title);
  const faqTitle = config.enableCustomFaq && pass.customFaqTitle
    ? pass.customFaqTitle
    : config.i18n.faqTitle;
  const meta = [
    title.year,
    title.rating,
    title.runtime,
    title.seasons ? `${title.seasons} seasons` : null,
  ].filter(Boolean);

  if (!config.enabled) {
    return (
      <div className="cp-preview__off">
        <div>
          <h1 className="cp-preview__title" style={{ fontSize: 32 }}>
            Content pages off
          </h1>
          <p>This territory template is disabled. ATOM titles will not use it.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="cp-preview__nav">
        <span className="cp-preview__wordmark">streamly</span>
        <button type="button" className="cp-preview__nav-cta" tabIndex={-1}>
          Sign in
        </button>
      </header>
      <section
        className="cp-preview__hero"
        style={{
          background: `linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.82) 100%), radial-gradient(120% 80% at 80% 10%, ${posterWash(title.poster)} 0%, #000000 55%)`,
        }}
      >
        <div className="cp-preview__hero-copy">
          <p className="cp-preview__kicker">
            {title.kind === "episode" ? "Episode" : title.genre}
          </p>
          <h1 className="cp-preview__title">{title.title}</h1>
          <p className="cp-preview__meta">{meta.join(" · ")}</p>
          <p className="cp-preview__synopsis">{title.synopsis}</p>
          <div className="cp-preview__actions">
            <button type="button" className="cp-preview__btn cp-preview__btn--primary" tabIndex={-1}>
              {pass.ctaLabel || config.i18n.watch}
            </button>
            <button type="button" className="cp-preview__btn cp-preview__btn--ghost" tabIndex={-1}>
              {config.i18n.details}
            </button>
          </div>
          {config.legal && <p className="cp-preview__legal">{config.legal}</p>}
        </div>
        <AtomPoster
          poster={title.poster}
          title={title.title}
          size={200}
          className="cp-preview__poster"
        />
      </section>
      <p className="cp-preview__crumbs">
        {pass.breadcrumbLabel || "Home"}
        {" / "}
        <strong>{title.title}</strong>
      </p>
      <div className="cp-preview__body">
        <h2 className="cp-preview__sub">{sub}</h2>
        {title.kind !== "movie" && (
          <div className="cp-preview__tabs" aria-hidden>
            <span className="cp-preview__tab cp-preview__tab--on">Episodes</span>
            <span className="cp-preview__tab">{config.i18n.details}</span>
          </div>
        )}
        {title.kind !== "movie" && (
          <div className="cp-preview__grid">
            {["S1 E1", "S1 E2", "S1 E3", "S1 E4"].map((ep) => (
              <div key={ep} className="cp-preview__tile">
                <span>{ep}</span>
              </div>
            ))}
          </div>
        )}
        <section>
          <h2 className="cp-preview__sub">{about}</h2>
          <p className="cp-preview__synopsis">{title.synopsis}</p>
        </section>
        <Recs label="Because you watched this" />
        {config.whatIsWidget && (
          <div className="cp-preview__widget">
            <strong>What Is</strong>
            <span>{config.whatIsWidget}</span>
          </div>
        )}
        <section className="cp-preview__faq">
          <h3>{faqTitle}</h3>
          <details open>
            <summary>How can I watch {title.title}?</summary>
            <p>
              {pass.ctaLabel} on Streamly with a {pass.title} plan.
              {config.filterRecommendedCarousel
                ? " Recommendations are filtered to this pass."
                : ""}
            </p>
          </details>
          <details>
            <summary>Where can I watch {title.title}?</summary>
            <p>Stream on streamlytv.com or the Streamly app.</p>
          </details>
        </section>
      </div>
    </>
  );
}

function AtomTitleField({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (id: string) => void;
}) {
  const current = ATOM_TITLES.find((t) => t.id === value) ?? ATOM_TITLES[0];
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        size="sm"
        aria-label="ATOM title"
        className="h-8 min-w-[220px] gap-2 rounded-sm bg-[var(--color-bg-subtle)] px-2 text-[length:var(--type-body-sm-size)] leading-[length:var(--type-body-sm-lh)] [&_svg]:size-auto"
      >
        <span className="flex min-w-0 items-center gap-2">
          <AtomPoster poster={current.poster} title={current.title} size={32} />
          <span className="truncate">{current.title}</span>
        </span>
      </SelectTrigger>
      <SelectContent align="end" position="popper" className="min-w-[360px] p-1">
        {ATOM_TITLES.map((t) => (
          <SelectItem
            key={t.id}
            value={t.id}
            className="h-auto items-start py-2 pr-9 text-[length:var(--type-body-sm-size)] leading-[length:var(--type-body-sm-lh)] [&_svg]:size-auto"
          >
            <span className="flex items-center gap-3">
              <AtomPoster poster={t.poster} title={t.title} size={112} />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate font-medium">{t.title}</span>
                <span className="text-[var(--color-text-muted)]">
                  {t.kind === "episode" ? "Episode" : t.kind === "movie" ? "Movie" : "Series"}
                  {" · "}
                  {t.year}
                </span>
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ContentPagePreview({
  title,
  config,
  passType,
  atomId,
  onAtomChange,
  onPassChange,
}: {
  title: AtomTitle;
  config: ContentPageConfig;
  passType: PassType;
  atomId: string;
  onAtomChange: (id: string) => void;
  onPassChange: (type: PassType) => void;
}) {
  return (
    <section className="ui-ws__region ui-ws-preview" aria-label="Live preview">
      <div className="flex shrink-0 items-center gap-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2">
        <span className="text-[length:var(--type-label-md-size)] leading-[length:var(--type-label-md-lh)] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
          Preview
        </span>
        <div className="ml-auto flex min-w-0 items-center gap-2">
          <AtomTitleField value={atomId} onValueChange={onAtomChange} />
          <SelectField
            aria-label="Membership pass"
            value={passType}
            onValueChange={(v) => onPassChange(v as PassType)}
            options={PASS_OPTIONS}
          />
        </div>
      </div>
      <div className="ui-ws-preview__inner min-h-0 flex-1 overflow-auto bg-black">
        <div className="cp-preview">
          <TitlePage title={title} config={config} passType={passType} />
        </div>
      </div>
      <p className="shrink-0 truncate border-t border-[var(--color-border-subtle)] px-3 py-1.5 font-mono text-[length:var(--type-body-sm-size)] leading-[length:var(--type-body-sm-lh)] text-[var(--color-text-muted)]">
        {title.slug}
      </p>
    </section>
  );
}
