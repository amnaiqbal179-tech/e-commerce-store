import Image from "next/image";
import Link from "next/link";

const topSellingProducts = [
  {
    id: 1,
    name: "Vertical Striped Shirt",
    rating: 5.0,
    price: 212,
    oldPrice: 232,
    discount: "-20%",
    image: "/products/vertical-shirt.png",
  },
  {
    id: 2,
    name: "Courage Graphic T-shirt",
    rating: 4.0,
    price: 145,
    oldPrice: null,
    discount: null,
    image: "/products/courage-tshirt.png",
  },
  {
    id: 3,
    name: "Loose Fit Bermuda Shorts",
    rating: 3.0,
    price: 80,
    oldPrice: null,
    discount: null,
    image: "/products/bermuda-shorts.png",
  },
  {
    id: 4,
    name: "Faded Skinny Jeans",
    rating: 4.5,
    price: 210,
    oldPrice: null,
    discount: null,
    image: "/products/faded-jeans.png",
  },
];

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

export default function TopSelling() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-[100px] pt-10 lg:pt-16 pb-8 lg:pb-10">
      
      {/* Heading */}
      <h2 className="text-center text-black font-extrabold uppercase tracking-tight text-[28px] sm:text-[40px] lg:text-[48px] mb-8 lg:mb-14" style={{ fontFamily: "'Integral CF', 'Arial Black', sans-serif" }}>
        TOP SELLING
      </h2>

      {/* Products Grid - 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-[20px]">
        {topSellingProducts.map((product) => (
          <div key={product.id} className="flex flex-col gap-3 sm:gap-4">
            
            <div className="relative w-full aspect-square bg-[#F0EEED] rounded-[13px] sm:rounded-[20px] overflow-hidden flex items-center justify-center">
              <Image 
                src={product.image} 
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>

            <div className="flex flex-col gap-1 sm:gap-2">
              <h3 className="text-black font-bold text-[14px] sm:text-[18px] lg:text-[20px] leading-tight capitalize truncate sm:whitespace-normal">
                {product.name}
              </h3>
              
              <div className="flex items-center gap-1.5 sm:gap-2">
                {renderStars(product.rating)}
                <span className="text-black/60 text-[12px] sm:text-[14px]">
                  <span className="text-black">{product.rating.toFixed(1)}</span>/5
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

          </div>
        ))}
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