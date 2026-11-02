import * as React from "react";
import { Input } from "@/v4-eos/ui/input";
import { Textarea as ShadTextarea } from "@/v4-eos/ui/textarea";
import { Checkbox as ShadCheckbox } from "@/v4-eos/ui/checkbox";
import { Switch as ShadSwitch } from "@/v4-eos/ui/switch";
import { RadioGroup as ShadRadioGroup, RadioGroupItem } from "@/v4-eos/ui/radio-group";
import { Label } from "@/v4-eos/ui/label";
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/v4-eos/ui/select";
import { cn } from "@/v4-eos/ui/lib/utils";

// V2-local form-control adapters. They wrap the shadcn primitives behind the
// value/onChange/options API the Properties body already speaks, so the region
// code stays declarative and never imports Radix directly (§10). Compact
// Iceberg density: 28px controls, restrained radius, subtle dark input fills.

// Inspector fields: Eos standard control height (36px) with body-sized values.
// Same outlined white surface as the polished select (Figma SV_Playground).
const FIELD =
  "h-[var(--control-height-sm)] rounded-[var(--radius-field)] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3 text-[length:var(--type-body-sm-size)] leading-[length:var(--type-body-sm-lh)] shadow-none focus-visible:bg-[var(--color-bg-elevated)]";

export function TextField(
  props: React.ComponentProps<typeof Input> & { invalid?: boolean },
) {
  const { invalid, className, title, value, ...rest } = props;
  const tip =
    title ??
    (typeof value === "string" && value.length > 28 ? value : undefined);
  return (
    <Input
      {...rest}
      value={value}
      title={tip}
      aria-invalid={invalid || undefined}
      className={cn(FIELD, "min-w-0 max-w-full", className)}
    />
  );
}

export function TextAreaField(
  props: React.ComponentProps<typeof ShadTextarea> & { invalid?: boolean },
) {
  const { invalid, className, ...rest } = props;
  return (
    <ShadTextarea
      {...rest}
      aria-invalid={invalid || undefined}
      className={cn(
        "min-h-16 rounded-[var(--radius-field)] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3 py-2.5 text-[length:var(--type-body-sm-size)] leading-[length:var(--type-body-sm-lh)] shadow-none focus-visible:bg-[var(--color-bg-elevated)]",
        className,
      )}
    />
  );
}

export function CheckboxField({
  id,
  checked,
  onCheckedChange,
}: {
  id?: string;
  checked: boolean;
  onCheckedChange?: (v: boolean) => void;
}) {
  return (
    <ShadCheckbox id={id} checked={checked} onCheckedChange={(v) => onCheckedChange?.(!!v)} />
  );
}

export function SwitchField({
  id,
  checked,
  onCheckedChange,
  "aria-describedby": describedBy,
}: {
  id?: string;
  checked: boolean;
  onCheckedChange?: (v: boolean) => void;
  "aria-describedby"?: string;
}) {
  return (
    <ShadSwitch
      id={id}
      size="lg"
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-describedby={describedBy}
    />
  );
}

type SelectFieldOption = string | { label: string; value: string };

const normalizeOption = (o: SelectFieldOption) =>
  typeof o === "string" ? { label: o, value: o } : o;

// The single app dropdown (light shadcn/Radix Select). Used by the Properties
// panel AND the preview toolbar so every dropdown looks and behaves the same.
// Accepts plain strings (label === value) or { label, value } pairs.
// Radix SelectItem cannot take "" as a value, so the empty first option uses a
// sentinel that is translated back to "" on change.
const EMPTY_OPTION_VALUE = "__empty__";

// Polished select (Figma SV_Playground "Select"): white surface, 1px outline,
// 36px control, 12px horizontal padding, dark disclosure chevron.
const POLISHED_FIELD =
  "rounded-[var(--radius-field)] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3 text-[color:var(--color-text-primary)] shadow-none focus-visible:bg-[var(--color-bg-elevated)] [&>span:last-child]:opacity-100 [&>span:last-child]:text-[var(--color-text-primary)]";

export function SelectField({
  id,
  value,
  onValueChange,
  options,
  invalid,
  placeholder = "Select…",
  triggerClassName,
  polished = false,
  emptyOption = false,
  "aria-label": ariaLabel,
}: {
  id?: string;
  value: string;
  onValueChange?: (v: string) => void;
  options: SelectFieldOption[];
  invalid?: boolean;
  placeholder?: string;
  triggerClassName?: string;
  // Figma "Select" look (see POLISHED_FIELD).
  polished?: boolean;
  // Adds a blank first row that clears the value (value "").
  emptyOption?: boolean;
  "aria-label"?: string;
}) {
  const normalized = options.map(normalizeOption);
  const match = normalized.find((o) => o.value === value);
  const triggerTitle =
    match && match.label !== placeholder ? match.label : value || undefined;

  return (
    <ShadSelect
      value={value}
      onValueChange={(v) =>
        onValueChange?.(v === EMPTY_OPTION_VALUE ? "" : v)
      }
    >
      <SelectTrigger
        id={id}
        size="sm"
        title={triggerTitle}
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        className={cn(
          FIELD,
          polished && POLISHED_FIELD,
          "data-[size=sm]:h-[var(--control-height-md)] w-full min-w-0 max-w-full [&_[data-slot=select-value]]:min-w-0 [&_[data-slot=select-value]]:truncate",
          triggerClassName,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {emptyOption && (
          <SelectItem
            value={EMPTY_OPTION_VALUE}
            className="text-[length:var(--type-body-sm-size)] leading-[length:var(--type-body-sm-lh)]"
          >
            &nbsp;
          </SelectItem>
        )}
        {normalized.map((opt) => {
          return (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="text-[length:var(--type-body-sm-size)] leading-[length:var(--type-body-sm-lh)]"
            >
              {opt.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </ShadSelect>
  );
}

export function RadioField({
  name,
  value,
  onValueChange,
  options,
}: {
  name: string;
  value: string;
  onValueChange?: (v: string) => void;
  options: string[];
}) {
  return (
    <ShadRadioGroup
      name={name}
      value={value}
      onValueChange={onValueChange}
      className="gap-1.5"
    >
      {options.map((opt) => {
        const optId = `${name}-${opt}`;
        return (
          <div key={opt} className="flex items-center gap-2">
            <RadioGroupItem id={optId} value={opt} />
            <Label
              htmlFor={optId}
              className="text-[length:var(--type-body-sm-size)] font-normal leading-[length:var(--type-body-sm-lh)]"
            >
              {opt}
            </Label>
          </div>
        );
      })}
    </ShadRadioGroup>
  );
}
