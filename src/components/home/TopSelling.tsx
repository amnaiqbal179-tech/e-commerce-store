import Image from "next/image";
import Link from "next/link";

// Helper function to render stars based on rating
const renderStars = (rating: number) => {
  return (
    <div className="flex gap-[3px] sm:gap-[5px] items-center">
      {[...Array(5)].map((_, index) => {
        if (index < Math.floor(rating)) {
          return (
            <svg key={index} className="w-[14px] h-[14px] sm:w-[19px] sm:h-[19px]" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 0.5L12.008 6.516L18.5 7.026L13.5 11.238L15 17.5L9.5 14L4 17.5L5.5 11.238L0.5 7.026L6.992 6.516L9.5 0.5Z" fill="#FFC633"/>
            </svg>
          );
        } else if (index === Math.floor(rating) && rating % 1 !== 0) {
           return (
             <svg key={index} className="w-[14px] h-[14px] sm:w-[19px] sm:h-[19px]" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5 0.5L12.008 6.516L18.5 7.026L13.5 11.238L15 17.5L9.5 14V0.5Z" fill="#FFC633"/>
                <path d="M9.5 0.5L6.992 6.516L0.5 7.026L5.5 11.238L4 17.5L9.5 14V0.5Z" fill="#D1D5DB"/>
             </svg>
           )
        }
        return (
          <svg key={index} className="w-[14px] h-[14px] sm:w-[19px] sm:h-[19px]" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 0.5L12.008 6.516L18.5 7.026L13.5 11.238L15 17.5L9.5 14L4 17.5L5.5 11.238L0.5 7.026L6.992 6.516L9.5 0.5Z" fill="#D1D5DB"/>
          </svg>
        );
      })}
    </div>
  );
};

export default function TopSelling({ products }: { products: any[] }) {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-[100px] pt-6 sm:pt-8 lg:pt-10 pb-8 lg:pb-10">
      
      {/* Heading */}
      <h2 className="text-center text-black font-extrabold uppercase tracking-tight text-[28px] sm:text-[40px] lg:text-[48px] mb-8 lg:mb-14" style={{ fontFamily: "'Integral CF', 'Arial Black', sans-serif" }}>
        TOP SELLING
      </h2>

      {/* Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-[20px]">
        {products && products.length > 0 ? (
          products.map((product) => {
            const avgRating = product.reviews && product.reviews.length > 0
              ? product.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / product.reviews.length
              : 4.8;

            return (
              <Link href={`/products/${product.id}`} key={product.id} className="flex flex-col gap-3 sm:gap-4 group">
                <div className="relative w-full aspect-square bg-[#F0EEED] rounded-[13px] sm:rounded-[20px] overflow-hidden flex items-center justify-center">
                  <Image 
                    src={product.image || "/products/vertical-shirt.png"} 
                    alt={product.name || "Top Selling Product"} // <--- Fallback add kar diya hai
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>

                <div className="flex flex-col gap-1 sm:gap-2">
                  <h3 className="text-black font-bold text-[14px] sm:text-[18px] lg:text-[20px] leading-tight capitalize truncate sm:whitespace-normal">
                    {product.name || "Untitled Product"}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {renderStars(avgRating)}
                    <span className="text-black/60 text-[12px] sm:text-[14px]">
                      <span className="text-black">{avgRating.toFixed(1)}</span>/5
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-black font-bold text-[16px] sm:text-[22px] lg:text-[24px]">
                      ${product.price}
                    </span>
                    
                    {product.oldPrice && (
                      <span className="text-black/40 font-bold text-[16px] sm:text-[22px] lg:text-[24px] line-through">
                        ${product.oldPrice}
                      </span>
                    )}
                    
                    {product.discount && (
                      <span className="bg-[#FF3333]/10 text-[#FF3333] font-medium text-[10px] sm:text-[12px] px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-[62px]">
                        {product.discount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500 py-6">No top selling products found.</p>
        )}
      </div>

      {/* View All Button */}
      <div className="mt-8 lg:mt-12 flex justify-center">
        <Link 
          href="/shop" 
          className="w-full sm:w-auto text-center px-14 py-3 sm:py-3.5 rounded-[62px] border border-black/10 text-black font-medium text-[14px] sm:text-[16px] hover:bg-gray-50 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="mt-10 lg:mt-16 w-full h-[1px] bg-black/10"></div>

    </section>
  );
}