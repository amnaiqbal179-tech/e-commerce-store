import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ordersFromDb = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const orders = ordersFromDb.map((order) => {
      const firstItem = order.items[0];
      return {
        id: order.orderNumber || order.id,
        customer: order.customerName || "Guest Customer",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
        product: firstItem?.title || firstItem?.product?.title || "Custom Order Item",
        amount: order.totalAmount,
        status: order.status,
      };
    });

    const productsFromDb = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const products = productsFromDb.map((p) => ({
      id: p.id,
      name: p.title,
      image: p.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop",
      price: p.price,
      sold: p.stock > 0 ? 10 : 0,
    }));

    const totalRevenue = ordersFromDb.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    return NextResponse.json(
      {
        metrics: {
          totalRevenue,
          totalOrders: ordersFromDb.length,
        },
        orders,
        products,
        revenueData: [],
        returningRateData: [],
        locationData: [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}