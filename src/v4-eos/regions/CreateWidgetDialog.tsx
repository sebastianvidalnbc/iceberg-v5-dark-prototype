import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/v4-eos/ui/dialog";
import { Button } from "@/v4-eos/ui/button";
import { Input } from "@/v4-eos/ui/input";
import { Label } from "@/v4-eos/ui/label";
import { RadioGroup, RadioGroupItem } from "@/v4-eos/ui/radio-group";
import { createBlankWidget } from "../widget-create";

// Production's "Create new Widget" dialog, styled to the Eos Basic dialog
// (Workset 77:87): 480px, 24px padding, title + content + actions, no header
// or footer rules and no close icon. Buttons follow the Eos Button spec (4:81):
// Text (Cancel), Outlined (Create), Filled (Create and Edit), all 36px pills.
// Fields follow the Eos Text field spec: label above, 36px box, 4px radius.
const LABEL =
  "text-[length:var(--type-label-md-size)] leading-[length:var(--type-label-md-lh)] font-semibold text-[var(--color-text-secondary)]";

export function CreateWidgetDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (widgetId: string, openEditor: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [format, setFormat] = useState<"HTML" | "JSON">("HTML");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setFormat("HTML");
    setError(null);
  };

  const create = (openEditor: boolean) => {
    const result = createBlankWidget(name, format);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    reset();
    onOpenChange(false);
    onCreated(result.id, openEditor);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent
        showClose={false}
        className="w-[480px] max-w-[calc(100vw-48px)] gap-0 p-6"
      >
        <DialogTitle className="text-[length:var(--type-title-lg-size)] leading-[length:var(--type-title-lg-lh)] font-normal tracking-normal">
          Create new Widget
        </DialogTitle>
        <form
          className="mt-4 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            create(true);
          }}
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="create-widget-name" className={LABEL}>
              Name
            </Label>
            <Input
              id="create-widget-name"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "create-widget-error" : undefined}
              className="h-9 rounded-[var(--radius-field)] border-[var(--color-border-strong)] px-3 text-[length:var(--type-body-md-size)] shadow-none"
            />
            {error && (
              <p
                id="create-widget-error"
                className="text-[length:var(--type-body-sm-size)] leading-[length:var(--type-body-sm-lh)] text-[var(--color-status-danger)]"
              >
                {error}
              </p>
            )}
          </div>
          <fieldset className="flex flex-col gap-1">
            <legend className={`mb-1 ${LABEL}`}>Template</legend>
            <RadioGroup
              value={format}
              onValueChange={(v) => setFormat(v as "HTML" | "JSON")}
              className="flex gap-6"
            >
              {(["HTML", "JSON"] as const).map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <RadioGroupItem
                    id={`create-widget-${f}`}
                    value={f}
                    className="size-4 border-[var(--color-border-strong)]"
                  />
                  <Label
                    htmlFor={`create-widget-${f}`}
                    className="text-[length:var(--type-body-md-size)] leading-[length:var(--type-body-md-lh)] font-normal text-foreground"
                  >
                    {f}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </fieldset>
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-[var(--color-border-strong)] shadow-none"
              onClick={() => create(false)}
            >
              Create
            </Button>
            <Button type="submit">Create and Edit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
