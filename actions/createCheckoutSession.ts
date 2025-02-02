"use server";

import { BasketItem } from "@/app/store/store";
import imageUrl from "@/lib/imageUrl";
import stripe from "@/lib/stripe";

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
};

export type GroupedBasketItem = {
  product: BasketItem["product"];
  quantity: number;
};

export async function createCheckoutSession(
  items: GroupedBasketItem[],
  metadata: Metadata
) {
  try {
    // check if any grouped items don't have a price
    const itemsWithoutPrice = items.filter((item) => !item.product.price);
    if (itemsWithoutPrice.length > 0) {
      throw new Error("Some items do not have a price");
    }

    // Search for existing customers by mail
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? `https://${process.env.VERCEL_URL}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}`;
    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;

    const cancelUrl = `${baseUrl}/basket`;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : "always",
      customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata,
      allow_promotion_codes: true,
      // success_url: `${`https://${process.env.VERCEL_URL}` || process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      success_url: successUrl,
      // cancel_url: `${`https://${process.env.VERCEL_URL}` || process.env.NEXT_PUBLIC_BASE_URL}/basket`,
      cancel_url: cancelUrl,
      line_items: items.map((item) => ({
        price_data: {
          currency: "gbp",
          unit_amount: Math.round(item.product.price! * 100),
          product_data: {
            name: item.product.name || "Unnamed product",
            description: `Product ID: ${item.product._id}`,
            metadata: {
              id: item.product._id,
            },
            images: item.product.image
              ? [imageUrl(item.product.image).url()]
              : undefined,
          },
        },
        quantity: item.quantity,
      })),
      mode: "payment", // يتم تحديد `mode` هنا في الجلسة فقط
    });
    return session.url; // Ensure the function returns a string (checkout URL)
  } catch (error) {
    console.error("Error creating checkout session", error);
    throw error;
  }
}
