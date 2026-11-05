import { Fragment, useEffect, useMemo, useState } from "react";
import { Button, IconButton } from "../ui-lib/Button";
import { Badge } from "../ui-lib/Badge";
import { SearchInput } from "../ui-lib/TextInput";
import { FilterChip } from "../ui-lib/FilterChip";
import { TableFooter } from "../ui-lib/TableFooter";
import { EmptyState } from "../ui-lib/EmptyState";
import { BrowseGroupHeader, useGroupHues } from "../ui-lib/BrowseGroupHeader";
import { SortHeaderCell, compareSortValues, nextSort, type SortState } from "../ui-lib/SortableHeader";
import {
  buildWidgetRows,
  groupHueVars,
  groupWidgetRows,
  WIDGET_TYPE_ORDER,
  WIDGET_TYPE_SWATCH,
  routes,
  navigate,
  type GroupSwatch,
  type WidgetChildRow,
  type WidgetFormat,
  type WidgetRow,
  type WidgetType,
} from "../browse";
import { CreateWidgetDialog } from "../regions/CreateWidgetDialog";

type SortKey = "slug" | "widgetName" | "createdAt" | "modifiedAt";

const SORT_HEADERS: { key: SortKey; label: string }[] = [
  { key: "slug", label: "Slug" },
  { key: "widgetName", label: "Name" },
  { key: "createdAt", label: "Created" },
  { key: "modifiedAt", label: "Modified" },
];

function sortValue(row: WidgetRow, key: SortKey): string | number {
  switch (key) {
    case "slug":
      return row.slug;
    case "widgetName":
      return row.widgetName;
    case "createdAt":
      return row.createdAt;
    case "modifiedAt":
      return row.modifiedAt;
  }
}

// Production format glyphs (list-item.component): HTML → "</>", JSON → "{…}".
function formatGlyph(format: WidgetFormat): string {
  return format === "HTML" ? "</>" : "{…}";
}

// Widgets list, in the V4 layout: rows grouped by widget Type (Retention first)
// under collapsible headers, with a Type filter row and a HTML/JSON format filter.
// A widget with variants shows a "N variants" badge; its chevron expands the
// variants inline, and each variant opens its own editor. "+" opens the Create
// new Widget dialog.
export function WidgetsView() {
  // Bumped when a widget is created, so the rows include it.
  const [rowsVersion, setRowsVersion] = useState(0);
  const allRows = useMemo(() => buildWidgetRows(), [rowsVersion]);
  const { swatchFor, setGroupHue } = useGroupHues();
  const [query, setQuery] = useState("");
  const [formatFilter, setFormatFilter] = useState<"all" | WidgetFormat>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | WidgetType>("all");
  const [sort, setSort] = useState<SortState<SortKey>>({ key: "modifiedAt", dir: "desc" });
  const onSort = (key: SortKey) => setSort((prev) => nextSort(prev, key));
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  // Rows expand independently to show their variants and pages.
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());
  // Per-Type collapse memory for the group section headers.
  const [collapsedGroups, setCollapsedGroups] = useState<Set<WidgetType>>(() => new Set());
  const [createOpen, setCreateOpen] = useState(false);

  const q = query.trim().toLowerCase();
  const searched = q
    ? allRows.filter((r) => r.slug.toLowerCase().includes(q) || r.widgetName.toLowerCase().includes(q))
    : allRows;

  const formatCounts = useMemo(() => {
    const acc: Record<WidgetFormat, number> = { HTML: 0, JSON: 0 };
    for (const r of searched) acc[r.format] += 1;
    return acc;
  }, [searched]);

  const formatted =
    formatFilter === "all" ? searched : searched.filter((r) => r.format === formatFilter);

  // Per-Type counts over the current search + format results drive the Type chips.
  const typeCounts = useMemo(() => {
    const acc = {} as Record<WidgetType, number>;
    for (const r of formatted) acc[r.type] = (acc[r.type] ?? 0) + 1;
    return acc;
  }, [formatted]);

  // If the active type has no matches after a search, fall back to All.
  const effectiveType = typeFilter !== "all" && !typeCounts[typeFilter] ? "all" : typeFilter;

  const filtered = useMemo(() => {
    const base = effectiveType === "all" ? formatted : formatted.filter((r) => r.type === effectiveType);
    // Sort before grouping and paging, so each group keeps the chosen order.
    return [...base].sort((a, b) =>
      compareSortValues(sortValue(a, sort.key), sortValue(b, sort.key), sort.dir),
    );
  }, [formatted, effectiveType, sort]);

  useEffect(() => setPage(0), [q, formatFilter, effectiveType, pageSize, sort]);

  const pageRows = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const groups = groupWidgetRows(pageRows);

  // Searching, or narrowing to one type, opens every visible group.
  const forceOpen = q !== "" || effectiveType !== "all";
  const isCollapsed = (t: WidgetType) => !forceOpen && collapsedGroups.has(t);

  const toggleRow = (id: string) =>
    setOpenIds((cur) => {
      const next = new Set(cur);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const toggleGroup = (t: WidgetType) =>
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });

  return (
    <div className="ui-ws-browse">
      <header className="ui-ws-browse__head">
        <div className="ui-ws-browse__title">
          <h1 className="ui-ws-browse__h1">Widgets</h1>
          <IconButton
            icon="plus"
            aria-label="Create widget"
            className="ui-ws-browse__add"
            onClick={() => setCreateOpen(true)}
          />
        </div>
      </header>

      <div className="ui-ws-browse__toolbar">
        <SearchInput
          size="sm"
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
          placeholder="Search…"
        />
        <div className="ui-ws-browse__tools">
          <Button variant="secondary" size="sm">
            View Archived Widgets
          </Button>
        </div>
      </div>

      <div className="ui-ws-browse__filters">
        <FilterChip
          label={`All (${searched.length})`}
          active={effectiveType === "all"}
          onClick={() => setTypeFilter("all")}
        />
        {WIDGET_TYPE_ORDER.filter((t) => typeCounts[t] > 0).map((t) => (
          <FilterChip
            key={t}
            label={`${t} (${typeCounts[t]})`}
            active={effectiveType === t}
            onClick={() => setTypeFilter((f) => (f === t ? "all" : t))}
          />
        ))}
        <span className="ui-ws-browse__filter-sep" aria-hidden="true" />
        {(["HTML", "JSON"] as WidgetFormat[]).map((f) => (
          <FilterChip
            key={f}
            label={`${f} (${formatCounts[f]})`}
            active={formatFilter === f}
            onClick={() => setFormatFilter((cur) => (cur === f ? "all" : f))}
          />
        ))}
      </div>

      <div className="ui-ws-browse__table ui-ws-browse__table--widgets" role="table" aria-label="Widgets">
        <div className="ui-ws-browse__row ui-ws-browse__row--head" role="row">
          {SORT_HEADERS.map((h) => (
            <SortHeaderCell key={h.key} sortKey={h.key} label={h.label} sort={sort} onSort={onSort} />
          ))}
          <span role="columnheader" aria-label="Actions" />
        </div>

        {groups.length === 0 ? (
          <EmptyState
            title="No widgets match your search"
            description="Try a different slug or clear the search and filters."
          />
        ) : (
          groups.map((g) => {
            const collapsed = isCollapsed(g.type);
            const swatch = swatchFor(g.type, WIDGET_TYPE_SWATCH[g.type]);
            return (
              <Fragment key={g.type}>
                <BrowseGroupHeader
                  name={g.type}
                  count={g.rows.length}
                  collapsed={collapsed}
                  swatch={swatch}
                  onToggle={() => toggleGroup(g.type)}
                  onSwatchChange={(id) => setGroupHue(g.type, id)}
                />
                {!collapsed &&
                  g.rows.map((r) => (
                    <WidgetRowItem
                      key={r.id}
                      row={r}
                      swatch={swatch}
                      expanded={openIds.has(r.id)}
                      onToggle={() => toggleRow(r.id)}
                    />
                  ))}
              </Fragment>
            );
          })
        )}
      </div>

      <TableFooter
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <CreateWidgetDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(id, openEditor) => {
          if (openEditor) navigate(routes.editor("widget", id));
          else setRowsVersion((v) => v + 1);
        }}
      />
    </div>
  );
}

function WidgetRowItem({
  row,
  swatch,
  expanded,
  onToggle,
}: {
  row: WidgetRow;
  swatch: GroupSwatch;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasVariants = row.variants.length > 0;
  const hasChildren = hasVariants || row.children.length > 0;
  // A widget with no variants or pages is itself the editable experience.
  const openSelf = () => navigate(routes.editor("widget", row.id));
  return (
    <Fragment>
      <div className="ui-ws-browse__row ui-ws-browse__row--widgets" role="row" style={groupHueVars(swatch)}>
        <span className="ui-ws-browse__slug ui-ws-browse__primary" role="cell">
          {hasChildren ? (
            <IconButton
              icon={expanded ? "chevron-down" : "chevron-right"}
              aria-label={expanded ? "Collapse" : "Expand"}
              aria-expanded={expanded}
              size="sm"
              onClick={onToggle}
            />
          ) : (
            <span className="ui-ws-browse__chevron-spacer" aria-hidden="true" />
          )}
          <span className="ui-ws-browse__markers">
            <span className="ui-ws-browse__widget-fam-dot" aria-hidden="true" />
            <span className="ui-ws-browse__format" title={row.format} aria-label={row.format}>
              {formatGlyph(row.format)}
            </span>
          </span>
          <Badge variant={row.status === "Published" ? "success" : "default"}>{row.status}</Badge>
          {/* Slug and variant badge share one grid cell, so the badge stays on the slug's line. */}
          <span className="ui-ws-browse__slug-name">
            <button
              type="button"
              className="ui-ws-browse__slug-link"
              onClick={hasChildren ? onToggle : openSelf}
            >
              {row.slug}
            </button>
            {hasVariants && (
              <button
                type="button"
                className="ui-ws-browse__variants-link"
                onClick={() => navigate(routes.widgetVariants(row.id))}
                title="Open the variants list"
              >
                <Badge variant="info">
                  {row.variantCount} {row.variantCount === 1 ? "variant" : "variants"}
                </Badge>
              </button>
            )}
          </span>
        </span>
        <span role="cell" className="ui-ws-browse__name">{row.widgetName}</span>
        <span role="cell" className="ui-ws-browse__muted">{row.created}</span>
        <span role="cell" className="ui-ws-browse__muted">{row.modified}</span>
        <span role="cell" className="ui-ws-browse__actions">
          <IconButton icon="eye" aria-label="Preview" size="sm" />
          <IconButton icon="copy" aria-label="Duplicate" size="sm" />
          <IconButton icon="archive" aria-label="Archive" size="sm" />
          <IconButton icon="trash" aria-label="Delete" size="sm" variant="tertiary" />
        </span>
      </div>
      {hasChildren && expanded && (
        <div className="ui-ws-browse__widget-children" role="rowgroup">
          {hasVariants && (
            <>
              <div className="ui-ws-browse__widget-children-label">Variants:</div>
              {row.variants.map((v) => (
                <WidgetChildItem
                  key={v.id}
                  child={v}
                  onOpen={() => navigate(routes.editor("widget", v.id))}
                />
              ))}
            </>
          )}
          {row.children.length > 0 && (
            <>
              <div className="ui-ws-browse__widget-children-label">Pages:</div>
              {row.children.map((c) => (
                <WidgetChildItem key={c.id} child={c} />
              ))}
            </>
          )}
        </div>
      )}
    </Fragment>
  );
}

// A variant opens its editor. A page that uses the widget is read-only here: the
// page itself is authored in the Pages editor.
function WidgetChildItem({ child, onOpen }: { child: WidgetChildRow; onOpen?: () => void }) {
  return (
    <div className="ui-ws-browse__widget-child" role="row">
      <Badge variant={child.status === "Published" ? "success" : "default"}>{child.status}</Badge>
      {onOpen ? (
        <button type="button" className="ui-ws-browse__slug-link" onClick={onOpen}>
          {child.name}
        </button>
      ) : (
        <span className="ui-ws-browse__slug-link">{child.name}</span>
      )}
    </div>
  );
}
