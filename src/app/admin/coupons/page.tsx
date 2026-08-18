import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Tag, Trash2, PlusCircle } from "lucide-react";

export const runtime = "nodejs";

// Server Action: Naya coupon create karne ke liye
async function handleAddCoupon(formData: FormData) {
  "use server";
  const code = (formData.get("code") as string)?.toUpperCase().trim();
  const discountPercent = parseFloat(formData.get("discountPercent") as string);

  if (!code || isNaN(discountPercent)) return;

  try {
    await db.coupon.create({
      data: {
        code,
        discountPercent,
      },
    });
  } catch (error) {
    console.log("Error creating coupon (Code might already exist):", error);
  }

  revalidatePath("/admin/coupons");
}

// Server Action: Coupon delete karne ke liye
async function handleDeleteCoupon(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (!id) return;

  await db.coupon.delete({
    where: { id },
  });

  revalidatePath("/admin/coupons");
}

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-[1000px] mx-auto px-4 py-10 font-sans space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">Promo Code & Coupon Manager</h1>
        <p className="text-black/60 text-sm mt-1">Create discount codes for your customers to use at checkout.</p>
      </div>

      {/* Add Coupon Form */}
      <div className="bg-white border border-black/10 p-6 rounded-3xl shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <PlusCircle size={20} /> Add New Coupon
        </h2>
        
        <form action={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-black/70 mb-1 uppercase tracking-wider">Coupon Code</label>
            <input
              type="text"
              name="code"
              placeholder="e.g. SAVE20"
              required
              className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm uppercase outline-none focus:border-black font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-black/70 mb-1 uppercase tracking-wider">Discount (%)</label>
            <input
              type="number"
              name="discountPercent"
              placeholder="e.g. 15"
              min="1"
              max="100"
              step="0.1"
              required
              className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-black text-white font-semibold text-sm py-3 rounded-xl hover:bg-gray-800 transition shadow-sm cursor-pointer"
            >
              Create Coupon
            </button>
          </div>
        </form>
      </div>

      {/* Coupons List Table */}
      <div className="bg-white border border-black/10 rounded-3xl shadow-sm overflow-hidden p-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Tag size={20} /> Active Coupons ({coupons.length})
        </h2>

        {coupons.length === 0 ? (
          <p className="text-sm text-black/50 py-8 text-center">No coupons created yet.</p>
        ) : (
          <div className="divide-y divide-black/10">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-100 rounded-2xl text-black font-mono font-bold tracking-wider">
                    {coupon.code}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-black">{coupon.discountPercent}% OFF</p>
                    <p className="text-xs text-black/50">Created on: {new Date(coupon.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <form action={handleDeleteCoupon}>
                  <input type="hidden" name="id" value={coupon.id} />
                  <button
                    type="submit"
                    className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition cursor-pointer"
                    title="Delete Coupon"
                  >
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}