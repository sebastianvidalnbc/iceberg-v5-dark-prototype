import { useEffect, useState } from "react";
import type { PreviewModel } from "../previewModel";
import { BrandRender } from "./BrandRender";
import {
  CMS_SOURCE,
  PREVIEW_SOURCE,
  PREVIEW_STORAGE_KEY,
  type CmsToPreview,
  type PreviewToCms,
} from "./protocol";

interface RenderState {
  model: PreviewModel;
  selectedId: string | null;
  pickMode: boolean;
}

const EMPTY: RenderState = {
  model: { variantName: "", sections: [] },
  selectedId: null,
  pickMode: false,
};

// The standalone preview app that runs inside the iframe (renderer.html). It
// receives render/pick-mode messages from the CMS parent and posts ready +
// section-selected back. When opened as a standalone tab (no parent), it falls
// back to the last model the CMS mirrored to localStorage so "Preview In Tab"
// works. This is the client-rendered analog of Iceberg's SSR preview service.
export function RendererApp() {
  const [state, setState] = useState<RenderState>(() => {
    try {
      const raw = localStorage.getItem(PREVIEW_STORAGE_KEY);
      if (raw) {
        const model = JSON.parse(raw) as PreviewModel;
        return { model, selectedId: null, pickMode: false };
      }
    } catch {
      /* ignore */
    }
    return EMPTY;
  });

  const post = (msg: PreviewToCms) => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(msg, "*");
    }
  };

  useEffect(() => {
    // The CMS pushes the model only in response to our "ready" ping. That ping
    // is one-shot, so if the parent's message listener isn't attached yet when
    // we first announce (a cross-document load race), the ping is lost and the
    // preview stalls on a stale/empty model. Guard against it by re-announcing
    // until the first render lands (the parent re-pushes on every "ready").
    let acknowledged = false;
    const onMessage = (e: MessageEvent) => {
      const data = e.data as CmsToPreview;
      if (!data || data.source !== CMS_SOURCE) return;
      if (data.type === "render") {
        acknowledged = true;
        setState({
          model: data.model,
          selectedId: data.selectedId,
          pickMode: data.pickMode,
        });
        post({ source: PREVIEW_SOURCE, type: "rendered" });
      } else if (data.type === "pick-mode") {
        setState((prev) => ({ ...prev, pickMode: data.enabled }));
      }
    };
    window.addEventListener("message", onMessage);
    const announce = () => post({ source: PREVIEW_SOURCE, type: "ready" });
    // Announce immediately, then retry until acknowledged. Cap the retries so a
    // standalone tab (no parent to answer) doesn't ping indefinitely.
    announce();
    const retry = window.setInterval(() => {
      if (!acknowledged) announce();
    }, 200);
    const stop = window.setTimeout(() => window.clearInterval(retry), 4000);
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearInterval(retry);
      window.clearTimeout(stop);
    };
  }, []);

  // Keep the selected element scrolled into view when selection changes
  // (mirrors checkElementIsVisibleOrScrollTo in the real preview bridge).
  useEffect(() => {
    if (!state.selectedId) return;
    const el = document.querySelector(`[data-node-id="${state.selectedId}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [state.selectedId, state.model]);

  // Any click in the preview selects that element (the CMS then focuses the tree
  // on it). Pick-mode is now just an optional "outline every clickable element"
  // affordance, no longer a prerequisite for selecting.
  const onPick = (nodeId: string) => {
    post({ source: PREVIEW_SOURCE, type: "section-selected", nodeId });
  };

  return (
    <BrandRender
      model={state.model}
      selectedId={state.selectedId}
      pickMode={state.pickMode}
      onPick={onPick}
    />
  );
}
