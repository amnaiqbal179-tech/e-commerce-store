import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

interface PageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

// URL subcategory ko Database ki subcategory se map karne ke liye helper object
const subcategoryMapping: { [key: string]: string } = {
  "party": "party-wear",
  "casual": "casual-wear",
  "tops": "tops-kurtis",
  "shalwar": "shalwar-kameez",
  "dresses": "dresses",
};

export default async function SubCategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const category = resolvedParams.category.toLowerCase();
  let subcategory = resolvedParams.subcategory.toLowerCase();

  // Agar URL wala subcategory mapping mein mojood hai, toh database wala correct format use karein
  if (subcategoryMapping[subcategory]) {
    subcategory = subcategoryMapping[subcategory];
  }

  // Database se products fetch karein
  const products = await prisma.product.findMany({
    where: {
      category: category,
      subcategory: subcategory,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black capitalize tracking-tight text-gray-900 mb-8">
        {resolvedParams.subcategory}
      </h1>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-500 text-sm">No products found in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-x-8 sm:gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}