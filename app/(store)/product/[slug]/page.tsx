import imageUrl from "@/lib/imageUrl";
import getProductBySlug from "@/sanity/lib/products/getProductBySlug";
import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToBasketButton from "@/components/AddToBasketButton";
// import { FC } from "react";

export const dynamic = "force-static";
export const revalidate = 60;

const ProductPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  if (!params?.slug) {
    notFound();
  }
  const product = await getProductBySlug(slug);

  // const paramsResolved = await Promise.resolve(params); // make sure Promise is resolved if exist
  // const slug = paramsResolved.slug; // get slug after resolve the Promise
  // const product = await getProductBySlug(slug);

  // console.log("Is slug a string?", typeof params.slug === "string");
  // console.log("Slug:", slug);
  // console.log("Params:", params);
  // console.log("Slug:", params.slug);

  if (!product) {
    notFound();
  }

  console.log(
    crypto.randomUUID().slice(0, 5) +
      `>>>>> Rerendered the product page cache for ${slug}`
  );

  const isOutOfStock = product.stock != null && product.stock <= 0;
  console.log("price:", product.price); // Print Price

  if (typeof product.price === "number") {
    console.log("Price is a number:", product.price);
  } else {
    console.log("Price is not a number", product.price);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className={`relative aspect-square overflow-hidden rounded-lg shadow-lg ${isOutOfStock ? "opacity-50" : ""}`}
        >
          {product.image && (
            <Image
              src={imageUrl(product.image).url()}
              alt={product.name ?? "Product image"}
              fill
              className="object-contain transition-transform duration-300 hover:scale-105"
            />
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="text-3xl font-semibold mb-4">
              £{product.price?.toFixed(2)}
            </div>
            <div className="prose">
              {Array.isArray(product.description) ? (
                <PortableText value={product.description} />
              ) : (
                <p>{product.description}</p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <AddToBasketButton product={product} disabled={isOutOfStock} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
