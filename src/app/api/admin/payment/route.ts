import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Database se balances aur transactions fetch karein
    const balances = await prisma.balance.findMany();
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ balances, transactions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching payment data:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment data" },
      { status: 500 }
    );
  }
}