import { prisma } from "@/lib/prisma";
import { Download, Calendar, ChevronRight } from "lucide-react";

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border px-3 py-2 rounded-md text-sm hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            21 Jul 2026 - 17 Aug 2026
          </button>
          <button className="p-2 border rounded-md hover:bg-gray-50">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6 text-sm font-medium">
        <button className="pb-2 border-b-2 border-black text-black">Latest</button>
        <button className="pb-2 text-gray-500 hover:text-black">Upcoming</button>
      </div>

      {/* Transaction List */}
      <div className="border rounded-lg bg-white">
        {transactions.map((tx, index) => (
          <div
            key={tx.id}
            className={`flex items-center justify-between p-4 ${
              index !== transactions.length - 1 ? "border-b" : ""
            } hover:bg-gray-50 transition-colors`}
          >
            <div className="flex items-center gap-6">
              {/* Date */}
              <span className="text-sm text-gray-500 w-24">
                {new Date(tx.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              
              {/* Title & Status */}
              <div>
                <h4 className="text-sm font-medium">{tx.title}</h4>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold bg-green-50 text-green-700 border border-green-200">
                  {tx.status || "Completed"}
                </span>
              </div>
            </div>

            {/* Amount & Arrow */}
            <div className="flex items-center gap-4">
              <span className={`text-sm font-semibold ${tx.amount.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                {tx.amount} USD
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}