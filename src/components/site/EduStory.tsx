"use client";

import { useEffect, useRef } from "react";
import type { EducationView } from "@/lib/site";

/**
 * Education storytelling (About) — ported from the demo's vanilla layer:
 * chapters reveal via IntersectionObserver, the timeline line fill and the
 * active chapter dot are driven by a plain scroll handler, and a 1.6s
 * watchdog forces on-screen chapters fully visible. NO animation library —
 * GSAP broke this section in the demo phase and was removed deliberately.
 * Content renders fully visible if any of this fails.
 */
export default function EduStory({ items }: { items: EducationView[] }) {
  const storyRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;
    const RM2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasIO = typeof window.IntersectionObserver !== "undefined";
    const ac = new AbortController();
    const { signal } = ac;

    function eduScrollUpdate() {
      if (!story || !story.offsetParent) return;
      const r = story.getBoundingClientRect();
      const vh = window.innerHeight;
      const fill = fillRef.current;
      if (fill && !story.classList.contains("no-anim")) {
        const p = Math.min(1, Math.max(0, (vh * 0.62 - r.top) / Math.max(r.height, 1)));
        fill.style.transform = `scaleY(${p.toFixed(4)})`;
      }
      const mid = vh * 0.5;
      let currentCh: Element | null = null;
      story.querySelectorAll(".chapter").forEach((ch) => {
        if (ch.getBoundingClientRect().top <= mid) currentCh = ch;
      });
      story.querySelectorAll(".chapter").forEach((ch) =>
        ch.classList.toggle("active", ch === currentCh)
      );
    }
    let ticking = false;
    function eduOnScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        eduScrollUpdate();
      });
    }
    window.addEventListener("scroll", eduOnScroll, { passive: true, signal });
    window.addEventListener("resize", eduOnScroll, { signal });
    window.addEventListener("load", eduOnScroll, { signal });

    function eduFailsafe() {
      const vh = window.innerHeight;
      story!.querySelectorAll(".chapter").forEach((ch) => {
        const r = ch.getBoundingClientRect();
        if (r.top < vh * 0.85 && r.bottom > -vh * 0.2) ch.classList.add("in");
      });
      eduScrollUpdate();
    }

    let eio: IntersectionObserver | null = null;
    if (!hasIO || RM2) {
      story.classList.add("no-anim");
      story.querySelectorAll(".chapter").forEach((ch) => ch.classList.add("in", "active"));
    } else {
      story.classList.add("anim");
      eio = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              eio?.unobserve(en.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
      );
      story.querySelectorAll(".chapter").forEach((ch) => eio?.observe(ch));
    }
    eduScrollUpdate();
    const watchdog = setTimeout(eduFailsafe, 1600);

    return () => {
      ac.abort();
      eio?.disconnect();
      clearTimeout(watchdog);
    };
  }, []);

  return (
    <div className="edu-story" id="eduStory" ref={storyRef}>
      <div className="edu-line" aria-hidden="true">
        <div className="edu-line-fill" id="eduLineFill" ref={fillRef}></div>
      </div>
      {items.map((e, i) => {
        const year = e.period.split("—")[0].trim();
        return (
          <article key={e.id} className={`chapter${i % 2 === 1 ? " flip" : ""}`}>
            <span className="ch-ghost" aria-hidden="true">
              {year}
            </span>
            <span className="ch-dot" aria-hidden="true"></span>
            <div className="ch-inner">
              <div className="ch-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.image} alt={e.imageAlt} loading="lazy" />
              </div>
              <div className="ch-body">
                <p className="ch-kicker">
                  Chapter 0{i + 1} · {e.kicker}
                </p>
                <span className="ch-period">{e.period}</span>
                <h3>{e.title}</h3>
                <p className="ch-org">
                  {e.org} <span className="loc">· {e.location}</span>
                </p>
                <p className="ch-desc">{e.desc}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
