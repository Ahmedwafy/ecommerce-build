import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Ecommerce Website")
    .items([
      S.documentTypeListItem("category").title("Categories"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !["post", "category"].includes(item.getId()!)
      ),
    ]);
