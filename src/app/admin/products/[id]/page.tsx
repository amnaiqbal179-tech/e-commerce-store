"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Edit, Trash2, DollarSign, Package, Layers, TrendingUp, 
  ChevronLeft, ChevronRight, Star, Plus, ArrowLeft, X,
  ShoppingCart, Heart
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [dbProduct, setDbProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", title: "", comment: "", rating: 5 });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchProduct = async () => {
    if (!productId) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/products/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setDbProduct(data);
        
        if (data.variants && data.variants.length > 0) {
          const colors = data.variants.filter((v: any) => v.option?.toLowerCase() === 'color');
          const sizes = data.variants.filter((v: any) => v.option?.toLowerCase() === 'size');
          
          if (colors.length > 0) setSelectedColor(colors[0].value);
          if (sizes.length > 0) setSelectedSize(sizes[0].value);
        }
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleDelete = async () => {
    if (!productId) return;
    if (confirm("Aap waqai is product ko delete karna chahti hain?")) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
        if (res.ok) {
          router.push("/admin/products");
          router.refresh();
        } else {
          alert("Product delete karne mein masla aaya hai.");
        }
      } catch (error) {
        console.error("Delete Error:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) return alert("Please fill all fields");

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });

      if (res.ok) {
        setReviewForm({ name: "", title: "", comment: "", rating: 5 });
        setIsReviewModalOpen(false);
        fetchProduct();
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      console.error("Review Submit Error:", error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500 font-medium text-sm">
        Loading real product data...
      </div>
    );
  }

  if (!dbProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 font-medium text-sm space-y-4">
        <p className="text-red-500">Product not found in database!</p>
        <Link href="/admin/products" className="bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold">
          Back to Products List
        </Link>
      </div>
    );
  }

  const productTitle = dbProduct.title || dbProduct.name || "Untitled Product";
  const productPrice = dbProduct.price !== undefined ? `$${Number(dbProduct.price).toFixed(2)}` : "Price Not Set";
  const productStock = dbProduct.stock !== undefined ? dbProduct.stock.toLocaleString() : "0";
  const productCategory = dbProduct.category || "N/A";
  const productDescription = dbProduct.description || "No description provided for this product.";
  const productBrand = dbProduct.brand || "N/A";
  const productWeight = dbProduct.weight || "N/A";
  const productSeller = dbProduct.seller || "N/A";
  const productOrders = dbProduct.ordersCount || dbProduct.orders || 0;
  const productRevenue = dbProduct.totalRevenue ? `$${Number(dbProduct.totalRevenue).toLocaleString()}` : "$0";
  const publishedDate = dbProduct.createdAt ? new Date(dbProduct.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A";
  const productSku = dbProduct.sku || "N/A";

  // Dynamic Image Parser
  let productImages: string[] = [];
  if (Array.isArray(dbProduct.images) && dbProduct.images.length > 0) {
    productImages = dbProduct.images;
  } else if (typeof dbProduct.images === 'string' && dbProduct.images.trim() !== '') {
    try { productImages = JSON.parse(dbProduct.images); } catch { productImages = [dbProduct.images]; }
  } else if (typeof dbProduct.imageUrl === 'string' && dbProduct.imageUrl.trim() !== '') {
    productImages = [dbProduct.imageUrl];
  } else if (typeof dbProduct.image === 'string' && dbProduct.image.trim() !== '') {
    productImages = [dbProduct.image];
  }

  const productFeatures = Array.isArray(dbProduct.features) ? dbProduct.features : [];
  
  // Variants extraction
  const productVariants = Array.isArray(dbProduct.variants) ? dbProduct.variants : [];
  const productColorsList = productVariants.filter((v: any) => v.option?.toLowerCase() === 'color');
  const productSizesList = productVariants.filter((v: any) => v.option?.toLowerCase() === 'size');

  const activeReviews = Array.isArray(dbProduct.reviews) ? dbProduct.reviews : [];
  const totalReviews = activeReviews.length;
  const averageRating = totalReviews > 0 
    ? (activeReviews.reduce((acc: number, curr: any) => acc + (curr.rating || 0), 0) / totalReviews).toFixed(1) 
    : "0.0";

  const getRatingPercentage = (star: number) => {
    if (totalReviews === 0) return 0;
    const count = activeReviews.filter((r: any) => Math.round(r.rating || 0) === star).length;
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-white min-h-screen text-gray-900 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/admin/products" className="text-gray-400 hover:text-gray-600 transition-colors mr-1">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">{productTitle}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span><strong className="text-gray-700 font-medium">Seller :</strong> {productSeller}</span>
            <span><strong className="text-gray-700 font-medium">Published :</strong> {publishedDate}</span>
            <span><strong className="text-gray-700 font-medium">SKU :</strong> {productSku}</span>
          </div>
        </div>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Link 
            href={`/admin/products/edit/${productId}`} 
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Link>
          <button 
            onClick={handleDelete} 
            disabled={isDeleting} 
            className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-lg text-sm flex items-center justify-center shadow-sm disabled:opacity-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Gallery (Sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
          <div className="relative w-full aspect-square rounded-2xl bg-[#717274] overflow-hidden flex items-center justify-center group">
            {productImages.length > 0 ? (
              <>
                <img 
                  src={productImages[selectedImageIndex]} 
                  alt={productTitle} 
                  className="w-full h-full object-cover" 
                />
                {productImages.length > 1 && (
                  <>
                    <button 
                      onClick={() => setSelectedImageIndex(prev => prev === 0 ? productImages.length - 1 : prev - 1)} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-black/40 p-1.5 rounded-full hover:bg-black/60 transition-transform active:scale-95"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setSelectedImageIndex(prev => prev === productImages.length - 1 ? 0 : prev + 1)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black/40 p-1.5 rounded-full hover:bg-black/60 transition-transform active:scale-95"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <span className="text-gray-300 text-sm font-medium">No Image Available</span>
            )}
          </div>

          {/* Thumbnails List */}
          {productImages.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {productImages.slice(0, 4).map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedImageIndex(idx)} 
                  className={`aspect-square rounded-xl bg-gray-100 overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx ? "border-black shadow-sm" : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Product Details & Stats */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-50/60 border border-gray-100 p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium truncate">Price</p>
                <p className="text-sm sm:text-base font-bold text-gray-900 truncate">{productPrice}</p>
              </div>
            </div>

            <div className="bg-gray-50/60 border border-gray-100 p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium truncate">No. of Orders</p>
                <p className="text-sm sm:text-base font-bold text-gray-900 truncate">{productOrders}</p>
              </div>
            </div>

            <div className="bg-gray-50/60 border border-gray-100 p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium truncate">Available Stocks</p>
                <p className="text-sm sm:text-base font-bold text-gray-900 truncate">{productStock}</p>
              </div>
            </div>

            <div className="bg-gray-50/60 border border-gray-100 p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium truncate">Total Revenue</p>
                <p className="text-sm sm:text-base font-bold text-gray-900 truncate">{productRevenue}</p>
              </div>
            </div>
          </div>

          {/* Main Info Card */}
          <div className="border border-gray-200/80 rounded-2xl p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Description & Key Features */}
              <div className="md:col-span-7 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Description:</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{productDescription}</p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Key Features:</h3>
                  {productFeatures.length > 0 ? (
                    <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1.5">
                      {productFeatures.map((feature: string, idx: number) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No key features specified.</p>
                  )}
                </div>
              </div>

              {/* Metadata Table Box */}
              <div className="md:col-span-5">
                <div className="border border-gray-200 rounded-xl overflow-hidden text-xs sm:text-sm">
                  <div className="grid grid-cols-2 p-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Category</span>
                    <span className="text-gray-900 font-semibold text-right">{productCategory}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Brand</span>
                    <span className="text-gray-900 font-semibold text-right">{productBrand}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Color</span>
                    <span className="text-gray-900 font-semibold text-right">{selectedColor || dbProduct.color || "N/A"}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3">
                    <span className="text-gray-500 font-medium">Weight</span>
                    <span className="text-gray-900 font-semibold text-right">{productWeight}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Colors Variant Picker */}
            {productColorsList.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">Colors:</h3>
                <div className="flex items-center gap-3">
                  {productColorsList.map((col: any) => (
                    <button 
                      key={col.id || col.value} 
                      onClick={() => setSelectedColor(col.value)} 
                      style={{ backgroundColor: col.value.toLowerCase() }} 
                      title={col.value}
                      className={`w-7 h-7 rounded-full border transition-transform ${
                        selectedColor === col.value 
                          ? "ring-2 ring-offset-2 ring-black scale-105 border-transparent" 
                          : "border-gray-300 hover:scale-105"
                      }`} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Variant Picker */}
            {productSizesList.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">Sizes:</h3>
                <div className="flex flex-wrap items-center gap-2.5">
                  {productSizesList.map((size: any) => (
                    <button 
                      key={size.id || size.value} 
                      onClick={() => setSelectedSize(size.value)} 
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selectedSize === size.value 
                          ? "border-black bg-white text-black shadow-sm" 
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {size.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center gap-3 pt-4">
              <button className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors">
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors">
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
              </button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Reviews</h2>
              <button 
                onClick={() => setIsReviewModalOpen(true)} 
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Submit Review</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Individual Review Cards */}
              <div className="md:col-span-7 space-y-4">
                {activeReviews.length === 0 ? (
                  <div className="border border-gray-200 p-8 rounded-xl text-center">
                    <p className="text-xs sm:text-sm text-gray-500">No reviews yet for this product.</p>
                  </div>
                ) : (
                  activeReviews.map((rev: any, idx: number) => (
                    <div key={rev.id || idx} className="border border-gray-200 p-5 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center font-bold text-gray-600 text-xs shrink-0">
                            {rev.avatarUrl ? (
                              <img src={rev.avatarUrl} alt={rev.name} className="w-full h-full object-cover" />
                            ) : (
                              rev.name?.charAt(0).toUpperCase() || "U"
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900">{rev.name}</h4>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-semibold text-gray-700">{Number(rev.rating || 5).toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "Recently"}
                        </span>
                      </div>
                      <div>
                        {rev.title && <h5 className="text-xs font-bold text-gray-900 mb-1">{rev.title}</h5>}
                        <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Rating Summary Bar Box */}
              <div className="md:col-span-5 md:sticky md:top-6">
                <div className="bg-gray-50/50 border border-gray-200/80 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-900 ml-1">
                      {averageRating} <span className="text-xs font-normal text-gray-500">({totalReviews} reviews)</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-3">
                        <span className="w-10 text-gray-600 font-medium shrink-0">{star} stars</span>
                        <div className="flex-1 h-2 bg-gray-200/80 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-black rounded-full transition-all duration-500" 
                            style={{ width: `${getRatingPercentage(star)}%` }}
                          />
                        </div>
                        <span className="w-8 text-right font-medium text-gray-600 shrink-0">{getRatingPercentage(star)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Write a Review</h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleReviewSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
                <input 
                  type="text" required
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                  className="w-full text-xs sm:text-sm border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-black outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Rating</label>
                <select 
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({...reviewForm, rating: Number(e.target.value)})}
                  className="w-full text-xs sm:text-sm border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-black outline-none bg-white"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Terrible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Review Title (Optional)</label>
                <input 
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                  className="w-full text-xs sm:text-sm border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-black outline-none"
                  placeholder="Summary of your experience"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Comment</label>
                <textarea 
                  required rows={3}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                  className="w-full text-xs sm:text-sm border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-black outline-none resize-none"
                  placeholder="What did you like or dislike?"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsReviewModalOpen(false)} 
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmittingReview} 
                  className="flex-1 py-2 bg-black text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors disabled:opacity-70"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}