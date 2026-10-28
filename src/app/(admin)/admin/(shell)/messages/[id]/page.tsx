import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { Card, PageTitle, StatusBadge } from "../../_components/ui";
import MessageActions from "./MessageActions";

export const instant = false;

export default async function MessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  let m: Awaited<ReturnType<typeof db.message.findUnique>> = null;
  try {
    m = await db.message.findUnique({ where: { id } });
  } catch {
    m = null;
  }
  if (!m) notFound();

  return (
    <div>
      <PageTitle
        title="Message"
        sub={new Date(m.createdAt).toLocaleString("en-GB", {
          dateStyle: "full",
          timeStyle: "short",
        })}
        action={
          <Link
            href="/admin/messages"
            className="rounded-lg border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-[#161c26]"
          >
            ← All messages
          </Link>
        }
      />
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-heading text-[20px] font-semibold text-[#161c26]">{m.name}</h2>
          <StatusBadge status={m.status} />
        </div>
        <dl className="mt-5 grid gap-4 text-[14.5px] sm:grid-cols-2">
          <div>
            <dt className="text-[12.5px] font-semibold uppercase tracking-wide text-[#797f89]">Email</dt>
            <dd className="mt-1">
              <a className="text-[#455ce9] hover:underline" href={`mailto:${m.email}`}>
                {m.email}
              </a>
            </dd>
          </div>
          {m.org && (
            <div>
              <dt className="text-[12.5px] font-semibold uppercase tracking-wide text-[#797f89]">Organization</dt>
              <dd className="mt-1">{m.org}</dd>
            </div>
          )}
          {m.subject && (
            <div>
              <dt className="text-[12.5px] font-semibold uppercase tracking-wide text-[#797f89]">Subject</dt>
              <dd className="mt-1">{m.subject}</dd>
            </div>
          )}
        </dl>
        <div className="mt-6 border-t border-black/10 pt-5">
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#161c26]">{m.body}</p>
        </div>
        <div className="mt-8 border-t border-black/10 pt-5">
          <MessageActions id={m.id} status={m.status} />
        </div>
      </Card>
    </div>
  );
}
