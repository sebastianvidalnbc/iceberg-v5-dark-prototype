import type { StructureNode } from "./data";

// Pure, immutable tree operations backing the Structure tree's authoring
// interactions (drag-reorder + the overflow/context menu: rename, duplicate,
// copy, paste, disable, delete). All helpers return NEW arrays/nodes so React
// state updates stay referentially honest; none mutate their inputs.
//
// Nodes are addressed by id. Reordering is scoped to a sibling list identified
// by its parent id (null = the Structure root list), matching the per-list
// drag model in `useDrag`.

let cloneCounter = 0;

// Structural deep-copy that PRESERVES ids — used to seed editable per-experience
// state from the shared static dataset without ever mutating that constant.
export function cloneKeepIds(nodes: StructureNode[]): StructureNode[] {
  return nodes.map((n) => ({
    ...n,
    children: n.children ? cloneKeepIds(n.children) : undefined,
  }));
}

// Deep-clone a node, assigning fresh unique ids throughout so a duplicated /
// pasted subtree never collides with the original (ids drive selection).
export function cloneWithNewIds(node: StructureNode): StructureNode {
  const suffix = `copy-${Date.now().toString(36)}-${(cloneCounter++).toString(36)}`;
  const next: StructureNode = {
    ...node,
    id: `${node.id}-${suffix}`,
    children: node.children?.map(cloneWithNewIds),
  };
  return next;
}

export function findNodeById(
  nodes: StructureNode[],
  id: string,
): StructureNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const hit = findNodeById(n.children, id);
      if (hit) return hit;
    }
  }
  return null;
}

// The ids of every ancestor of `id` (root → … → immediate parent), so the path
// to a node can be expanded and the node revealed in the tree. Excludes the node
// itself; returns [] if not found or if it's a root node.
export function ancestorIdsOf(nodes: StructureNode[], id: string): string[] {
  const find = (list: StructureNode[]): string[] | null => {
    for (const n of list) {
      if (n.id === id) return [];
      if (n.children) {
        const sub = find(n.children);
        if (sub) return [n.id, ...sub];
      }
    }
    return null;
  };
  return find(nodes) ?? [];
}

export function renameNode(
  nodes: StructureNode[],
  id: string,
  label: string,
): StructureNode[] {
  return nodes.map((n) => {
    if (n.id === id) return { ...n, label };
    if (n.children) return { ...n, children: renameNode(n.children, id, label) };
    return n;
  });
}

// Write a single field VALUE onto an instance's `content`, returning a new tree.
// This is the V4 analog of the real reducer's
// `updatePlaceholderContentByPath → mergeIn(['content', ...path])`: the edited
// value is stored on the element instance within the variant's Structure, so it
// persists across selection changes and drives both Properties and the preview.
export function setNodeContent(
  nodes: StructureNode[],
  id: string,
  field: string,
  value: string,
): StructureNode[] {
  return nodes.map((n) => {
    if (n.id === id) {
      return { ...n, content: { ...(n.content ?? {}), [field]: value } };
    }
    if (n.children) {
      return { ...n, children: setNodeContent(n.children, id, field, value) };
    }
    return n;
  });
}

// The Design radio on a section writes here (not to content): design is a
// structural property of the section, read by its Section Options.
export const DESIGN_FIELD = "Design";

export function setNodeDesign(
  nodes: StructureNode[],
  id: string,
  design: StructureNode["design"],
): StructureNode[] {
  return nodes.map((n) => {
    if (n.id === id) return { ...n, design };
    if (n.children) return { ...n, children: setNodeDesign(n.children, id, design) };
    return n;
  });
}

export function toggleDisabled(
  nodes: StructureNode[],
  id: string,
): StructureNode[] {
  return nodes.map((n) => {
    if (n.id === id) return { ...n, disabled: !n.disabled };
    if (n.children) return { ...n, children: toggleDisabled(n.children, id) };
    return n;
  });
}

export function deleteNode(nodes: StructureNode[], id: string): StructureNode[] {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) =>
      n.children ? { ...n, children: deleteNode(n.children, id) } : n,
    );
}

// Insert `incoming` immediately after the node with `afterId`, in that node's
// sibling list (at any depth). If `afterId` is null/not found, append to root.
export function insertAfter(
  nodes: StructureNode[],
  afterId: string | null,
  incoming: StructureNode,
): StructureNode[] {
  if (!afterId) return [...nodes, incoming];
  let inserted = false;
  const walk = (list: StructureNode[]): StructureNode[] => {
    const out: StructureNode[] = [];
    for (const n of list) {
      const nextNode = n.children ? { ...n, children: walk(n.children) } : n;
      out.push(nextNode);
      if (n.id === afterId) {
        out.push(incoming);
        inserted = true;
      }
    }
    return out;
  };
  const result = walk(nodes);
  return inserted ? result : [...nodes, incoming];
}

// Insert `incoming` immediately BEFORE the node with `beforeId`, in that node's
// sibling list (at any depth). If `beforeId` is null/not found, prepend to root.
export function insertBefore(
  nodes: StructureNode[],
  beforeId: string | null,
  incoming: StructureNode,
): StructureNode[] {
  if (!beforeId) return [incoming, ...nodes];
  let inserted = false;
  const walk = (list: StructureNode[]): StructureNode[] => {
    const out: StructureNode[] = [];
    for (const n of list) {
      if (n.id === beforeId) {
        out.push(incoming);
        inserted = true;
      }
      out.push(n.children ? { ...n, children: walk(n.children) } : n);
    }
    return out;
  };
  const result = walk(nodes);
  return inserted ? result : [incoming, ...nodes];
}

// Append `incoming` as the LAST child of the node with `parentId` (creating the
// children array if absent). If `parentId` is null/not found, append to root.
export function appendChild(
  nodes: StructureNode[],
  parentId: string | null,
  incoming: StructureNode,
): StructureNode[] {
  if (!parentId) return [...nodes, incoming];
  return nodes.map((n) => {
    if (n.id === parentId) {
      return { ...n, children: [...(n.children ?? []), incoming] };
    }
    if (n.children) return { ...n, children: appendChild(n.children, parentId, incoming) };
    return n;
  });
}

// Duplicate the node with `id`, inserting the clone right after it (same list).
export function duplicateNode(
  nodes: StructureNode[],
  id: string,
): StructureNode[] {
  const original = findNodeById(nodes, id);
  if (!original) return nodes;
  return insertAfter(nodes, id, cloneWithNewIds(original));
}

// Reorder within a single sibling list identified by `parentId` (null = root).
export function moveWithin(
  nodes: StructureNode[],
  parentId: string | null,
  from: number,
  to: number,
): StructureNode[] {
  const reorder = (list: StructureNode[]): StructureNode[] => {
    if (from === to || from < 0 || to < 0) return list;
    if (from >= list.length || to >= list.length) return list;
    const next = [...list];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
  };
  if (parentId === null) return reorder(nodes);
  return nodes.map((n) => {
    if (n.id === parentId && n.children) {
      return { ...n, children: reorder(n.children) };
    }
    if (n.children) return { ...n, children: moveWithin(n.children, parentId, from, to) };
    return n;
  });
}
