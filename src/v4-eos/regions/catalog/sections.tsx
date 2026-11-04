import { useState } from "react";
import { MSym } from "@/v4-eos/ui/msym";
import { Button } from "@/v4-eos/ui/button";
import { Badge } from "@/v4-eos/ui/badge";
import { Separator } from "@/v4-eos/ui/separator";
import {
  TextField,
  TextAreaField,
  CheckboxField,
  SwitchField,
  SelectField,
  RadioField,
} from "@/v4-eos/ui/form-controls";
import {
  ListAccessory,
  ListItem,
  InspectorHeader,
  CompactPropertyRow,
  PropertyRow,
  PropertyRows,
} from "@/v4-eos/ui/property";
import { Panel } from "@/v4-eos/ui/panel";
import { Section, Specimen, Swatch } from "./layout";

// --- Foundations: the Eos M3 color/type/spacing roles this workspace is built
// on (ui-lib/tokens.css), rendered live so the swatches always reflect the
// actual running theme rather than a static screenshot. ---
export function FoundationsSection() {
  return (
    <Section
      id="foundations"
      title="Foundations"
      lead="Color roles come straight from the Eos-aligned Iceberg tokens (ui-lib/tokens.css) — the same custom properties every V4 component consumes, so this page can never drift from the running theme."
    >
      <Specimen label="Surfaces">
        <Swatch name="Canvas" brand="Onyx" varName="--color-bg-canvas" />
        <Swatch name="Panel" varName="--color-bg-panel" />
        <Swatch name="Surface" varName="--color-bg-surface" />
        <Swatch name="Subtle" brand="Deep Onyx" varName="--color-bg-subtle" />
        <Swatch name="Control" varName="--color-bg-control" />
      </Specimen>
      <Specimen label="Text">
        <Swatch name="Primary" brand="Alabaster Grey" varName="--color-text-primary" />
        <Swatch name="Secondary" brand="Silver" varName="--color-text-secondary" />
        <Swatch name="Muted" brand="Grey Olive" varName="--color-text-muted" />
      </Specimen>
      <Specimen label="Accents & status">
        <Swatch name="Primary" varName="--color-action-primary" />
        <Swatch name="Success" varName="--color-status-success" />
        <Swatch name="Warning" varName="--color-status-warning" />
        <Swatch name="Info" varName="--color-status-info" />
        <Swatch name="Danger" varName="--color-status-danger" />
      </Specimen>
    </Section>
  );
}

// --- Actions: every Button variant + size, plus icon buttons — Eos §3.2
// pill shape, height, and padding rules (Phase 4). ---
export function ActionsSection() {
  return (
    <Section
      id="actions"
      title="Actions"
      lead="Eos §3.2 button: pill radius, filled/outline/ghost variants, consistent height and icon sizing across sizes."
    >
      <Specimen label="Variants">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </Specimen>
      <Specimen label="Sizes">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </Specimen>
      <Specimen label="With icons & icon-only">
        <Button size="sm">
          <MSym name="add" size={16} />
          Add item
        </Button>
        <Button variant="destructive" size="sm">
          <MSym name="delete" size={16} />
          Delete
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="More">
          <MSym name="more_horiz" size={16} />
        </Button>
        <Button size="sm" disabled>
          Disabled
        </Button>
      </Specimen>
    </Section>
  );
}

// --- Status: Badge, including the Iceberg-specific status variants layered
// on top of Eos's status color roles. ---
export function StatusSection() {
  return (
    <Section
      id="status"
      title="Status & badges"
      lead="Iceberg status variants (success / warning / info) mapped onto the Eos status color tokens. Status is never color-only \u2014 always paired with a label."
    >
      <Specimen label="Default variants">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </Specimen>
      <Specimen label="Iceberg status">
        <Badge variant="success">Published</Badge>
        <Badge variant="warning">In review</Badge>
        <Badge variant="info">Page section</Badge>
      </Specimen>
    </Section>
  );
}

// --- Form controls: the Eos-spec'd controls (Phase 4) the Properties panel
// actually uses. Live, stateful demos so focus/checked/switch states are
// inspectable. ---
export function FormSection() {
  const [text, setText] = useState("Premium card test");
  const [area, setArea] = useState("Rich copy with headings.");
  const [checked, setChecked] = useState(true);
  const [on, setOn] = useState(true);
  const [sel, setSel] = useState("Grid");
  const [design, setDesign] = useState("Comfortable");
  return (
    <Section
      id="form-controls"
      title="Form controls"
      lead="TextField, TextAreaField, Select, Checkbox, Switch, and Radio, aligned to Eos field/control specs and consumed as-is by the Properties panel."
    >
      <Specimen label="Inputs" className="flex-col items-stretch gap-4">
        <div className="max-w-sm">
          <TextField value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className="max-w-sm">
          <TextAreaField value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <div className="max-w-xs">
          <SelectField
            value={sel}
            onValueChange={setSel}
            options={["Grid", "Carousel", "List", "Hero"]}
          />
        </div>
      </Specimen>
      <Specimen label="Toggles & choice">
        <label className="flex items-center gap-2 text-[length:var(--type-label-lg-size)] leading-[length:var(--type-label-lg-lh)] text-foreground">
          <CheckboxField checked={checked} onCheckedChange={setChecked} />
          Enabled
        </label>
        <label className="flex items-center gap-2 text-[length:var(--type-label-lg-size)] leading-[length:var(--type-label-lg-lh)] text-foreground">
          <SwitchField checked={on} onCheckedChange={setOn} />
          Live
        </label>
        <RadioField
          name="ds-density"
          value={design}
          onValueChange={setDesign}
          options={["Compact", "Comfortable"]}
        />
      </Specimen>
    </Section>
  );
}

// --- Patterns: Iceberg-specific compositions built from Eos primitives \u2014
// panel chrome and the Properties label/control rows. Shows the primitives
// working together in the authoring UI, not just in isolation. ---
export function PatternsSection() {
  return (
    <Section
      id="patterns"
      title="Patterns"
      lead="V4 Properties inspector: contextual header, compact rows, and stacked fields on Eos tokens."
    >
      <Specimen label="Inspector header" className="flex-col items-stretch">
        <Panel className="w-full max-w-md overflow-hidden rounded-md border border-border bg-[var(--color-bg-panel)]">
          <div className="p-3">
            <InspectorHeader
              title="Section Options"
              kind="Selected section"
              actions={<Badge variant="success">Published</Badge>}
            />
          </div>
        </Panel>
      </Specimen>
      <Specimen label="Property rows" className="flex-col items-stretch">
        <div className="w-full max-w-md rounded-md border border-border bg-[var(--color-bg-panel)] p-3">
          <PropertyRows>
            <PropertyRow label="Description">
              <TextField defaultValue="What is Streamly" />
            </PropertyRow>
            <CompactPropertyRow label="Layout">
              <SelectField value="Grid" options={["Grid", "Carousel", "List"]} />
            </CompactPropertyRow>
            <ListItem
              primary="Enabled"
              labelFor="catalog-enabled"
              trailing={
                <ListAccessory type="switch">
                  <SwitchField id="catalog-enabled" checked onCheckedChange={() => {}} />
                </ListAccessory>
              }
            />
            <ListItem
              primary="Section ID"
              secondary={<code className="font-mono">sec-hero-01</code>}
            />
          </PropertyRows>
          <Separator className="my-4" />
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              Duplicate
            </Button>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        </div>
      </Specimen>
    </Section>
  );
}

// --- Potential Eos Contributions: Iceberg-built pieces that go beyond what
// the Eos library currently documents. They're implemented as one-off V4
// components today, not published Eos primitives \u2014 called out here as
// candidates rather than demoed live, since they only make sense in their
// real authoring context (a resizable panel, a data table, a tree). ---
export function ContributionsSection() {
  return (
    <Section
      id="contributions"
      title="Potential Eos Contributions"
      lead="Iceberg-specific pieces built on top of Eos that could graduate into the Eos library itself \u2014 none of these are Eos primitives today, so each stays a local V4 component (linked below) rather than a documented spec."
    >
      <Specimen label="Resizer grabber" className="flex-col items-stretch gap-1">
        <p className="text-[length:var(--type-body-sm-size)] leading-relaxed text-muted-foreground">
          Eos \u00a73.6 specifies the resizer's hit target and hover/active color, but
          not a grip affordance. Iceberg adds a dotted-pill grabber centered on
          every divider (Explorer\u2194Preview, Pages\u2194Structure) \u2014{" "}
          <code className="font-mono">WorkspaceShell.tsx</code>,{" "}
          <code className="font-mono">regions/Explorer.tsx</code>.
        </p>
      </Specimen>
      <Specimen label="PanelHeader" className="flex-col items-stretch gap-1">
        <p className="text-[length:var(--type-body-sm-size)] leading-relaxed text-muted-foreground">
          A compact tool-panel header (eyebrow + title + sub + trailing
          actions) reused by Explorer, Structure, and Properties \u2014{" "}
          <code className="font-mono">ui/panel.tsx</code>.
        </p>
      </Specimen>
      <Specimen label="PropertyRow / PropertyRows" className="flex-col items-stretch gap-1">
        <p className="text-[length:var(--type-body-sm-size)] leading-relaxed text-muted-foreground">
          Field rows (label above control) on the Eos List item inset, plus
          List item, accessory, subheader and divider compositions for
          switches and read-only values \u2014 shown live in Patterns above,
          implemented in <code className="font-mono">ui/property.tsx</code>.
        </p>
      </Specimen>
      <Specimen label="FilterChip + TableFooter" className="flex-col items-stretch gap-1">
        <p className="text-[length:var(--type-body-sm-size)] leading-relaxed text-muted-foreground">
          Built to Eos \u00a73.7's data-table spec (pinned filter chips, footer
          range + pager instead of a header count) for the Pages/Widgets/
          Variants tables \u2014 <code className="font-mono">ui-lib/FilterChip.tsx</code>,{" "}
          <code className="font-mono">ui-lib/TableFooter.tsx</code>.
        </p>
      </Specimen>
      <Specimen label="Structure tree row" className="flex-col items-stretch gap-1">
        <p className="text-[length:var(--type-body-sm-size)] leading-relaxed text-muted-foreground">
          Combines disclosure, drag handle, validation flag, disabled state,
          and an overflow menu in one dense row \u2014 denser and more
          feature-complete than a plain Eos list item \u2014{" "}
          <code className="font-mono">ui/tree-row.tsx</code>.
        </p>
      </Specimen>
    </Section>
  );
}
