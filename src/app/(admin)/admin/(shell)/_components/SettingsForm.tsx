"use client";

import { useState } from "react";
import { Card, Field, PrimaryButton, inputCls, textareaCls } from "./ui";
import ImageField from "./ImageField";
import CvField from "./CvField";
import { SETTING_GROUPS, type SettingsFieldDef } from "./settings-fields";

/** Full-page site-settings form. Saves via PUT /api/admin/settings. */
export default function SettingsForm({
  initial,
}: {
  initial: Record<string, string>;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSavedAt(null);
    const fd = new FormData(e.currentTarget);
    const body: Record<string, string> = {};
    for (const g of SETTING_GROUPS) {
      for (const f of g.fields) body[f.key] = String(fd.get(f.key) ?? "");
    }
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed.");
      setSavedAt(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  const renderField = (f: SettingsFieldDef) => {
    if (f.kind === "cv") {
      return (
        <div key={f.key} className="sm:col-span-2">
          <CvField
            name={f.key}
            label={f.label}
            defaultValue={initial[f.key]}
            hint={f.hint}
          />
        </div>
      );
    }
    if (f.kind === "image") {
      return (
        <ImageField
          key={f.key}
          name={f.key}
          label={f.label}
          defaultValue={initial[f.key]}
          hint={f.hint}
        />
      );
    }
    if (f.kind === "textarea") {
      return (
        <Field key={f.key} label={f.label} hint={f.hint}>
          <textarea
            name={f.key}
            className={textareaCls}
            rows={f.rows ?? 3}
            defaultValue={initial[f.key] ?? ""}
          />
        </Field>
      );
    }
    return (
      <Field key={f.key} label={f.label} hint={f.hint}>
        <input
          name={f.key}
          className={inputCls}
          type={f.kind === "url" ? "text" : "text"}
          defaultValue={initial[f.key] ?? ""}
        />
      </Field>
    );
  };

  return (
    <form onSubmit={save} className="space-y-6" noValidate>
      {SETTING_GROUPS.map((group) => (
        <Card key={group.title}>
          <h2 className="font-heading text-[17px] font-semibold text-[#161c26]">{group.title}</h2>
          {group.sub && <p className="mt-1 text-[13.5px] text-[#797f89]">{group.sub}</p>}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">{group.fields.map(renderField)}</div>
        </Card>
      ))}
      <div className="flex items-center gap-4">
        <PrimaryButton disabled={saving}>{saving ? "Saving…" : "Save settings"}</PrimaryButton>
        {savedAt && <p className="text-[13.5px] font-medium text-green-700">Saved at {savedAt}</p>}
        {error && <p className="text-[13.5px] font-medium text-red-600">{error}</p>}
      </div>
    </form>
  );
}
