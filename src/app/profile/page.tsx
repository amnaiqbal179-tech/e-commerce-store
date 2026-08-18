import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Server action order delete karne ke liye
async function deleteOrder(orderId: string) {
  "use server";
  await db.order.delete({
    where: { id: orderId },
  });
  revalidatePath("/profile");
}

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    return (
      <main className="w-full bg-white min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="max-w-[1440px] mx-auto px-6 py-24 text-center space-y-4">
          <h1 className="text-2xl font-bold text-black">Please sign in to view your orders.</h1>
          <Link href="/" className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors">
            Go to Home
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const userEmail = user.emailAddresses[0]?.emailAddress;
  const userId = user.id;

  const orders = await db.order.findMany({
    where: {
      OR: [
        { userId: userId },
        ...(userEmail ? [{ customerEmail: userEmail }] : []),
      ],
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="w-full bg-white min-h-screen flex flex-col justify-between">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[100px] py-10 flex-1 w-full space-y-8">
        <h1 className="text-[28px] sm:text-[32px] font-bold text-black">My Orders & Tracking</h1>

        {orders.length === 0 ? (
          <div className="bg-[#F0F0F0] rounded-3xl p-8 text-center space-y-4">
            <ShoppingCart size={48} className="mx-auto text-black/40" />
            <p className="text-black/60 text-lg font-medium">You haven't placed any orders yet.</p>
            <Link 
              href="/" 
              className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="border border-black/10 rounded-2xl p-6 bg-white shadow-sm space-y-4 hover:border-black/30 transition-all"
              >
                {/* Header Meta Info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-black/10 pb-4">
                  <div>
                    <p className="font-bold text-black">
                      Order Number: #{order.orderNumber || order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-black/60">
                      Placed on: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                      order.status === "Processing" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                    }`}>
                      {order.status}
                    </span>
                    
                    <Link 
                      href={`/order-tracking/${order.id}`}
                      className="bg-black text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      Track Order
                    </Link>

                    {/* Delete Form Action */}
                    <form action={async () => {
                      "use server";
                      await deleteOrder(order.id);
                    }}>
                      <button 
                        type="submit"
                        className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-full transition-colors cursor-pointer"
                        aria-label="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Order Items List */}
                {order.items && order.items.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 bg-[#F9F9F9] p-3 rounded-xl">
                        {item.image && (
                          <div className="w-12 h-12 bg-white rounded-lg relative shrink-0 overflow-hidden">
                            <Image src={item.image} alt={item.title || "Product"} fill className="object-cover" />
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
                )}

                {/* Payment & Total Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-black/5 text-sm gap-2">
                  <div className="flex items-center gap-4 text-black/60 flex-wrap text-xs">
                    <span>Method: <strong className="text-black">{order.paymentMethod || "N/A"}</strong></span>
                    
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