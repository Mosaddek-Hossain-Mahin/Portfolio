import Link from "next/link";
import { db } from "@/lib/db";
import { Card, PageTitle, StatusBadge, Empty } from "./_components/ui";
import { getCurrentAdminUser } from "@/lib/session";

export const instant = false;

async function counts() {
  try {
    const [projects, technologies, gallery, messages, newMessages, testimonials] =
      await Promise.all([
        db.project.count(),
        db.technology.count(),
        db.galleryItem.count(),
        db.message.count(),
        db.message.count({ where: { status: "NEW" } }),
        db.testimonial.count(),
      ]);
    return { projects, technologies, gallery, messages, newMessages, testimonials };
  } catch {
    return null;
  }
}

async function recentMessages() {
  try {
    return await db.message.findMany({ orderBy: { createdAt: "desc" }, take: 5 });
  } catch {
    return [];
  }
}

const TILES = [
  { key: "projects", label: "Projects", href: "/admin/projects" },
  { key: "technologies", label: "Technologies", href: "/admin/technologies" },
  { key: "gallery", label: "Gallery items", href: "/admin/gallery" },
  { key: "testimonials", label: "Testimonials", href: "/admin/testimonials" },
] as const;

export default async function DashboardPage() {
  const [c, recent, admin] = await Promise.all([
    counts(),
    recentMessages(),
    getCurrentAdminUser(),
  ]);

  return (
    <div>
      <PageTitle
        title={`Welcome${admin ? `, ${admin.name.split(" ")[0]}` : ""}`}
        sub="Everything on the public site is editable from here."
      />
      {c === null ? (
        <Card>
          <p className="py-6 text-center text-[14.5px] text-red-600">
            Could not reach the database. Check DATABASE_URL (Neon) in your .env,
            then run <b>npx prisma db push</b> and <b>npm run db:seed</b>.
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {TILES.map((t) => (
              <Link key={t.key} href={t.href}>
                <Card className="transition hover:shadow-md">
                  <p className="font-heading text-[32px] font-semibold text-[#161c26]">
                    {c[t.key]}
                  </p>
                  <p className="text-[13.5px] font-medium text-[#797f89]">{t.label}</p>
                </Card>
              </Link>
            ))}
          </div>
          <Link href="/admin/messages" className="mt-4 block">
            <Card className="transition hover:shadow-md">
              <p className="font-heading text-[32px] font-semibold text-[#161c26]">
                {c.messages}
                {c.newMessages > 0 && (
                  <span className="ml-3 align-middle text-[14px] font-semibold text-[#455ce9]">
                    {c.newMessages} new
                  </span>
                )}
              </p>
              <p className="text-[13.5px] font-medium text-[#797f89]">
                Contact-form messages — open the inbox →
              </p>
            </Card>
          </Link>
        </>
      )}

      <h2 className="mb-4 mt-10 font-heading text-[19px] font-semibold text-[#161c26]">
        Recent messages
      </h2>
      {recent.length === 0 ? (
        <Empty text="No messages yet — they appear here when someone uses the contact form." />
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-black/8">
            {recent.map((m) => (
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
                    {new Date(m.createdAt).toLocaleDateString("en-GB")}
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
