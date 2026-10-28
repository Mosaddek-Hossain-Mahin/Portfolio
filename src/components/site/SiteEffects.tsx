"use client";

import { useEffect } from "react";

/**
 * Per-page client effects, ported from the demo's script:
 * - .reveal scroll reveals (IntersectionObserver) + 1.6s watchdog failsafe
 *   that forces on-screen reveals visible (content never depends on an
 *   observer having fired)
 * - [data-count] animated counters
 * - .magnetic button magnetism
 * - hero portrait parallax + name marquee (Home only, when #hero exists)
 * Runs on every route mount, mirroring the demo's page-show hook.
 */
export default function SiteEffects() {
  useEffect(() => {
    const ac = new AbortController();
    const { signal } = ac;

    /* ---------------- Reveal on scroll + watchdog ---------------- */
    // Guarded like EduStory/TechBubbles: without IntersectionObserver
    // (ancient/embedded webviews) reveals + counters fall back to their
    // final visible state instead of throwing and stranding content.
    const hasIO = typeof window.IntersectionObserver !== "undefined";
    let io: IntersectionObserver | null = null;
    let cio: IntersectionObserver | null = null;
    if (hasIO) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              io?.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      document.querySelectorAll(".reveal").forEach((el) => io?.observe(el));
    } else {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
    }
    const watchdog = setTimeout(() => {
      const vh = window.innerHeight;
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > -vh * 0.2) el.classList.add("in");
      });
    }, 1600);

    /* ---------------- Counters ---------------- */
    if (hasIO) {
      cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            cio?.unobserve(en.target);
            const target = en.target as HTMLElement;
            const end = +(target.dataset.count || 0);
            const t0 = performance.now();
            const step = (t: number) => {
              const p = Math.min((t - t0) / 1300, 1);
              target.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3))));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          });
        },
        { threshold: 0.5 }
      );
      document.querySelectorAll("[data-count]").forEach((el) => cio?.observe(el));
    } else {
      document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        el.textContent = el.dataset.count || "0";
      });
    }

    /* ---------------- Magnetic buttons ---------------- */
    document.querySelectorAll<HTMLElement>(".magnetic").forEach((el) => {
      const inner = (el.querySelector(".mag-in") as HTMLElement) || el;
      const strength = el.classList.contains("round-btn") ? 0.42 : 0.28;
      el.addEventListener(
        "mousemove",
        (e) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          el.style.transition = "transform .18s ease-out";
          inner.style.transition = "transform .18s ease-out";
          el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
          inner.style.transform = `translate(${x * strength * 0.5}px, ${y * strength * 0.5}px)`;
        },
        { signal }
      );
      el.addEventListener(
        "mouseleave",
        () => {
          el.style.transition = "transform .65s cubic-bezier(.22,1,.36,1)";
          inner.style.transition = "transform .65s cubic-bezier(.22,1,.36,1)";
          el.style.transform = "";
          inner.style.transform = "";
        },
        { signal }
      );
    });

    /* ---------------- Hero parallax + marquee ---------------- */
    let raf = 0;
    const hero = document.getElementById("hero");
    const wrap = document.getElementById("portraitWrap");
    const track = document.getElementById("mqTrack");
    if (hero && wrap && track) {
      let tx = 0,
        ty = 0,
        cx = 0,
        cy = 0,
        mqX = 0,
        mqHalf = 0,
        mqBoost = 0,
        lastY = window.scrollY;
      const measureMQ = () => {
        const g = track.children[0] as HTMLElement | undefined;
        if (g) mqHalf = g.offsetWidth;
      };
      measureMQ();
      if (document.fonts?.ready) document.fonts.ready.then(measureMQ);
      window.addEventListener("resize", measureMQ, { signal });
      window.addEventListener(
        "scroll",
        () => {
          const y = window.scrollY;
          mqBoost = Math.min(mqBoost + Math.abs(y - lastY) * 0.05, 15);
          lastY = y;
        },
        { passive: true, signal }
      );
      hero.addEventListener(
        "mousemove",
        (e) => {
          const r = hero.getBoundingClientRect();
          tx = ((e.clientX - r.left) / r.width - 0.5) * 22;
          ty = ((e.clientY - r.top) / r.height - 0.5) * 12;
        },
        { signal }
      );
      hero.addEventListener("mouseleave", () => { tx = 0; ty = 0; }, { signal });
      const loop = () => {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        const sy = Math.min(window.scrollY * 0.22, 260);
        wrap.style.transform = `translate3d(${cx.toFixed(1)}px, ${(cy + sy).toFixed(1)}px, 0)`;
        mqBoost *= 0.94;
        mqX -= 1.5 + mqBoost;
        if (mqHalf && mqX <= -mqHalf) mqX += mqHalf;
        track.style.transform = `translate3d(${mqX.toFixed(1)}px,0,0)`;
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      ac.abort();
      io?.disconnect();
      cio?.disconnect();
      clearTimeout(watchdog);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
