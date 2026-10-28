"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Public-site theme switch — 3-state System / Light / Dark (same pattern as
 * mohammed's StitchBD switcher). The preference persists in localStorage
 * ("pf-theme"); the resolved theme is written to <html data-theme> by the
 * inline bootstrap in the root layout BEFORE first paint (no flash) and kept
 * in sync here. Admin never renders this component and admin.css does not
 * read [data-theme], so the admin panel is unaffected.
 */

export type ThemePref = "system" | "light" | "dark";
const KEY = "pf-theme";
const EVENT = "pf-theme-change";

function resolve(pref: ThemePref): "light" | "dark" {
  if (pref === "dark") return "dark";
  if (pref === "light") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" || v === "system" ? v : "system";
  } catch {
    return "system";
  }
}

function apply(pref: ThemePref) {
  document.documentElement.dataset.theme = resolve(pref);
  document.documentElement.dataset.themePref = pref;
}

function useThemePref() {
  const [pref, setPrefState] = useState<ThemePref>("system");

  useEffect(() => {
    const sync = () => setPrefState(readPref());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => {
      if (readPref() === "system") apply("system");
    };
    mq.addEventListener("change", onSystem);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
      mq.removeEventListener("change", onSystem);
    };
  }, []);

  const setPref = useCallback((next: ThemePref) => {
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode — theme still applies for this session */
    }
    apply(next);
    setPrefState(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { pref, setPref };
}

const SunIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const MoonIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
);
const SystemIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none" />
  </svg>
);

const NEXT: Record<ThemePref, ThemePref> = { system: "light", light: "dark", dark: "system" };
const LABEL: Record<ThemePref, string> = { system: "System", light: "Light", dark: "Dark" };
const ICON: Record<ThemePref, React.ReactNode> = { system: SystemIcon, light: SunIcon, dark: MoonIcon };

/** Compact cycling pill for the navbar: System → Light → Dark → System. */
export function ThemeToggle() {
  const { pref, setPref } = useThemePref();
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setPref(NEXT[pref])}
      aria-label={`Theme: ${LABEL[pref]}. Switch theme`}
      title={`Theme: ${LABEL[pref]}`}
    >
      <span className="tt-ico">{ICON[pref]}</span>
      <span className="tt-text">{LABEL[pref]}</span>
    </button>
  );
}

/** Segmented 3-option control for the mobile menu overlay. */
export function ThemeToggleMenu() {
  const { pref, setPref } = useThemePref();
  return (
    <div className="theme-seg" role="group" aria-label="Theme">
      {(["system", "light", "dark"] as ThemePref[]).map((p) => (
        <button
          key={p}
          type="button"
          className={pref === p ? "active" : undefined}
          aria-pressed={pref === p}
          onClick={() => setPref(p)}
        >
          <span className="tt-ico">{ICON[p]}</span>
          {LABEL[p]}
        </button>
      ))}
    </div>
  );
}
