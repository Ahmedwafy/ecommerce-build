import imageUrl from "@/lib/imageUrl";
import getProductBySlug from "@/sanity/lib/products/getProductBySlug";
import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToBasketButton from "@/components/AddToBasketButton";

export const dynamic = "force-static";
export const revalidate = 60;

const ProductPage = async ({ params }: { params: { slug: string } }) => {
  const resolvedParams = await Promise.resolve(params); // تأكد من حل الـ Promise
  const { slug } = resolvedParams; // استخراج الـ slug

  if (!slug) {
    notFound(); // if slug missing
  }

  const product = await getProductBySlug(slug);
  console.log(product);

  if (!product) {
    notFound(); // if no product found
  }

  const isOutOfStock = product.stock != null && product.stock <= 0;

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
