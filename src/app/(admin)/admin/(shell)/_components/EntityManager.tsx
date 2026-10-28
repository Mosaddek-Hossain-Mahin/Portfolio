"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, PageTitle, Field, PrimaryButton, DangerButton, inputCls, textareaCls, Empty } from "./ui";
import ImageField from "./ImageField";
import VideoField from "./VideoField";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "select"
  | "image"
  | "video" // single video URL via VideoField (upload / YouTube / Vimeo / direct)
  | "list" // string array — one item per line
  | "stats" // [{n, l}] rows
  | "images"; // [{img, alt}] rows

export type EntityField = {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  rows?: number;
  hint?: string;
  full?: boolean; // span both columns
  required?: boolean;
};

export type EntityConfig = {
  api: string; // e.g. "/api/admin/projects"
  title: string;
  sub: string;
  singular: string; // e.g. "project"
  fields: EntityField[];
  /** row → main list label */
  label: (row: Record<string, unknown>) => string;
  /** row → secondary list label */
  subLabel?: (row: Record<string, unknown>) => string;
};

type Row = Record<string, unknown>;

function parseJsonArray(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const v = JSON.parse(raw);
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** Form value conversions between API rows (JSON strings) and form state. */
function toFormValue(f: EntityField, row: Row | null): string | boolean {
  const v = row?.[f.key];
  switch (f.type) {
    case "checkbox":
      return Boolean(v ?? false);
    case "number":
      return String(typeof v === "number" ? v : 0);
    case "list":
      return parseJsonArray(v).map(String).join("\n");
    case "stats":
      return parseJsonArray(v)
        .map((s) => `${(s as { n?: string }).n ?? ""} | ${(s as { l?: string }).l ?? ""}`)
        .join("\n");
    case "images":
      return parseJsonArray(v)
        .map((s) => `${(s as { img?: string }).img ?? ""} | ${(s as { alt?: string }).alt ?? ""}`)
        .join("\n");
    default:
      return v == null ? "" : String(v);
  }
}

function fromFormValue(f: EntityField, v: string | boolean): unknown {
  switch (f.type) {
    case "checkbox":
      return Boolean(v);
    case "number":
      return Number(v) || 0;
    case "list":
      return String(v).split("\n").map((s) => s.trim()).filter(Boolean);
    case "stats":
      return String(v)
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((line) => {
          const [n, ...rest] = line.split("|");
          return { n: n.trim(), l: rest.join("|").trim() };
        });
    case "images":
      return String(v)
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((line) => {
          const [img, ...rest] = line.split("|");
          return { img: img.trim(), alt: rest.join("|").trim() };
        });
    default:
      return String(v);
  }
}

export default function EntityManager({ config }: { config: EntityConfig }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [editing, setEditing] = useState<Row | null>(null); // null = list view
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [listError, setListError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch(config.api);
      if (!res.ok) throw new Error("load failed");
      setRows((await res.json()) as Row[]);
    } catch {
      setListError("Could not load — check the database connection.");
      setRows([]);
    }
  }, [config.api]);

  useEffect(() => {
    load();
  }, [load]);

  const openForm = (row: Row | null) => {
    const state: Record<string, string | boolean> = {};
    for (const f of config.fields) state[f.key] = toFormValue(f, row);
    setForm(state);
    setEditing(row ?? {});
    setIsNew(row === null);
    setError("");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const payload: Row = {};
    for (const f of config.fields) payload[f.key] = fromFormValue(f, form[f.key] ?? "");
    // ImageField/VideoField keep their own input state (uploads/tabs);
    // take their live DOM value (named inputs in the form).
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    for (const f of config.fields) {
      if (f.type === "image" || f.type === "video") payload[f.key] = String(fd.get(f.key) ?? "");
    }
    try {
      const res = await fetch(isNew ? config.api : `${config.api}/${editing?.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed.");
      setEditing(null);
      await load();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (row: Row) => {
    if (!confirm(`Delete “${config.label(row)}” permanently?`)) return;
    const res = await fetch(`${config.api}/${row.id}`, { method: "DELETE" });
    if (res.ok) {
      await load();
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Delete failed.");
    }
  };

  if (editing !== null) {
    return (
      <div>
        <PageTitle
          title={`${isNew ? "New" : "Edit"} ${config.singular}`}
          sub={config.title}
          action={
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-lg border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-[#161c26]"
            >
              ← Back to list
            </button>
          }
        />
        <Card>
          <form onSubmit={save} className="grid gap-5 sm:grid-cols-2" noValidate>
            {config.fields.map((f) => {
              const v = form[f.key];
              const set = (val: string | boolean) =>
                setForm((s) => ({ ...s, [f.key]: val }));
              const wrap = (node: React.ReactNode) => (
                <div key={f.key} className={f.full ? "sm:col-span-2" : undefined}>
                  {node}
                </div>
              );
              if (f.type === "video") {
                return wrap(
                  <VideoField
                    name={f.key}
                    label={f.label}
                    defaultValue={typeof v === "string" ? v : ""}
                    hint={f.hint}
                  />
                );
              }
              if (f.type === "image") {
                return wrap(
                  <ImageField
                    name={f.key}
                    label={f.label}
                    defaultValue={typeof v === "string" ? v : ""}
                    hint={f.hint}
                  />
                );
              }
              if (f.type === "checkbox") {
                return wrap(
                  <label className="flex h-11 items-center gap-3 text-[14.5px] font-medium text-[#161c26]">
                    <input
                      type="checkbox"
                      checked={Boolean(v)}
                      onChange={(e) => set(e.target.checked)}
                      className="h-5 w-5 accent-[#455ce9]"
                    />
                    {f.label}
                  </label>
                );
              }
              if (f.type === "select") {
                return wrap(
                  <Field label={f.label} hint={f.hint}>
                    <select
                      className={inputCls}
                      value={String(v ?? "")}
                      onChange={(e) => set(e.target.value)}
                    >
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                );
              }
              if (f.type === "textarea" || f.type === "list" || f.type === "stats" || f.type === "images") {
                const hint =
                  f.hint ??
                  (f.type === "list"
                    ? "One item per line."
                    : f.type === "stats"
                      ? "One stat per line: value | label"
                      : f.type === "images"
                        ? "One image per line: image URL | alt text"
                        : undefined);
                return wrap(
                  <Field label={f.label} hint={hint}>
                    <textarea
                      className={textareaCls}
                      rows={f.rows ?? (f.type === "textarea" ? 4 : 5)}
                      value={String(v ?? "")}
                      onChange={(e) => set(e.target.value)}
                    />
                  </Field>
                );
              }
              return wrap(
                <Field label={f.label} hint={f.hint}>
                  <input
                    className={inputCls}
                    type={f.type === "number" ? "number" : "text"}
                    value={String(v ?? "")}
                    onChange={(e) => set(e.target.value)}
                  />
                </Field>
              );
            })}
            <div className="flex items-center gap-4 sm:col-span-2">
              <PrimaryButton disabled={busy}>
                {busy ? "Saving…" : isNew ? `Create ${config.singular}` : "Save changes"}
              </PrimaryButton>
              {error && <p className="text-[13.5px] font-medium text-red-600">{error}</p>}
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        title={config.title}
        sub={config.sub}
        action={
          <button
            type="button"
            onClick={() => openForm(null)}
            className="rounded-lg bg-[#181c20] px-5 py-2.5 text-sm font-semibold text-white hover:shadow-md"
          >
            + New {config.singular}
          </button>
        }
      />
      {listError && <p className="mb-4 text-[14px] font-medium text-red-600">{listError}</p>}
      {rows === null ? (
        <Card>
          <p className="py-8 text-center text-[14.5px] text-[#797f89]">Loading…</p>
        </Card>
      ) : rows.length === 0 ? (
        <Empty text={`No ${config.title.toLowerCase()} yet — create the first one.`} />
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-black/8">
            {rows.map((row) => (
              <li key={String(row.id)} className="flex flex-wrap items-center gap-3 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold text-[#161c26]">
                    {config.label(row)}
                  </p>
                  {config.subLabel && (
                    <p className="truncate text-[13px] text-[#797f89]">{config.subLabel(row)}</p>
                  )}
                </div>
                {row.visible === false && (
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-0.5 text-[12px] font-semibold text-gray-600">
                    Hidden
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => openForm(row)}
                  className="rounded-lg border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-[#161c26] hover:bg-black/5"
                >
                  Edit
                </button>
                <DangerButton onClick={() => remove(row)}>Delete</DangerButton>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
