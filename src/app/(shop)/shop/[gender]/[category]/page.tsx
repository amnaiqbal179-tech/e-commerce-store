"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { FiSliders } from "react-icons/fi";
import { IoChevronDown } from "react-icons/io5";
import Footer from "@/components/layout/Footer";

// Product images with separate thumbnails and large high-res previews
const productImages = [
  {
    thumb: "/t-shirt-thumb1.png",
    large: "/t-shirt-main.png", 
  },
  {
    thumb: "/t-shirt-thumb2.png",
    large: "/t-shirt-main.png", 
  },
  {
    thumb: "/t-shirt-thumb3.png",
    large: "/t-shirt-main.png", 
  },
];

const colors = ["#4F4631", "#314F4A", "#31344F"]; // Olive, Dark Green, Navy
const sizes = ["Small", "Medium", "Large", "X-Large"];

// You Might Also Like Products Data
const relatedProducts = [
  {
    id: 1,
    title: "Polo with Contrast Trims",
    image: "/product-1.png",
    rating: "4.0",
    price: "$212",
    oldPrice: "$242",
    discount: "-20%",
  },
  {
    id: 2,
    title: "Gradient Graphic T-shirt",
    image: "/product-2.png",
    rating: "3.5",
    price: "$145",
  },
  {
    id: 3,
    title: "Polo with Tipping Details",
    image: "/product-3.png",
    rating: "4.5",
    price: "$180",
  },
  {
    id: 4,
    title: "Black Striped T-shirt",
    image: "/product-4.png",
    rating: "5.0",
    price: "$120",
    oldPrice: "$150",
    discount: "-30%",
  },
];

export default function CategoryProductPage() {
  const params = useParams();
  const gender = (params?.gender as string) || "men";
  const category = (params?.category as string) || "t-shirts";

  const [mainImage, setMainImage] = useState(productImages[0].large);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState("Large");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <main className="w-full bg-white overflow-x-hidden">
      
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[100px] py-6 text-black/60 text-sm flex items-center gap-2 capitalize">
        <Link href="/" className="hover:text-black">Home</Link> &gt; 
        <Link href="/shop" className="hover:text-black">Shop</Link> &gt; 
        <Link href={`/shop/${gender}`} className="hover:text-black">{gender}</Link> &gt; 
        <span className="text-black font-medium">{category.replace("-", " ")}</span>
      </div>

      {/* Main Product Section - Responsive Figma Layout */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[100px] flex flex-col lg:flex-row gap-10 pt-2 items-start">
        
        {/* Left: Images Gallery (Main Image on top for mobile, left column for desktop) */}
        <div className="flex flex-col lg:flex-row gap-4 shrink-0 w-full lg:w-auto">
          
          {/* Big Main Image Preview */}
          <div className="w-full lg:w-[444px] h-[380px] sm:h-[530px] rounded-[20px] bg-[#F0EEED] overflow-hidden relative shrink-0 flex items-center justify-center order-1 lg:order-2">
            <img 
              src={mainImage} 
              alt="One Life Graphic T-Shirt" 
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnails Row/Column */}
          <div className="flex flex-row lg:flex-col gap-3.5 justify-between lg:justify-start order-2 lg:order-1 overflow-x-auto lg:overflow-visible w-full lg:w-auto pb-2 lg:pb-0">
            {productImages.map((item, index) => (
              <button
                key={index}
                onClick={() => setMainImage(item.large)}
                className={`w-[100px] h-[110px] sm:w-[130px] sm:h-[145px] lg:w-[152px] lg:h-[167px] rounded-[20px] bg-[#F0EEED] overflow-hidden transition-all cursor-pointer relative shrink-0 ${
                  mainImage === item.large ? "ring-2 ring-black" : "border border-black/10"
                }`}
              >
                <img 
                  src={item.thumb} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details Info */}
        <div className="flex flex-col flex-1 lg:ml-4 w-full">
          <h1 
            className="text-black font-extrabold text-[24px] sm:text-[34px] lg:text-[38px] uppercase tracking-tight leading-[32px] sm:leading-[48px]"
            style={{ fontFamily: "'Integral CF', 'Arial Black', sans-serif" }}
          >
            ONE LIFE GRAPHIC T-SHIRT
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 my-3">
            <div className="flex text-[#FFC633] gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={22} />
              ))}
            </div>
            <span className="text-black text-base">4.5/<span className="text-black/60">5</span></span>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-3 my-2">
            <span className="text-black font-bold text-[28px] sm:text-[32px]">$260</span>
            <span className="text-black/30 font-bold text-[28px] sm:text-[32px] line-through">$300</span>
            <span className="bg-[#FF3333]/10 text-[#FF3333] text-sm font-medium px-3.5 py-1.5 rounded-full">
              -40%
            </span>
          </div>

          {/* Description */}
          <p className="text-black/60 text-sm sm:text-base border-b border-black/10 pb-6 mt-3 leading-[22px]">
            This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
          </p>

          {/* Select Colors */}
          <div className="py-5 border-b border-black/10">
            <p className="text-black/60 text-sm sm:text-base mb-4">Select Colors</p>
            <div className="flex gap-4">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className="w-[37px] h-[37px] rounded-full flex items-center justify-center text-white cursor-pointer transition-transform hover:scale-105 relative shadow-sm"
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && <FaCheckCircle size={16} />}
                </button>
              ))}
            </div>
          </div>

          {/* Choose Size */}
          <div className="py-5 border-b border-black/10">
            <p className="text-black/60 text-sm sm:text-base mb-4">Choose Size</p>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 sm:px-6 py-3 rounded-full text-sm sm:text-base font-medium transition-all cursor-pointer ${
                    selectedSize === size
                      ? "bg-black text-white font-medium"
                      : "bg-[#F0EEED] text-black/60 hover:bg-black/10"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Counter & Add to Cart */}
          <div className="flex items-center gap-4 sm:gap-5 pt-6 w-full">
            <div className="bg-[#F0EEED] flex items-center justify-between px-4 sm:px-5 py-3.5 rounded-full w-[140px] sm:w-[170px] h-[52px] shrink-0">
              <button onClick={handleDecrement} className="text-black text-2xl font-bold cursor-pointer">-</button>
              <span className="font-bold text-black text-base">{quantity}</span>
              <button onClick={handleIncrement} className="text-black text-2xl font-bold cursor-pointer">+</button>
            </div>

            <button className="flex-1 bg-black text-white h-[52px] rounded-full font-medium hover:bg-black/80 transition-all cursor-pointer text-center text-sm sm:text-base">
              Add to Cart
            </button>
          </div>

        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[100px] mt-20 sm:mt-24">
        <div className="flex border-b border-black/10 justify-between overflow-x-auto">
          <button 
            onClick={() => setActiveTab("details")}
            className={`pb-4 px-2 sm:px-10 text-base sm:text-lg font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === "details" ? "border-b-2 border-black text-black" : "text-black/60"}`}
          >
            Product Details
          </button>
          <button 
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 px-2 sm:px-10 text-base sm:text-lg font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === "reviews" ? "border-b-2 border-black text-black" : "text-black/60"}`}
          >
            Rating &amp; Reviews (451)
          </button>
          <button 
            onClick={() => setActiveTab("faqs")}
            className={`pb-4 px-2 sm:px-10 text-base sm:text-lg font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === "faqs" ? "border-b-2 border-black text-black" : "text-black/60"}`}
          >
            FAQs
          </button>
        </div>

        {/* Reviews Content */}
        {activeTab === "reviews" && (
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h3 className="text-black font-bold text-xl sm:text-2xl flex items-center gap-2">
                All Reviews <span className="text-black/60 text-sm sm:text-base font-normal">(451)</span>
              </h3>
              <div className="flex items-center gap-3">
                <button className="w-12 h-12 rounded-full bg-[#F0EEED] flex items-center justify-center cursor-pointer shrink-0">
                  <FiSliders size={20} />
                </button>
                <button className="hidden sm:flex items-center gap-2 bg-[#F0EEED] px-5 py-3 rounded-full font-medium text-base cursor-pointer">
                  Latest <IoChevronDown />
                </button>
                <button className="bg-black text-white px-5 sm:px-6 py-3.5 rounded-full text-sm sm:text-base font-medium cursor-pointer w-full sm:w-auto">
                  Write a Review
                </button>
              </div>
            </div>

            {/* Review Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {[
                { name: "Samantha D.", date: "August 14, 2023", comment: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt." },
                { name: "Alex M.", date: "August 15, 2023", comment: "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a quirky about aesthetics, and this t-shirt definitely gets a thumbs up from me." },
                { name: "Ethan R.", date: "August 16, 2023", comment: "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt." },
                { name: "Olivia P.", date: "August 17, 2023", comment: "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It's evident that the designer poured their creativity into making this t-shirt stand out." },
                { name: "Liam K.", date: "August 18, 2023", comment: "This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer's skill. It's like wearing a piece of art that reflects my passion for both design and fashion." },
                { name: "Ava H.", date: "August 19, 2023", comment: "I'm not just wearing a t-shirt; I'm wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter." }
              ].map((review, index) => (
                <div key={index} className="border border-black/10 rounded-[20px] p-6 sm:p-8 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex text-[#FFC633] gap-1">
                      {[...Array(5)].map((_, i) => (<FaStar key={i} size={18} />))}
                    </div>
                    <span className="text-black/40 font-bold text-xl">...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black text-lg">{review.name}</span>
                    <FaCheckCircle className="text-[#01AB31]" size={18} />
                  </div>
                  <p className="text-black/60 text-sm sm:text-base leading-[22px]">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <span className="text-black/40 text-xs sm:text-sm mt-1">Posted on {review.date}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <button className="border border-black/10 px-8 py-3.5 rounded-full font-medium text-sm sm:text-base hover:bg-black hover:text-white transition-all cursor-pointer">
                Load More Reviews
              </button>
            </div>
          </div>
        )}
      </div>

      {/* You Might Also Like Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[100px] mt-24 sm:mt-28 mb-20">
        <h2 
          className="text-black font-extrabold text-[28px] sm:text-[40px] lg:text-[48px] text-center uppercase tracking-tight mb-8 sm:mb-12"
          style={{ fontFamily: "'Integral CF', 'Arial Black', sans-serif" }}
        >
          YOU MIGHT ALSO LIKE
        </h2>

        {/* Responsive grid: 2 columns on mobile, 4 columns on large screens */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {relatedProducts.map((product) => (
            <div key={product.id} className="flex flex-col gap-3 group cursor-pointer">
              <div className="w-full h-[200px] sm:h-[298px] rounded-[20px] bg-[#F0EEED] overflow-hidden flex items-center justify-center relative">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-black text-sm sm:text-lg truncate">{product.title}</h3>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex text-[#FFC633] gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={13} />
                  ))}
                </div>
                <span className="text-black text-xs sm:text-sm">{product.rating}/<span className="text-black/60">5</span></span>
              </div>
              <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                <span className="font-bold text-black text-base sm:text-xl">{product.price}</span>
                {product.oldPrice && (
                  <span className="font-bold text-black/30 text-sm sm:text-xl line-through">{product.oldPrice}</span>
                )}
                {product.discount && (
                  <span className="bg-[#FF3333]/15 text-[#FF3333] text-[10px] sm:text-xs font-medium px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                    {product.discount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Imported Footer Component */}
      <Footer />

    </main>
  );
}