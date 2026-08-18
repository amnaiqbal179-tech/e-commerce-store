import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";
import { FaBoxOpen, FaArrowLeft, FaSearchLocation } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Server action order delete karne ke liye
async function deleteOrder(orderId: string) {
  "use server";
  await prisma.order.delete({
    where: { id: orderId },
  });
  revalidatePath("/orders");
}

export default async function OrdersHistoryPage() {
  const user = await currentUser();

  if (!user) {
    return (
      <main className="w-full bg-white min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
          <h1 className="text-2xl font-bold text-black">Please Login</h1>
          <p className="text-black/60 text-sm">Order history dekhne ke liye login karna zaroori hai.</p>
          <Link href="/" className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium">
            Go to Home
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const userEmail = user.primaryEmailAddress?.emailAddress;
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { userId: user.id },
        ...(userEmail ? [{ customerEmail: userEmail }] : []),
      ],
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="w-full bg-white min-h-screen flex flex-col justify-between">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[100px] py-10 flex-1 w-full space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-black/10 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black uppercase">
              My Order History & Tracking
            </h1>
            <p className="text-black/60 text-sm mt-1">
              Aapke is account se kiye gaye tamam orders ki list aur status.
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-black/60 hover:text-black transition-colors"
          >
            <FaArrowLeft size={12} /> Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 space-y-4 border border-black/10 rounded-3xl p-8 bg-[#F9F9F9]">
            <div className="w-20 h-20 bg-black/5 text-black/40 rounded-full flex items-center justify-center mx-auto text-3xl">
              <FaBoxOpen />
            </div>
            <h3 className="text-xl font-bold text-black">No Orders Found</h3>
            <p className="text-black/60 text-sm max-w-sm mx-auto">
              Aapne abhi tak is account se koi order nahi kiya.
            </p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-black/80 transition-all shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-black/10 rounded-2xl p-6 bg-white shadow-xs space-y-4 hover:border-black/30 transition-all"
              >
                {/* Order Meta Info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-black/10 pb-4">
                  <div>
                    <span className="text-xs text-black/60 uppercase font-semibold">Order ID:</span>
                    <span className="font-mono font-bold text-sm text-black ml-2">{order.id}</span>
                    <span className="text-xs text-black/40 ml-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Order Status */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                      order.status === "Processing" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                    }`}>
                      {order.status}
                    </span>

                    {/* Track Order Button */}
                    <Link
                      href={`/order-tracking/${order.id}`}
                      className="bg-black text-white px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 hover:bg-black/80 transition-all"
                    >
                      <FaSearchLocation /> Track Order
                    </Link>

                    {/* Delete Order Form */}
                    <form action={async () => {
                      "use server";
                      await deleteOrder(order.id);
                    }}>
                      <button 
                        type="submit"
                        className="bg-red-50 text-red-600 hover:bg-red-100 p-2.5 rounded-full transition-colors cursor-pointer"
                        aria-label="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Order Items List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-[#F9F9F9] p-3 rounded-xl">
                      {item.image && (
                        <div className="w-12 h-12 bg-white rounded-lg relative shrink-0 overflow-hidden">
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-black truncate">{item.title}</h4>
                        <p className="text-[11px] text-black/60">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-xs text-black">${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Payment & Total Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-black/5 text-sm gap-2">
                  <div className="flex items-center gap-4 text-black/60">
                    <span>Method: <strong className="text-black">{order.paymentMethod || "N/A"}</strong></span>
                    
                    {/* Payment Status Badge */}
                    <span className="flex items-center gap-1.5">
                      Status: 
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                        (order.paymentStatus || "Pending") === "Paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {order.paymentStatus || "Pending"}
                      </span>
                    </span>
                  </div>

                  <span className="font-bold text-black text-base">Total: ${order.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}