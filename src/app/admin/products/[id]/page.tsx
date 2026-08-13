"use client";

import { useState } from "react";
import { 
  Edit, 
  Trash2, 
  DollarSign, 
  Package, 
  Layers, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ShoppingCart, 
  Heart,
  Plus
} from "lucide-react";

// Product Image Gallery Sources
const productImages = [
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80", // Grey Hoodie
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80", // Graphic T-Shirt
  "https://images.unsplash.com/photo-1584865288642-42078afe6942?w=800&auto=format&fit=crop&q=80", // Black Pants
  "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80", // Red Cap
];

// Sample Reviews Data
const reviewsData = [
  {
    id: 1,
    name: "Mark P.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    rating: 3.2,
    time: "5 days ago",
    title: "Decent but could be better",
    comment: "The product is okay, but I expected more for the price. A few minor flaws, but overall, it's acceptable.",
  },
  {
    id: 2,
    name: "Jessica K.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    rating: 3.2,
    time: "2 weeks ago",
    title: "Beautiful design",
    comment: "I love the sleek design and the ease of use. Haven't come across such a stylish product in a long time. Highly satisfied!",
  },
  {
    id: 3,
    name: "Michael B.",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
    rating: 3.2,
    time: "4 days ago",
    title: "Satisfied with my purchase",
    comment: "I'm really happy with this purchase. The quality is great, and it's perfect for daily use. It's simple, efficient, and does exactly what it promises.",
  },
  {
    id: 4,
    name: "David L.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    rating: 3.2,
    time: "1 month ago",
    title: "Highly functional and stylish",
    comment: "This product is both functional and stylish. It fits perfectly with my needs, and I'm really impressed with the overall quality.",
  },
];

export default function ProductDetailPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("green");
  const [selectedSize, setSelectedSize] = useState("MD");

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-screen font-sans">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Acme Prism T-Shirt</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
            <span><strong className="text-gray-700 font-medium">Seller :</strong> Poetic Fashion</span>
            <span>•</span>
            <span><strong className="text-gray-700 font-medium">Published :</strong> 20 Oct, 2024</span>
            <span>•</span>
            <span><strong className="text-gray-700 font-medium">SKU :</strong> WH1000XM4</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="bg-black hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs">
            <Edit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl text-xs flex items-center justify-center transition-colors cursor-pointer shadow-xs">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Sticky Gallery vs Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT COLUMN: STICKY IMAGE GALLERY ================= */}
        <div className="lg:col-span-5 sticky top-6 self-start space-y-3">
          
          {/* Main Selected Image */}
          <div className="relative w-full aspect-square rounded-2xl bg-[#EAEBED] border border-gray-200/80 overflow-hidden flex items-center justify-center group">
            <img 
              src={productImages[selectedImageIndex]} 
              alt="Product Main" 
              className="w-full h-full object-cover mix-blend-multiply transition-all duration-300"
            />
            
            {/* Gallery Arrows */}
            <button 
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Image Thumbnails Grid */}
          <div className="grid grid-cols-4 gap-2.5">
            {productImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`aspect-square rounded-xl bg-[#EAEBED] border overflow-hidden transition-all cursor-pointer ${
                  selectedImageIndex === idx 
                    ? "border-black ring-2 ring-black/10" 
                    : "border-gray-200/80 hover:border-gray-400"
                }`}
              >
                <img 
                  src={img} 
                  alt={`Thumbnail ${idx}`} 
                  className="w-full h-full object-cover mix-blend-multiply" 
                />
              </button>
            ))}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: SCROLLABLE CONTENT ================= */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. KPI Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">Price</p>
                <p className="text-lg font-bold text-gray-900">$120.40</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">No. of Orders</p>
                <p className="text-lg font-bold text-gray-900">250</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">Available Stocks</p>
                <p className="text-lg font-bold text-gray-900">2,550</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">Total Revenue</p>
                <p className="text-lg font-bold text-gray-900">$45,938</p>
              </div>
            </div>
          </div>

          {/* 2. Product Specs Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Description:</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Tommy Hilfiger men striped pink sweatshirt. Crafted with cotton. Material composition is 100% organic cotton.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Key Features:</h3>
                  <ul className="list-disc list-inside text-xs text-gray-600 space-y-1.5 pl-1">
                    <li>Industry-leading noise cancellation</li>
                    <li>30-hour battery life</li>
                    <li>Touch sensor controls</li>
                    <li>Speak-to-chat technology</li>
                  </ul>
                </div>
              </div>

              {/* Specification Table */}
              <div className="md:col-span-5">
                <div className="border border-gray-100 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-2 p-2.5 border-b border-gray-100 bg-gray-50/50">
                    <span className="text-gray-500 font-medium">Category</span>
                    <span className="text-gray-900 font-semibold text-right">T-Shirt</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Brand</span>
                    <span className="text-gray-900 font-semibold text-right">Tommy Hilfiger</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5 border-b border-gray-100 bg-gray-50/50">
                    <span className="text-gray-500 font-medium">Color</span>
                    <span className="text-gray-900 font-semibold text-right">Purple</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span className="text-gray-500 font-medium">Weight</span>
                    <span className="text-gray-900 font-semibold text-right">140 Gr</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Colors Picker */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-900">Colors:</h3>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedColor("green")}
                  className={`w-6 h-6 rounded-full bg-emerald-500 transition-all cursor-pointer ${
                    selectedColor === "green" ? "ring-2 ring-offset-2 ring-emerald-500 scale-105" : ""
                  }`}
                />
                <button
                  onClick={() => setSelectedColor("blue")}
                  className={`w-6 h-6 rounded-full bg-indigo-500 transition-all cursor-pointer ${
                    selectedColor === "blue" ? "ring-2 ring-offset-2 ring-indigo-500 scale-105" : ""
                  }`}
                />
                <button
                  onClick={() => setSelectedColor("purple")}
                  className={`w-6 h-6 rounded-full bg-purple-500 transition-all cursor-pointer ${
                    selectedColor === "purple" ? "ring-2 ring-offset-2 ring-purple-500 scale-105" : ""
                  }`}
                />
              </div>
            </div>

            {/* Sizes Picker */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-900">Sizes:</h3>
              <div className="flex flex-wrap items-center gap-2">
                {["SM", "MD", "LG", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      selectedSize === size
                        ? "border-black bg-white text-black font-semibold shadow-xs"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Cart & Wishlist Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button className="bg-black hover:bg-gray-800 text-white font-medium px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs">
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Card</span>
              </button>
              <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer">
                <Heart className="w-4 h-4 text-gray-500" />
                <span>Wishlist</span>
              </button>
            </div>
          </div>

          {/* 3. REVIEWS SECTION (Exact Side-by-Side Layout) */}
          <div className="space-y-4 pt-2">
            
            {/* Reviews Header Row */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Reviews</h2>
              <button className="bg-white border border-gray-200/80 hover:bg-gray-50 text-gray-800 px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs">
                <Plus className="w-3.5 h-3.5 text-gray-600" />
                <span>Submit Review</span>
              </button>
            </div>

            {/* Sub-grid for Reviews List (Left Side) & Rating Card (Right Side) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              
              {/* LEFT SUB-COLUMN: Individual Reviews + Load More */}
              <div className="md:col-span-7 space-y-3">
                {reviewsData.map((rev) => (
                  <div key={rev.id} className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={rev.avatar} 
                          alt={rev.name} 
                          className="w-8 h-8 rounded-full object-cover" 
                        />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">{rev.name}</h4>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-[11px] font-semibold text-gray-700">{rev.rating}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-400 font-medium">{rev.time}</span>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold text-gray-900 mb-1">{rev.title}</h5>
                      <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  </div>
                ))}

                {/* Load More Button (At the bottom of Reviews Feed only) */}
                <div className="flex justify-center pt-2">
                  <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer shadow-2xs">
                    Load more..
                  </button>
                </div>
              </div>

              {/* RIGHT SUB-COLUMN: Rating Summary Breakdown Box (Exact Location) */}
              <div className="md:col-span-5 sticky top-6">
                <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
                  
                  {/* Rating Header */}
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <Star className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-900">4.3 </span>
                      <span className="text-[11px] text-gray-400 font-normal">(12 reviews)</span>
                    </div>
                  </div>

                  {/* Percentage Progress Bars */}
                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-10 text-gray-600 font-medium shrink-0">5 stars</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: "70%" }}></div>
                      </div>
                      <span className="w-7 text-right font-medium text-gray-600 shrink-0">70%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-10 text-gray-600 font-medium shrink-0">4 stars</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: "17%" }}></div>
                      </div>
                      <span className="w-7 text-right font-medium text-gray-600 shrink-0">17%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-10 text-gray-600 font-medium shrink-0">3 stars</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: "7%" }}></div>
                      </div>
                      <span className="w-7 text-right font-medium text-gray-600 shrink-0">7%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-10 text-gray-600 font-medium shrink-0">2 stars</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: "4%" }}></div>
                      </div>
                      <span className="w-7 text-right font-medium text-gray-600 shrink-0">4%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-10 text-gray-600 font-medium shrink-0">1 star</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: "2%" }}></div>
                      </div>
                      <span className="w-7 text-right font-medium text-gray-600 shrink-0">2%</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}