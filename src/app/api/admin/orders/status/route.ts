import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const { orderId, status, paymentStatus } = await req.json();

    // Check karein ke orderId aur kam az kam aik field (status ya paymentStatus) mojood ho
    if (!orderId || (!status && !paymentStatus)) {
      return NextResponse.json(
        { success: false, error: "Order ID and at least one status field are required" },
        { status: 400 }
      );
    }

    // Dynamic object banayen taake jo field aaye sirf wahi update ho
    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    // Database mein order update karein
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    return NextResponse.json(
      { success: true, message: "Order updated successfully", updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Order Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}