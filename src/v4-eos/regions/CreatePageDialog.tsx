import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/v4-eos/ui/dialog";
import { Input } from "@/v4-eos/ui/input";
import { ScrollArea } from "@/v4-eos/ui/scroll-area";
import { MSym } from "@/v4-eos/ui/msym";
import { Button } from "../ui-lib/Button";
import {
  createPage,
  findExistingPage,
  normalizeSlug,
  parentPageFor,
  suggestExistingPages,
  type PageRef,
} from "../page-create";
import { STARTER_TEMPLATES, type StarterTemplate } from "../starter-templates";
import { StarterPreview } from "./StarterPreview";

// "Create new Page" popup for the Pages "+" button. Eos Basic dialog: 24px
// padding, title, content, actions. Left: a Eos list of starters. Right: a
// web-page preview of the selected starter.

const DANGER = "ui-field__error";
const HELP = "ui-field__help";

const BLANK = "blank";

// Left rail entries: the blank canvas first, then the starter templates.
const RAIL_OPTIONS: { id: string; name: string; moduleCount: number | null }[] = [
  { id: BLANK, name: "Blank page", moduleCount: null },
  ...STARTER_TEMPLATES.map((t) => ({ id: t.id, name: t.name, moduleCount: t.steps.length })),
];

export function CreatePageDialog({
  open,
  onOpenChange,
  onCreated,
  onOpenExisting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (variantId: string, openEditor: boolean) => void;
  onOpenExisting: (pageId: string) => void;
}) {
  const [name, setName] = useState("");
  const [start, setStart] = useState(BLANK);
  const [error, setError] = useState<string | null>(null);

  const slug = normalizeSlug(name);
  const exact: PageRef | null = useMemo(() => findExistingPage(slug), [slug]);
  const matches = useMemo(() => suggestExistingPages(slug), [slug]);
  const parent = slug && !exact ? parentPageFor(slug) : null;
  const canCreate = Boolean(slug) && !exact;

  const selected: StarterTemplate | null =
    STARTER_TEMPLATES.find((t) => t.id === start) ?? null;

  const reset = () => {
    setName("");
    setStart(BLANK);
    setError(null);
  };

  const close = () => {
    reset();
    onOpenChange(false);
  };

  const create = (openEditor: boolean) => {
    const result = createPage({ slug, starterId: selected ? selected.id : null });
    if ("error" in result) {
      setError(result.error);
      return;
    }
    reset();
    onOpenChange(false);
    onCreated(result.variantId, openEditor);
  };

  const openPage = (pageId: string) => {
    reset();
    onOpenChange(false);
    onOpenExisting(pageId);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="w-[1040px] max-w-[calc(100vw-48px)] gap-0 p-0">
        <DialogHeader className="gap-1 px-6 pt-6">
          <DialogTitle className="text-[length:var(--type-title-lg-size)] leading-[length:var(--type-title-lg-lh)] font-semibold text-foreground">
            Create new Page
          </DialogTitle>
          <DialogDescription className="text-[length:var(--type-body-sm-size)] leading-[length:var(--type-body-sm-lh)] text-[var(--color-text-secondary)]">
            Name the page, then start blank or from a starter template.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            if (canCreate) create(true);
          }}
        >
          <div className="flex flex-col gap-2 px-6 pt-5 pb-5">
            <label htmlFor="create-page-name" className="ui-field__label">
              Name
            </label>
            <Input
              id="create-page-name"
              autoFocus
              placeholder="/plans/all-monthly"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              aria-describedby="create-page-hint"
              className="h-[var(--control-height-md)] rounded-[var(--radius-field)] border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3 text-[length:var(--type-body-sm-size)] leading-[length:var(--type-body-sm-lh)] shadow-none"
              aria-invalid={exact || error ? true : undefined}
            />
            <div id="create-page-hint" className="flex flex-col gap-1.5">
              {exact ? (
                <div className="flex flex-wrap items-center gap-2">
                  <p className={DANGER}>{exact.label} already exists.</p>
                  <Button variant="secondary" size="sm" onClick={() => openPage(exact.id)}>
                    Open existing page
                  </Button>
                </div>
              ) : error ? (
                <p className={DANGER}>{error}</p>
              ) : slug && slug !== name.trim() ? (
                <p className={HELP}>
                  Will be created as <span className="font-semibold">{slug}</span>
                </p>
              ) : slug ? (
                <p className={HELP}>{parent ? `Nested under ${parent.label}.` : "Top-level page."}</p>
              ) : (
                <p className={HELP}>Use the full slug, for example /news/election.</p>
              )}
              {!exact && matches.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className={HELP}>Existing slugs:</span>
                  {matches.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => openPage(m.id)}
                      className="inline-flex h-8 items-center rounded-[var(--radius-field)] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3 text-[length:var(--type-label-lg-size)] leading-[length:var(--type-label-lg-lh)] text-foreground hover:bg-[var(--color-bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[280px_minmax(0,1fr)] border-t border-[var(--color-border-default)]">
            <div className="flex min-h-0 flex-col border-r border-[var(--color-border-default)]">
              <div className="flex h-9 items-center px-3 text-[length:var(--type-label-lg-size)] leading-[length:var(--type-label-lg-lh)] font-semibold text-foreground">
                Start from
              </div>
              <ScrollArea className="h-[52vh] min-h-0">
                <div className="flex flex-col px-2 pb-2" role="group" aria-label="Start from">
                  {RAIL_OPTIONS.map((o, i) => {
                    const active = start === o.id;
                    return (
                      <div key={o.id}>
                        {i === 1 && <div className="my-1 h-px bg-[var(--color-border-default)]" />}
                        <button
                          type="button"
                          aria-pressed={active}
                          onClick={() => setStart(o.id)}
                          className={
                            "flex h-[60px] w-full flex-col justify-center gap-0.5 rounded-[var(--radius-sm)] px-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 " +
                            (active
                              ? "bg-[var(--color-bg-selected)] shadow-[inset_3px_0_0_var(--color-action-primary)]"
                              : "hover:bg-[var(--color-bg-hover)]")
                          }
                        >
                          <span className="truncate text-[length:var(--type-body-md-size)] leading-[length:var(--type-body-md-lh)] font-medium text-[var(--color-text-primary)]">
                            {o.name}
                          </span>
                          <span className="text-[length:var(--type-body-sm-size)] leading-[length:var(--type-body-sm-lh)] text-[var(--color-text-secondary)]">
                            {o.moduleCount === null ? "Empty canvas" : `${o.moduleCount} modules`}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            <ScrollArea className="h-[52vh] min-h-0 bg-[var(--color-bg-preview-canvas)]">
              <StarterPreview template={selected} slug={slug} />
            </ScrollArea>
          </div>

          <DialogFooter className="flex-row items-center justify-between gap-2 border-t border-[var(--color-border-default)] px-6 py-4">
            <span className="flex items-center gap-1.5 text-[length:var(--type-body-sm-size)] leading-[length:var(--type-body-sm-lh)] text-[var(--color-text-secondary)]">
              <MSym name="info" size={14} />
              {selected
                ? `${selected.name} will be created with ${selected.steps.length} modules.`
                : "A blank page starts with no modules."}
            </span>
            <div className="flex gap-2">
              <Button type="button" variant="tertiary" onClick={close}>
                Cancel
              </Button>
              <Button type="button" variant="secondary" disabled={!canCreate} onClick={() => create(false)}>
                Create
              </Button>
              <Button type="submit" variant="primary" disabled={!canCreate}>
                Create and Edit
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
