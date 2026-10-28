"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DangerButton } from "../../_components/ui";

/** Status + delete controls for one message. */
export default function MessageActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next: string) {
    setBusy(true);
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert("Could not update the status.");
  }

  async function remove() {
    if (!confirm("Delete this message permanently?")) return;
    setBusy(true);
    const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/messages");
      router.refresh();
    } else {
      setBusy(false);
      alert("Delete failed.");
    }
  }

  const btn =
    "rounded-lg border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-[#161c26] hover:bg-black/5 disabled:opacity-60";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {status !== "READ" && (
        <button type="button" className={btn} disabled={busy} onClick={() => setStatus("READ")}>
          Mark as read
        </button>
      )}
      {status !== "ARCHIVED" && (
        <button type="button" className={btn} disabled={busy} onClick={() => setStatus("ARCHIVED")}>
          Archive
        </button>
      )}
      {status === "ARCHIVED" && (
        <button type="button" className={btn} disabled={busy} onClick={() => setStatus("NEW")}>
          Move back to inbox
        </button>
      )}
      <DangerButton onClick={remove} disabled={busy}>
        Delete message
      </DangerButton>
    </div>
  );
}
