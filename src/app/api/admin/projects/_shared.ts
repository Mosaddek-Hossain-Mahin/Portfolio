import { db } from "@/lib/db";
import { makeCrud, str, strOr, num, bool, json } from "../_crud";
import { slugify } from "../_guard";

function base(body: Record<string, unknown>, partial: boolean) {
  const d: Record<string, unknown> = {};
  const set = (key: string, value: unknown) => {
    if (!partial || key in body) d[key] = value;
  };
  set("title", str(body.title, 160));
  set("category", strOr(body.category, "design", 40));
  set("catLabel", str(body.catLabel, 120));
  set("year", str(body.year, 20));
  set("tagline", str(body.tagline, 500));
  set("client", str(body.client, 160));
  set("role", str(body.role, 120));
  set("services", json(body.services, []));
  set("heroImage", str(body.heroImage, 600));
  set("heroAlt", str(body.heroAlt, 300));
  set("thumb", str(body.thumb, 600) || null);
  set("thumbAlt", str(body.thumbAlt, 300));
  set("challenge", str(body.challenge, 5000));
  set("built", str(body.built, 5000));
  set("outcome", str(body.outcome, 5000));
  set("stats", json(body.stats, []));
  set("images", json(body.images, []));
  set("tech", json(body.tech, []));
  set("liveUrl", str(body.liveUrl, 600) || null);
  set("videoUrl", str(body.videoUrl, 600) || null);
  set("sortOrder", num(body.sortOrder, 0));
  set("featured", bool(body.featured, false));
  set("visible", bool(body.visible, true));
  if ("slug" in body || "title" in body) {
    const slug = slugify(str(body.slug, 160)) || slugify(str(body.title, 160));
    if (slug) d.slug = slug;
  }
  return d;
}

export const projectsCrud = makeCrud({
  list: () => db.project.findMany({ orderBy: { sortOrder: "asc" } }),
  create: (data) => db.project.create({ data: data as never }),
  update: (id, data) => db.project.update({ where: { id }, data: data as never }),
  remove: (id) => db.project.delete({ where: { id } }),
  buildCreate: (body) => {
    if (!str(body.title, 160)) return { error: "Title is required." };
    const data = base(body, false);
    if (!data.slug) return { error: "A slug is required." };
    return data;
  },
  buildUpdate: (body) => base(body, true),
  revalidate: ["/", "/work", "/sitemap.xml"],
});
