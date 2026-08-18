import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// 1. GET: Products fetch karne ke liye
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        reviews: true,
        productVariants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("GET Products Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error?.message },
      { status: 500 }
    );
  }
}

// 2. DELETE: Product delete karne ke liye
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Product check karein
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Product delete karein
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json(
      { error: "Failed to delete product", details: error?.message },
      { status: 500 }
    );
  }
}