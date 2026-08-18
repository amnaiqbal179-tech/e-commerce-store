import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Database se real orders fetch karein (latest first)
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 20, // Latest 20 transactions
    });

    // 2. Real Revenue calculate karein (Balances ke liye)
    const totalRevenue = orders
      .filter((order) => order.paymentStatus.toLowerCase() === "paid" || order.status.toLowerCase() !== "cancelled")
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Dynamic balances based on real orders
    const balances = [
      { id: "1", currency: "USD", amount: totalRevenue },
      { id: "2", currency: "EUR", amount: totalRevenue * 0.92 }, // Approximate conversion or separate tracking
      { id: "3", currency: "GBP", amount: 0.00 },
    ];

    // 3. Real orders ko Transactions format mein map karein
    const transactions = orders.map((order) => {
      const isPaid = order.paymentStatus.toLowerCase() === "paid";
      return {
        id: order.id,
        title: `Order #${order.orderNumber.slice(-6).toUpperCase()} - ${order.customerName} (${order.paymentMethod})`,
        amount: `+$${order.totalAmount.toFixed(2)} USD`,
        status: isPaid ? "Completed" : order.paymentStatus,
        date: new Date(order.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        createdAt: order.createdAt,
      };
    });

    return NextResponse.json({ balances, transactions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching real payment data:", error);
    return NextResponse.json(
      { error: "Failed to fetch real payment data" },
      { status: 500 }
    );
  }
}