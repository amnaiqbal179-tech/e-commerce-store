import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await context.params;
    const productId = params.id;

    const body = await req.json();
    const { name, title, comment, rating } = body;

    if (!name || !comment || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        name,
        title,
        comment,
        rating: Number(rating),
        productId,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error("DETAILED REVIEW ERROR:", error);
    return NextResponse.json({ error: error.message || "Failed to create review" }, { status: 500 });
  }
}