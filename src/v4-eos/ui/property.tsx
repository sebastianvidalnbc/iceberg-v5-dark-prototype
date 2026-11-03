import * as React from "react";
import { MSym } from "@/v4-eos/ui/msym";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/v4-eos/ui/collapsible";
import { cn } from "@/v4-eos/ui/lib/utils";

// V4 Properties inspector compositions. Built on Eos tokens and list-family
// patterns where they fit (switch/checkbox rows, read-only metadata). Compact
// inspector rows and stacked fields extend Eos when list rows or Workset fields
// are the wrong shape — documented in docs/eos-design-system.md §7.11.

/** Role-based type for the Properties inspector (purpose-named, not raw px). */
export const inspectorType = {
  kind: "text-[length:var(--inspector-kind-size)] font-normal leading-[length:var(--inspector-kind-lh)] text-[var(--color-text-secondary)]",
  title:
    "text-[length:var(--inspector-title-size)] font-semibold leading-[length:var(--inspector-title-lh)] tracking-[-0.01em] text-balance text-foreground",
  section:
    "text-[length:var(--inspector-section-size)] font-semibold leading-[length:var(--inspector-section-lh)] text-foreground",
  fieldLabel:
    "text-[length:var(--inspector-label-size)] font-medium leading-[length:var(--inspector-label-lh)] text-[var(--color-text-secondary)]",
  value:
    "text-[length:var(--inspector-value-size)] font-normal leading-[length:var(--inspector-value-lh)] text-foreground",
  help: "text-[length:var(--inspector-help-size)] font-normal leading-[length:var(--inspector-help-lh)] text-[var(--color-text-secondary)]",
  meta: "text-[length:var(--inspector-help-size)] font-normal leading-[length:var(--inspector-help-lh)] text-muted-foreground",
} as const;

const ACRONYMS = new Set(["CTA", "FAQ", "URL", "URLS", "ID", "SEO", "T&C", "TV", "AI"]);
export function sentenceCase(text: string): string {
  if (text !== text.toUpperCase()) return text;
  return text
    .split(" ")
    .map((word, i) => {
      if (ACRONYMS.has(word)) return word;
      const lower = word.toLowerCase();
      return i === 0 ? lower.charAt(0).toUpperCase() + lower.slice(1) : lower;
    })
    .join(" ");
}

/** Context line for the inspector header; omitted when it would repeat the title. */
// Kind line removed: the panel heading is the only header label.
export function inspectorKindLabel(_eyebrow: string, _title: string): string | undefined {
  return undefined;
}

// Pins the panel's top block (object header, plus the tab strip for tabbed
// collections) while the rest of the panel scrolls. Only one sticky block per
// scroll area: nested sticky headers paint over each other.
export function InspectorStickyHead({
  children,
  divider = false,
}: {
  children: React.ReactNode;
  divider?: boolean;
}) {
  return (
    <div
      className={cn(
        "sticky top-0 z-10 -mx-[var(--inspector-body-x)] -mt-[var(--inspector-pad-y)] bg-[var(--color-bg-surface)] px-[var(--inspector-side)] pt-[var(--grid-gutter)]",
        // Divider sits 24px below the header text (InspectorHeader's 12px + 12px here).
        divider && "-mb-2 border-b border-[var(--color-border-default)] pb-3",
      )}
    >
      {children}
    </div>
  );
}

// --- Inspector header ---------------------------------------------------------
// One primary title (selected object) + optional kind line. Replaces the old
// uppercase eyebrow + duplicate panel "Properties" chrome.
export function InspectorHeader({
  title,
  kind,
  children,
  actions,
  className,
}: {
  // Omit the title when the enclosing tab already names the object.
  title?: React.ReactNode;
  kind?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-wrap items-start gap-x-2 gap-y-1 pb-[var(--grid-gutter)]",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {kind && <p className={inspectorType.kind}>{kind}</p>}
        {title != null && <h2 className={cn(inspectorType.title, kind && "mt-0.5")}>{title}</h2>}
      </div>
      {(actions || children) && (
        <div className="ml-auto flex shrink-0 flex-wrap items-center gap-2 self-center">
          {actions}
          {children}
        </div>
      )}
    </header>
  );
}

/** @deprecated Use InspectorHeader — maps legacy eyebrow/name call sites. */
export function ObjectHeader({
  eyebrow,
  name,
  children,
  bleed: _bleed,
}: {
  eyebrow: string;
  name: string;
  children?: React.ReactNode;
  bleed?: boolean;
}) {
  return (
    <InspectorHeader title={name} kind={inspectorKindLabel(eyebrow, name)}>
      {children}
    </InspectorHeader>
  );
}

// Scroll body wrapper for the Properties panel (consistent inset + density).
export function InspectorBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-[var(--inspector-gap-section)] px-[var(--inspector-body-x)] pb-4 pt-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

// --- List accessory (116:201) ------------------------------------------------
const ACCESSORY_WIDTH = {
  icon: "w-6",
  switch: "w-11",
  label: "min-w-12",
} as const;

export function ListAccessory({
  type = "icon",
  children,
}: {
  type?: keyof typeof ACCESSORY_WIDTH;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "flex h-8 shrink-0 items-center justify-center",
        ACCESSORY_WIDTH[type],
        type === "label" && cn("justify-end whitespace-nowrap", inspectorType.fieldLabel),
      )}
    >
      {children}
    </span>
  );
}

// --- Compact / list rows ------------------------------------------------------
export function ListItem({
  primary,
  secondary,
  secondaryId,
  leading,
  trailing,
  labelFor,
  rowFor,
  selected,
  disabled,
  density = "compact",
  className,
}: {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  secondaryId?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  labelFor?: string;
  rowFor?: string;
  selected?: boolean;
  disabled?: boolean;
  density?: "compact" | "comfortable";
  className?: string;
}) {
  const Row = rowFor ? "label" : "div";
  const Primary = labelFor ? "label" : "span";
  const secondaryIsValue = Boolean(secondary && !labelFor && !rowFor);
  const minH =
    density === "comfortable"
      ? secondary
        ? "min-h-[60px]"
        : "min-h-11"
      : secondary
        ? "min-h-[52px]"
        : "min-h-[var(--inspector-row-min-h)]";
  return (
    <Row
      htmlFor={rowFor}
      aria-disabled={disabled || undefined}
      className={cn(
        "relative flex w-full items-center gap-2 rounded-sm px-[var(--inspector-pad-x)] py-1 text-left",
        minH,
        rowFor &&
          "cursor-pointer transition-colors hover:bg-[var(--color-bg-hover)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-[var(--color-focus-ring)]",
        selected && "bg-[var(--color-bg-selected)] hover:bg-[var(--color-bg-selected)]",
        disabled && "pointer-events-none",
        className,
      )}
    >
      {selected && (
        <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-[var(--color-action-primary)]" />
      )}
      {leading}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Primary
          htmlFor={labelFor}
          className={cn(
            inspectorType.fieldLabel,
            disabled && "text-foreground/40",
            (labelFor || rowFor) && "cursor-pointer",
            !secondary && "break-words",
          )}
        >
          {primary}
        </Primary>
        {secondary && (
          <span
            id={secondaryId}
            className={cn(
              "line-clamp-2 break-words",
              secondaryIsValue ? inspectorType.value : inspectorType.help,
            )}
          >
            {secondary}
          </span>
        )}
      </span>
      {trailing}
    </Row>
  );
}

// Pattern A — label above control (textarea, assets, long copy, helpers).
export function PropertyRow({
  label,
  htmlFor,
  required,
  help,
  inset = true,
  children,
}: {
  label: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  help?: React.ReactNode;
  inset?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-[var(--inspector-gap-field)] pb-1.5 pt-2.5", inset && "px-[var(--inspector-pad-x)]")}>
      <label htmlFor={htmlFor} className={cn("min-w-0 break-words", inspectorType.fieldLabel)}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      <div className="min-w-0">
        {children}
        {help && <p className={cn("mt-1", inspectorType.help)}>{help}</p>}
      </div>
    </div>
  );
}

// Pattern B — label and control on one row (toggles, selects, short text).
export function CompactPropertyRow({
  label,
  htmlFor,
  required,
  help,
  children,
}: {
  label: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  help?: React.ReactNode;
  children: React.ReactNode;
}) {
  const helpId = help ? `${htmlFor ?? "field"}-help` : undefined;
  return (
    <div className="px-[var(--inspector-pad-x)] py-1">
      <div className="grid min-h-[var(--inspector-row-min-h)] grid-cols-1 items-center gap-x-3 gap-y-1 min-[360px]:grid-cols-[minmax(0,1fr)_minmax(7.5rem,42%)]">
        <label htmlFor={htmlFor} className={cn("min-w-0 break-words", inspectorType.fieldLabel)}>
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </label>
        <div className="min-w-0 min-[360px]:justify-self-end min-[360px]:w-full">{children}</div>
      </div>
      {help && (
        <p id={helpId} className={cn("mt-0.5 px-0", inspectorType.help)}>
          {help}
        </p>
      )}
    </div>
  );
}

export function PropertyRows({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col", className)}>{children}</div>
  );
}

export function ListDivider({ inset = "full" }: { inset?: "full" | "content" }) {
  return (
    <div aria-hidden className={cn("h-px shrink-0", inset === "content" && "pl-12")}>
      <div className="h-px bg-[var(--color-border-default)]" />
    </div>
  );
}

// Section groups — spacing-first; top border only between headed sections.
export function PropertySection({
  header,
  expanded,
  onToggle,
  action,
  borderedTop,
  children,
}: {
  header?: string;
  expanded?: boolean;
  onToggle?: () => void;
  action?: React.ReactNode;
  borderedTop?: boolean;
  children: React.ReactNode;
}) {
  if (!header) {
    return <section className="min-w-0 py-1">{children}</section>;
  }
  return (
    <Collapsible
      open={expanded}
      onOpenChange={onToggle}
      // Bleed to the panel edge so the divider runs full width; the padding keeps the
      // header and rows on the same inset as the title.
      className={cn(
        "-mx-[var(--inspector-body-x)] min-w-0 px-[var(--inspector-body-x)] pt-[18px]",
        // Every header keeps 24px to its divider above and below (18px here or on
        // the margin + the header row's 6px); the expanded rows follow the same rhythm.
        borderedTop && "mt-[18px] border-t border-[var(--color-border-default)]",
      )}
    >
      <div className="flex items-center gap-1">
        <CollapsibleTrigger className="group flex h-8 min-w-0 flex-1 items-center gap-2 rounded-sm px-[var(--inspector-pad-x)] text-left transition-colors hover:bg-[var(--color-bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus-ring)]">
          <span className={cn("min-w-0 flex-1 truncate", inspectorType.section)}>
            {sentenceCase(header)}
          </span>
          <span
            aria-hidden
            className="flex h-6 w-6 shrink-0 items-center justify-center text-[var(--color-text-secondary)]"
          >
            <MSym
              name="expand_more"
              size={20}
              className="transition-transform group-data-[state=closed]:-rotate-90"
            />
          </span>
        </CollapsibleTrigger>
        {action}
      </div>
      <CollapsibleContent className="pt-0.5">{children}</CollapsibleContent>
    </Collapsible>
  );
}

// Callout block for notices / intelligent authoring (inspector card, not form).
export function InspectorCallout({
  title,
  children,
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-sm bg-[var(--color-bg-subtle)] px-[var(--inspector-pad-x)] py-2.5">
      {title && <p className={cn(inspectorType.value, "font-medium")}>{title}</p>}
      <div className={cn(inspectorType.help, title && "mt-1")}>
        {children}
      </div>
    </div>
  );
}
