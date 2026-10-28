import Link from "next/link";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { Card, PageTitle, StatusBadge, Empty } from "../_components/ui";

export const instant = false;

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await connection();
  const { status } = await searchParams;
  const filter =
    status === "NEW" || status === "READ" || status === "ARCHIVED" ? status : null;
  let rows: Awaited<ReturnType<typeof db.message.findMany>> = [];
  let error = "";
  try {
    rows = await db.message.findMany({
      where: filter ? { status: filter } : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  } catch {
    error = "Could not load messages — check the database connection.";
  }

  const tab = (label: string, value: string | null) => {
    const active = filter === value;
    const href = value ? `/admin/messages?status=${value}` : "/admin/messages";
    return (
      <Link
        key={label}
        href={href}
        className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold ${
          active
            ? "border-[#101012] bg-[#101012] text-white"
            : "border-black/15 bg-white text-[#161c26] hover:bg-black/5"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div>
      <PageTitle
        title="Messages"
        sub="Contact-form submissions, newest first. Click one to read it, change its status or delete it."
      />
      <div className="mb-5 flex flex-wrap gap-2">
        {tab("All", null)}
        {tab("New", "NEW")}
        {tab("Read", "READ")}
        {tab("Archived", "ARCHIVED")}
      </div>
      {error && <p className="mb-4 text-[14px] font-medium text-red-600">{error}</p>}
      {!error && rows.length === 0 ? (
        <Empty text="No messages in this view yet." />
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-black/8">
            {rows.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/admin/messages/${m.id}`}
                  className="flex flex-wrap items-center gap-3 px-6 py-4 hover:bg-black/[0.02]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-[#161c26]">
                      {m.name} <span className="font-normal text-[#797f89]">· {m.email}</span>
                    </p>
                    <p className="truncate text-[13.5px] text-[#797f89]">{m.body}</p>
                  </div>
                  <span className="text-[12.5px] text-[#797f89]">
                    {new Date(m.createdAt).toLocaleString("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                  <StatusBadge status={m.status} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
