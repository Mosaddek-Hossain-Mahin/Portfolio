import { db } from "@/lib/db";
import { makeCrud, str, strOr, num, bool, json } from "../_crud";

function base(body: Record<string, unknown>, partial: boolean) {
  const d: Record<string, unknown> = {};
  const set = (key: string, value: unknown) => {
    if (!partial || key in body) d[key] = value;
  };
  set("name", str(body.name, 120));
  set("category", strOr(body.category, "frontend", 40));
  set("catLabel", str(body.catLabel, 80));
  set("logo", str(body.logo, 600));
  set("darkBubble", bool(body.darkBubble, false));
  set("sortOrder", num(body.sortOrder, 0));
  set("visible", bool(body.visible, true));
  return d;
}

export const crud = makeCrud({
  list: () => db.technology.findMany({ orderBy: { sortOrder: "asc" } }),
  create: (data) => db.technology.create({ data: data as never }),
  update: (id, data) => db.technology.update({ where: { id }, data: data as never }),
  remove: (id) => db.technology.delete({ where: { id } }),
  buildCreate: (body) => {
    if (!str(body.name, 300)) return { error: "Technology name is required." };
    return base(body, false);
  },
  buildUpdate: (body) => base(body, true),
  revalidate: ["/"],
});
