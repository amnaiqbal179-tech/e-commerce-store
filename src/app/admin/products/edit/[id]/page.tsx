import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string } 
}) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!product) {
    return <div className="p-6 text-center text-red-500">Product not found</div>;
  }

  // Server Action to Update Product
  async function updateProduct(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;

    await prisma.product.update({
      where: { id: resolvedParams.id },
      data: { title, price, stock, category, description },
    });

    redirect("/admin/products");
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 bg-white rounded-2xl border border-gray-200/80 shadow-2xs mt-6">
      <div className="flex items-center gap-3">
        <Link 
          href="/admin/products"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Edit Product</h1>
      </div>

      <form action={updateProduct} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Product Title *</label>
          <input 
            name="title" 
            defaultValue={product.title} 
            required 
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">Price ($) *</label>
            <input 
              name="price" 
              type="number" 
              step="0.01" 
              defaultValue={product.price} 
              required 
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">Stock *</label>
            <input 
              name="stock" 
              type="number" 
              defaultValue={product.stock} 
              required 
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Category</label>
          <input 
            name="category" 
            defaultValue={product.category || ""} 
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black" 
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Description</label>
          <textarea 
            name="description" 
            defaultValue={product.description || ""} 
            rows={3} 
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black resize-none" 
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-2.5 bg-black text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}