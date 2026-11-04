import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/v4-eos/ui/dialog";
import { Button } from "@/v4-eos/ui/button";
import { Badge } from "@/v4-eos/ui/badge";
import { ScrollArea } from "@/v4-eos/ui/scroll-area";
import { MSym } from "@/v4-eos/ui/msym";
import type { VariantWorkspace } from "../data";

// --- Loose structure traversal (shared shape with LivePreview) --------------
type Loose = {
  id: string;
  label: string;
  children?: Loose[];
  props?: { data?: { groups?: { fields?: F[] }[]; fields?: F[] } };
};
type F = { label: string; value: string };
function fieldsOf(n?: Loose): Record<string, string> {
  const d = n?.props?.data;
  if (!d) return {};
  const groups = d.groups ?? (d.fields ? [{ fields: d.fields }] : []);
  const out: Record<string, string> = {};
  for (const g of groups) for (const f of g.fields ?? []) out[f.label] = f.value;
  return out;
}

// One plain-language line describing what an offer will do in production.
export interface Scenario {
  headline: string;
  detail: string;
  live: boolean;
}
export interface PublishWarning {
  label: string;
}

// Translate the live widget config into readable scenarios + heuristic warnings
// so an author can sanity-check a release before it goes out (§9).
export function summarizeWidget(variant: VariantWorkspace | null): {
  scenarios: Scenario[];
  warnings: PublishWarning[];
} {
  const roots = (variant?.structure ?? []) as unknown as Loose[];
  const offersNode = roots.find((n) => n.id === "wg-offers");
  const scenarios: Scenario[] = [];
  const warnings: PublishWarning[] = [];
  for (const band of offersNode?.children ?? []) {
    for (const offer of band.children ?? []) {
      const f = fieldsOf(offer);
      const staticId = f["Cancellation Product Static ID"] || "";
      const plan = staticId || "a plan";
      const segment = f["Segment Name (Optional)"] || "any segment";
      const live = (f["Live in flow"] || "Not live") !== "Not live";
      const code = f["Voucher Code"] || f["Product Static ID"] || "";
      scenarios.push({
        headline: offer.label,
        detail: `${band.label.replace(/ Offers$/, "")} · ${f["Type"] || "Offer"} — customers on ${plan} matching ${segment}${code ? ` get ${code}` : ""}.`,
        live,
      });
      if (!staticId)
        warnings.push({ label: `“${offer.label}” has no Cancellation Product Static ID.` });
      if (!code && f["Suppress default offer"] !== "true")
        warnings.push({ label: `“${offer.label}” has no product/voucher code.` });
    }
  }
  return { scenarios, warnings };
}

// §9 Pre-publish "are you sure" — a readable summary + validation gate. Publish
// stays possible even with warnings (auto-save philosophy), but the author must
// consciously confirm ("Publish anyway").
export function PrePublishDialog({
  open,
  onOpenChange,
  onConfirm,
  variant,
  issueCount,
  env,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: () => void;
  variant: VariantWorkspace | null;
  issueCount: number;
  env: string;
}) {
  const { scenarios, warnings } = summarizeWidget(variant);
  const totalWarnings = warnings.length + issueCount;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[640px] p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>Publish retention widget?</DialogTitle>
          <DialogDescription>
            This publishes the live config to <strong>{env}</strong>. Review the
            expected behaviour below before confirming.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[52vh] min-h-0 px-5">
          <section className="flex flex-col gap-2 py-2">
            <h4 className="text-[length:var(--type-label-md-size)] leading-[length:var(--type-label-md-lh)] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              What customers will see · {scenarios.length} offers
            </h4>
            <ul className="flex flex-col divide-y divide-[var(--color-border-subtle)]">
              {scenarios.slice(0, 8).map((s, i) => (
                <li key={i} className="flex items-start gap-2 py-1.5 text-[length:var(--type-body-md-size)] leading-[length:var(--type-body-md-lh)]">
                  <Badge variant={s.live ? "success" : "default"}>
                    {s.live ? "Live" : "Idle"}
                  </Badge>
                  <span className="min-w-0">
                    <span className="font-medium text-foreground">{s.headline}</span>
                    <span className="block text-[length:var(--type-body-sm-size)] leading-[length:var(--type-body-sm-lh)] text-muted-foreground">{s.detail}</span>
                  </span>
                </li>
              ))}
              {scenarios.length > 8 && (
                <li className="py-1.5 text-[length:var(--type-body-sm-size)] leading-[length:var(--type-body-sm-lh)] text-muted-foreground">
                  + {scenarios.length - 8} more…
                </li>
              )}
            </ul>
          </section>
          <section className="flex flex-col gap-1.5 border-t border-[var(--color-border-subtle)] py-3">
            <h4 className="text-[length:var(--type-label-md-size)] leading-[length:var(--type-label-md-lh)] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              Pre-publish checks
            </h4>
            {totalWarnings === 0 ? (
              <p className="flex items-center gap-1.5 text-[length:var(--type-body-md-size)] leading-[length:var(--type-body-md-lh)] text-[var(--color-status-success)]">
                <MSym name="check_circle" size={16} /> No issues detected.
              </p>
            ) : (
              <ul className="flex flex-col gap-1 text-[length:var(--type-body-md-size)] leading-[length:var(--type-body-md-lh)] text-[var(--color-status-warning)]">
                {issueCount > 0 && (
                  <li className="flex items-center gap-1.5">
                    <MSym name="warning" size={16} /> {issueCount} required field
                    {issueCount === 1 ? "" : "s"} still empty.
                  </li>
                )}
                {warnings.slice(0, 6).map((w, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <MSym name="warning" size={16} /> {w.label}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </ScrollArea>
        <DialogFooter className="px-5 pb-5">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {totalWarnings > 0 ? "Publish anyway" : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// §7 Schedule a release — mirrors the scheduled-publish other Iceberg pages
// support. Pick a date/time; on confirm the shell records it and shows a chip.
export function ScheduleDialog({
  open,
  onOpenChange,
  onSchedule,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSchedule: (whenIso: string) => void;
}) {
  const [when, setWhen] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Schedule release</DialogTitle>
          <DialogDescription>
            Publish this widget automatically at a future date and time, the same
            way scheduled pages release.
          </DialogDescription>
        </DialogHeader>
        {/* Body padding matches the header/footer (px-5) so the field aligns
            with the title and has breathing room from both dividers. */}
        <div className="px-5 py-4">
          <label
            htmlFor="schedule-release-at"
            className="mb-1.5 block text-[length:var(--type-label-md-size)] leading-[length:var(--type-label-md-lh)] font-medium text-muted-foreground"
          >
            Release at
          </label>
          <input
            id="schedule-release-at"
            type="datetime-local"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-[var(--color-bg-subtle)] px-3 text-[length:var(--type-body-md-size)] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            disabled={!when}
            onClick={() => {
              if (!when) return;
              onSchedule(when);
              onOpenChange(false);
            }}
          >
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// §8 Publish / release history. Sample entries model the real per-variant audit
// trail so authors can see what changed and when without leaving the editor.
export interface HistoryEntry {
  when: string;
  who: string;
  action: string;
  note?: string;
  tone?: "success" | "info" | "warning" | "default";
}
const WIDGET_HISTORY: HistoryEntry[] = [
  { when: "Today · 09:42", who: "you", action: "Edited", note: "Added BrandM acquisition band", tone: "default" },
  { when: "Yesterday · 16:10", who: "M. Rivera", action: "Published", note: "to Production", tone: "success" },
  { when: "Yesterday · 15:30", who: "M. Rivera", action: "Sent to QA", tone: "info" },
  { when: "2 days ago · 11:05", who: "A. Chen", action: "Scheduled", note: "for release Fri 09:00", tone: "warning" },
  { when: "5 days ago · 14:22", who: "A. Chen", action: "Published", note: "to Production", tone: "success" },
];

export function HistoryDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px] p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>Publish & release history</DialogTitle>
          <DialogDescription>
            Recent changes to this widget variant. New activity is flagged in the
            editor bar so you know when it changed.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[56vh] min-h-0 px-5 pb-2">
          <ol className="flex flex-col divide-y divide-[var(--color-border-subtle)]">
            {WIDGET_HISTORY.map((h, i) => (
              <li key={i} className="flex items-start gap-3 py-2.5">
                <Badge variant={h.tone ?? "default"}>{h.action}</Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-[length:var(--type-body-md-size)] leading-[length:var(--type-body-md-lh)] text-foreground">
                    {h.note ? `${h.action} ${h.note}` : h.action}
                  </p>
                  <p className="text-[length:var(--type-body-sm-size)] leading-[length:var(--type-body-sm-lh)] text-muted-foreground">
                    {h.when} · {h.who}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </ScrollArea>
        <DialogFooter className="px-5 pb-5">
          <Button variant="default" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
