"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { TechnologyView } from "@/lib/site";
import { TECH_CATS } from "@/lib/demo-data";

/**
 * My Stack — Apple Watch bubble cluster (honeycomb layout, centre-focus
 * scaling, drag-to-pan with inertia + elastic bounds, tap/hover label,
 * filter chips ghost-dimming non-matches).
 *
 * Animation engine: GSAP. It drives per-bubble STATE (entrance progress,
 * selection pop, dock magnification, filter blend, cluster parallax) and
 * the continuous float (on the inner .bubble-float layer); a single
 * gsap.ticker loop is the only writer of each bubble's transform/opacity,
 * composing pan + centre scale + those states per frame.
 *
 * FAILSAFE (this project's hard rule): a bubble's visibility never depends
 * on a tween completing — states live in plain objects, initial states are
 * set in JS only (nothing is hidden in CSS/SSR), and a watchdog force-
 * completes the entrance ~2.8s after mount no matter what. If GSAP were
 * removed, the CSS float loop + static layout still render the cluster.
 * prefers-reduced-motion: no float/parallax/dock, entrance is instant.
 */
export default function TechBubbles({ technologies }: { technologies: TechnologyView[] }) {
  const chipsRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  const chips = TECH_CATS.map(([key, label]) => {
    const n =
      key === "all"
        ? technologies.length
        : technologies.filter((t) => t.category === key).length;
    return { key, label, n };
  });

  useEffect(() => {
    const techChips = chipsRef.current;
    const watchStage = stageRef.current;
    const watchCluster = clusterRef.current;
    const watchLabel = labelRef.current;
    if (!techChips || !watchStage || !watchCluster || !watchLabel) return;

    const TECHNOLOGIES = technologies.map((t) => ({
      name: t.name,
      cat: t.category,
      catLabel: t.catLabel,
      logo: t.logo,
      dark: t.darkBubble,
    }));
    const RM2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasIO = typeof window.IntersectionObserver !== "undefined";
    const ac = new AbortController();
    const { signal } = ac;
    const tweens: gsap.core.Tween[] = [];
    const track = <T extends gsap.core.Tween>(t: T): T => {
      tweens.push(t);
      return t;
    };

    type Bubble = {
      tech: (typeof TECHNOLOGIES)[number];
      el: HTMLButtonElement;
      face: HTMLElement;
      floatEl: HTMLElement;
      bx: number;
      by: number;
      rank: number;
      curS: number;
      curO: number;
      /* GSAP-driven state (plain values, tweened) */
      enter: number; // 0 → 1 entrance progress (back.out overshoots > 1)
      sel: number; // selection pop scale (1 or 1.3)
      dock: number; // hover magnification scale
      filt: number; // 1 = matches filter, 0 = ghost-dimmed
    };

    let activeFilter = "all";
    let selectedTech: Bubble["tech"] | null = null;
    let suppressClick = false;
    const dragState = { on: false, id: -1, lx: 0, ly: 0, moved: 0 };
    /* Cluster parallax, GSAP-smoothed (quickTo-style tween on a state obj). */
    const par = { x: 0, y: 0 };

    const bubbles: Bubble[] = TECHNOLOGIES.map((t, i) => {
      const el = document.createElement("button");
      el.className = "bubble" + (t.dark ? " dark" : "");
      el.dataset.cat = t.cat;
      el.setAttribute("aria-label", `${t.name} — ${t.catLabel}`);
      el.style.left = "50%";
      el.style.top = "50%";
      el.style.width = "84px";
      el.style.height = "84px";
      const dur = 3.2 + ((i * 37) % 10) * 0.22;
      const amp = 5;
      el.innerHTML =
        `<span class="bubble-float" style="--dur:${dur.toFixed(2)}s;--delay:${(-(((i * 53) % 100) / 100) * dur).toFixed(2)}s;--amp:${amp}px">` +
        `<span class="bubble-face"><img src="${t.logo}" alt="${t.name} logo" loading="lazy" /></span></span>`;
      watchCluster.appendChild(el);
      return {
        tech: t,
        el,
        face: el.querySelector(".bubble-face") as HTMLElement,
        floatEl: el.querySelector(".bubble-float") as HTMLElement,
        bx: 0,
        by: 0,
        rank: i,
        curS: RM2 ? 1 : 0,
        curO: RM2 ? 1 : 0,
        enter: RM2 ? 1 : 0,
        sel: 1,
        dock: 1,
        filt: 1,
      };
    });

    /* Continuous float — GSAP takes over from the CSS loop (the stage's
       .gsap-on class disables the CSS animation). Varied per bubble. */
    if (!RM2) {
      watchStage.classList.add("gsap-on");
      bubbles.forEach((b, i) => {
        const dur = 1.7 + ((i * 37) % 10) * 0.13; // ~1.7–2.9s half-cycle
        const amp = 4 + ((i * 29) % 4); // 4–7px, varied per bubble
        gsap.set(b.floatEl, { y: -amp, scale: 0.985 });
        track(
          gsap.to(b.floatEl, {
            y: amp,
            scale: 1.015,
            duration: dur,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: -((i * 53) % 100) / 100 * dur * 2,
          })
        );
      });
    }

    /* Honeycomb layout (wide 3-4-7-4-3, narrow 4-4-5-4-4 for 21 items;
       computed from the row profile so admin-added items still fit). */
    let stepX = 90,
      maxDistPx = 200;
    function layoutWatch() {
      const w = watchStage!.clientWidth || 800;
      const h = watchStage!.clientHeight || 500;
      const rows = w < 640 ? [4, 4, 5, 4, 4] : [3, 4, 7, 4, 3];
      // If the technology count differs from 21, rebuild a near-circle profile.
      const total = rows.reduce((a, b) => a + b, 0);
      let profile = rows;
      if (total !== bubbles.length) {
        profile = [];
        let left = bubbles.length;
        const pattern = w < 640 ? [4, 5, 5, 5, 4] : [4, 5, 6, 5, 4];
        let pi = 0;
        while (left > 0) {
          const take = Math.min(pattern[pi % pattern.length], left);
          profile.push(take);
          left -= take;
          pi++;
        }
      }
      const maxCount = Math.max(...profile);
      stepX = Math.min(96, w / (maxCount + 0.35));
      stepX = Math.min(
        stepX,
        (w - 28) / (maxCount - 1 + 0.96),
        (h - 28) / ((profile.length - 1) * 0.87 + 0.96)
      );
      const stepY = stepX * 0.87;
      const size = Math.round(stepX * 0.96);
      const pos: { x: number; y: number }[] = [];
      profile.forEach((count, r) => {
        for (let c = 0; c < count; c++) {
          pos.push({ x: (c - (count - 1) / 2) * stepX, y: (r - (profile.length - 1) / 2) * stepY });
        }
      });
      maxDistPx = 1;
      bubbles.forEach((b, i) => {
        const p = pos[i % pos.length];
        b.bx = p.x;
        b.by = p.y;
        b.el.style.width = `${size}px`;
        b.el.style.height = `${size}px`;
        maxDistPx = Math.max(maxDistPx, Math.sqrt(p.x * p.x + p.y * p.y));
      });
      bubbles
        .slice()
        .sort((a, b2) => a.bx * a.bx + a.by * a.by - (b2.bx * b2.bx + b2.by * b2.by))
        .forEach((b, r) => {
          b.rank = r;
        });
    }
    layoutWatch();
    let rsT: ReturnType<typeof setTimeout> | undefined;
    window.addEventListener(
      "resize",
      () => {
        clearTimeout(rsT);
        rsT = setTimeout(layoutWatch, 120);
      },
      { signal }
    );

    function setWatchLabel(t: Bubble["tech"] | null) {
      if (!watchLabel) return;
      if (t)
        watchLabel.innerHTML = `<span class="wl-name">${t.name}</span><span> — </span><span class="wl-cat">${t.catLabel}</span>`;
      else if (selectedTech) setWatchLabel(selectedTech);
      else
        watchLabel.innerHTML =
          '<span class="wl-name">My Stack</span><span> — </span><span class="wl-cat">drag to explore, tap a bubble</span>';
    }
    function selectTech(b: Bubble | null) {
      bubbles.forEach((o) => {
        const target = b && o === b ? 1.3 : 1;
        track(
          gsap.to(o, {
            sel: target,
            duration: RM2 ? 0 : 0.5,
            ease: "back.out(2.2)",
            overwrite: "auto",
          })
        );
        o.el.classList.toggle("is-selected", !!b && o === b);
      });
      selectedTech = b ? b.tech : null;
      setWatchLabel(b ? b.tech : null);
    }

    /* Hover magnification — Apple-dock feel: the hovered bubble grows,
       near neighbours swell a little, the rest stay put. GSAP tweens the
       per-bubble `dock` state; the ticker composes it into the transform. */
    function dockTo(hovered: Bubble | null) {
      if (RM2) return;
      bubbles.forEach((o) => {
        let target = 1;
        if (hovered) {
          const dist = Math.hypot(o.bx - hovered.bx, o.by - hovered.by);
          if (o === hovered) target = 1.16;
          else if (dist < stepX * 1.15) target = 1.07;
          else if (dist < stepX * 2.1) target = 1.03;
        }
        track(
          gsap.to(o, { dock: target, duration: 0.45, ease: "power3.out", overwrite: "auto" })
        );
      });
    }

    bubbles.forEach((b) => {
      b.el.addEventListener("pointerenter", (e) => {
        if (!dragState.on) setWatchLabel(b.tech);
        if (e.pointerType === "mouse") dockTo(b);
      }, { signal });
      b.el.addEventListener("focus", () => setWatchLabel(b.tech), { signal });
      b.el.addEventListener("click", () => {
        if (!suppressClick) selectTech(b);
      }, { signal });
    });
    watchStage.addEventListener("pointerleave", () => {
      setWatchLabel(null);
      dockTo(null);
    }, { signal });

    /* Pan / explore (drag with inertia + elastic bounds — unchanged) and
       mouse parallax (GSAP-smoothed into `par`, applied per bubble with
       a distance-based depth factor in the ticker).
       NOTE: no setPointerCapture on the stage — capturing retargets the
       click event to the stage, which silently breaks bubble tap/click
       selection (found by live click-testing). Drag continuation is
       tracked with window-level move/up listeners instead. */
    let panX = 0,
      panY = 0,
      dragTX = 0,
      dragTY = 0,
      velX = 0,
      velY = 0;
    watchStage.addEventListener(
      "pointerdown",
      (e) => {
        dragState.on = true;
        dragState.id = e.pointerId;
        dragState.lx = e.clientX;
        dragState.ly = e.clientY;
        dragState.moved = 0;
        velX = velY = 0;
        watchStage.classList.add("dragging");
      },
      { signal }
    );
    window.addEventListener(
      "pointermove",
      (e) => {
        if (dragState.on && e.pointerId === dragState.id) {
          const dx = e.clientX - dragState.lx;
          const dy = e.clientY - dragState.ly;
          dragState.lx = e.clientX;
          dragState.ly = e.clientY;
          dragState.moved += Math.abs(dx) + Math.abs(dy);
          dragTX += dx;
          dragTY += dy * 0.7;
          velX = dx;
          velY = dy * 0.7;
          if (dragState.moved > 8) suppressClick = true;
        }
      },
      { signal }
    );
    watchStage.addEventListener(
      "pointermove",
      (e) => {
        if (!dragState.on && e.pointerType === "mouse" && !RM2) {
          const r = watchStage.getBoundingClientRect();
          const tx = ((e.clientX - r.left) / Math.max(r.width, 1) - 0.5) * 16;
          const ty = ((e.clientY - r.top) / Math.max(r.height, 1) - 0.5) * 10;
          track(gsap.to(par, { x: tx, y: ty, duration: 0.7, ease: "power3.out", overwrite: "auto" }));
        }
      },
      { signal }
    );
    const endDrag = (e: PointerEvent) => {
      if (!dragState.on || e.pointerId !== dragState.id) return;
      dragState.on = false;
      watchStage.classList.remove("dragging");
      setTimeout(() => {
        suppressClick = false;
      }, 60);
    };
    window.addEventListener("pointerup", endDrag, { signal });
    window.addEventListener("pointercancel", endDrag, { signal });
    watchStage.addEventListener("mouseleave", () => {
      if (!RM2) track(gsap.to(par, { x: 0, y: 0, duration: 0.8, ease: "power3.out", overwrite: "auto" }));
    }, { signal });

    /* Filter chips — GSAP glides each bubble's `filt` blend (scale +
       opacity follow in the ticker) instead of snapping; matching
       bubbles get a GSAP pulse on the face. */
    techChips.addEventListener(
      "click",
      (e) => {
        const chip = (e.target as HTMLElement).closest<HTMLElement>(".chip");
        if (!chip || chip.classList.contains("active")) return;
        techChips.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        activeFilter = chip.dataset.tcat || "all";
        if (selectedTech && activeFilter !== "all" && selectedTech.cat !== activeFilter)
          selectTech(null);
        bubbles.forEach((b) => {
          const match = activeFilter === "all" || b.tech.cat === activeFilter;
          b.el.classList.toggle("is-dim", !match);
          track(
            gsap.to(b, {
              filt: match ? 1 : 0,
              duration: RM2 ? 0 : 0.55,
              ease: "power2.inOut",
              overwrite: "auto",
            })
          );
          if (match && !RM2) {
            track(
              gsap.fromTo(
                b.face,
                { scale: 1 },
                { scale: 1.14, duration: 0.26, ease: "power2.out", yoyo: true, repeat: 1, overwrite: "auto" }
              )
            );
          }
        });
        if (activeFilter !== "all") {
          const found = TECH_CATS.find((c) => c[0] === activeFilter);
          const label = found ? found[1] : activeFilter;
          const n = TECHNOLOGIES.filter((t) => t.cat === activeFilter).length;
          watchLabel.innerHTML = `<span class="wl-name">${label}</span><span> — </span><span class="wl-cat">${n} technologies</span>`;
        } else setWatchLabel(null);
      },
      { signal }
    );

    /* Entrance — GSAP centre-out choreography: bubbles spring in by rank
       (centre first) with a back.out overshoot. Started by IO when the
       section scrolls into view; a proximity check covers IO quirks. */
    let entered = false;
    const startEntrance = () => {
      if (entered) return;
      entered = true;
      if (RM2) {
        bubbles.forEach((b) => { b.enter = 1; });
        return;
      }
      bubbles.forEach((b) => {
        track(
          gsap.to(b, {
            enter: 1,
            duration: 0.7,
            ease: "back.out(1.9)",
            delay: b.rank * 0.05,
            overwrite: "auto",
          })
        );
      });
    };
    let wio: IntersectionObserver | null = null;
    if (!hasIO || RM2) startEntrance();
    else {
      wio = new IntersectionObserver(
        (en) => {
          en.forEach((x) => {
            if (x.isIntersecting) {
              startEntrance();
              wio?.disconnect();
            }
          });
        },
        { threshold: 0.22 }
      );
      wio.observe(watchStage);
      setTimeout(() => {
        const r = watchStage.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.4 && r.bottom > -200) startEntrance();
      }, 2200);
    }

    /* Per-frame loop — gsap.ticker is the single transform writer. */
    const watchTick = () => {
      if (!dragState.on && (Math.abs(velX) > 0.05 || Math.abs(velY) > 0.05)) {
        dragTX += velX;
        dragTY += velY;
        velX *= 0.93;
        velY *= 0.93;
      }
      const lim = stepX * 1.25;
      if (!dragState.on) {
        if (dragTX > lim) dragTX += (lim - dragTX) * 0.14;
        if (dragTX < -lim) dragTX += (-lim - dragTX) * 0.14;
        if (dragTY > lim * 0.7) dragTY += (lim * 0.7 - dragTY) * 0.14;
        if (dragTY < -lim * 0.7) dragTY += (-lim * 0.7 - dragTY) * 0.14;
      } else {
        dragTX = Math.max(-lim * 1.45, Math.min(lim * 1.45, dragTX));
        dragTY = Math.max(-lim, Math.min(lim, dragTY));
      }
      panX += (dragTX - panX) * 0.14;
      panY += (dragTY - panY) * 0.14;
      bubbles.forEach((b) => {
        const baseD = Math.sqrt(b.bx * b.bx + b.by * b.by);
        const baseDn = Math.min(baseD / maxDistPx, 1.18);
        const depth = 1 - baseDn * 0.45; // centre bubbles parallax most
        const ex = b.bx + panX + par.x * depth,
          ey = b.by + panY + par.y * depth;
        const d = Math.sqrt(ex * ex + ey * ey);
        const dn = Math.min(d / maxDistPx, 1.18);
        const centreS = Math.max(0.52, 1 - 0.38 * Math.pow(dn, 1.12));
        const filterS = 0.5 + 0.5 * b.filt;
        const shownO = 1 - 0.16 * Math.min(dn, 1);
        const baseO = shownO * b.filt + 0.15 * (1 - b.filt);
        const enterS = Math.max(b.enter, 0);
        const enterO = Math.min(Math.max(b.enter, 0), 1);
        const targetS = centreS * filterS * b.sel * b.dock * enterS;
        const targetO = baseO * enterO;
        b.curS += (targetS - b.curS) * 0.24;
        b.curO += (targetO - b.curO) * 0.24;
        if (Math.abs(targetS - b.curS) < 0.002) b.curS = targetS;
        if (Math.abs(targetO - b.curO) < 0.004) b.curO = targetO;
        b.el.style.opacity = b.curO.toFixed(3);
        b.el.style.zIndex = String(
          60 - Math.round(d / 14) + (b.el.classList.contains("is-selected") ? 60 : 0)
        );
        b.el.style.transform = `translate(-50%,-50%) translate(${ex.toFixed(1)}px,${ey.toFixed(1)}px) scale(${b.curS.toFixed(3)})`;
      });
    };
    gsap.ticker.add(watchTick);

    /* FAILSAFE watchdog: whatever happened above (IO never fired, a tween
       was killed, GSAP hiccup), ~2.8s after mount every bubble's entrance
       state is complete and the cluster is fully visible. */
    const watchdog = setTimeout(() => {
      bubbles.forEach((b) => {
        gsap.killTweensOf(b);
        b.enter = 1;
        if (b.filt !== 0 && b.filt !== 1) b.filt = activeFilter === "all" || b.tech.cat === activeFilter ? 1 : 0;
      });
      entered = true;
    }, 2800);

    return () => {
      ac.abort();
      wio?.disconnect();
      clearTimeout(watchdog);
      clearTimeout(rsT);
      gsap.ticker.remove(watchTick);
      tweens.forEach((t) => t.kill());
      bubbles.forEach((b) => {
        gsap.killTweensOf(b);
        gsap.killTweensOf(b.face);
        gsap.killTweensOf(b.floatEl);
      });
      gsap.killTweensOf(par);
      watchCluster.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="wrap">
        <div className="chips dark" id="techChips" role="tablist" aria-label="Filter technologies" ref={chipsRef}>
          {chips.map((c) => (
            <button
              key={c.key}
              className={`chip${c.key === "all" ? " active" : ""}`}
              data-tcat={c.key}
              role="tab"
            >
              {c.label}
              <sup>{c.n}</sup>
            </button>
          ))}
        </div>
        <div className="watch-stage" id="watchStage" ref={stageRef}>
          <div className="watch-disc" aria-hidden="true"></div>
          <div className="watch-cluster" id="watchCluster" ref={clusterRef}></div>
        </div>
        <p className="watch-label" id="watchLabel" aria-live="polite" ref={labelRef}>
          <span className="wl-name">My Stack</span>
          <span> — </span>
          <span className="wl-cat">drag to explore, tap a bubble</span>
        </p>
        <p className="watch-hint">Floating bubbles · like a watch face</p>
      </div>
    </>
  );
}
