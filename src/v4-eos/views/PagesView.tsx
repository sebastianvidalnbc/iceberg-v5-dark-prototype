import { useEffect, useMemo, useState } from "react";
import { Button, IconButton } from "../ui-lib/Button";
import { Icon } from "../ui-lib/Icon";
import { CreatePageDialog } from "../regions/CreatePageDialog";
import { Badge, StatusDot } from "../ui-lib/Badge";
import { SearchInput } from "../ui-lib/TextInput";
import { EmptyState } from "../ui-lib/EmptyState";
import { FilterChip } from "../ui-lib/FilterChip";
import { TableFooter } from "../ui-lib/TableFooter";
import {
  buildSlugRows,
  GROUP_SWATCHES,
  groupHueVars,
  groupSwatch,
  routes,
  navigate,
  type GroupSwatch,
  type GroupSwatchId,
  type SlugRow,
} from "../browse";
import { SortHeaderCell, compareSortValues, nextSort, type SortState } from "../ui-lib/SortableHeader";

type VisibilityFilter = "all" | "Visible" | "Hidden";

type SortKey = "slug" | "visibility" | "unpublishAt" | "createdAt" | "modifiedAt";

const SORT_HEADERS: { key: SortKey; label: string }[] = [
  { key: "slug", label: "Slug" },
  { key: "visibility", label: "Search Visibility" },
  { key: "unpublishAt", label: "Un-Publish Date" },
  { key: "createdAt", label: "Created" },
  { key: "modifiedAt", label: "Modified" },
];

function sortValue(row: SlugRow, key: SortKey): string | number | null {
  switch (key) {
    case "slug":
      return row.slug;
    case "visibility":
      return row.visibility;
    case "unpublishAt":
      return row.unpublishAt;
    case "createdAt":
      return row.createdAt;
    case "modifiedAt":
      return row.modifiedAt;
  }
}

function compareRows(a: SlugRow, b: SlugRow, sort: SortState<SortKey>): number {
  return compareSortValues(sortValue(a, sort.key), sortValue(b, sort.key), sort.dir);
}

// Sorts sibling rows within each parent so the tree stays intact. Top-level
// groups keep their order (a group header shows no column data of its own).
// In flat mode (search or filter active) the whole list is sorted.
function orderRows(allRows: SlugRow[], sort: SortState<SortKey>, flat: boolean): SlugRow[] {
  if (flat) return [...allRows].sort((a, b) => compareRows(a, b, sort));
  const childrenOf = new Map<string, SlugRow[]>();
  const top: SlugRow[] = [];
  for (const r of allRows) {
    if (r.parentId === null) {
      top.push(r);
    } else {
      childrenOf.set(r.parentId, [...(childrenOf.get(r.parentId) ?? []), r]);
    }
  }
  const out: SlugRow[] = [];
  const emit = (r: SlugRow) => {
    out.push(r);
    const kids = childrenOf.get(r.id);
    if (kids) [...kids].sort((a, b) => compareRows(a, b, sort)).forEach(emit);
  };
  top.forEach(emit);
  return out;
}

// Pages list — the top browse level, mirroring real Iceberg's Pages table
// (Figma 488:8901: CardHeader → Toolbar → Filters → Table → TableFooter).
// Top-level slugs expand to reveal sub-pages; a row that owns Variants is
// clickable through to the Variants view. All CTAs besides search/filters/
// pagination are prototype no-ops.
export function PagesView() {
  // Bumped after a page is created so the list rebuilds from the updated tree.
  const [treeVersion, setTreeVersion] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const allRows = useMemo(() => buildSlugRows(), [treeVersion]);
  // Every top-level slug gets a default hue for its marker bar. Colour is not
  // user-selectable on this list.
  const hueByGroup = useMemo(() => {
    const map: Record<string, GroupSwatchId> = {};
    allRows
      .filter((r) => r.depth === 0)
      .forEach((r, i) => {
        map[r.groupId] = GROUP_SWATCHES[i % GROUP_SWATCHES.length].id;
      });
    return map;
  }, [allRows]);
  const swatchOf = (groupId: string): GroupSwatch => groupSwatch(hueByGroup[groupId] ?? "gray");
  const [query, setQuery] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>("all");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<SortState<SortKey>>({ key: "modifiedAt", dir: "asc" });
  const onSort = (key: SortKey) => setSort((prev) => nextSort(prev, key));
  // Locally track which slugs are expanded (top-level rows collapsed by default,
  // except those already expanded in the sample tree cannot be known here, so we
  // start with all depth-0 rows expanded to reveal the nested structure).
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(allRows.filter((r) => r.depth === 0).map((r) => r.id))
  );

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // A row is visible when every ancestor page in its path is expanded. Because
  // rows are pre-ordered depth-first, we can hide any row whose nearest shown
  // ancestor is collapsed by tracking a "hidden below depth" cursor. A search
  // query or an active Visibility filter drops the tree structure in favour of
  // a flat, fully-matching list (same as real Iceberg's filtered results).
  const q = query.trim().toLowerCase();
  const flatMode = q !== "" || visibilityFilter !== "all";
  // Pagination counts top-level slugs only. Each unit is one top-level row plus
  // its visible sub-pages, so expanding or collapsing a group never moves rows
  // between pages. Flat mode (search/filter) has no tree, so each match is a unit.
  const units = useMemo<SlugRow[][]>(() => {
    if (flatMode) {
      const matches = allRows.filter((r) => {
        if (q && !r.slug.toLowerCase().includes(q)) return false;
        if (visibilityFilter !== "all" && r.visibility !== visibilityFilter) return false;
        return true;
      });
      return orderRows(matches, sort, true).map((r) => [r]);
    }
    const out: SlugRow[][] = [];
    let hiddenBelow = Infinity;
    for (const r of orderRows(allRows, sort, false)) {
      if (r.depth === 0) {
        out.push([r]);
        hiddenBelow = Infinity;
      } else if (r.depth > hiddenBelow) {
        continue;
      } else {
        out[out.length - 1].push(r);
      }
      hiddenBelow = r.hasChildren && !expanded.has(r.id) ? r.depth : Infinity;
    }
    return out;
  }, [allRows, expanded, q, visibilityFilter, flatMode, sort]);

  // Reset to page 1 whenever the visible row set changes shape.
  useEffect(() => setPage(0), [q, visibilityFilter, pageSize, sort]);

  const pageRows = units.slice(page * pageSize, page * pageSize + pageSize).flat();

  return (
    <div className="ui-ws-browse">
      <header className="ui-ws-browse__head">
        <div className="ui-ws-browse__title">
          <h1 className="ui-ws-browse__h1">Pages</h1>
          <IconButton
            icon="plus"
            aria-label="Create page"
            className="ui-ws-browse__add"
            onClick={() => setCreateOpen(true)}
          />
        </div>
      </header>
      <CreatePageDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(variantId, openEditor) => {
          setTreeVersion((v) => v + 1);
          if (openEditor) navigate(routes.editor("page", variantId));
        }}
        onOpenExisting={(pageId) => navigate(routes.variants(pageId))}
      />

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
            View Archived Pages
          </Button>
        </div>
      </div>

      <div className="ui-ws-browse__filters">
        <Button variant="tertiary" size="sm" leadingIcon="filter">
          All Filters
        </Button>
        <FilterChip
          label="Visible"
          active={visibilityFilter === "Visible"}
          onClick={() => setVisibilityFilter((f) => (f === "Visible" ? "all" : "Visible"))}
        />
        <FilterChip
          label="Hidden"
          active={visibilityFilter === "Hidden"}
          onClick={() => setVisibilityFilter((f) => (f === "Hidden" ? "all" : "Hidden"))}
        />
        {visibilityFilter !== "all" && (
          <Button variant="tertiary" size="sm" leadingIcon="filter-off" onClick={() => setVisibilityFilter("all")}>
            Clear Filters
          </Button>
        )}
      </div>

      <div className="ui-ws-browse__table ui-ws-browse__table--pages" role="table" aria-label="Pages">
        <div className="ui-ws-browse__row ui-ws-browse__row--head" role="row">
          {SORT_HEADERS.map((h) => (
            <SortHeaderCell key={h.key} sortKey={h.key} label={h.label} sort={sort} onSort={onSort} />
          ))}
          <span role="columnheader" aria-label="Actions" />
        </div>

        {pageRows.length === 0 ? (
          <EmptyState
            title="No pages match your search"
            description="Try a different slug or clear the search/filters."
          />
        ) : (
          pageRows.map((r) => (
            <PageRow
              key={r.id}
              row={r}
              expanded={expanded.has(r.id)}
              swatch={swatchOf(r.groupId)}
              onToggle={() => toggle(r.id)}
            />
          ))
        )}
      </div>

      <TableFooter
        page={page}
        pageSize={pageSize}
        total={units.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}

function PageRow({
  row,
  expanded,
  swatch,
  onToggle,
}: {
  row: SlugRow;
  expanded: boolean;
  swatch: GroupSwatch;
  onToggle: () => void;
}) {
  // Top-level slugs are always clickable: they open their Variants list when
  // they own variants, otherwise the editor. Subpages are clickable when they
  // are a leaf or own variants; a subpage that has its own subpages only expands.
  const isTop = row.depth === 0;
  const ownsVariants = row.variantCount > 0;
  const isLeaf = !row.hasChildren;
  const clickable = isTop || ownsVariants || isLeaf;
  const open = () => {
    if (!clickable) return;
    navigate(ownsVariants ? routes.variants(row.id) : routes.editor("page", row.id));
  };
  // Children indent one level under their top-level slug. Every top-level row
  // (leaf or group) uses the same chevron slot, so they line up.
  return (
    <div
      className={`ui-ws-browse__row${isTop ? " ui-ws-browse__row--top" : ""}`}
      role="row"
      style={groupHueVars(swatch)}
    >
      <span
        className="ui-ws-browse__slug ui-ws-browse__primary"
        role="cell"
        style={{ paddingLeft: `calc(${row.depth} * var(--space-5))` }}
      >
        {row.hasChildren ? (
          <IconButton
            icon={expanded ? "chevron-down" : "chevron-right"}
            aria-label={expanded ? "Collapse" : "Expand"}
            size="sm"
            onClick={onToggle}
          />
        ) : (
          <span className="ui-ws-browse__chevron-spacer" aria-hidden="true" />
        )}
        <span className="ui-ws-browse__markers">
          <span
            className={`ui-ws-browse__protect${row.protect ? " is-on" : ""}`}
            title={row.protect ? "This page is protected" : "This page is not protected"}
            aria-label={row.protect ? "Protected" : "Not protected"}
          >
            <Icon name="protect" size={14} />
          </span>
        </span>
        <Badge variant={row.status === "Published" ? "success" : "default"}>{row.status}</Badge>
        <span className="ui-ws-browse__slug-wrap">
          {clickable ? (
            <button type="button" className="ui-ws-browse__slug-link" onClick={open}>
              {row.slug}
              {ownsVariants && (
                <span className="ui-ws-browse__slug-count">{row.variantCount} variants</span>
              )}
            </button>
          ) : (
            <span className="ui-ws-browse__slug-text">{row.slug}</span>
          )}
          {isTop && row.hasChildren && (
            <span className="ui-ws-browse__top-count" title="Subpages">
              {row.childCount}
            </span>
          )}
        </span>
      </span>
      <span role="cell">
        <StatusDot status={row.visibility === "Visible" ? "success" : "default"}>{row.visibility}</StatusDot>
      </span>
      <span role="cell" className="ui-ws-browse__muted">{row.unpublishDate ?? "—"}</span>
      <span role="cell" className="ui-ws-browse__muted">{row.created}</span>
      <span role="cell" className="ui-ws-browse__muted">{row.modified}</span>
      <span role="cell" className="ui-ws-browse__actions">
        <IconButton icon="eye" aria-label="Preview" size="sm" />
        <IconButton icon="copy" aria-label="Duplicate" size="sm" />
        <IconButton icon="archive" aria-label="Archive" size="sm" />
        <IconButton icon="trash" aria-label="Delete" size="sm" variant="tertiary" />
      </span>
    </div>
  );
}
