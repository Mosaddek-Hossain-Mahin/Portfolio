"use client";

import { useRef, useState } from "react";
import type { NavItem } from "@/lib/site";
import { DangerButton, PrimaryButton, inputCls } from "./ui";

type Row = NavItem & { id: number };

const arrowBtnCls =
  "flex h-6 w-7 items-center justify-center rounded-md border border-black/15 text-[13px] leading-none hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent";

/**
 * Navigation menu editor (Admin → Menu). Edits the whole menu as one list —
 * rename, reorder, show/hide, add, delete — and saves it through
 * PUT /api/admin/nav-items into the `navItems` site setting.
 */
export function MenuManager({
  initial,
  defaults,
}: {
  initial: NavItem[];
  defaults: NavItem[];
}) {
  const [rows, setRows] = useState<Row[]>(() =>
    initial.map((it, i) => ({ ...it, id: i + 1 }))
  );
  const nextId = useRef(initial.length + 1);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  function update(id: number, patch: Partial<NavItem>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    setMsg(null);
  }

  function move(index: number, dir: -1 | 1) {
    setRows((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
    setMsg(null);
  }

  function add() {
    setRows((prev) => [
      ...prev,
      { id: nextId.current++, label: "", href: "/", visible: true },
    ]);
    setMsg(null);
  }

  function reset() {
    setRows(defaults.map((it, i) => ({ ...it, id: i + 1 })));
    nextId.current = defaults.length + 1;
    setMsg(null);
  }

  async function save() {
    if (rows.length === 0) {
      setMsg({ kind: "err", text: "The menu needs at least one item." });
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      if (!rows[i].label.trim()) {
        setMsg({ kind: "err", text: `Item ${i + 1} needs a label.` });
        return;
      }
      if (!rows[i].href.trim().startsWith("/")) {
        setMsg({
          kind: "err",
          text: `Item ${i + 1}'s link must start with "/" (for example /product).`,
        });
        return;
      }
    }
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/nav-items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: rows.map((r) => ({
            label: r.label.trim(),
            href: r.href.trim(),
            visible: r.visible,
          })),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed — please try again.");
      setMsg({
        kind: "ok",
        text: "Menu saved — the site header (desktop and mobile) now uses this menu.",
      });
    } catch (e) {
      setMsg({
        kind: "err",
        text: e instanceof Error ? e.message : "Save failed — please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-[13.5px] text-[#797f89]">
        This is the menu in the site header, on desktop and mobile. Hidden items
        stay saved here but do not appear on the site. Links must start with
        "/" — for example <code>/product</code>.
      </p>

      {rows.map((r, i) => (
        <div
          key={r.id}
          className={`flex flex-wrap items-end gap-3 rounded-xl border border-black/10 p-4 ${
            r.visible ? "" : "opacity-60"
          }`}
        >
          <div className="flex flex-col gap-1 pb-0.5">
            <button
              type="button"
              aria-label={`Move ${r.label || "item"} up`}
              className={arrowBtnCls}
              disabled={i === 0}
              onClick={() => move(i, -1)}
            >
              ↑
            </button>
            <button
              type="button"
              aria-label={`Move ${r.label || "item"} down`}
              className={arrowBtnCls}
              disabled={i === rows.length - 1}
              onClick={() => move(i, 1)}
            >
              ↓
            </button>
          </div>

          <label className="block min-w-[150px] flex-1">
            <span className="mb-1.5 block text-[13.5px] font-semibold text-[#161c26]">
              Label
            </span>
            <input
              className={inputCls}
              value={r.label}
              onChange={(e) => update(r.id, { label: e.target.value })}
              placeholder="e.g. Product"
            />
          </label>

          <label className="block min-w-[150px] flex-1">
            <span className="mb-1.5 block text-[13.5px] font-semibold text-[#161c26]">
              Link
            </span>
            <input
              className={inputCls}
              value={r.href}
              onChange={(e) => update(r.id, { href: e.target.value })}
              placeholder="/product"
            />
          </label>

          <label className="flex cursor-pointer items-center gap-2 pb-2.5 text-[14px] font-medium text-[#161c26]">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[#d96600]"
              checked={r.visible}
              onChange={(e) => update(r.id, { visible: e.target.checked })}
            />
            Show
          </label>

          <div className="pb-0.5">
            <DangerButton
              onClick={() => {
                setRows((prev) => prev.filter((x) => x.id !== r.id));
                setMsg(null);
              }}
            >
              Delete
            </DangerButton>
          </div>
        </div>
      ))}

      {rows.length === 0 && (
        <p className="py-4 text-center text-[14px] text-[#797f89]">
          No menu items — add one below, or reset to the defaults.
        </p>
      )}

      {msg && (
        <p
          className={`rounded-lg px-4 py-3 text-sm ${
            msg.kind === "ok"
              ? "border border-green-200 bg-green-50 text-green-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
          role={msg.kind === "err" ? "alert" : "status"}
        >
          {msg.kind === "ok" ? "✓ " : ""}
          {msg.text}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <PrimaryButton type="button" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save menu"}
        </PrimaryButton>
        <button
          type="button"
          onClick={add}
          className="rounded-lg border border-black/15 px-4 py-2.5 text-sm font-semibold hover:bg-black/5"
        >
          + Add item
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#797f89] hover:bg-black/5"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}
