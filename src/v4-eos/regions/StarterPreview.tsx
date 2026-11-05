import { MSym } from "@/v4-eos/ui/msym";
import { getLayoutDef } from "../layouts";
import { LAYOUT_TYPES, layoutTypeOf, type LayoutTypeId } from "../layout-identity";
import type { StarterStep, StarterTemplate } from "../starter-templates";

// Streamly-style preview of a starter template, measured from streamlytv.com
// (Home, Sports, Movies collection, Channels): black page, white type, yellow
// CTAs, purple promo band, dark tiles and rows, full-bleed sections with 5%
// side insets, and a dark multi-column footer. Literal values on purpose: this
// is Streamly styling, so no Eos tokens here (AGENTS.md renderer isolation).
const PK = {
  page: "#000000",
  surface: "#1d1e20",
  surfaceHi: "#2a2c2f",
  text: "#ffffff",
  muted: "#b3b3b3",
  cta: "#fccc12",
  ctaText: "#000000",
  promo: "#400094",
  live: "#ff3b3b",
  line: "rgba(255,255,255,0.12)",
};

const FONT = '"Streamly Sans", Helvetica, Arial, sans-serif';

type Section =
  | "nav"
  | "hero"
  | "rail"
  | "live"
  | "grid"
  | "logos"
  | "rows"
  | "plans"
  | "banner"
  | "text"
  | "faq"
  | "footer"
  | "custom";

const SECTION_BY_LAYOUT: Record<string, Section> = {
  hero: "hero",
  "key-art-synopsis": "hero",
  carousel: "rail",
  "content-promotional-rail": "rail",
  highlights: "rail",
  "sle-carousel": "live",
  "filtered-grid": "grid",
  "content-grid": "grid",
  "cast-layout": "grid",
  "logo-grid": "logos",
  "channels-guide": "rows",
  "sports-fixture": "rows",
  "seasons-episodes": "rows",
  "comparison-table": "plans",
  banner: "banner",
  "content-banner": "banner",
  countdown: "banner",
  "seo-footer": "footer",
  "sub-navigation": "nav",
  faqs: "faq",
  usp: "text",
  "text-tcs": "text",
  "what-is": "text",
};

function sectionOf(step: StarterStep): Section {
  if (step.layoutId) return SECTION_BY_LAYOUT[step.layoutId] ?? "text";
  if (/navigation/i.test(step.label)) return "nav";
  return "custom";
}

// Skeleton line for body copy and captions. Text labels are used for titles.
function Line({ className = "" }: { className?: string }) {
  return <span className={`block h-1.5 rounded-[2px] bg-white/20 ${className}`} />;
}

// Module name as a Streamly-style section title.
function SectionTitle({ children }: { children: string }) {
  return (
    <h4 className="text-[13px] leading-[17px] font-bold" style={{ color: PK.text }}>
      {children}
    </h4>
  );
}

// Small tag with the widget name, in the layout type's colour.
function WidgetTag({ step, type }: { step: StarterStep; type: LayoutTypeId | null }) {
  const def = step.layoutId ? getLayoutDef(step.layoutId) : undefined;
  if (!def && !step.widgetSlug) return null;
  return (
    <span
      className="absolute right-[5%] top-3 z-10 flex items-center gap-1 rounded-[3px] px-1.5 py-0.5 text-[9px] font-semibold leading-[12px]"
      style={{ background: PK.surface, color: PK.text, border: `1px solid ${type ? `var(--layout-${type})` : PK.line}` }}
    >
      <MSym name={type ? LAYOUT_TYPES[type].icon : "widgets"} size={11} />
      {def ? `${def.name} widget` : `${step.widgetSlug} widget`}
    </span>
  );
}

function Tile({ aspect = "aspect-video", live = false }: { aspect?: string; live?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={`relative ${aspect} rounded-[6px]`}
        style={{ background: `linear-gradient(160deg, ${PK.surfaceHi}, ${PK.surface})` }}
      >
        {live && (
          <span
            className="absolute left-1.5 top-1.5 rounded-[2px] px-1 text-[8px] font-bold leading-[12px] text-white"
            style={{ background: PK.live }}
          >
            LIVE
          </span>
        )}
      </div>
      <Line className="w-4/5" />
    </div>
  );
}

function SectionBody({ kind, step }: { kind: Section; step: StarterStep }) {
  switch (kind) {
    case "nav":
      return (
        <div className="flex h-10 items-center gap-3 px-[5%] pr-[150px]">
          <span className="text-[13px] font-extrabold tracking-tight" style={{ color: PK.text }}>
            streamly
          </span>
          {[0, 1, 2, 3, 4].map((i) => (
            <Line key={i} className="h-1.5 w-7 bg-white/60" />
          ))}
          <span
            className="ml-auto rounded-[100px] px-2.5 py-1 text-[9px] font-semibold text-white"
            style={{ background: "rgba(50,53,56,0.64)" }}
          >
            Sign In
          </span>
        </div>
      );
    case "hero":
      return (
        <div
          className="relative flex h-[210px] flex-col justify-end gap-2 px-[5%] pb-6"
          style={{ background: `linear-gradient(180deg, rgba(0,0,0,0) 30%, ${PK.page}), linear-gradient(120deg, #27455c, #3a1b6b 60%, ${PK.page})` }}
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.08em]" style={{ color: PK.cta }}>
            {step.label}
          </span>
          <Line className="h-3 w-2/5 bg-white/90" />
          <Line className="h-3 w-1/4 bg-white/90" />
          <Line className="mt-1 h-1.5 w-1/3 bg-white/45" />
          <span
            className="mt-2 inline-flex h-7 w-24 items-center justify-center rounded-[100px] text-[10px] font-bold"
            style={{ background: PK.cta, color: PK.ctaText }}
          >
            Get started
          </span>
        </div>
      );
    case "rail":
      return (
        <div className="flex flex-col gap-3 px-[5%] py-5">
          <SectionTitle>{step.label}</SectionTitle>
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <Tile key={i} />
            ))}
          </div>
        </div>
      );
    case "live":
      return (
        <div className="flex flex-col gap-3 px-[5%] py-5">
          <SectionTitle>{step.label}</SectionTitle>
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <Tile key={i} aspect="aspect-[16/10]" live={i === 0} />
            ))}
          </div>
        </div>
      );
    case "grid":
      return (
        <div className="flex flex-col gap-3 px-[5%] py-5">
          <SectionTitle>{step.label}</SectionTitle>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <Tile key={i} aspect="aspect-[2/3]" />
            ))}
          </div>
        </div>
      );
    case "logos":
      return (
        <div className="flex flex-col gap-3 px-[5%] py-6 text-center">
          <SectionTitle>{step.label}</SectionTitle>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="flex h-9 items-center justify-center rounded-[6px]"
                style={{ background: PK.surface }}
              >
                <Line className="w-1/2" />
              </div>
            ))}
          </div>
        </div>
      );
    case "rows":
      return (
        <div className="flex flex-col gap-2 px-[5%] py-5">
          <SectionTitle>{step.label}</SectionTitle>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-[6px] px-3 py-2"
              style={{ background: PK.surface }}
            >
              <span className="text-[9px] font-semibold" style={{ color: PK.muted }}>
                {i === 0 ? "Now" : "8:00 PM"}
              </span>
              <div className="flex flex-1 flex-col gap-1.5">
                <Line className="h-2 w-1/2 bg-white/70" />
                <Line className="w-1/3" />
              </div>
              {i === 0 && (
                <span
                  className="rounded-[2px] px-1 text-[8px] font-bold leading-[12px] text-white"
                  style={{ background: PK.live }}
                >
                  LIVE
                </span>
              )}
            </div>
          ))}
        </div>
      );
    case "plans":
      return (
        <div className="flex flex-col items-center gap-3 px-[5%] py-6">
          <h4 className="text-[14px] font-bold" style={{ color: PK.text }}>
            {step.label}
          </h4>
          <div className="grid w-full grid-cols-2 gap-3">
            {["Premium", "Premium Plus"].map((name) => (
              <div key={name} className="flex flex-col gap-2 rounded-[12px] bg-white p-3">
                <span className="text-[11px] font-bold text-black">{name}</span>
                <div className="flex flex-col gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <MSym name="check" size={10} />
                      <span className="block h-1 w-3/4 rounded-[2px] bg-black/25" />
                    </div>
                  ))}
                </div>
                <span
                  className="mt-1 inline-flex h-6 items-center justify-center rounded-[100px] text-[9px] font-bold"
                  style={{ background: PK.cta, color: PK.ctaText }}
                >
                  Select plan
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    case "banner":
      return (
        <div className="flex items-center gap-4 px-[5%] py-4" style={{ background: PK.promo }}>
          <div className="flex flex-1 flex-col gap-1.5">
            <Line className="h-2.5 w-2/5 bg-white/90" />
            <Line className="h-1.5 w-3/5 bg-white/50" />
          </div>
          <span
            className="inline-flex h-7 items-center rounded-[100px] px-3 text-[10px] font-bold"
            style={{ background: PK.cta, color: PK.ctaText }}
          >
            Learn more
          </span>
        </div>
      );
    case "text":
      return (
        <div className="flex flex-col gap-2 px-[5%] py-5">
          <SectionTitle>{step.label}</SectionTitle>
          <Line className="w-full bg-white/25" />
          <Line className="w-11/12 bg-white/25" />
          <Line className="w-2/3 bg-white/25" />
        </div>
      );
    case "faq":
      return (
        <div className="flex flex-col gap-1.5 px-[5%] py-5">
          <SectionTitle>{step.label}</SectionTitle>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-[4px] px-3 py-2.5"
              style={{ background: PK.surface }}
            >
              <Line className="h-2 w-2/5 bg-white/75" />
              <MSym name="add" size={14} />
            </div>
          ))}
        </div>
      );
    case "footer":
      return (
        <div className="flex flex-col gap-4 px-[5%] py-6" style={{ borderTop: `1px solid ${PK.line}` }}>
          <div className="grid grid-cols-6 gap-3">
            {[0, 1, 2, 3, 4, 5].map((col) => (
              <div key={col} className="flex flex-col gap-2">
                <Line className="h-1.5 w-2/3 bg-white/70" />
                <Line className="h-1 w-full bg-white/30" />
                <Line className="h-1 w-5/6 bg-white/30" />
                <Line className="h-1 w-3/4 bg-white/30" />
              </div>
            ))}
          </div>
          <Line className="h-1 w-1/2 bg-white/25" />
        </div>
      );
    case "custom":
      return (
        <div
          className="mx-[5%] my-4 flex h-14 items-center justify-center rounded-[6px] border border-dashed text-[10px]"
          style={{ borderColor: "rgba(255,255,255,0.25)", color: PK.muted }}
        >
          {step.label}
        </div>
      );
  }
}

function ModuleSection({ step }: { step: StarterStep }) {
  const def = step.layoutId ? getLayoutDef(step.layoutId) : undefined;
  const type = def ? layoutTypeOf(def) : null;
  const kind = sectionOf(step);
  return (
    <section className="relative" style={{ background: PK.page, borderTop: `1px solid ${PK.line}` }}>
      <WidgetTag step={step} type={type} />
      <SectionBody kind={kind} step={step} />
    </section>
  );
}

// Right-hand pane: a Streamly-style page for the selected template. The address
// bar shows the slug typed in the Name field.
export function StarterPreview({
  template,
  slug,
}: {
  template: StarterTemplate | null;
  slug: string;
}) {
  const url = `streamlytv.com${slug || "/new-page"}`;
  return (
    <div className="flex flex-col gap-3 px-8 py-5">
      <div>
        <h3 className="text-[length:var(--type-title-md-size)] leading-[length:var(--type-title-md-lh)] font-semibold text-foreground">
          {template ? template.name : "Blank page"}
        </h3>
        <p className="text-[length:var(--type-body-sm-size)] leading-[length:var(--type-body-sm-lh)] text-[var(--color-text-secondary)]">
          {template ? `${template.steps.length} modules, top to bottom` : "No modules yet"}
        </p>
      </div>
      <div className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] shadow-[var(--elevation-1)]">
        <div className="flex items-center gap-2 border-b border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] px-3 py-2">
          <MSym name="lock" size={12} />
          <span className="min-w-0 flex-1 truncate rounded-[var(--radius-pill)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] px-3 py-0.5 text-[length:var(--type-label-md-size)] leading-[length:var(--type-label-md-lh)] text-[var(--color-text-secondary)]">
            {url}
          </span>
        </div>
        <div style={{ background: PK.page, color: PK.text, fontFamily: FONT }}>
          {template ? (
            template.steps.map((s, i) => <ModuleSection key={`${s.label}-${i}`} step={s} />)
          ) : (
            <div className="grid h-[300px] place-items-center p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <MSym name="note_add" size={28} />
                <p className="text-[13px] leading-[18px]" style={{ color: PK.muted }}>
                  This page starts empty. Add layouts from the editor once it is created.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
