"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
    
    // Admin orders page aur user orders page dono ko revalidate/refresh kar dega
    revalidatePath("/admin/orders");
    revalidatePath("/orders"); // Agar user ki order history page ho
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false, error: "Status update failed" };
  }
}