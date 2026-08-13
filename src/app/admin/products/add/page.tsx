"use client";

import { useState } from "react";
import { 
  ChevronLeft, 
  Upload, 
  Plus, 
  Image as ImageIcon 
} from "lucide-react";

export default function AddProductPage() {
  const [inStock, setInStock] = useState(true);
  const [chargeTax, setChargeTax] = useState(false);
  const [status, setStatus] = useState("draft");
  
  // Variants state for dynamic rows
  const [variants, setVariants] = useState([
    { option: "", value: "", price: "" },
    { option: "", value: "", price: "" }
  ]);

  const addVariantRow = () => {
    setVariants([...variants, { option: "", value: "", price: "" }]);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50/40 min-h-screen font-sans text-gray-800">
      
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200/80 hover:bg-gray-50 text-gray-700 shadow-2xs transition-colors cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add Products</h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="bg-[#E4E4E7] hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer">
            Discard
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200/80 px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer">
            Save Draft
          </button>
          <button className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer">
            Publish
          </button>
        </div>
      </div>

      {/* ================= MAIN LAYOUT GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT COLUMN (MAIN FORM FIELDS) ================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. PRODUCT DETAILS CARD */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-gray-900">Product Details</h2>
            
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Name</label>
              <input 
                type="text" 
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
            </div>

            {/* SKU & Barcode Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">SKU</label>
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Barcode</label>
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Description (Optional)</label>
              <textarea 
                rows={4} 
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none"
              />
              <p className="text-[11px] text-gray-500">Set a description to the product for better visibility.</p>
            </div>
          </div>

          {/* 2. PRODUCT IMAGES CARD */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Product Images</h2>
              <button type="button" className="text-xs font-medium text-gray-700 hover:underline cursor-pointer">
                Add media from URL
              </button>
            </div>

            {/* Image Upload Box */}
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3 bg-gray-50/30 hover:bg-gray-50/80 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">Drop your images here</p>
                <p className="text-[11px] text-gray-400 mt-0.5">PNG or JPG (max. 5MB)</p>
              </div>
              <label className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-2xs transition-colors">
                <Upload className="w-3.5 h-3.5 text-gray-500" />
                <span>Select images</span>
                <input type="file" multiple accept="image/*" className="hidden" />
              </label>
            </div>
          </div>

          {/* 3. VARIANTS CARD */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-gray-900">Variants</h2>

            {/* Table Header Labels */}
            <div className="grid grid-cols-12 gap-3 text-xs font-medium text-gray-600 px-1">
              <div className="col-span-4">Options</div>
              <div className="col-span-4">Value</div>
              <div className="col-span-4">Price</div>
            </div>

            {/* Variant Rows */}
            <div className="space-y-3">
              {variants.map((_, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-4">
                    <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black text-gray-600">
                      <option value="">Select a status</option>
                      <option value="size">Size</option>
                      <option value="color">Color</option>
                      <option value="material">Material</option>
                    </select>
                  </div>
                  <div className="col-span-4">
                    <input 
                      type="text" 
                      className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black"
                    />
                  </div>
                  <div className="col-span-4">
                    <input 
                      type="text" 
                      className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Variant Button */}
            <div className="pt-2 flex justify-center">
              <button 
                type="button" 
                onClick={addVariantRow}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-800 hover:text-black cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Variant</span>
              </button>
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN (PRICING, STATUS & CATEGORIES) ================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. PRICING CARD */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-gray-900">Pricing</h2>

            {/* Base Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Base Price</label>
              <input 
                type="text" 
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Discounted Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Discounted Price</label>
              <input 
                type="text" 
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Charge Tax Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input 
                type="checkbox" 
                id="chargeTax"
                checked={chargeTax} 
                onChange={(e) => setChargeTax(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
              />
              <label htmlFor="chargeTax" className="text-xs font-medium text-gray-700 cursor-pointer">
                Charge tax on this product
              </label>
            </div>

            <hr className="border-gray-100 my-2" />

            {/* In Stock Toggle Switch */}
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setInStock(!inStock)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  inStock ? "bg-black" : "bg-gray-200"
                }`}
              >
                <div 
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    inStock ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-xs font-semibold text-gray-800">In stock</span>
            </div>
          </div>

          {/* 2. STATUS CARD */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
            <h2 className="text-base font-bold text-gray-900">Status</h2>

            <div className="relative">
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black text-gray-800 appearance-none font-medium cursor-pointer"
              >
                <option value="draft">🟠 Draft</option>
                <option value="active">🟢 Active</option>
                <option value="archived">⚪ Archived</option>
              </select>
            </div>

            <p className="text-[11px] text-gray-500">Set the product status.</p>
          </div>

          {/* 3. CATEGORIES CARD */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-gray-900">Categories</h2>

            {/* Main Category */}
            <div className="flex items-center gap-2">
              <select className="flex-1 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black text-gray-500">
                <option value="">Select a category</option>
                <option value="clothing">Clothing</option>
                <option value="footwear">Footwear</option>
              </select>
              <button type="button" className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 cursor-pointer shrink-0">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Sub Category */}
            <div className="flex items-center gap-2">
              <select className="flex-1 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black text-gray-500">
                <option value="">Select a sub category</option>
                <option value="hoodies">Hoodies</option>
                <option value="tshirts">T-Shirts</option>
              </select>
              <button type="button" className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 cursor-pointer shrink-0">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}