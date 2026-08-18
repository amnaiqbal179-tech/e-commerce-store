import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Saare active coupons fetch karne ke liye taake cart page par show ho sakein
export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true, // Sirf active coupons show hon
      },
      select: {
        id: true,
        code: true,
        discountPercent: true,
        fixedDiscount: true,
        minOrderAmount: true,
        expiresAt: true,
        usageLimit: true,
        usedCount: true,
        isActive: true,
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(coupons, { status: 200 });
  } catch (error: any) {
    console.error("FETCH COUPONS API ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

// POST: Coupon verify/apply karne ke liye OR Admin dwara database mein create karne ke liye
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🟢 Agar request Admin coupon creation ki hai
    if (body.action === "create" || (body.code && body.cartTotal === undefined && (body.discountPercent !== undefined || body.fixedDiscount !== undefined))) {
      const { code, discountPercent, fixedDiscount, minOrderAmount, usageLimit, expiresAt } = body;

      if (!code) {
        return NextResponse.json({ success: false, message: "Coupon code is required" }, { status: 400 });
      }

      const upperCode = code.toUpperCase().trim();

      // Check if coupon already exists
      const existing = await prisma.coupon.findUnique({
        where: { code: upperCode },
      });

      if (existing) {
        return NextResponse.json({ success: false, message: "Coupon code already exists in database" }, { status: 400 });
      }

      const newCoupon = await prisma.coupon.create({
        data: {
          code: upperCode,
          discountPercent: discountPercent ? Number(discountPercent) : null,
          fixedDiscount: fixedDiscount ? Number(fixedDiscount) : null,
          minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
          usageLimit: usageLimit ? Number(usageLimit) : null,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          isActive: true,
        },
      });

      return NextResponse.json({ success: true, coupon: newCoupon, message: "Coupon created successfully!" }, { status: 201 });
    }

    // 🟢 Otherwise: Cart page se Coupon Verify aur Apply karne ke liye
    const { code, cartTotal } = body;
    
    if (!code) {
      return NextResponse.json({ success: false, message: "Promo code is required" }, { status: 400 });
    }

    // Database mein coupon find karein
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() }
    });

    // 1. Check if coupon exists and is active
    if (!coupon || coupon.isActive === false) {
      return NextResponse.json({ success: false, message: "Invalid or expired promo code" }, { status: 400 });
    }

    // 2. Check Expiry Date (agar date set ho)
    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return NextResponse.json({ success: false, message: "This promo code has expired" }, { status: 400 });
    }

    // 3. Check Minimum Order Amount
    if (coupon.minOrderAmount && cartTotal !== undefined && cartTotal < coupon.minOrderAmount) {
      return NextResponse.json({ 
        success: false, 
        message: `Minimum order amount of $${coupon.minOrderAmount} is required for this code` 
      }, { status: 400 });
    }

    // 4. Check Usage Limit
    if (coupon.usageLimit && coupon.usedCount !== null && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, message: "Coupon usage limit has been reached" }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      discountPercent: coupon.discountPercent || 0,
      fixedDiscount: coupon.fixedDiscount || 0,
      message: "Coupon applied successfully!" 
    });
  } catch (error: any) {
    console.error("COUPON API ERROR:", error);
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}