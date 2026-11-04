import { PAGES_TREE, VARIANTS, findNode, type TreeNode } from "./data";
import { STARTER_TEMPLATE_VERSION, instantiateStarter, starterById } from "./starter-templates";

// Create-page logic for the Pages "+" popup. The Name field is the slug, e.g.
// "/plans/all-monthly". Created pages go into the in-memory Pages tree.

export interface PageRef {
  id: string;
  label: string;
}

function allNodes(nodes: TreeNode[] = PAGES_TREE, out: TreeNode[] = []): TreeNode[] {
  for (const n of nodes) {
    out.push(n);
    if (n.children) allNodes(n.children, out);
  }
  return out;
}

// Page routes only (variants excluded).
function pageNodes(): TreeNode[] {
  return allNodes().filter((n) => n.type !== "variant");
}

// "Foo Bar/x" → "/foo-bar/x". Returns "" when nothing usable is left.
export function normalizeSlug(raw: string): string {
  const segments = raw
    .split("/")
    .map((seg) =>
      seg
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/^-+|-+$/g, "")
    )
    .filter(Boolean);
  return segments.length ? `/${segments.join("/")}` : "";
}

export function findExistingPage(slug: string): PageRef | null {
  if (!slug) return null;
  const hit = pageNodes().find((n) => n.label === slug);
  return hit ? { id: hit.id, label: hit.label } : null;
}

// Existing slugs that contain the typed text, for the "already exists" prompt.
export function suggestExistingPages(slug: string, limit = 6): PageRef[] {
  if (!slug) return [];
  return pageNodes()
    .filter((n) => n.label !== slug && n.label.includes(slug))
    .slice(0, limit)
    .map((n) => ({ id: n.id, label: n.label }));
}

// Nearest existing ancestor of a slug, e.g. "/plans/x/y" → "/plans/x" if it exists.
export function parentPageFor(slug: string): PageRef | null {
  const segments = slug.split("/").filter(Boolean);
  for (let i = segments.length - 1; i >= 1; i--) {
    const parent = findExistingPage(`/${segments.slice(0, i).join("/")}`);
    if (parent) return parent;
  }
  return null;
}

function uniqueId(base: string, taken: Set<string>): string {
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

export type CreatePageResult = { variantId: string; nodeId: string } | { error: string };

// starterId: a STARTER_TEMPLATES id, or null for a blank page.
export function createPage({
  slug,
  starterId,
}: {
  slug: string;
  starterId: string | null;
}): CreatePageResult {
  if (!slug) return { error: "Enter a name for the page." };
  if (findExistingPage(slug)) return { error: `${slug} already exists.` };

  const starter = starterId ? starterById(starterId) : undefined;
  if (starterId && !starter) return { error: "Unknown starter template." };

  const taken = new Set<string>([
    ...allNodes().map((n) => n.id),
    ...Object.keys(VARIANTS),
  ]);
  const baseId = slug.slice(1).replace(/\//g, "-");
  const nodeId = uniqueId(baseId, taken);
  taken.add(nodeId);
  const variantId = uniqueId(`pg-${baseId}`, taken);

  const structure = starter ? instantiateStarter(starter) : [];
  const variantName = starter ? starter.name : "Blank page";
  VARIANTS[variantId] = {
    id: variantId,
    name: variantName,
    structure,
    previewData: {
      title: variantName,
      subtitle: starter ? `${starter.steps.length} modules` : "No modules yet",
      tone: "neutral",
      body: starter
        ? "Starter template. Edit the modules, or add and remove them."
        : "Empty page. Add a layout to start building.",
    },
    defaultSelectionId: structure[0]?.id ?? "",
    ...(starter ? { templateId: starter.id, templateVersion: STARTER_TEMPLATE_VERSION } : {}),
  };

  const node: TreeNode = {
    id: nodeId,
    label: slug,
    type: "page",
    kind: "path",
    children: [{ id: variantId, label: variantName, type: "variant" }],
  };

  const parent = parentPageFor(slug);
  const parentNode = parent ? findNode(PAGES_TREE, parent.id) : null;
  if (parentNode) {
    parentNode.children = [...(parentNode.children ?? []), node];
  } else {
    PAGES_TREE.push(node);
  }

  return { variantId, nodeId };
}
