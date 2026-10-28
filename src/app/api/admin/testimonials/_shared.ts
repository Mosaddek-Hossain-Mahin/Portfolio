import { db } from "@/lib/db";
import { makeCrud, str, strOr, num, bool, json } from "../_crud";

function base(body: Record<string, unknown>, partial: boolean) {
  const d: Record<string, unknown> = {};
  const set = (key: string, value: unknown) => {
    if (!partial || key in body) d[key] = value;
  };
  set("quote", str(body.quote, 2000));
  set("name", str(body.name, 120));
  set("initials", str(body.initials, 8));
  set("role", str(body.role, 200));
  set("sortOrder", num(body.sortOrder, 0));
  set("visible", bool(body.visible, true));
  return d;
}

export const crud = makeCrud({
  list: () => db.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
  create: (data) => db.testimonial.create({ data: data as never }),
  update: (id, data) => db.testimonial.update({ where: { id }, data: data as never }),
  remove: (id) => db.testimonial.delete({ where: { id } }),
  buildCreate: (body) => {
    if (!str(body.quote, 300)) return { error: "Quote is required." };
    return base(body, false);
  },
  buildUpdate: (body) => base(body, true),
  revalidate: ["/"],
});
