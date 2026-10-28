"use client";

import { useRef, useState } from "react";
import type { ProjectView } from "@/lib/site";
import { WORK_CATS } from "@/lib/demo-data";
import ProjectTile from "./ProjectTile";

/** Work page grid + category filter chips (demo renderWork + chips). */
export default function WorkGrid({ projects }: { projects: ProjectView[] }) {
  const [cat, setCat] = useState("all");
  const [fading, setFading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const list = cat === "all" ? projects : projects.filter((p) => p.category === cat);

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
      <div className="chips" id="chips" role="tablist" aria-label="Filter projects">
        {WORK_CATS.map(([key, label]) => {
          const n =
            key === "all" ? projects.length : projects.filter((p) => p.category === key).length;
          return (
            <button
              key={key}
              className={`chip${cat === key ? " active" : ""}`}
              data-cat={key}
              role="tab"
              onClick={() => pick(key)}
            >
              {label}
              <sup>{n}</sup>
            </button>
          );
        })}
      </div>
      <div className={`work-grid${fading ? " fading" : ""}`} id="workGrid">
        {list.map((p) => (
          <ProjectTile key={p.slug} project={p} />
        ))}
      </div>
    </>
  );
}
