import type { ReactNode } from "react";
import { Panel } from "@/v4-eos/ui/panel";
import {
  InspectorBody,
  InspectorStickyHead,
  InspectorHeader,
  inspectorType,
  ListAccessory,
  ListItem,
  PropertyRow,
  PropertyRows,
} from "@/v4-eos/ui/property";
import {
  SelectField,
  TextField,
  TextAreaField,
  SwitchField,
} from "@/v4-eos/ui/form-controls";
import { Button } from "@/v4-eos/ui/button";
import { MSym } from "@/v4-eos/ui/msym";
import { WIDGETS_TREE } from "../data";
import {
  outlineLabel,
  passByType,
  type ContentPageConfig,
  type ContentPageFaqAnswer,
  type ContentPageI18n,
  type OutlineGroupId,
  type PassConfig,
  type PassType,
} from "../contentPages";

const CONTENT_PAGE_WIDGET_OPTIONS = Array.from(
  new Set([
    ...WIDGETS_TREE.map((widget) => widget.label.replace(/^\//, "")),
    "sticky-banner-widget-data",
    "footer-nav",
  ]),
);

type StringKeyOf<T> = {
  [Key in keyof T]: T[Key] extends string ? Key : never;
}[keyof T];

const COMMON_WORD_FIELDS: Array<{
  key: StringKeyOf<ContentPageI18n>;
  label: string;
}> = [
  { key: "watch", label: "Watch" },
  { key: "details", label: "Details" },
  { key: "aboutSeries", label: "About this Series" },
  { key: "aboutEpisode", label: "About this Episode" },
  { key: "aboutMovie", label: "About this Movie" },
  { key: "ratings", label: "Ratings" },
  { key: "cast", label: "Cast" },
  { key: "crew", label: "Crew" },
  { key: "director", label: "Director" },
  { key: "producer", label: "Producer" },
  { key: "genre", label: "Genre" },
  { key: "studio", label: "Studio" },
  { key: "releaseDate", label: "Release Date" },
  { key: "runtime", label: "Runtime" },
  { key: "streaming", label: "Streaming" },
  { key: "comingSoon", label: "Coming Soon" },
  { key: "unavailable", label: "Unavailable" },
  { key: "comingSoonLabel", label: "Coming Soon Label" },
  { key: "streamingUntil", label: "Streaming Until" },
  { key: "season", label: "Season" },
  { key: "seasons", label: "Seasons" },
  { key: "episode", label: "Episode" },
  { key: "episodes", label: "Episodes" },
  { key: "seasonSymbol", label: "Season Symbol" },
  { key: "episodeSymbol", label: "Episode Symbol" },
  { key: "minuteSymbol", label: "Minute Symbol" },
  { key: "series", label: "Series" },
  { key: "movies", label: "Movies" },
  { key: "getPremium", label: "Get premium" },
  { key: "mins", label: "Mins" },
  { key: "viewAll", label: "View all" },
  { key: "audioDescribedAltText", label: "Audio Described Alt Text" },
  { key: "closedCaptionedAltText", label: "Closed Captioned Alt Text" },
  { key: "dolbyVisionAltText", label: "Dolby Vision Alt Text" },
  { key: "showMoreText", label: '"Show More" Text' },
  { key: "showFewerText", label: '"Show Fewer" Text' },
  { key: "selectSeasonLabel", label: "Select Season Label" },
];

const HERO_COPY_FIELDS: Array<{
  key: StringKeyOf<ContentPageI18n>;
  label: string;
}> = [
  { key: "heroButtonAria", label: "Hero Button Aria" },
  { key: "heroCriticsAria", label: "Hero Critics Aria" },
  { key: "heroFanAria", label: "Hero Fan Aria" },
  {
    key: "heroDescriptionReadMore",
    label: "Hero Description read more",
  },
  {
    key: "heroDescriptionReadLess",
    label: "Hero Description read less",
  },
];

const META_COPY_FIELDS: Array<{
  key: StringKeyOf<ContentPageI18n>;
  label: string;
  help?: string;
}> = [
  {
    key: "seriesMetadataTitle",
    label: "Series Metadata Title",
    help: "Text box should contain the following variables in this format {{title}}",
  },
  {
    key: "seriesMetadataTitleFallback",
    label: "Series Metadata Title Fallback",
  },
  {
    key: "seasonMetadataTitle",
    label: "Season Metadata Title",
    help: "Text box should contain the following variables in this format {{title}}, {{season}}",
  },
  {
    key: "seasonMetadataTitleFallback",
    label: "Season Metadata Title Fallback",
  },
  {
    key: "programmeMetadataTitle",
    label: "Programme Metadata Title",
    help: "Text box should contain the following variables in this format {{title}}",
  },
  {
    key: "programmeMetadataTitleFallback",
    label: "Programme Metadata Title Fallback",
  },
  {
    key: "episodeMetadataTitle",
    label: "Episode Metadata Title",
    help: "Text box should contain the following variables in this format {{title}}, {{seasonNumber}}, {{episodeNumber}}, {{episodeName}}",
  },
  {
    key: "episodeMetadataTitleFallback",
    label: "Episode Metadata Title Fallback",
  },
  {
    key: "episodeMetadataDescription",
    label: "Episode Metadata Description",
    help: "Text box should contain the following variables in this format {{title}}, {{seasonNumber}}, {{episodeNumber}}, {{episodeName}}",
  },
  {
    key: "episodeMetadataDescriptionFallback",
    label: "Episode Metadata Description Fallback",
  },
  {
    key: "episodeMetadataKeywords",
    label: "Episode Metadata Keywords",
    help: "Text box should contain the following variables in this format {{title}}, {{seasonNumber}}, {{episodeNumber}}, {{episodeName}}",
  },
  {
    key: "episodeMetadataOgTitle",
    label: "Episode Metadata og:title",
    help: "Text box should contain the following variables in this format {{title}}, {{seasonNumber}}, {{episodeNumber}}, {{episodeName}}",
  },
];

const FAQ_ANSWER_FIELDS: Array<{
  key: keyof ContentPageFaqAnswer;
  label: string;
}> = [
  { key: "textBeginning", label: "Text beginning" },
  { key: "afterTitleText", label: "After Title text" },
  { key: "urlText", label: "Url text" },
  { key: "textEnd", label: "Text end" },
];

function Field({
  id,
  label,
  value,
  onChange,
  required,
  stacked,
  compact,
  help,
}: {
  id: string;
  label: ReactNode;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  stacked?: boolean;
  compact?: boolean;
  help?: string;
}) {
  const invalid = Boolean(required && !value.trim());
  const control = stacked ? (
    <TextAreaField
      id={id}
      value={value}
      invalid={invalid}
      required={required}
      className={
        compact
          ? "h-[var(--control-height-md)] min-h-[var(--control-height-md)] max-h-[var(--control-height-md)] resize-none overflow-y-auto"
          : undefined
      }
      onChange={(e) => onChange(e.target.value)}
    />
  ) : (
    <TextField
      id={id}
      value={value}
      invalid={invalid}
      required={required}
      onChange={(e) => onChange(e.target.value)}
    />
  );

  return (
    <PropertyRow label={label} htmlFor={id} required={required} help={help}>
      {control}
    </PropertyRow>
  );
}

function FaqAnswerGroup({
  id,
  title,
  answer,
  help,
  onChange,
}: {
  id: string;
  title: string;
  answer: ContentPageFaqAnswer;
  help?: string;
  onChange: (answer: ContentPageFaqAnswer) => void;
}) {
  return (
    <fieldset className="min-w-0 border-t border-[var(--color-border-subtle)] pt-2">
      <legend
        className={`mx-[var(--inspector-pad-x)] inline-flex items-center gap-1 ${inspectorType.section}`}
      >
        {title}
        <span title={help}>
          <MSym name="info" size={14} />
        </span>
      </legend>
      {FAQ_ANSWER_FIELDS.map(({ key, label }) => (
        <Field
          key={key}
          id={`${id}-${key}`}
          label={label}
          value={answer[key]}
          stacked
          compact
          onChange={(value) => onChange({ ...answer, [key]: value })}
        />
      ))}
    </fieldset>
  );
}

function ReferenceSelector({
  id,
  label,
  value,
  onChange,
  options = CONTENT_PAGE_WIDGET_OPTIONS,
  showRefresh = true,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  showRefresh?: boolean;
}) {
  return (
    <PropertyRow label={label} htmlFor={id}>
      <div className="flex min-w-0 items-center gap-1">
        <SelectField
          id={id}
          value={value}
          options={options}
          placeholder="Select…"
          triggerClassName="min-w-0 flex-1"
          onValueChange={onChange}
          polished
          emptyOption
        />
        {showRefresh && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled
            aria-label={`Refresh ${label} options`}
            title="Refresh behavior requires production verification"
            className="size-[var(--control-height-md)]"
          >
            <MSym name="refresh" size={16} />
          </Button>
        )}
      </div>
    </PropertyRow>
  );
}

function Toggle({
  id,
  label,
  checked,
  onChange,
  help,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  help?: string;
}) {
  const helpId = help ? `${id}-help` : undefined;
  return (
    <ListItem
      primary={label}
      labelFor={id}
      secondary={help}
      secondaryId={helpId}
      trailing={
        <ListAccessory type="switch">
          <SwitchField id={id} checked={checked} onCheckedChange={onChange} aria-describedby={helpId} />
        </ListAccessory>
      }
    />
  );
}

export function ContentPageProperties({
  group,
  config,
  created,
  modified,
  editedBy,
  onPatch,
  onPatchPass,
}: {
  group: OutlineGroupId;
  config: ContentPageConfig;
  created: string;
  modified: string;
  editedBy: string;
  onPatch: (patch: Partial<ContentPageConfig>) => void;
  onPatchPass: (type: PassType, patch: Partial<PassConfig>) => void;
}) {
  const passType =
    group.startsWith("pass-") ? (group.slice(5) as PassType) : null;
  const pass = passType ? passByType(config, passType) : null;

  const title = outlineLabel(group);
  return (
    <Panel className="ui-ws__region ui-ws-props" aria-label="Properties">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <InspectorBody>
          <InspectorStickyHead>
            <InspectorHeader title={title} />
          </InspectorStickyHead>
          <PropertyRows>
            {group === "overview" && (
              <>
                <ListItem primary="Created date" secondary={created} />
                <ListItem primary="Last modified date" secondary={modified} />
                <ListItem primary="Last modified by" secondary={editedBy} />
              </>
            )}

            {group === "memberships" && (
              <PropertyRow label="Passes" help="Select a pass in the outline to edit it.">
                <p className={inspectorType.value}>
                  Select, Premium / Premium Plus, STARZ, and Free. Free is
                  feature-flagged in production.
                </p>
              </PropertyRow>
            )}

            {group === "filter-recommended" && (
              <Toggle
                id="filter-recommended-carousel"
                label="Enable filter"
                checked={config.filterRecommendedCarousel}
                onChange={(value) =>
                  onPatch({ filterRecommendedCarousel: value })
                }
              />
            )}

            {group === "faq-override" && (
              <Toggle
                id="enable-custom-faq"
                label="Enable Custom FAQ"
                checked={config.enableCustomFaq}
                onChange={(value) => onPatch({ enableCustomFaq: value })}
              />
            )}

            {pass && passType && passType !== "free" && (
              <>
                <PropertyRow label="CTA label" htmlFor={`${passType}-cta`}>
                  <TextField
                    id={`${passType}-cta`}
                    value={pass.ctaLabel}
                    onChange={(event) =>
                      onPatchPass(passType, { ctaLabel: event.target.value })
                    }
                  />
                </PropertyRow>
                <PropertyRow
                  label="Upcoming CTA label"
                  htmlFor={`${passType}-upcoming`}
                >
                  <TextField
                    id={`${passType}-upcoming`}
                    value={pass.upcomingCtaLabel}
                    onChange={(event) =>
                      onPatchPass(passType, {
                        upcomingCtaLabel: event.target.value,
                      })
                    }
                  />
                </PropertyRow>
                <PropertyRow
                  label={
                    <span className="inline-flex items-center gap-1">
                      CTA url (Required)
                      <MSym name="info" size={14} />
                    </span>
                  }
                  htmlFor={`${passType}-cta-url`}
                >
                  <TextField
                    id={`${passType}-cta-url`}
                    required
                    value={pass.ctaUrl}
                    onChange={(event) =>
                      onPatchPass(passType, { ctaUrl: event.target.value })
                    }
                  />
                </PropertyRow>
                <PropertyRow
                  label="Breadcrumb Label (optional)"
                  htmlFor={`${passType}-breadcrumb-label`}
                >
                  <TextField
                    id={`${passType}-breadcrumb-label`}
                    value={pass.breadcrumbLabel}
                    onChange={(event) =>
                      onPatchPass(passType, {
                        breadcrumbLabel: event.target.value,
                      })
                    }
                  />
                </PropertyRow>
                <PropertyRow
                  label={
                    <span className="inline-flex items-center gap-1">
                      Breadcrumb URL (optional)
                      <MSym name="info" size={14} />
                    </span>
                  }
                  htmlFor={`${passType}-breadcrumb-url`}
                >
                  <TextField
                    id={`${passType}-breadcrumb-url`}
                    value={pass.breadcrumbUrl}
                    onChange={(event) =>
                      onPatchPass(passType, {
                        breadcrumbUrl: event.target.value,
                      })
                    }
                  />
                </PropertyRow>
                <ReferenceSelector
                  id={`${passType}-terms`}
                  label="T&C content"
                  value={pass.termsModule}
                  options={pass.termsModule ? [pass.termsModule] : []}
                  onChange={(value) =>
                    onPatchPass(passType, { termsModule: value })
                  }
                />
                <ReferenceSelector
                  id={`${passType}-widget-1`}
                  label="Optional widget 1"
                  value={pass.optionalWidget1}
                  options={pass.optionalWidget1 ? [pass.optionalWidget1] : []}
                  onChange={(value) =>
                    onPatchPass(passType, { optionalWidget1: value })
                  }
                />
                <ReferenceSelector
                  id={`${passType}-widget-2`}
                  label="Optional widget 2"
                  value={pass.optionalWidget2}
                  options={pass.optionalWidget2 ? [pass.optionalWidget2] : []}
                  onChange={(value) =>
                    onPatchPass(passType, { optionalWidget2: value })
                  }
                />
                <ReferenceSelector
                  id={`${passType}-widget-3`}
                  label="Optional widget 3"
                  value={pass.optionalWidget3}
                  options={pass.optionalWidget3 ? [pass.optionalWidget3] : []}
                  onChange={(value) =>
                    onPatchPass(passType, { optionalWidget3: value })
                  }
                />
              </>
            )}

            {group === "widgets" && (
              <>
                <ReferenceSelector id="w-what" label="What Is Widget" value={config.whatIsWidget} onChange={(v) => onPatch({ whatIsWidget: v })} />
                <ReferenceSelector id="w-1" label="First Additional Widget (Optional)" value={config.extraWidget1} onChange={(v) => onPatch({ extraWidget1: v })} />
                <ReferenceSelector id="w-2" label="Second Additional Widget (Optional)" value={config.extraWidget2} onChange={(v) => onPatch({ extraWidget2: v })} />
                <ReferenceSelector id="w-3" label="Third Additional Widget (Optional)" value={config.extraWidget3} onChange={(v) => onPatch({ extraWidget3: v })} />
                <ReferenceSelector id="w-foot" label="Footer Navigation Widget" value={config.footerNavWidget} onChange={(v) => onPatch({ footerNavWidget: v })} />
                <ReferenceSelector id="w-sticky" label="Sticky Banner Widget Data" value={config.stickyBannerWidget} onChange={(v) => onPatch({ stickyBannerWidget: v })} />
                <Toggle
                  id="opt"
                  label="Optimizely enabled"
                  checked={config.optimizely}
                  onChange={(v) => onPatch({ optimizely: v })}
                />
              </>
            )}

            {group === "territory-pages" && (
              <>
                <Toggle
                  id="cp-enabled"
                  label="Enabled"
                  checked={config.enabled}
                  onChange={(v) => onPatch({ enabled: v })}
                />
                <Field id="legal" label="Legal Text" value={config.legal} stacked onChange={(v) => onPatch({ legal: v })} />
              </>
            )}

            {group === "accessibility" && (
              <>
                <Field id="skip-main" label="Skip Links Text for Main" value={config.skipLinkMain} stacked onChange={(v) => onPatch({ skipLinkMain: v })} />
                <Field id="skip-foot" label="Skip Links Text for Footer" value={config.skipLinkFooter} stacked onChange={(v) => onPatch({ skipLinkFooter: v })} />
              </>
            )}

            {group === "urls" && (
              <>
                <Field
                  id="url-faq"
                  label={<span className="inline-flex items-center gap-1">FAQ Success Redirect <MSym name="info" size={14} /></span>}
                  value={config.faqSuccessRedirect}
                  onChange={(v) => onPatch({ faqSuccessRedirect: v })}
                />
                <Field
                  id="url-dev"
                  label={<span className="inline-flex items-center gap-1">Devices PDP URL <MSym name="info" size={14} /></span>}
                  value={config.devicesHref}
                  onChange={(v) => onPatch({ devicesHref: v })}
                />
                <Field
                  id="url-all"
                  label={<span className="inline-flex items-center gap-1">All monthly plans PDP URL <MSym name="info" size={14} /></span>}
                  value={config.allMonthlyPlansHref}
                  onChange={(v) => onPatch({ allMonthlyPlansHref: v })}
                />
                <Field
                  id="url-free"
                  label={<span className="inline-flex items-center gap-1">Free PDP URL <MSym name="info" size={14} /></span>}
                  value={config.freeEpisodesHref}
                  onChange={(v) => onPatch({ freeEpisodesHref: v })}
                />
                <Field
                  id="url-prem"
                  label={<span className="inline-flex items-center gap-1">Premium PDP URL <MSym name="info" size={14} /></span>}
                  value={config.premiumEpisodesHref}
                  onChange={(v) => onPatch({ premiumEpisodesHref: v })}
                />
                <Field
                  id="url-mix"
                  label={<span className="inline-flex items-center gap-1">Mixed PDP URL <MSym name="info" size={14} /></span>}
                  value={config.mixedEpisodesHref}
                  onChange={(v) => onPatch({ mixedEpisodesHref: v })}
                />
              </>
            )}

            {group === "episodes" && (
              <>
                <Field id="ep-free" label="Free Episodes Text" value={config.freeEpisodesText} stacked onChange={(v) => onPatch({ freeEpisodesText: v })} />
                <Field id="ep-prem" label="Premium Episodes Text" value={config.premiumEpisodesText} stacked onChange={(v) => onPatch({ premiumEpisodesText: v })} />
              </>
            )}

            {group === "button-text" && (
              <>
                <Field id="btn-all" label="All plans Button Text" value={config.allPlansBtnText} stacked onChange={(v) => onPatch({ allPlansBtnText: v })} />
                <Field id="btn-prem" label="Premium Button Text" value={config.premiumBtnText} stacked onChange={(v) => onPatch({ premiumBtnText: v })} />
                <Field id="btn-mix" label="Mixed Button Text" value={config.mixedBtnText} stacked onChange={(v) => onPatch({ mixedBtnText: v })} />
                <Field id="btn-free" label="Free Button Text" value={config.freeBtnText} stacked onChange={(v) => onPatch({ freeBtnText: v })} />
              </>
            )}

            {group === "email-capture" && (
              <Field id="email" label="Email Placeholder Text" value={config.emailPlaceholder} stacked onChange={(v) => onPatch({ emailPlaceholder: v })} />
            )}

            {group === "carousels" && (
              <>
                <ReferenceSelector
                  id="car-tv"
                  label="TV fallback carousel"
                  value={config.carouselTv}
                  options={config.carouselTv ? [config.carouselTv] : []}
                  showRefresh={false}
                  onChange={(v) => onPatch({ carouselTv: v })}
                />
                <ReferenceSelector
                  id="car-mov"
                  label="Movies fallback carousel"
                  value={config.carouselMovies}
                  options={config.carouselMovies ? [config.carouselMovies] : []}
                  showRefresh={false}
                  onChange={(v) => onPatch({ carouselMovies: v })}
                />
                <ReferenceSelector
                  id="car-kids"
                  label="Kids fallback carousel"
                  value={config.carouselKids}
                  options={config.carouselKids ? [config.carouselKids] : []}
                  showRefresh={false}
                  onChange={(v) => onPatch({ carouselKids: v })}
                />
                <ReferenceSelector
                  id="car-news"
                  label="News fallback carousel"
                  value={config.carouselNews}
                  options={config.carouselNews ? [config.carouselNews] : []}
                  showRefresh={false}
                  onChange={(v) => onPatch({ carouselNews: v })}
                />
              </>
            )}

            {group === "video" && (
              <>
                <Field id="ve1" label="Video End Message Line 1" value={config.videoEnd1} stacked onChange={(v) => onPatch({ videoEnd1: v })} />
                <Field id="ve2" label="Video End Message Line 2" value={config.videoEnd2} stacked onChange={(v) => onPatch({ videoEnd2: v })} />
                <Field id="vp1" label="Video pause message line 1" value={config.videoPause1} stacked onChange={(v) => onPatch({ videoPause1: v })} />
                <Field id="vp2" label="Video pause message line 2" value={config.videoPause2} stacked onChange={(v) => onPatch({ videoPause2: v })} />
                <Field id="vpcta" label="Video pause message CTA text" value={config.videoPauseCta} stacked onChange={(v) => onPatch({ videoPauseCta: v })} />
                <Field
                  id="vph"
                  label={<span className="inline-flex items-center gap-1">Video pause message url <MSym name="info" size={14} /></span>}
                  value={config.videoPauseHref}
                  onChange={(v) => onPatch({ videoPauseHref: v })}
                />
              </>
            )}

            {group === "translation-copy" && (
              <PropertyRow label="Copy groups" help="Choose a subsection in the outline to edit its fields.">
                <p className={inspectorType.value}>
                  Common Words, Hero Copy, Recommended Copy, Faq Copy,
                  Subheadings, and Meta Copy.
                </p>
              </PropertyRow>
            )}

            {group === "i18n" && (
              <>
                {COMMON_WORD_FIELDS.map(({ key, label }) => (
                  <Field
                    key={key}
                    id={`i-common-${key}`}
                    label={
                      <span className="inline-flex items-center gap-1">
                        {label}
                        <MSym name="info" size={14} />
                      </span>
                    }
                    value={config.i18n[key]}
                    stacked
                    compact
                    onChange={(value) =>
                      onPatch({
                        i18n: { ...config.i18n, [key]: value },
                      })
                    }
                  />
                ))}
              </>
            )}

            {group === "i18n-hero" && (
              <>
                {HERO_COPY_FIELDS.map(({ key, label }) => (
                  <Field
                    key={key}
                    id={`i-hero-${key}`}
                    label={
                      <span className="inline-flex items-center gap-1">
                        {label}
                        <MSym name="info" size={14} />
                      </span>
                    }
                    value={config.i18n[key]}
                    stacked
                    compact
                    onChange={(value) =>
                      onPatch({
                        i18n: { ...config.i18n, [key]: value },
                      })
                    }
                  />
                ))}
              </>
            )}

            {group === "i18n-recommended" && (
              <Field
                id="i-recommendations-title"
                label={
                  <span className="inline-flex items-center gap-1">
                    Recommendations Title
                    <MSym name="info" size={14} />
                  </span>
                }
                value={config.i18n.recommendationsTitle}
                stacked
                compact
                onChange={(value) =>
                  onPatch({
                    i18n: { ...config.i18n, recommendationsTitle: value },
                  })
                }
              />
            )}

            {group === "i18n-faq" && (
              <>
                <Field
                  id="i-faq-title"
                  label={
                    <span className="inline-flex items-center gap-1">
                      Faq Title
                      <MSym name="info" size={14} />
                    </span>
                  }
                  value={config.i18n.faqTitle}
                  stacked
                  compact
                  onChange={(value) =>
                    onPatch({ i18n: { ...config.i18n, faqTitle: value } })
                  }
                />
                <Field
                  id="i-faq-how-watch-title"
                  label={
                    <span
                      className="inline-flex items-center gap-1"
                      title="Text box should contain the following variables in this format {{title}}"
                    >
                      How can I watch XYZ? Title
                      <MSym name="info" size={14} />
                    </span>
                  }
                  value={config.i18n.faqHowWatchTitle}
                  stacked
                  compact
                  onChange={(value) =>
                    onPatch({
                      i18n: { ...config.i18n, faqHowWatchTitle: value },
                    })
                  }
                />
                <FaqAnswerGroup
                  id="i-faq-how-watch-show"
                  title="How can I watch XYZ? Show Answer"
                  answer={config.i18n.faqHowWatchShowAnswer}
                  onChange={(answer) =>
                    onPatch({
                      i18n: {
                        ...config.i18n,
                        faqHowWatchShowAnswer: answer,
                      },
                    })
                  }
                />
                <FaqAnswerGroup
                  id="i-faq-how-watch-movie"
                  title="How can I watch XYZ? Movie Answer"
                  answer={config.i18n.faqHowWatchMovieAnswer}
                  onChange={(answer) =>
                    onPatch({
                      i18n: {
                        ...config.i18n,
                        faqHowWatchMovieAnswer: answer,
                      },
                    })
                  }
                />
                <Field
                  id="i-faq-where-watch-title"
                  label={
                    <span
                      className="inline-flex items-center gap-1"
                      title="Text box should contain the following variables in this format {{title}}"
                    >
                      Where can I watch XYZ? Title
                      <MSym name="info" size={14} />
                    </span>
                  }
                  value={config.i18n.faqWhereWatchTitle}
                  stacked
                  compact
                  onChange={(value) =>
                    onPatch({
                      i18n: { ...config.i18n, faqWhereWatchTitle: value },
                    })
                  }
                />
                <FaqAnswerGroup
                  id="i-faq-where-watch-show"
                  title="Where can I watch XYZ? Show Answer"
                  answer={config.i18n.faqWhereWatchShowAnswer}
                  onChange={(answer) =>
                    onPatch({
                      i18n: {
                        ...config.i18n,
                        faqWhereWatchShowAnswer: answer,
                      },
                    })
                  }
                />
                <FaqAnswerGroup
                  id="i-faq-where-watch-movie"
                  title="Where can I watch XYZ? Movie Answer"
                  answer={config.i18n.faqWhereWatchMovieAnswer}
                  onChange={(answer) =>
                    onPatch({
                      i18n: {
                        ...config.i18n,
                        faqWhereWatchMovieAnswer: answer,
                      },
                    })
                  }
                />
                <Field
                  id="i-faq-how-long-title"
                  label={
                    <span
                      className="inline-flex items-center gap-1"
                      title="Text box should contain the following variables in this format {{title}}"
                    >
                      How long is XYZ? Title
                      <MSym name="info" size={14} />
                    </span>
                  }
                  value={config.i18n.faqHowLongTitle}
                  stacked
                  compact
                  onChange={(value) =>
                    onPatch({
                      i18n: { ...config.i18n, faqHowLongTitle: value },
                    })
                  }
                />
                <FaqAnswerGroup
                  id="i-faq-how-long"
                  title="How long is XYZ? Answer"
                  help="Text box should contain the following variables in this format {{duration}}"
                  answer={config.i18n.faqHowLongAnswer}
                  onChange={(answer) =>
                    onPatch({
                      i18n: { ...config.i18n, faqHowLongAnswer: answer },
                    })
                  }
                />
                <Field
                  id="i-faq-seasons-title"
                  label={
                    <span
                      className="inline-flex items-center gap-1"
                      title="Text box should contain the following variables in this format {{title}}"
                    >
                      How many seasons of XYZ are there? Title
                      <MSym name="info" size={14} />
                    </span>
                  }
                  value={config.i18n.faqSeasonsTitle}
                  stacked
                  compact
                  onChange={(value) =>
                    onPatch({
                      i18n: { ...config.i18n, faqSeasonsTitle: value },
                    })
                  }
                />
                <FaqAnswerGroup
                  id="i-faq-seasons-single"
                  title="How many seasons of XYZ are there? Answer single"
                  help="Text box should contain the following variables in this format {{availableSeasonCount}}"
                  answer={config.i18n.faqSeasonsSingleAnswer}
                  onChange={(answer) =>
                    onPatch({
                      i18n: {
                        ...config.i18n,
                        faqSeasonsSingleAnswer: answer,
                      },
                    })
                  }
                />
                <FaqAnswerGroup
                  id="i-faq-seasons-plural"
                  title="How many seasons of XYZ are there? Answer plural"
                  help="Text box should contain the following variables in this format {{availableSeasonCount}}"
                  answer={config.i18n.faqSeasonsPluralAnswer}
                  onChange={(answer) =>
                    onPatch({
                      i18n: {
                        ...config.i18n,
                        faqSeasonsPluralAnswer: answer,
                      },
                    })
                  }
                />
              </>
            )}

            {group === "i18n-subheadings" && (
              <>
                <Field
                  id="i-sub-s"
                  label={
                    <span className="inline-flex items-center gap-1">
                      Show Subheading
                      <MSym name="info" size={14} />
                    </span>
                  }
                  value={config.i18n.showSubheading}
                  onChange={(v) => onPatch({ i18n: { ...config.i18n, showSubheading: v } })}
                  stacked
                  compact
                  help="Text box should contain the following variables in this format {{title}}"
                />
                <Field
                  id="i-sub-m"
                  label={
                    <span className="inline-flex items-center gap-1">
                      Movie Subheading
                      <MSym name="info" size={14} />
                    </span>
                  }
                  value={config.i18n.movieSubheading}
                  onChange={(v) => onPatch({ i18n: { ...config.i18n, movieSubheading: v } })}
                  stacked
                  compact
                  help="Text box should contain the following variables in this format {{title}}"
                />
              </>
            )}

            {group === "i18n-meta" && (
              <>
                {META_COPY_FIELDS.map(({ key, label, help }) => (
                  <Field
                    key={key}
                    id={`i-meta-${key}`}
                    label={
                      <span className="inline-flex items-center gap-1">
                        {label}
                        <MSym name="info" size={14} />
                      </span>
                    }
                    value={config.i18n[key]}
                    required
                    stacked
                    compact
                    help={help}
                    onChange={(value) =>
                      onPatch({
                        i18n: { ...config.i18n, [key]: value },
                      })
                    }
                  />
                ))}
              </>
            )}

          </PropertyRows>
        </InspectorBody>
      </div>
    </Panel>
  );
}
