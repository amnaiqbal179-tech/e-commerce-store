import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import PrintButton from "@/components/PrintButton";
import CancelOrderButton from "@/components/CancelOrderButton"; // 🟢 Cancel Button Component import kiya

// 🔴 Yeh line Next.js ko strictly batayegi ke is page ko Node.js par chalana hai (Edge par nahi)
export const runtime = "nodejs";

// Server action review save karne ke liye
async function handleAddReview(formData: FormData) {
  "use server";
  const productId = formData.get("productId") as string;
  const rating = Number(formData.get("rating")) || 5;
  const comment = formData.get("comment") as string;
  const userName = (formData.get("userName") as string) || "Customer";
  const orderId = formData.get("orderId") as string;

  if (!comment || !productId) return;

  await db.review.create({
    data: {
      productId,
      rating,
      comment,
      name: userName,
    },
  });

  revalidatePath(`/order-tracking/${orderId}`);
}

// 🟢 Server Action: Order Cancel karne aur Stock wapis update karne ke liye
async function handleCancelOrder(formData: FormData) {
  "use server";
  const orderId = formData.get("orderId") as string;
  if (!orderId) return;

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) return;

  // Sirf tab cancel ho sake jab Pending ya Processing ho
  if (order.status !== "Pending" && order.status !== "Processing") {
    return;
  }

  // Database transaction ke zariye status update aur stock restore karna
  await db.$transaction(async (tx) => {
    // 1. Order status ko Cancelled kar dein
    await tx.order.update({
      where: { id: orderId },
      data: { status: "Cancelled" },
    });

    // 2. Har item ka stock wapis barha dein (restore stock)
    for (const item of order.items) {
      if (item.productId) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }
  });

  revalidatePath(`/order-tracking/${orderId}`);
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderTrackingPage({ params }: PageProps) {
  const { id } = await params;
  const user = await currentUser();

  console.log("➡️ URL se aane wali ID:", id); 

  const order = await db.order.findFirst({
    where: {
      OR: [
        { id: id },
        { orderNumber: id }
      ]
    },
    include: {
      items: {
        include: { 
          product: {
            include: {
              reviews: true
            }
          } 
        }
      }
    }
  });

  if (!order) {
    console.log("🚨 ERROR: Yeh order database mein nahi hai:", id);
    return (
      <main className="max-w-[1000px] mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 border border-red-200 text-red-600 p-8 rounded-3xl max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-4">Order Nahi Mila!</h1>
          <p className="mb-2">Aap jis Order ID ko track karne ki koshish kar rahi hain, woh database mein mojood nahi hai:</p>
          <p className="font-mono bg-white px-3 py-1 rounded border inline-block mb-6 text-black">{id}</p>
          <br />
          <Link href="/profile" className="inline-flex items-center gap-2 text-white bg-black px-6 py-3 rounded-full hover:bg-gray-800 transition">
            <ArrowLeft size={18} /> Go Back to Profile
          </Link>
        </div>
      </main>
    );
  }

  // Check karein kya order delivered hai?
  const isDelivered = order.status === "Delivered";
  const isCancellable = order.status === "Pending" || order.status === "Processing";
  
  // Typecast or fallback for payment details
  const paymentMethod = (order as any).paymentMethod || "Cash on Delivery";
  const paymentStatus = (order as any).paymentStatus || "Pending";

  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = Number(order.totalAmount) > subtotal ? Number(order.totalAmount) - subtotal : 250;

  return (
    <main className="max-w-[1000px] mx-auto px-4 py-10 font-sans">
      
      {/* Top Navigation & Print Actions (Print ke waqt hide ho jayenge) */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link href="/profile" className="flex items-center gap-2 text-black/60 hover:text-black w-fit text-sm font-medium">
          <ArrowLeft size={18} /> Back to My Orders
        </Link>

        <div className="flex items-center gap-3">
          {/* 🟢 Cancel Order Client Component (Agar order Pending ya Processing ho tabhi show hoga) */}
          {isCancellable && (
            <CancelOrderButton orderId={order.id} onCancel={handleCancelOrder} />
          )}

          <PrintButton />
        </div>
      </div>

      {/* ================= INVOICE WRAPPER ================= */}
      <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* SHOP.CO Official Branding Header (Only visible when printing) */}
        <div className="hidden print:flex justify-between items-start pb-6 border-b border-gray-300">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-black">SHOP.CO</h1>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-1">Official Tax Invoice</p>
          </div>
          <div className="text-right">
            <h2 className="text-sm font-bold text-gray-900">INVOICE #{order.orderNumber || order.id.slice(-8).toUpperCase()}</h2>
            <p className="text-xs text-gray-500 mt-1">Date: {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            <span className="inline-block mt-2 px-3 py-0.5 bg-gray-100 text-black text-xs font-semibold rounded-md border border-gray-300">
              Status: {order.status}
            </span>
          </div>
        </div>

        {/* Header Section (Normal Screen View) */}
        <div className="flex justify-between items-start border-b border-black/10 pb-6 print:hidden">
          <div>
            <h1 className="text-2xl font-bold">Order Tracking & Invoice</h1>
            <p className="text-black/60 mt-1 font-mono text-sm">Order ID: #{order.orderNumber}</p>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${
            order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
            order.status === "Processing" ? "bg-blue-100 text-blue-800" : 
            order.status === "Cancelled" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}>
            {order.status}
          </div>
        </div>

        {/* Order Items Section */}
        <div className="space-y-6">
          <h2 className="font-bold text-lg">Order Items</h2>
          {order.items.map((item) => {
            const productReviews = item.product?.reviews || [];
            const userReview = productReviews.find(r => r.name === (user?.fullName || "Customer"));

            return (
              <div key={item.id} className="border border-black/10 p-6 rounded-2xl bg-white space-y-4 print:border-gray-200">
                <div className="flex items-center gap-4">
                  {item.image && (
                    <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-black/5 print:hidden">
                      <Image src={item.image} alt={item.title || "Product"} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-black">{item.title}</p>
                    <p className="text-sm text-black/60">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-lg">${Number(item.price * item.quantity).toFixed(2)}</p>
                </div>

                {/* 🟢 Agar Order Delivered hai, toh Review section show ho ga (Print par hide rahega) */}
                {isDelivered && item.productId && (
                  <div className="mt-4 pt-4 border-t border-black/15 space-y-4 print:hidden">
                    {userReview ? (
                      <div className="bg-green-50/50 border border-green-100 p-4 rounded-xl space-y-1">
                        <p className="text-xs font-bold text-green-800 uppercase tracking-wide">Aapka Review:</p>
                        <div className="flex items-center gap-1 text-yellow-500 text-sm py-1">
                          {[...Array(userReview.rating)].map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" />
                          ))}
                        </div>
                        <p className="text-sm text-black/80 italic">"{userReview.comment}"</p>
                      </div>
                    ) : (
                      <form action={handleAddReview} className="space-y-3 bg-[#F9F9F9] border border-black/5 p-5 rounded-xl">
                        <input type="hidden" name="productId" value={item.productId} />
                        <input type="hidden" name="orderId" value={order.id} />
                        <input type="hidden" name="userName" value={user?.fullName || "Customer"} />
                        
                        <h5 className="font-bold text-sm text-black">Rate & Review this Product:</h5>
                        
                        <div className="flex gap-2 items-center">
                          <label className="text-xs font-semibold text-black/70">Rating:</label>
                          <select name="rating" className="border border-black/20 rounded-md px-2 py-1 text-sm bg-white outline-none focus:border-black">
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Good</option>
                            <option value="3">3 - Average</option>
                            <option value="2">2 - Poor</option>
                            <option value="1">1 - Terrible</option>
                          </select>
                        </div>

                        <textarea
                          name="comment"
                          placeholder="Apna experience share karein..."
                          required
                          className="w-full border border-black/20 rounded-xl p-3 text-sm bg-white focus:outline-none focus:border-black resize-none"
                          rows={2}
                        ></textarea>

                        <button
                          type="submit"
                          className="bg-black text-white text-xs font-medium px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
                        >
                          Submit Review
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 💳 Summary, Shipping & Payment Section */}
        <div className="bg-[#F9F9F9] print:bg-white border border-black/5 print:border-gray-200 p-6 rounded-2xl mt-8 space-y-4">
          <div className="flex justify-between items-center text-sm text-black/70">
            <span>Subtotal</span>
            <span className="font-semibold text-black">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-black/70 border-b border-black/10 pb-4">
            <span>Shipping Fee</span>
            <span className="font-semibold text-black">${shippingFee.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center font-bold text-xl pt-1 text-black">
            <span>Total Amount</span>
            <span>${Number(order.totalAmount).toFixed(2)}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-black/10">
            {/* Shipping Info */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-black/50 uppercase tracking-widest">Shipping Details</h3>
              <div className="text-sm text-black/80 leading-relaxed">
                <p><span className="font-medium text-black">Name:</span> {order.customerName}</p>
                <p><span className="font-medium text-black">Address:</span> {order.address}, {order.city}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-2 sm:text-right">
              <h3 className="text-xs font-bold text-black/50 uppercase tracking-widest">Payment Details</h3>
              <div className="text-sm text-black/80 leading-relaxed flex flex-col sm:items-end gap-1.5">
                <p><span className="font-medium text-black">Method:</span> {paymentMethod}</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-black">Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    paymentStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note for Print */}
        <div className="hidden print:block mt-12 pt-6 border-t border-gray-300 text-center text-xs text-gray-500 space-y-1">
          <p className="font-bold text-black">Thank you for shopping with SHOP.CO!</p>
          <p>This is a computer-generated official tax invoice.</p>
        </div>

      </div>
    </main>
  );
}