import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

const getAllProducts = async () => {
  const ALL_PRODUCTS_QUERY = defineQuery(`
    *[_type == "product"] | order(name asc)
        `);

  try {
    // Use sanityFetch to send the query
    const products = await sanityFetch({
      query: ALL_PRODUCTS_QUERY,
    });

    // Return the list of product, or an empty array if none are found
    return products.data || [];
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};

export default getAllProducts;
