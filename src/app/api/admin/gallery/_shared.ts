import { db } from "@/lib/db";
import { makeCrud, str, strOr, num, bool, json } from "../_crud";

function base(body: Record<string, unknown>, partial: boolean) {
  const d: Record<string, unknown> = {};
  const set = (key: string, value: unknown) => {
    if (!partial || key in body) d[key] = value;
  };
  set("title", str(body.title, 200));
  set("category", strOr(body.category, "design", 40));
  set("catLabel", str(body.catLabel, 80));
  set("image", str(body.image, 600));
  set("caption", str(body.caption, 400));
  set("alt", str(body.alt, 300));
  set("ratio", strOr(body.ratio, "ar-sq", 20));
  set("sortOrder", num(body.sortOrder, 0));
  set("visible", bool(body.visible, true));
  return d;
}

export const crud = makeCrud({
  list: () => db.galleryItem.findMany({ orderBy: { sortOrder: "asc" } }),
  create: (data) => db.galleryItem.create({ data: data as never }),
  update: (id, data) => db.galleryItem.update({ where: { id }, data: data as never }),
  remove: (id) => db.galleryItem.delete({ where: { id } }),
  buildCreate: (body) => {
    if (!str(body.title, 300)) return { error: "Title is required." };
    return base(body, false);
  },
  buildUpdate: (body) => base(body, true),
  revalidate: ["/","/gallery"],
});
