"use client";

import { useCallback, useEffect } from "react";
import type { GalleryView } from "@/lib/site";

/** Gallery lightbox (demo): caption, counter, prev/next, Esc/arrows,
    backdrop close, dynamic alt from the active item. */
export default function Lightbox({
  list,
  idx,
  open,
  onClose,
  onStep,
}: {
  list: GalleryView[];
  idx: number;
  open: boolean;
  onClose: () => void;
  onStep: (d: number) => void;
}) {
  const g = list[idx];

  const keyHandler = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onStep(-1);
      else if (e.key === "ArrowRight") onStep(1);
    },
    [open, onClose, onStep]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [keyHandler]);

  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("locked");
      document.getElementById("lbClose")?.focus();
    } else {
      document.documentElement.classList.remove("locked");
    }
  }, [open ]);

  if (!g) return null;

  return (
    <div
      id="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      aria-hidden={open ? "false" : "true"}
      className={open ? "open" : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button className="lb-btn lb-close" id="lbClose" aria-label="Close viewer" onClick={onClose}>
        ✕
      </button>
      <button className="lb-btn lb-prev" id="lbPrev" aria-label="Previous image" onClick={() => onStep(-1)}>
        ←
      </button>
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img id="lbImg" src={g.image} alt={g.alt} />
        <figcaption>
          <b id="lbTitle">{g.title}</b>
          <span id="lbCap">{g.caption}</span>
          <span className="lb-count" id="lbCount">
            {idx + 1} / {list.length}
          </span>
        </figcaption>
      </figure>
      <button className="lb-btn lb-next" id="lbNext" aria-label="Next image" onClick={() => onStep(1)}>
        →
      </button>
    </div>
  );
}
