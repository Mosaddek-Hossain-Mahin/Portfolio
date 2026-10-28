import { db } from "@/lib/db";
import { makeCrud, str, strOr, num, bool, json } from "../_crud";

function base(body: Record<string, unknown>, partial: boolean) {
  const d: Record<string, unknown> = {};
  const set = (key: string, value: unknown) => {
    if (!partial || key in body) d[key] = value;
  };
  set("role", str(body.role, 160));
  set("org", str(body.org, 160));
  set("location", str(body.location, 120));
  set("period", str(body.period, 60));
  set("points", json(body.points, []));
  set("tech", json(body.tech, []));
  set("sortOrder", num(body.sortOrder, 0));
  set("visible", bool(body.visible, true));
  return d;
}

export const crud = makeCrud({
  list: () => db.experienceItem.findMany({ orderBy: { sortOrder: "asc" } }),
  create: (data) => db.experienceItem.create({ data: data as never }),
  update: (id, data) => db.experienceItem.update({ where: { id }, data: data as never }),
  remove: (id) => db.experienceItem.delete({ where: { id } }),
  buildCreate: (body) => {
    if (!str(body.role, 300)) return { error: "Role is required." };
    return base(body, false);
  },
  buildUpdate: (body) => base(body, true),
  revalidate: ["/about"],
});
