"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { DEFAULT_SETTINGS } from "@/lib/site-defaults";

const NAME = DEFAULT_SETTINGS.siteName || "Mohammed";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 8 10 8a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.53 13.53 0 0 0 2 12s3.5 8 10 8a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Sign-in failed.");
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setBusy(false);
    }
  }

  // Fixed light inputs (bg-white + dark text) in every theme — readable always.
  const fieldCls =
    "h-12 w-full rounded-lg border border-black/15 bg-white px-4 text-[15px] text-[#161c26] outline-none placeholder:text-[#9aa0a8] focus:border-[#455ce9]";

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <label className="block">
        <span className="mb-1.5 block text-[13.5px] font-semibold text-[#161c26]">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@portfolio.local"
          className={fieldCls}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[13.5px] font-semibold text-[#161c26]">Password</span>
        <span className="relative block">
          <input
            type={showPw ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className={`${fieldCls} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#797f89] hover:text-[#161c26]"
          >
            <EyeIcon open={showPw} />
          </button>
        </span>
      </label>
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-[13.5px] font-medium text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="mt-1 flex h-12 items-center justify-center gap-2 rounded-lg bg-[#101012] text-[15px] font-semibold text-white hover:bg-[#232328] disabled:opacity-60"
      >
        {busy && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

const POINTS = [
  "Projects, stack, education & gallery — full control",
  "Messages inbox for contact-form submissions",
  "Settings, menu and SEO in one place",
];

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-[#f4f4f2]">
      {/* Brand panel */}
      <div className="hidden w-[46%] flex-col justify-between bg-[#101012] p-12 lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#455ce9] font-heading text-[20px] font-semibold text-white">
            {NAME.charAt(0)}
          </span>
          <div>
            <p className="font-heading text-[18px] font-semibold leading-tight text-white">
              {NAME} — Portfolio
            </p>
            <p className="text-[13px] text-white/60">Admin console</p>
          </div>
        </div>
        <div>
          <h1 className="font-heading text-[34px] font-semibold leading-[1.15] text-white">
            Your portfolio,
            <br />
            fully in your hands.
          </h1>
          <ul className="mt-8 flex flex-col gap-3.5">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-[15px] text-white/80">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#455ce9] text-white">
                  <CheckIcon />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[13px] text-white/40">
          © Code by {NAME} — {DEFAULT_SETTINGS.locationText}
        </p>
      </div>

      {/* Sign-in card */}
      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-[420px] rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#455ce9] font-heading text-[18px] font-semibold text-white">
              {NAME.charAt(0)}
            </span>
            <p className="font-heading text-[17px] font-semibold text-[#161c26]">
              {NAME} — Portfolio Admin
            </p>
          </div>
          <h2 className="font-heading text-[24px] font-semibold text-[#161c26]">Welcome back</h2>
          <p className="mb-6 mt-1 text-[14.5px] text-[#797f89]">
            Sign in to manage your portfolio.
          </p>
          <Suspense>
            <LoginForm />
          </Suspense>
          <p className="mt-6 text-center text-[13px] text-[#797f89]">
            <a href="/" className="font-medium text-[#455ce9] hover:underline">
              ← Back to the site
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
