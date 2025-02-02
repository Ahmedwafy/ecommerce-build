import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

const getMyOrders = async (userId: string) => {
  if (!userId) {
    throw new Error("No user id, User id is required");
  }

  // Define the query to get the orders based on user ID, sorted by order date descending
  const MY_ORDERS_QUERY = defineQuery(`
    *[_type == "order" && clerkUserId == $userId] | order(orderDate desc) {
        ..., // Include all fields
        products[] {
            ..., // Include all fields
            product->                   
        }
      }
    `);

  try {
    // Use sanityFetch to send the query
    const orders = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId },
    });

    // Return the list of orders, or an empty array if no orders are found
    return orders.data || [];
  } catch (error) {
    console.error("Error fetching orders", error);
    throw new Error("Error fetching orders");
  }
};

export default getMyOrders;
