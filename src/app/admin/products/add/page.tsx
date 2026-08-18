"use client";

import { useState, ChangeEvent, useRef } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Upload, 
  Plus, 
  Image as ImageIcon,
  X,
  Trash2,
  RefreshCw,
  Check,
  Loader2,
  AlertCircle
} from "lucide-react";
import { createProduct } from "./actions";

// Default Category and Subcategories mapping
const initialCategoryMap: { [key: string]: { label: string; value: string }[] } = {
  men: [
    { label: "T-Shirts", value: "t-shirts" },
    { label: "Jeans", value: "jeans" },
    { label: "Shalwar Kameez", value: "shalwar-kameez" },
  ],
  women: [
    { label: "Dresses", value: "dresses" },
    { label: "Tops & Kurtis", value: "tops-kurtis" },
  ],
  kids: [
    { label: "Casual Wear", value: "casual-wear" },
    { label: "Party Wear", value: "party-wear" },
  ],
};

const PRESET_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#EF4444" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Navy", hex: "#1E3A8A" },
  { name: "Green", hex: "#10B981" },
  { name: "Yellow", hex: "#F59E0B" },
  { name: "Maroon", hex: "#800000" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Gray", hex: "#6B7280" },
];

const PRESET_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

export interface VariantType {
  option: string;
  value: string;
  price: string;
  colorHex?: string;
  quantity: string;
  sku: string;
}

export default function AddProductPage() {
  const [status, setStatus] = useState("draft");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Images state (Multiple images gallery)
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Form Basic Fields
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [tags, setTags] = useState("");
  const [quantity, setQuantity] = useState("10");

  // Dynamic Category state
  const [categoryMap, setCategoryMap] = useState(initialCategoryMap);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [inStock, setInStock] = useState(true);
  const [chargeTax, setChargeTax] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Variants state with individual quantity and SKU support
  const [variants, setVariants] = useState<VariantType[]>([
    { option: "Size", value: "M", price: "", quantity: "10", sku: "" },
    { option: "Color", value: "Black", price: "", colorHex: "#000000", quantity: "10", sku: "" }
  ]);

  // Automatic SKU Generator
  const generateSKU = (cat = selectedCategory, name = title, variantVal = "") => {
    const prefix = "FH";
    const catCode = cat ? cat.substring(0, 3).toUpperCase() : "GEN";
    const nameCode = name.replace(/[^a-zA-Z0-9]/g, "").substring(0, 3).toUpperCase() || "PRD";
    const varCode = variantVal ? `-${variantVal.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}` : "";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${catCode}-${nameCode}${varCode}-${randomNum}`;
  };

  const handleAutoGenerateSku = () => {
    setSku(generateSKU());
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!sku && newTitle.trim().length > 2) {
      setSku(generateSKU(selectedCategory, newTitle));
    }
  };

  // Multiple Images Handlers with Cloudinary Upload
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

        if (!uploadPreset || !cloudName || cloudName === "your_cloud_name") {
          throw new Error("Cloudinary environment variables are missing in .env.local");
        }

        formData.append("upload_preset", uploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.secure_url) {
          return data.secure_url;
        } else {
          throw new Error(data.error?.message || "Cloudinary upload failed");
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (error: any) {
      console.error("Cloudinary upload error:", error);
      setUploadError(error.message || "Failed to upload image. Please check configuration.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddUrlImage = () => {
    if (urlInput.trim()) {
      setImages((prev) => [...prev, urlInput.trim()]);
      setUrlInput("");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Variants Handlers
  const addVariantRow = () => {
    const defaultVal = "Red";
    setVariants([...variants, { 
      option: "Color", 
      value: defaultVal, 
      price: "", 
      colorHex: "#EF4444", 
      quantity: "10", 
      sku: generateSKU(selectedCategory, title, defaultVal) 
    }]);
  };

  const removeVariantRow = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof VariantType, val: string) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: val };
    
    // Agar value change ho aur SKU empty ho, toh auto SKU update karein
    if (field === "value" && !updated[index].sku) {
      updated[index].sku = generateSKU(selectedCategory, title, val);
    }

    setVariants(updated);
  };

  const handleColorSelect = (index: number, hex: string, name?: string) => {
    const updated = [...variants];
    const colorName = name || updated[index].value || hex;
    updated[index] = {
      ...updated[index],
      colorHex: hex,
      value: colorName,
      sku: updated[index].sku || generateSKU(selectedCategory, title, colorName)
    };
    setVariants(updated);
  };

  const handleSizeSelect = (index: number, sizeVal: string) => {
    const updated = [...variants];
    updated[index] = { 
      ...updated[index], 
      value: sizeVal,
      sku: updated[index].sku || generateSKU(selectedCategory, title, sizeVal)
    };
    setVariants(updated);
  };

  // Dynamic Category / Subcategory Addition
  const handleAddNewCategory = () => {
    const newCat = prompt("Enter new category name (e.g. Accessories):");
    if (newCat) {
      const key = newCat.toLowerCase().replace(/\s+/g, "-");
      if (!categoryMap[key]) {
        setCategoryMap((prev) => ({ ...prev, [key]: [] }));
        setSelectedCategory(key);
      }
    }
  };

  const handleAddNewSubcategory = () => {
    if (!selectedCategory) return;
    const newSub = prompt("Enter new subcategory name:");
    if (newSub) {
      const value = newSub.toLowerCase().replace(/\s+/g, "-");
      const item = { label: newSub, value };
      setCategoryMap((prev) => ({
        ...prev,
        [selectedCategory]: [...(prev[selectedCategory] || []), item]
      }));
      setSelectedSubcategory(value);
    }
  };

  const availableSubcategories = selectedCategory ? categoryMap[selectedCategory] || [] : [];

  return (
    <form 
      action={async (formData) => {
        setIsSubmitting(true);
        try {
          await createProduct(formData);
        } finally {
          setIsSubmitting(false);
        }
      }} 
      className="p-6 md:p-8 space-y-6 bg-gray-50/50 min-h-screen font-sans text-gray-900 max-w-7xl mx-auto"
    >
      
      {/* Hidden inputs to pass state to Server Action */}
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="image" value={images[0] || ""} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="variants" value={JSON.stringify(variants)} />
      <input type="hidden" name="inStock" value={String(inStock)} />
      <input type="hidden" name="chargeTax" value={String(chargeTax)} />

      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/products"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add Product</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/admin/products"
            className="bg-gray-200/70 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
          >
            Discard
          </Link>
          <button 
            type="submit"
            disabled={isSubmitting}
            onClick={() => setStatus("draft")}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer shadow-2xs disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && status === "draft" && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save Draft</span>
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            onClick={() => setStatus("active")}
            className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-2xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && status === "active" && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Publish</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN LAYOUT GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-8 space-y-6">

          {/* PRODUCT DETAILS CARD */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-gray-900">Product Details</h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Name</label>
              <input 
                name="title"
                type="text" 
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="Product Name"
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Auto Generated SKU */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">SKU (Auto Generated)</label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateSku}
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate New</span>
                  </button>
                </div>
                <input 
                  name="sku"
                  type="text" 
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. FH-MEN-001"
                  className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition-all font-mono text-gray-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Barcode</label>
                <input 
                  name="barcode"
                  type="text" 
                  placeholder="e.g. 0123456789"
                  className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Description (Optional)</label>
              <textarea 
                name="description"
                rows={4} 
                placeholder="Set a description for better product visibility..."
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition-all resize-none"
              />
              <p className="text-xs text-gray-400">Set a description to the product for better visibility.</p>
            </div>
          </div>

          {/* PRODUCT IMAGES CARD (MULTIPLE MEDIA SUPPORT) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Product Media ({images.length})</h2>
              <button 
                type="button" 
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-xs font-medium text-gray-600 hover:text-black cursor-pointer transition-colors"
              >
                {showUrlInput ? "Hide URL input" : "Add media from URL"}
              </button>
            </div>

            {uploadError && (
              <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <div className="flex-1">
                  <span className="font-semibold">Upload Failed: </span>
                  {uploadError}
                </div>
                <button 
                  type="button" 
                  onClick={() => setUploadError(null)}
                  className="text-red-400 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {showUrlInput && (
              <div className="flex items-center gap-2">
                <input 
                  type="url" 
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={handleAddUrlImage}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-medium cursor-pointer"
                >
                  Add Image
                </button>
              </div>
            )}

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img src={img} alt={`Product image ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1 bg-black/70 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer shadow-md"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 text-[10px] bg-black/80 text-white px-2 py-0.5 rounded-md font-medium">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="border border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3 bg-white">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Drop your product images here</p>
                <p className="text-xs text-gray-400 mt-0.5">PNG, JPG or WEBP (Max 5MB each)</p>
              </div>
              <label className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg text-xs flex items-center gap-2 cursor-pointer transition-all">
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading to Cloudinary...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Select file(s)</span>
                  </>
                )}
                <input 
                  type="file" 
                  name="imageFile"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  disabled={isUploading}
                  onChange={handleFileChange}
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {/* VARIANTS CARD WITH QUANTITY & SKU PER VARIANT */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Variants (Stock & SKU per Variant)</h2>
              <button 
                type="button" 
                onClick={addVariantRow}
                className="text-xs font-medium text-gray-600 hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Option</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-gray-500 px-1">
                <div className="col-span-2">Option</div>
                <div className="col-span-3">Value / Selector</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Variant SKU</div>
                <div className="col-span-1"></div>
              </div>

              {variants.map((variant, index) => (
                <div key={index} className="p-3 bg-gray-50/70 border border-gray-200/80 rounded-xl space-y-3">
                  <div className="grid grid-cols-12 gap-3 items-center">
                    
                    {/* Option Dropdown */}
                    <div className="col-span-2">
                      <select
                        value={variant.option}
                        onChange={(e) => handleVariantChange(index, "option", e.target.value)}
                        className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-black text-gray-700 cursor-pointer"
                      >
                        <option value="Size">Size</option>
                        <option value="Color">Color</option>
                        <option value="Material">Material</option>
                        <option value="Style">Style</option>
                      </select>
                    </div>

                    {/* Value Input */}
                    <div className="col-span-3">
                      <div className="relative flex items-center">
                        {variant.option === "Color" && (
                          <span
                            className="absolute left-2 w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0 shadow-2xs"
                            style={{ backgroundColor: variant.colorHex || "#000000" }}
                          />
                        )}
                        <input 
                          type="text"
                          value={variant.value}
                          onChange={(e) => handleVariantChange(index, "value", e.target.value)}
                          placeholder={variant.option === "Color" ? "Color Name" : "e.g. Medium"}
                          className={`w-full py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-black ${
                            variant.option === "Color" ? "pl-7 pr-2" : "px-2.5"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Price Input */}
                    <div className="col-span-2">
                      <input 
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                        placeholder="0.00"
                        className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-black"
                      />
                    </div>

                    {/* Quantity Input */}
                    <div className="col-span-2">
                      <input 
                        type="number"
                        value={variant.quantity}
                        onChange={(e) => handleVariantChange(index, "quantity", e.target.value)}
                        placeholder="10"
                        className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-black font-semibold text-gray-800"
                      />
                    </div>

                    {/* SKU Input */}
                    <div className="col-span-2">
                      <input 
                        type="text"
                        value={variant.sku}
                        onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                        placeholder="SKU"
                        className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-[11px] outline-none focus:border-black font-mono text-gray-700"
                      />
                    </div>

                    {/* Delete Variant Button */}
                    <div className="col-span-1 flex justify-end">
                      {variants.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeVariantRow(index)}
                          className="text-gray-400 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                          title="Remove variant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SIZE PRESETS BAR */}
                  {variant.option === "Size" && (
                    <div className="pt-2 border-t border-gray-200/60 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-medium text-gray-500 mr-1">Quick Size:</span>
                      {PRESET_SIZES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleSizeSelect(index, s)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                            variant.value === s 
                              ? "bg-black text-white border-black" 
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* VISUAL COLOR BAR */}
                  {variant.option === "Color" && (
                    <div className="pt-2 border-t border-gray-200/60 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-medium text-gray-500 mr-1">Color Bar:</span>
                      
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => handleColorSelect(index, c.hex, c.name)}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                          className={`w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center transition-transform cursor-pointer ${
                            variant.colorHex?.toLowerCase() === c.hex.toLowerCase()
                              ? "ring-2 ring-offset-1 ring-black scale-110"
                              : "hover:scale-105"
                          }`}
                        >
                          {variant.colorHex?.toLowerCase() === c.hex.toLowerCase() && (
                            <Check className={`w-3 h-3 ${c.hex === "#FFFFFF" || c.hex === "#F5F5DC" ? "text-black" : "text-white"}`} />
                          )}
                        </button>
                      ))}

                      <div className="relative flex items-center pl-2 border-l border-gray-300 ml-1" title="Pick custom color">
                        <input
                          type="color"
                          value={variant.colorHex || "#000000"}
                          onChange={(e) => handleColorSelect(index, e.target.value)}
                          className="w-5 h-5 rounded-full border-0 p-0 cursor-pointer overflow-hidden bg-transparent"
                        />
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="lg:col-span-4 space-y-6">

          {/* PRICING & INVENTORY CARD */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-gray-900">Pricing & Inventory</h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Base Price</label>
              <input 
                name="price"
                type="number" 
                step="0.01"
                required
                placeholder="0.00"
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Discounted Price</label>
              <input 
                name="discountPrice"
                type="number" 
                step="0.01"
                placeholder="0.00"
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Stock Quantity</label>
              <input 
                name="quantity"
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="10"
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-black"
              />
            </div>

            <div className="pt-2 space-y-3 border-t border-gray-100">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={chargeTax}
                  onChange={(e) => setChargeTax(e.target.checked)}
                  className="w-4 h-4 accent-black rounded border-gray-300 cursor-pointer"
                />
                <span className="text-xs font-medium text-gray-700">Charge tax on this product</span>
              </label>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-medium text-gray-700">In stock</span>
                <button
                  type="button"
                  onClick={() => setInStock(!inStock)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    inStock ? "bg-black" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      inStock ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* STATUS CARD */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
            <h2 className="text-base font-bold text-gray-900">Status</h2>
            <div className="relative">
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-black text-gray-800 cursor-pointer appearance-none pr-8"
              >
                <option value="draft">🟡 Draft</option>
                <option value="active">🟢 Active</option>
                <option value="archived">⚪ Archived</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                <ChevronLeft className="w-4 h-4 -rotate-90" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Set the product visibility status.</p>
          </div>

          {/* CATEGORIES CARD */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-gray-900">Categories & Tags</h2>

            {/* Main Category */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Category</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <select 
                    name="category"
                    required
                    value={selectedCategory}
                    onChange={(e) => {
                      const cat = e.target.value;
                      setSelectedCategory(cat);
                      setSelectedSubcategory(""); 
                      if (title) setSku(generateSKU(cat, title));
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-black text-gray-700 cursor-pointer appearance-none pr-8"
                  >
                    <option value="" disabled>Select a category</option>
                    {Object.keys(categoryMap).map((catKey) => (
                      <option key={catKey} value={catKey}>
                        {catKey.charAt(0).toUpperCase() + catKey.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                    <ChevronLeft className="w-4 h-4 -rotate-90" />
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={handleAddNewCategory}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                  title="Add New Category"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub-Category */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Subcategory</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <select 
                    name="subcategory"
                    required
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    disabled={!selectedCategory}
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-black text-gray-700 cursor-pointer appearance-none pr-8 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                    <option value="" disabled>
                      {selectedCategory ? "Select a subcategory" : "First select a category"}
                    </option>
                    {availableSubcategories.map((sub) => (
                      <option key={sub.value} value={sub.value}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                    <ChevronLeft className="w-4 h-4 -rotate-90" />
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={handleAddNewSubcategory}
                  disabled={!selectedCategory}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Add Sub-Category"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tags Input */}
            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              <label className="text-xs font-semibold text-gray-700">Product Tags</label>
              <input 
                name="tags"
                type="text" 
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="summer, new arrival, casual"
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-black"
              />
              <p className="text-[11px] text-gray-400">Comma separated tags.</p>
            </div>

          </div>

        </div>

      </div>

    </form>
  );
}