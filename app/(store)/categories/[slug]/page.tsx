import ProductsView from "@/components/ProductsView";
import getAllCategories from "@/sanity/lib/products/getAllCategories";
import getProductByCategory from "@/sanity/lib/products/getProductByCategory";

interface Props {
  params: {
    slug: string;
  };
}
const CategoryPage = async ({ params }: Props) => {
  const { slug } = params;

  console.log(">>>>>>>>>> params:", params);
  console.log(" >>>>>>>>> slug:", slug);
  console.log(`type of slug:${typeof slug}`);
  console.log(`type of params:${typeof params}`);

  const products = await getProductByCategory(slug);
  const categories = await getAllCategories();

  return (
    <div className="flex flex-col items-center justify-top min-h-screen gb-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3x1 font-bold mb-6 text-center">
          {slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}{" "}
          Collection
        </h1>
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
};

export default CategoryPage;
