import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID missing" }, { status: 400 });
    }

    // Database mein order ka status "Paid" update kar dein
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "Paid" },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}