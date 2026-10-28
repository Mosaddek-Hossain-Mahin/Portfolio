import { db } from "@/lib/db";
import { makeCrud, str, strOr, num, bool, json } from "../_crud";

function base(body: Record<string, unknown>, partial: boolean) {
  const d: Record<string, unknown> = {};
  const set = (key: string, value: unknown) => {
    if (!partial || key in body) d[key] = value;
  };
  set("title", str(body.title, 200));
  set("org", str(body.org, 160));
  set("location", str(body.location, 120));
  set("period", str(body.period, 60));
  set("kicker", str(body.kicker, 80));
  set("image", str(body.image, 600));
  set("imageAlt", str(body.imageAlt, 300));
  set("desc", str(body.desc, 3000));
  set("sortOrder", num(body.sortOrder, 0));
  set("visible", bool(body.visible, true));
  return d;
}

export const crud = makeCrud({
  list: () => db.educationItem.findMany({ orderBy: { sortOrder: "asc" } }),
  create: (data) => db.educationItem.create({ data: data as never }),
  update: (id, data) => db.educationItem.update({ where: { id }, data: data as never }),
  remove: (id) => db.educationItem.delete({ where: { id } }),
  buildCreate: (body) => {
    if (!str(body.title, 300)) return { error: "Title is required." };
    return base(body, false);
  },
  buildUpdate: (body) => base(body, true),
  revalidate: ["/","/about"],
});
