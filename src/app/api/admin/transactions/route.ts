import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Yahan aap apna Prisma query bhi use kar sakte hain:
    // const transactions = await db.transaction.findMany({ orderBy: { createdAt: 'desc' } });

    const transactions = [
      {
        id: 1,
        date: "16 Aug 2025",
        title: "Withdrawal to JP Morgan Chase (0440)",
        status: "Completed",
        amount: "-1,275.79 USD",
        type: "withdrawal",
      },
      {
        id: 2,
        date: "5 Aug 2025",
        title: "Withdrawal to Citibank (2290)",
        status: "Completed",
        amount: "-202.99 USD",
        type: "withdrawal",
      },
      {
        id: 3,
        date: "5 Aug 2025",
        title: "Withdrawal to Bank of America (3311)",
        status: "Completed",
        amount: "-1,272.30 USD",
        type: "withdrawal",
      },
      {
        id: 4,
        date: "4 Aug 2025",
        title: "Payment from Paddle",
        status: "Completed",
        amount: "+5,651.56 USD",
        type: "payment",
      },
      {
        id: 5,
        date: "4 Aug 2025",
        title: "Withdrawal to HSBC (5522)",
        status: "Completed",
        amount: "-1,679.35 USD",
        type: "withdrawal",
      },
      {
        id: 6,
        date: "20 Aug 2025",
        title: "Withdrawal to JP Morgan Chase (1133)",
        status: "Completed",
        amount: "-3,420.00 USD",
        type: "withdrawal",
      },
      {
        id: 7,
        date: "18 Aug 2025",
        title: "Payment from Stripe",
        status: "Completed",
        amount: "+2,345.75 USD",
        type: "payment",
      },
      {
        id: 8,
        date: "25 Aug 2025",
        title: "Scheduled Payout - PayPal",
        status: "Pending",
        amount: "+850.00 USD",
        type: "payment",
      },
    ];

    return NextResponse.json({ success: true, transactions }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch transactions" }, { status: 500 });
  }
}