"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle, ThemeToggleMenu } from "./ThemeToggle";
import type { NavItem } from "@/lib/site";

export type ShellSettings = {
  siteName: string;
  email: string;
  greetings: string[];
  socials: { label: string; href: string }[];
};

/**
 * Site chrome, ported from the approved demo: preloader (cycling greetings,
 * curved reveal), curved page-transition panel, header, floating menu
 * button and the menu overlay. Internal [data-nav] / [data-project] links
 * are intercepted so navigation plays the demo's transition and then uses
 * the Next router — real routes, demo feel.
 */
export default function Shell({
  settings,
  navItems,
  children,
}: {
  settings: ShellSettings;
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [greetIdx, setGreetIdx] = useState(0);
  const [preDone, setPreDone] = useState(false);
  const [preHidden, setPreHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [floatShow, setFloatShow] = useState(false);
  const [tLabel, setTLabel] = useState("");
  const [tLabelShow, setTLabelShow] = useState(false);
  const transitionRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);

  const greetings = settings.greetings.length ? settings.greetings : ["Hello"];

  /* ---------------- Preloader ---------------- */
  useEffect(() => {
    document.documentElement.classList.add("locked");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stepMs = reduced ? 30 : 172;
    let gi = 0;
    const iv = setInterval(() => {
      gi++;
      if (gi < greetings.length) {
        setGreetIdx(gi);
      } else {
        clearInterval(iv);
        setTimeout(() => {
          setPreDone(true);
          document.body.classList.add("loaded");
          document.documentElement.classList.remove("locked");
          setTimeout(() => setPreHidden(true), 1300);
        }, reduced ? 60 : 240);
      }
    }, stepMs);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Menu + float button ---------------- */
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    if (menuOpen) document.documentElement.classList.add("locked");
    else if (preDone) document.documentElement.classList.remove("locked");
  }, [menuOpen, preDone]);

  useEffect(() => {
    const onScroll = () => {
      if (!document.body.classList.contains("menu-open")) {
        setFloatShow(window.scrollY > window.innerHeight * 0.55);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* ---------------- Transition navigation ---------------- */
  const navigateWithTransition = useCallback(
    (href: string, label: string) => {
      if (animatingRef.current) return;
      if (href === pathname) {
        setMenuOpen(false);
        return;
      }
      animatingRef.current = true;
      setMenuOpen(false);
      const el = transitionRef.current;
      if (!el) {
        router.push(href);
        animatingRef.current = false;
        return;
      }
      setTLabel(label);
      el.style.transition = "transform .85s cubic-bezier(.76,0,.24,1)";
      el.style.transform = "translateY(0%)";
      el.style.pointerEvents = "auto";
      setTimeout(() => setTLabelShow(true), 380);
      setTimeout(() => {
        router.push(href);
        window.scrollTo(0, 0);
        setTLabelShow(false);
        el.style.transform = "translateY(calc(-100% - 130px))";
        setTimeout(() => {
          el.style.transition = "none";
          el.style.transform = "translateY(calc(100% + 130px))";
          el.style.pointerEvents = "none";
          animatingRef.current = false;
        }, 900);
      }, 1020);
    },
    [pathname, router]
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        "a[data-nav], a[data-project]"
      );
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      e.preventDefault();
      const label =
        anchor.dataset.label ||
        anchor.textContent?.trim() ||
        settings.siteName;
      navigateWithTransition(href, label);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigateWithTransition, settings.siteName]);

  const navKeyFor = (href: string) => {
    if (href === "/") return "home";
    return href.replace("/", "");
  };
  const activeKey =
    pathname === "/"
      ? "home"
      : pathname.startsWith("/work")
        ? "work"
        : navKeyFor(pathname);

  const navLink = (item: NavItem) => (
    <a
      key={item.href}
      href={item.href}
      data-nav={navKeyFor(item.href)}
      data-label={item.label}
      className={activeKey === navKeyFor(item.href) ? "active" : undefined}
    >
      {item.label}
    </a>
  );

  return (
    <>
      {/* ================= PRELOADER ================= */}
      {!preHidden && (
        <div id="preloader" aria-hidden="true" className={preDone ? "done" : undefined}>
          <div id="greeting">
            <span className="dot"></span>
            <span id="greetText">{greetings[Math.min(greetIdx, greetings.length - 1)]}</span>
          </div>
          <svg className="curve" viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,0 L1440,0 L1440,12 C980,110 460,110 0,12 Z" fill="#101012"></path>
          </svg>
        </div>
      )}

      {/* ================= PAGE TRANSITION ================= */}
      <div id="transition" ref={transitionRef} aria-hidden="true" className={tLabelShow ? "show-label" : undefined}>
        <svg className="curve-top" viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,110 L1440,110 L1440,98 C980,0 460,0 0,98 Z" fill="#101012"></path>
        </svg>
        <div className="t-label">
          <span className="dot"></span>
          <span id="tLabelText">{tLabel}</span>
        </div>
        <svg className="curve-bot" viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,0 L1440,0 L1440,12 C980,110 460,110 0,12 Z" fill="#101012"></path>
        </svg>
      </div>

      {/* ================= HEADER ================= */}
      <header className={`site-head${pathname === "/" ? " on-hero" : ""}`} id="siteHead">
        <a className="brand magnetic" href="/" data-nav="home" data-label="Home" aria-label="Home">
          <span className="mag-in">
            <span className="spin-c">©</span>&nbsp;Code by <span data-brand-name>{settings.siteName}</span>
          </span>
        </a>
        <div className="head-actions">
          <nav className="main-nav" aria-label="Main">
            {navItems.map(navLink)}
          </nav>
          <ThemeToggle />
        </div>
        <button
          className="head-burger"
          id="headBurger"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          Menu<span className="bdot"></span>
        </button>
      </header>

      {/* floating round menu button (appears after scroll) */}
      <button
        id="floatBtn"
        aria-label="Toggle menu"
        className={floatShow || menuOpen ? "show" : undefined}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span className="mag-in lines">
          <span></span>
          <span></span>
        </span>
      </button>

      {/* ================= MENU OVERLAY ================= */}
      <div id="menuScrim" onClick={() => setMenuOpen(false)}></div>
      <aside id="menu" aria-hidden={menuOpen ? "false" : "true"}>
        <div>
          <p className="m-label">Navigation</p>
          <nav aria-label="Menu">
            <a href="/" data-nav="home" data-label="Home" className={activeKey === "home" ? "active" : undefined}>
              <span className="mdot"></span>Home
            </a>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-nav={navKeyFor(item.href)}
                data-label={item.label}
                className={activeKey === navKeyFor(item.href) ? "active" : undefined}
              >
                <span className="mdot"></span>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="m-foot">
          <div>
            <h5>Theme</h5>
            <ThemeToggleMenu />
          </div>
          <div>
            <h5>Socials</h5>
            <div className="socials">
              {settings.socials.map((s) => (
                <a key={s.label} className="u-line" href={s.href} rel="noopener">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h5>Get in touch</h5>
            <a className="u-line" href={`mailto:${settings.email}`} data-email>
              {settings.email}
            </a>
          </div>
        </div>
      </aside>

      <main id="app">{children}</main>
    </>
  );
}
