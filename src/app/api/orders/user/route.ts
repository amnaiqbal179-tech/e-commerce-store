import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Apne prisma client ka path adjust karlein agar mukhtalif hai

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: true, // Order items ka relation include karne ke liye
      },
    });

    // Orders array ko direct return karein taake frontend par state theek se set ho
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Fetch User Orders Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}