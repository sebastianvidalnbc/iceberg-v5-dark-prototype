// Message protocol between the CMS shell (parent) and the preview renderer
// (iframe). This mirrors real Iceberg's editor↔preview bridge
// (iceberg.cmspreview.ts + use-preview-prop-updater): the CMS posts render /
// highlight / pick-mode messages into the frame, and the frame posts ready +
// section-selected back out. The renderer is a SEPARATE document (renderer.html)
// so the customer output is truly decoupled from the CMS chrome — the analog of
// the SSR renderer service, client-rendered here since GitHub Pages can't host
// a server.
import type { PreviewModel } from "../previewModel";

// The key under which the CMS mirrors the latest model so a standalone
// "Preview In Tab" window (no parent to message it) can still render.
export const PREVIEW_STORAGE_KEY = "iceberg-v4-preview-model";

// CMS → iframe.
export type CmsToPreview =
  | {
      source: "iceberg-cms";
      type: "render";
      model: PreviewModel;
      audience: string;
      selectedId: string | null;
      pickMode: boolean;
    }
  | { source: "iceberg-cms"; type: "pick-mode"; enabled: boolean };

// iframe → CMS.
export type PreviewToCms =
  | { source: "iceberg-preview"; type: "ready" }
  // Acknowledges a "render" was applied, so the CMS knows the frame is live.
  | { source: "iceberg-preview"; type: "rendered" }
  // A card/section was clicked while Pick Section mode is active.
  | { source: "iceberg-preview"; type: "section-selected"; nodeId: string };

export const CMS_SOURCE = "iceberg-cms";
export const PREVIEW_SOURCE = "iceberg-preview";
