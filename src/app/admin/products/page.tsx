import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Search, ArrowUpDown, ChevronDown, Columns3, Filter, Tag, Star } from "lucide-react";
import ProductActions from "./ProductActions";

export const revalidate = 0;

interface ProductsListPageProps {
  searchParams?: Promise<{ query?: string }>;
}

export default async function ProductsListPage({ searchParams }: ProductsListPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.query || "";

  let products: any[] = [];
  let dbError = false;

  // 1. Try-Catch to prevent page hangs on DB failure
  try {
    products = await prisma.product.findMany({
      where: query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { category: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Database Error:", error);
    dbError = true;
  }

  // Calculate real metrics from database products
  const totalProducts = products.length;
  const inStockCount = products.filter((p: any) => (p.quantity ?? p.stock ?? 0) > 0).length;
  const outOfStockCount = totalProducts - inStockCount;
  const totalInventoryValue = products.reduce((acc: number, p: any) => acc + (Number(p.price) || 0) * (p.quantity ?? p.stock ?? 0), 0);

  return (
    <div className="p-6 space-y-6 bg-gray-50/40 min-h-screen text-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-xs text-gray-500 mt-1">Manage your store products and inventory.</p>
        </div>
        <Link
          href="/admin/products/add"
          className="bg-black hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Total Products</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] font-semibold">Live</span>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-gray-900">{totalProducts}</h3>
            <span className="text-xs text-gray-400">Items in DB</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Inventory Value</span>
            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-[10px] font-semibold">Total</span>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-gray-900">${totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <span className="text-xs text-emerald-600 font-medium">Active</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>In Stock Items</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] font-semibold">Ready</span>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-gray-900">{inStockCount}</h3>
            <span className="text-xs text-gray-400">Products</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Out of Stock</span>
            <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-md text-[10px] font-semibold">Alert</span>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-gray-900">{outOfStockCount}</h3>
            <span className="text-xs text-red-500 font-medium">{outOfStockCount > 0 ? "Restock" : "All Good"}</span>
          </div>
        </div>
      </div>

      {/* Database Error Warning */}
      {dbError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
          ⚠️ Database se connect karne mein masla aa raha hai. Apni Prisma `.env` connection string aur DB status check karein.
        </div>
      )}

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        {/* Filters & Search Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <form method="GET" className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="query"
              defaultValue={query}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-black transition-colors"
            />
          </form>

          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 flex items-center gap-1.5 transition-colors cursor-pointer">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span>Status</span>
            </button>
            <button type="button" className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 flex items-center gap-1.5 transition-colors cursor-pointer">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              <span>Category</span>
            </button>
            <button type="button" className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 flex items-center gap-1.5 transition-colors cursor-pointer">
              <span>Price Range</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            <button type="button" className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 flex items-center gap-1.5 transition-colors cursor-pointer">
              <Columns3 className="w-3.5 h-3.5 text-gray-400" />
              <span>Columns</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[350px]">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase text-[10px] tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4 w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black cursor-pointer" />
                </th>
                <th className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-black">
                    <span>Product Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-black">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-black">
                    <span>Category</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-black">
                    <span>Stock</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-black">
                    <span>Rating</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-black">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    No products found. Click &quot;Add Product&quot; to create one!
                  </td>
                </tr>
              ) : (
                products.map((product: any) => {
                  const priceFormatted = Number(product.price || 0).toFixed(2);
                  const stockCount = product.quantity ?? product.stock ?? 0;
                  const skuValue = product.sku || `RCH${product.id ? product.id.slice(0, 5).toUpperCase() : "45Q1A"}`;
                  const ratingValue = product.rating || "4.9";
                  const isActive = stockCount > 0;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black cursor-pointer" />
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3 group">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0 relative flex items-center justify-center">
                            <img
                              src={product.image && product.image.trim() !== "" ? product.image : "/default-image.jpg"}
                              alt={product.title || "Product image"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-xs group-hover:text-blue-600 transition-colors">{product.title || "Untitled"}</p>
                            <p className="text-[10px] text-gray-400 line-clamp-1">{product.description || "No description"}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">${priceFormatted}</td>
                      <td className="py-3 px-4">
                        <span className="capitalize font-medium text-gray-700">{product.category || "General"}</span>
                        {product.subcategory && (
                          <span className="block text-[10px] text-gray-400 capitalize">{product.subcategory}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium">{stockCount}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-gray-500">{skuValue}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 font-semibold text-gray-700">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{ratingValue}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 ${
                          isActive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                          {isActive ? "Active" : "Out Of Stock"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <ProductActions productId={product.id} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}