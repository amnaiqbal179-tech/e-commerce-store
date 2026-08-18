"use server";

import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ==========================================
// 1. CREATE PRODUCT FUNCTION
// ==========================================
export async function createProduct(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string) || 0;
  const category = formData.get("category") as string;
  const subcategory = formData.get("subcategory") as string;
  const stockValue = formData.get("stock") ? parseInt(formData.get("stock") as string) : 10;
  const status = (formData.get("status") as string) || "active";
  const customSku = formData.get("sku") as string;

  // SKU Logic (Auto-generate if missing)
  const categoryPrefix = category ? category.toUpperCase().slice(0, 3) : "PRD";
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const generatedSku = customSku && customSku.trim() !== "" ? customSku : `FH-${categoryPrefix}-${randomNum}`;

  // Variants parsing
  const variantsJson = formData.get("variants") as string;
  let parsedVariants: any[] = [];
  try {
    if (variantsJson) {
      const rawVariants = JSON.parse(variantsJson);
      parsedVariants = rawVariants
        .filter((v: any) => v.value && v.value.trim() !== "")
        .map((v: any) => ({
          option: v.option || "Color",
          value: v.value,
          price: v.price ? parseFloat(v.price) : 0,
          colorHex: v.colorHex || null,
        }));
    }
  } catch (error) {
    console.error("Error parsing variants:", error);
  }

  // Fast Image Upload Handling
  const imageUrlInput = formData.get("image") as string;
  const imageFile = formData.get("imageFile") as File | null;

  let finalImagePath = "/default-image.jpg";

  if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
    try {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");

      try {
        await fs.access(uploadDir);
      } catch {
        await fs.mkdir(uploadDir, { recursive: true });
      }

      await fs.writeFile(path.join(uploadDir, filename), buffer);
      finalImagePath = `/uploads/${filename}`;
    } catch (error) {
      console.error("Error saving image file:", error);
    }
  } else if (imageUrlInput && imageUrlInput.trim() !== "" && !imageUrlInput.startsWith("data:")) {
    finalImagePath = imageUrlInput;
  }

  // Database Creation
  try {
    await prisma.product.create({
      data: {
        title,
        sku: generatedSku,
        description,
        price,
        stock: stockValue,
        status,
        image: finalImagePath,
        category,
        subcategory,
        variants: parsedVariants,
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product in database." };
  }

  // Revalidate routes & Redirect to product list page
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  
  redirect("/admin/products");
}

// ==========================================
// 2. DELETE PRODUCT FUNCTION
// ==========================================
export async function deleteProduct(productId: string) {
  if (!productId) {
    return { success: false, error: "Product ID is missing." };
  }

  try {
    const targetId: any = !isNaN(Number(productId)) && !productId.includes("-") 
      ? Number(productId) 
      : productId;

    await prisma.product.delete({
      where: { id: targetId },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting product:", error);

    if (error?.code === "P2003") {
      return { 
        success: false, 
        error: "Yeh product kisi order ya cart ke saath linked hai, isliye delete nahi ho sakta." 
      };
    }

    if (error?.code === "P2025") {
      return { 
        success: false, 
        error: "Product database mein nahi mila ya pehle hi delete ho chuka hai." 
      };
    }

    return { 
      success: false, 
      error: error?.message || "Database error: Product delete nahi ho saka." 
    };
  }
}