import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/v4-eos/ui/dialog";
import { Button } from "@/v4-eos/ui/button";
import { SearchInput } from "@/v4-eos/ui/panel";
import { ScrollArea } from "@/v4-eos/ui/scroll-area";
import { MSym } from "@/v4-eos/ui/msym";
import { isRetiredLayout, LAYOUT_CATALOG, type LayoutDef, type LayoutGroup } from "../layouts";
import { LAYOUT_TYPES, layoutTypeOf } from "../layout-identity";

const GROUP_ORDER: LayoutGroup[] = [
  "Plan Pickers",
  "Content",
  "Media & Grids",
  "Commerce",
  "Structure",
  "Logic & Targeting",
];

// Retired (legacy) layouts are not offered for new sections.
const PICKER_LAYOUTS = LAYOUT_CATALOG.filter((l) => !isRetiredLayout(l));

const PREVIEW_BASE = `${import.meta.env.BASE_URL}layout-previews/`;

// The lifecycle badge Iceberg shows next to experimental layouts.
function ExperimentBadge() {
  return (
    <span
      className="rounded-[3px] px-1.5 py-0.5 text-[length:var(--type-label-badge-size)] leading-[length:var(--type-label-badge-lh)] font-bold uppercase tracking-[0.06em] text-white"
      style={{ backgroundColor: "var(--color-status-experiment)" }}
    >
      Experiment
    </span>
  );
}

// One preview image with its device caption (Mobile / Desktop / UI), matching
// the real picker's preview column.
function PreviewImage({ file, caption }: { file: string; caption: string }) {
  return (
    <figure className="flex flex-col items-center gap-1.5">
      <figcaption className="text-[length:var(--type-label-md-size)] leading-[length:var(--type-label-md-lh)] font-medium text-[var(--color-text-secondary)]">
        {caption}
      </figcaption>
      <img
        src={`${PREVIEW_BASE}${file}`}
        alt={`${caption} preview`}
        loading="lazy"
        className="max-h-[260px] w-full rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] object-contain"
      />
    </figure>
  );
}

// The right-hand preview pane — real Mobile + Desktop art from the elements
// package, or a graceful "No preview available" (as production does).
function PreviewPane({ layout }: { layout: LayoutDef | null }) {
  if (!layout) {
    return (
      <div className="grid h-full place-items-center p-6 text-center text-[length:var(--type-body-md-size)] text-muted-foreground">
        Select a layout to preview it.
      </div>
    );
  }
  const p = layout.preview;
  const hasArt = p && (p.mobile || p.desktop || p.ui);
  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <div className="flex items-center gap-2">
        <h3 className="text-[length:var(--type-title-md-size)] leading-[length:var(--type-title-md-lh)] font-semibold text-foreground">{layout.name}</h3>
        {layout.experiment && <ExperimentBadge />}
      </div>
      <p className="text-[length:var(--type-body-sm-size)] leading-snug text-muted-foreground">
        {layout.description}
      </p>
      {hasArt ? (
        <div className="flex flex-col gap-5">
          {p!.ui && <PreviewImage file={p!.ui} caption="UI" />}
          {p!.mobile && <PreviewImage file={p!.mobile} caption="Mobile" />}
          {p!.desktop && <PreviewImage file={p!.desktop} caption="Desktop" />}
        </div>
      ) : (
        <div className="grid flex-1 place-items-center rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border-default)] p-8 text-center text-[length:var(--type-body-sm-size)] text-muted-foreground">
          No preview available
        </div>
      )}
    </div>
  );
}

// The Layout Picker modal — a searchable, grouped, previewable catalog of the
// real production Iceberg section layouts (the V4 analog of the CMS
// IbPopupSelector "Layout Picker"). Selecting inserts a pre-filled section at
// the target slot.
export function LayoutPicker({
  open,
  onOpenChange,
  onSelect,
  contextLabel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (layoutId: string) => void;
  // Where the layout will be inserted, shown in the header (e.g. "above Footer").
  contextLabel?: string;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PICKER_LAYOUTS;
    return PICKER_LAYOUTS.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.group.toLowerCase().includes(q),
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<LayoutGroup, LayoutDef[]>();
    for (const l of filtered) {
      const arr = map.get(l.group) ?? [];
      arr.push(l);
      map.set(l.group, arr);
    }
    return GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({
      group: g,
      layouts: map.get(g)!,
    }));
  }, [filtered]);

  // Keep a valid selection: default to the first filtered layout.
  useEffect(() => {
    if (!open) return;
    if (!selectedId || !filtered.some((l) => l.id === selectedId)) {
      setSelectedId(filtered[0]?.id ?? null);
    }
  }, [open, filtered, selectedId]);

  const selected = useMemo(
    () => LAYOUT_CATALOG.find((l) => l.id === selectedId) ?? null,
    [selectedId],
  );

  const confirm = (id: string | null) => {
    if (!id) return;
    onSelect(id);
    onOpenChange(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setQuery("");
      setSelectedId(null);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[880px] p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>Layout Picker</DialogTitle>
          <DialogDescription>
            {contextLabel
              ? `Add a premade, pre-filled layout ${contextLabel}.`
              : "Add a premade, pre-filled layout to the page."}
          </DialogDescription>
        </DialogHeader>

        {/* Two-pane body: searchable list + live preview. */}
        <div className="grid min-h-0 grid-cols-[300px_minmax(0,1fr)]">
          <div className="flex min-h-0 flex-col border-r border-[var(--color-border-subtle)]">
            <div className="p-3">
              <SearchInput
                value={query}
                onChange={setQuery}
                onClear={() => setQuery("")}
                placeholder="Search layouts…"
              />
            </div>
            <ScrollArea className="h-[56vh] min-h-0">
              <div className="flex flex-col gap-3 px-2 pb-3">
                {grouped.length === 0 && (
                  <p className="px-2 py-4 text-[length:var(--type-body-md-size)] text-muted-foreground">
                    No layouts match “{query}”.
                  </p>
                )}
                {grouped.map(({ group, layouts }) => (
                  <section key={group} className="flex flex-col gap-0.5">
                    <h4 className="px-2 py-1 text-[length:var(--type-label-md-size)] leading-[length:var(--type-label-md-lh)] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-secondary)]">
                      {group}
                    </h4>
                    {layouts.map((l) => {
                      const active = selectedId === l.id;
                      return (
                        <button
                          key={l.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setSelectedId(l.id)}
                          onDoubleClick={() => confirm(l.id)}
                          className={
                            "flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-left text-[length:var(--type-label-lg-size)] leading-[length:var(--type-label-lg-lh)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 " +
                            (active
                              ? "bg-[var(--color-action-primary)] text-white"
                              : "text-foreground hover:bg-[var(--color-bg-subtle)]")
                          }
                        >
                          <span
                            aria-hidden
                            data-layout-type={layoutTypeOf(l)}
                            className={
                              "layout-chip" + (active ? " layout-chip--on" : "")
                            }
                          >
                            <MSym name={LAYOUT_TYPES[layoutTypeOf(l)].icon} size={14} />
                          </span>
                          <span className="min-w-0 flex-1 truncate">{l.name}</span>
                          {l.experiment && <ExperimentBadge />}
                        </button>
                      );
                    })}
                  </section>
                ))}
              </div>
            </ScrollArea>
          </div>

          <ScrollArea className="h-[calc(56vh+56px)] min-h-0">
            <PreviewPane layout={selected} />
          </ScrollArea>
        </div>

        <DialogFooter className="px-5 pb-5">
          <Button variant="ghost" size="sm" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            disabled={!selectedId}
            onClick={() => confirm(selectedId)}
          >
            Add layout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
