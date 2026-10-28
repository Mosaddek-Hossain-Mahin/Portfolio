import { db } from "@/lib/db";
import { makeCrud, str, strOr, num, bool, json } from "../_crud";

function base(body: Record<string, unknown>, partial: boolean) {
  const d: Record<string, unknown> = {};
  const set = (key: string, value: unknown) => {
    if (!partial || key in body) d[key] = value;
  };
  set("title", str(body.title, 200));
  set("issuer", str(body.issuer, 160));
  set("year", str(body.year, 20));
  set("type", (["CERTIFICATION","AWARD"].includes(str(body.type, 40)) ? str(body.type, 40) : "CERTIFICATION"));
  set("sortOrder", num(body.sortOrder, 0));
  set("visible", bool(body.visible, true));
  return d;
}

export const crud = makeCrud({
  list: () => db.certification.findMany({ orderBy: { sortOrder: "asc" } }),
  create: (data) => db.certification.create({ data: data as never }),
  update: (id, data) => db.certification.update({ where: { id }, data: data as never }),
  remove: (id) => db.certification.delete({ where: { id } }),
  buildCreate: (body) => {
    if (!str(body.title, 300)) return { error: "Title is required." };
    return base(body, false);
  },
  buildUpdate: (body) => base(body, true),
  revalidate: ["/about"],
});
