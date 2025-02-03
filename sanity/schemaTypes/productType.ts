// import { title } from "process";
import { PortableTextBlock } from "next-sanity";
import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

interface SanityImage {
  asset: {
    _ref: string;
    _type: "reference";
    // ... other image properties
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface Product {
  _id: string;
  _type: "product";
  name: string; // NOT optional, because it's required in your schema
  slug: {
    current: string;
  };
  image: SanityImage | null; // Can be null
  description: PortableTextBlock[];
  price: number;
  categories: {
    _ref: string;
    _type: "reference";
  }[];
  stock: number | null; // Can be null
}
export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
    }),

    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),

    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      description: "Available quantity in stock",
      validation: (Rule) => Rule.min(0),
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "image",
      price: "price",
    },
    prepare(select) {
      return {
        title: select.title,
        subtitle: `${select.price}`,
        media: select.media,
      };
    },
  },
});
