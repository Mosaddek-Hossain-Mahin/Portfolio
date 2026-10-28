"use client";

import { useRef, useState } from "react";
import type { GalleryView } from "@/lib/site";
import { GALLERY_CATS } from "@/lib/demo-data";
import Lightbox from "./Lightbox";

/** Gallery page: masonry grid + filter chips + lightbox (demo logic). */
export function GallerySection({ items }: { items: GalleryView[] }) {
  const [cat, setCat] = useState("all");
  const [fading, setFading] = useState(false);
  const [lb, setLb] = useState<{ open: boolean; idx: number }>({ open: false, idx: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const list = cat === "all" ? items : items.filter((g) => g.category === cat);

  const pick = (key: string) => {
    if (key === cat) return;
    setFading(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setCat(key);
      setFading(false);
    }, 280);
  };

  return (
    <>
      <div className="chips" id="galChips" role="tablist" aria-label="Filter gallery">
        {GALLERY_CATS.map(([key, label]) => {
          const n =
            key === "all" ? items.length : items.filter((g) => g.category === key).length;
          return (
            <button
              key={key}
              className={`chip${cat === key ? " active" : ""}`}
              data-gcat={key}
              role="tab"
              onClick={() => pick(key)}
            >
              {label}
              <sup>{n}</sup>
            </button>
          );
        })}
      </div>
      <div className={`gal-grid${fading ? " fading" : ""}`} id="galGrid">
        {list.map((g, i) => (
          <button
            key={g.id}
            className={`gal-item ${g.ratio}`}
            data-lb={i}
            data-scope="gal"
            aria-label={`View photo: ${g.title}`}
            onClick={() => setLb({ open: true, idx: i })}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.image} alt={g.alt} loading="lazy" />
            <span className="cap">
              <b>{g.title}</b>
              <span>{g.catLabel}</span>
            </span>
          </button>
        ))}
      </div>
      <Lightbox
        list={list}
        idx={Math.min(lb.idx, Math.max(list.length - 1, 0))}
        open={lb.open}
        onClose={() => setLb((s) => ({ ...s, open: false }))}
        onStep={(d) =>
          setLb((s) => ({ ...s, idx: (s.idx + d + list.length) % list.length }))
        }
      />
    </>
  );
}

/** Home gallery preview strip — opens the same lightbox over all items. */
export function HomeStrip({ items }: { items: GalleryView[] }) {
  const [lb, setLb] = useState<{ open: boolean; idx: number }>({ open: false, idx: 0 });
  const shown = items.slice(0, 6);
  return (
    <>
      <div className="strip-grid reveal" id="homeStrip">
        {shown.map((g, i) => (
          <button
            key={g.id}
            className="strip-item"
            data-lb={i}
            data-scope="all"
            aria-label={`View photo: ${g.title}`}
            onClick={() => setLb({ open: true, idx: i })}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.image} alt={g.alt} loading="lazy" />
            <span className="cap">
              <b>{g.title}</b>
            </span>
          </button>
        ))}
      </div>
      <Lightbox
        list={items}
        idx={lb.idx}
        open={lb.open}
        onClose={() => setLb((s) => ({ ...s, open: false }))}
        onStep={(d) =>
          setLb((s) => ({ ...s, idx: (s.idx + d + items.length) % items.length }))
        }
      />
    </>
  );
}
