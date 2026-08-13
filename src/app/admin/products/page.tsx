"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  PlusCircle, 
  ChevronDown, 
  MoreHorizontal, 
  Star, 
  ArrowUpDown,
  Columns
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  rating: number;
  status: "Active" | "Out Of Stock" | "Closed For Sale";
}

// Fixed & verified working image URLs matching Shadcn UI Kit reference
const initialProducts: Product[] = [
  {
    id: "1",
    name: "HP Pavilion 16.1 Inch Gaming Laptop",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&auto=format&fit=crop&q=80", 
    price: 960.99,
    category: "Electronics",
    stock: 5,
    sku: "RCH45Q1A",
    rating: 4.9,
    status: "Active",
  },
  {
    id: "2",
    name: "Samsung SM-A21S Galaxy A21S",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80", 
    price: 350.00,
    category: "Electronics",
    stock: 25,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Active",
  },
  {
    id: "3",
    name: "Schwaiger KH510S 513 Buegelkopfhoerer",
    // Fixed direct working URL for Black Pants / Apparel
    image: "https://images.unsplash.com/photo-1584865288642-42078afe6942?w=200&auto=format&fit=crop&q=80", 
    price: 300.00,
    category: "Electronics",
    stock: 27,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Out Of Stock",
  },
  {
    id: "4",
    name: "Ultimate Ears Wonderboom Bluetooth Speaker",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&auto=format&fit=crop&q=80", 
    price: 119.99,
    category: "Electronics",
    stock: 10,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Active",
  },
  {
    id: "5",
    name: "Canon Pixma TS3350 Multifunction Printer",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=200&auto=format&fit=crop&q=80", 
    price: 439.50,
    category: "Electronics",
    stock: 25,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Closed For Sale",
  },
  {
    id: "6",
    name: "Canon 4000D 18-55 MM III (Canon Eurasia Guaranteed)",
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=200&auto=format&fit=crop&q=80", 
    price: 49.50,
    category: "Beauty",
    stock: 25,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Closed For Sale",
  },
  {
    id: "7",
    name: "Lobwerk Lenovo Tab M10 TB-X605F",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=200&auto=format&fit=crop&q=80", 
    price: 49.50,
    category: "Beauty",
    stock: 25,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Closed For Sale",
  },
];

export default function ProductsPage() {
  const [products] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const toggleSelectProduct = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
        <button className="bg-black hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs">
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Total Sales</span>
            <span className="bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-full border border-emerald-100/60">
              +20.1%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">$30,230</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Number of Sales</span>
            <span className="bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-full border border-emerald-100/60">
              +5.02
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">982</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Affiliate</span>
            <span className="bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-full border border-emerald-100/60">
              +3.1%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">$4,530</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Discounts</span>
            <span className="bg-rose-50 text-rose-600 font-semibold px-2 py-0.5 rounded-full border border-rose-100/60">
              -3.58%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">$2,230</p>
        </div>
      </div>

      {/* Filter and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200/80 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          <button className="bg-white border border-dashed border-gray-300 hover:border-gray-400 text-gray-700 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer">
            <PlusCircle className="w-3.5 h-3.5 text-gray-500" />
            <span>Status</span>
          </button>

          <button className="bg-white border border-dashed border-gray-300 hover:border-gray-400 text-gray-700 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer">
            <PlusCircle className="w-3.5 h-3.5 text-gray-500" />
            <span>Category</span>
          </button>

          <button className="bg-white border border-gray-200/80 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer">
            <span>Price: $100-$200</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>

        <button className="bg-white border border-gray-200/80 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-2xs">
          <span>Columns</span>
          <Columns className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>

      {/* Products Data Table */}
      <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 font-medium bg-gray-50/50 select-none">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input 
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded-sm border-gray-300 text-black focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">
                  <button className="flex items-center gap-1 hover:text-gray-900 transition-colors font-semibold text-gray-700">
                    Product Name <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </button>
                </th>
                <th className="py-3.5 px-4">
                  <button className="flex items-center gap-1 hover:text-gray-900 transition-colors font-semibold text-gray-700">
                    Price <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </button>
                </th>
                <th className="py-3.5 px-4">
                  <button className="flex items-center gap-1 hover:text-gray-900 transition-colors font-semibold text-gray-700">
                    Category <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </button>
                </th>
                <th className="py-3.5 px-4">
                  <button className="flex items-center gap-1 hover:text-gray-900 transition-colors font-semibold text-gray-700">
                    Stock <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </button>
                </th>
                <th className="py-3.5 px-4 font-semibold text-gray-700">SKU</th>
                <th className="py-3.5 px-4 font-semibold text-gray-700">Rating</th>
                <th className="py-3.5 px-4">
                  <button className="flex items-center gap-1 hover:text-gray-900 transition-colors font-semibold text-gray-700">
                    Status <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </button>
                </th>
                <th className="py-3.5 px-4 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredProducts.map((product) => {
                const isSelected = selectedProducts.includes(product.id);
                return (
                  <tr 
                    key={product.id} 
                    className={`hover:bg-gray-50/60 transition-colors ${isSelected ? "bg-gray-50/80" : ""}`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectProduct(product.id)}
                        className="rounded-sm border-gray-300 text-black focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Product Name & Studio Box Image */}
                    <td className="py-3.5 px-4 font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#EAEBED] border border-gray-200/60 flex items-center justify-center overflow-hidden shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            onError={(e) => {
                              // Fallback if network drops any image
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80";
                            }}
                            className="w-full h-full object-cover mix-blend-multiply"
                          />
                        </div>
                        <span className="line-clamp-1 max-w-[260px] text-xs text-gray-900 font-medium">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">
                      {product.category}
                    </td>

                    <td className="py-3.5 px-4 text-gray-800 font-medium">
                      {product.stock}
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                      {product.sku}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-semibold text-gray-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </td>

                    {/* Status Badges */}
                    <td className="py-3.5 px-4">
                      {product.status === "Active" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
                          Active
                        </span>
                      )}
                      {product.status === "Out Of Stock" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-600 border border-amber-200">
                          Out Of Stock
                        </span>
                      )}
                      {product.status === "Closed For Sale" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">
                          Closed For Sale
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}