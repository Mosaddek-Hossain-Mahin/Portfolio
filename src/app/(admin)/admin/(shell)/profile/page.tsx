"use client";

import { useEffect, useState } from "react";
import { Card, PageTitle, Field, PrimaryButton, inputCls } from "../_components/ui";

function Notice({ kind, text }: { kind: "ok" | "err"; text: string }) {
  return (
    <p
      className={`rounded-lg px-4 py-2.5 text-[14px] font-medium ${
        kind === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
      }`}
    >
      {text}
    </p>
  );
}

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileMsg, setProfileMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [profileBusy, setProfileBusy] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pwBusy, setPwBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.admin) {
          setName(d.admin.name ?? "");
          setEmail(d.admin.email ?? "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileBusy(true);
    setProfileMsg(null);
    const res = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json().catch(() => ({}));
    setProfileBusy(false);
    if (!res.ok) {
      setProfileMsg({ kind: "err", text: data.error || "Could not save profile." });
      return;
    }
    setName(data.admin.name);
    setEmail(data.admin.email);
    setProfileMsg({ kind: "ok", text: "Profile updated." });
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwBusy(true);
    setPwMsg(null);
    const res = await fetch("/api/admin/profile/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
    const data = await res.json().catch(() => ({}));
    setPwBusy(false);
    if (!res.ok) {
      setPwMsg({ kind: "err", text: data.error || "Could not change password." });
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPwMsg({ kind: "ok", text: "Password changed successfully." });
  }

  if (loading) {
    return (
      <>
        <PageTitle title="Profile" sub="Your admin account" />
        <Card><p className="py-6 text-center text-[14.5px] text-[#797f89]">Loading…</p></Card>
      </>
    );
  }

  return (
    <>
      <PageTitle title="Profile" sub="Update your name, email and password" />
      <div className="grid max-w-[860px] gap-6">
        <Card>
          <h2 className="font-heading text-[18px] font-semibold text-[#161c26]">Account details</h2>
          <form onSubmit={saveProfile} className="mt-4 grid gap-4" noValidate>
            <Field label="Name">
              <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputCls}
              />
            </Field>
            {profileMsg && <Notice kind={profileMsg.kind} text={profileMsg.text} />}
            <div>
              <PrimaryButton disabled={profileBusy}>{profileBusy ? "Saving…" : "Save changes"}</PrimaryButton>
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="font-heading text-[18px] font-semibold text-[#161c26]">Change password</h2>
          <form onSubmit={changePassword} className="mt-4 grid gap-4" noValidate>
            <Field label="Current password">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
                className={inputCls}
              />
            </Field>
            <Field label="New password" hint="At least 8 characters.">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={8}
                className={inputCls}
              />
            </Field>
            <Field label="Confirm new password">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                className={inputCls}
              />
            </Field>
            {pwMsg && <Notice kind={pwMsg.kind} text={pwMsg.text} />}
            <div>
              <PrimaryButton disabled={pwBusy}>{pwBusy ? "Changing…" : "Change password"}</PrimaryButton>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
