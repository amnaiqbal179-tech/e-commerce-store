"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Star, ShoppingBag, Heart, Minus, Plus, Check, MessageSquare, ChevronDown, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Variants state
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Tabs state ("details" | "reviews" | "faqs")
  const [activeTab, setActiveTab] = useState("reviews");

  // Reviews State
  const [reviews, setReviews] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
          else setSelectedSize("Large");

          if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
          
          if (data.reviews) setReviews(data.reviews);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-lg">Loading product details...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-lg text-red-500">Product not found!</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.title || product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
    });
    // Alert removed completely for smooth UI experience
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      return;
    }

    const reviewObj = {
      id: Date.now(),
      name: newReview.name,
      rating: Number(newReview.rating),
      comment: newReview.comment,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setReviews([reviewObj, ...reviews]);
    setNewReview({ name: "", rating: 5, comment: "" });
    setIsReviewModalOpen(false);
  };

  const sizesList = product.sizes || ["Small", "Medium", "Large", "X-Large"];
  const colorsList = product.colors || ["#000000", "#3B82F6", "#EF4444", "#10B981"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Left Side: Product Image */}
        <div className="w-full">
          <div className="w-full aspect-square sm:aspect-[4/5] rounded-[20px] overflow-hidden bg-[#F0EEED] relative shadow-sm">
            <img 
              src={product.image} 
              alt={product.title || product.name} 
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
          </div>
        </div>

        {/* Right Side: Product Information & Actions */}
        <div className="flex flex-col space-y-6">
          
          <div>
            <span className="text-xs font-bold uppercase tracking-widest bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {product.category || "Shop"} / {product.subcategory || "General"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3 tracking-tight">
              {product.title || product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-700">4.8 <span className="text-gray-400 font-normal">({reviews.length + 120} Reviews)</span></span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-black text-gray-900">
              ${product.price?.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xl font-bold text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed border-t border-b border-gray-100 py-4">
            {product.description || "This is a premium quality product designed for ultimate comfort and style. Perfect for casual wear or special occasions."}
          </p>

          {/* Color Selector */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">Select Colors</label>
            <div className="flex gap-3">
              {colorsList.map((color: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                    selectedColor === color ? "border-black scale-110 shadow-md" : "border-transparent"
                  }`}
                >
                  {selectedColor === color && <Check className="w-4 h-4 text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">Choose Size</label>
            <div className="flex flex-wrap gap-3">
              {sizesList.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedSize === size
                      ? "bg-black text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Cart Actions */}
          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2.5 gap-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-gray-600 hover:text-black cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm w-4 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="text-gray-600 hover:text-black cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black hover:bg-gray-800 text-white font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              Add to Cart
            </button>

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>

        </div>
      </div>

      {/* TABS SECTION */}
      <div className="mt-20">
        <div className="flex border-b border-gray-200 justify-around sm:justify-start sm:gap-12 text-sm sm:text-base font-bold">
          <button
            onClick={() => setActiveTab("details")}
            className={`pb-4 cursor-pointer transition-all ${
              activeTab === "details" ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Product Details
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 cursor-pointer transition-all ${
              activeTab === "reviews" ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Rating & Reviews ({reviews.length + 120})
          </button>
          <button
            onClick={() => setActiveTab("faqs")}
            className={`pb-4 cursor-pointer transition-all ${
              activeTab === "faqs" ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            FAQs
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === "details" && (
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed max-w-3xl">
              <h3 className="text-lg font-bold text-gray-900">Complete Product Specification</h3>
              <p>{product.description || "Crafted with premium materials to ensure maximum durability, comfort, and breathability. Suitable for all weather conditions and everyday wear."}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Material: 100% Premium Cotton Blend</li>
                <li>Fit: Modern Tailored Fit</li>
                <li>Care Instructions: Machine wash cold, tumble dry low</li>
                <li>Available Sizes: Small, Medium, Large, X-Large</li>
              </ul>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">All Reviews ({reviews.length + 120})</h3>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="bg-black hover:bg-gray-800 text-white font-bold text-sm px-6 py-3 rounded-full transition-all shadow-md cursor-pointer"
                >
                  Write a Review
                </button>
              </div>

              {/* Reviews List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.length === 0 ? (
                  <div className="col-span-2 border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400">
                    <p className="font-bold text-lg text-gray-700">No Custom Reviews Yet</p>
                    <p className="text-sm mt-1">Be the first to review this item and help others in their shopping journey.</p>
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="border border-gray-100 rounded-2xl p-6 shadow-sm bg-white space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">{rev.date}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-base">{rev.name}</h4>
                      <p className="text-gray-600 text-sm">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "faqs" && (
            <div className="space-y-4 max-w-3xl">
              <div className="border border-gray-200 rounded-xl p-5">
                <h4 className="font-bold text-gray-900 text-base">What is the return policy?</h4>
                <p className="text-sm text-gray-600 mt-2">We offer a hassle-free 14-day return and exchange policy for all unused items in original packaging.</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-5">
                <h4 className="font-bold text-gray-900 text-base">How long does shipping take?</h4>
                <p className="text-sm text-gray-600 mt-2">Standard delivery takes between 3 to 5 business days depending on your location.</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-5">
                <h4 className="font-bold text-gray-900 text-base">Are these products true to size?</h4>
                <p className="text-sm text-gray-600 mt-2">Yes, our products follow standard sizing charts. You can check our size guide for precise measurements.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WRITE A REVIEW MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-black text-gray-900">WRITE A REVIEW</h3>
            <p className="text-xs text-gray-500 mt-1">Share your thoughts and sizing experience with our community.</p>

            <form onSubmit={handlePostReview} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Overall Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="text-amber-400 cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${star <= newReview.rating ? "fill-current" : "text-gray-300"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Detailed Feedback *</label>
                <textarea
                  rows={4}
                  placeholder="How did the garment fit? What was your impression of the fabric weight, stitching, and color accuracy?"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-black transition-all resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-6 py-3 rounded-full border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-black text-white text-sm font-bold hover:bg-gray-800 shadow-md cursor-pointer"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}