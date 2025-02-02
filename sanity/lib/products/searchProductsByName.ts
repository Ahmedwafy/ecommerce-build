import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

const searchProductsByName = async (searchParam: string) => {
  const PRODUCT_SEARCH_QUERY = defineQuery(`
    *[
        _type == "product"
        && name match $searchParam
    ] | order(name asc)
    `);

  try {
    // use sanityFetch to send the query and pass the search parametar with a wildcard
    const prodcuts = await sanityFetch({
      query: PRODUCT_SEARCH_QUERY,
      params: {
        searchParam: `${searchParam}*`, // Append wildcard for partical match
      },
    });

    // Return the list of products, or an empty array if none are found
    return prodcuts.data || [];
  } catch (error) {
    console.error("Error fetching products by name:", error);
    return [];
  }
};

export default searchProductsByName;
