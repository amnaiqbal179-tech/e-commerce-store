import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ valid: false, message: "Code is required" }, { status: 400 });
  }

  try {
    const coupon = await prisma.coupon.findFirst({
      where: { code: code.trim() },
    });

    if (!coupon) {
      return NextResponse.json({ valid: false, message: "Invalid promo code" }, { status: 404 });
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent,
    });
  } catch (error) {
    return NextResponse.json({ valid: false, message: "Server error" }, { status: 500 });
  }
}