"use client";

import { useState } from "react";
import { Printer, ChevronLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function OrderInvoicePage({ params }: { params: { id: string } }) {
  // Yahan aap apna actual order data database se fetch karenge
  const [order, setOrder] = useState({
    id: params.id || "cmsy90mzi000eycbpsnj2ixzs",
    date: "August 18, 2026",
    status: "Confirmed",
    customer: {
      name: "Amna Iqbal",
      email: "amnaiqbal179@gmail.com",
      phone: "03455064056",
      address: "District Mandi Bahauddin Tehsil phalia near village doughal, MANDI BAHAUDDIN",
    },
    items: [
      { name: "Gradient Graphic T-Shirt", variant: "Large / Black", qty: 2, price: 2500 },
      { name: "Skinny Fit Jeans", variant: "32 / Blue", qty: 1, price: 3600 },
    ],
    shippingFee: 250,
    discount: 0,
  });

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalAmount = subtotal + order.shippingFee - order.discount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen font-sans text-gray-900 pb-12">
      
      {/* Top Action Bar (Print ke waqt hide ho jayega) */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-200 print:hidden">
        <Link 
          href="/admin/orders"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* ================= PROFESSIONAL INVOICE SHEET ================= */}
      <div className="p-8 sm:p-12 bg-white rounded-2xl border border-gray-100 shadow-sm print:shadow-none print:border-none print:p-0">
        
        {/* Header: Brand & Invoice Meta */}
        <div className="flex justify-between items-start pb-8 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-black">SHOP.CO</h1>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-1">Official Tax Invoice</p>
          </div>
          <div className="text-right">
            <h2 className="text-sm font-bold text-gray-900">INVOICE #{order.id.slice(-8).toUpperCase()}</h2>
            <p className="text-xs text-gray-500 mt-1">Date: {order.date}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
              {order.status}
            </span>
          </div>
        </div>

        {/* Billing & Shipping Details Grid */}
        <div className="grid grid-cols-2 gap-8 py-8 border-b border-gray-200">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Billed To Customer:</h3>
            <p className="text-sm font-bold text-gray-900">{order.customer.name}</p>
            <p className="text-xs text-gray-600 mt-0.5">{order.customer.email}</p>
            <p className="text-xs text-gray-600 mt-0.5">{order.customer.phone}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Delivery Address:</h3>
            <p className="text-xs text-gray-700 leading-relaxed font-medium">{order.customer.address}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
              <span>Payment Method:</span>
              <span className="text-black font-bold">Cash on Delivery</span>
            </div>
          </div>
        </div>

        {/* Itemized Products Table */}
        <div className="py-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-3 font-bold">Product Description</th>
                <th className="py-3 font-bold text-center">Qty</th>
                <th className="py-3 font-bold text-right">Unit Price</th>
                <th className="py-3 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-4">
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">Variant: {item.variant}</p>
                  </td>
                  <td className="py-4 text-center text-gray-700 font-semibold">{item.qty}</td>
                  <td className="py-4 text-right text-gray-600">Rs. {item.price.toLocaleString()}</td>
                  <td className="py-4 text-right font-bold text-gray-900">
                    Rs. {(item.price * item.qty).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculations / Totals Section */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <div className="w-72 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee</span>
              <span className="font-semibold text-gray-900">Rs. {order.shippingFee.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span className="font-semibold">- Rs. {order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-black font-extrabold text-base pt-3 border-t-2 border-black">
              <span>Total Amount</span>
              <span>Rs. {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-400 space-y-1">
          <p className="font-semibold text-gray-600">Thank you for shopping with SHOP.CO!</p>
          <p>For any support or queries, contact support@shop.co or call +92 300 0000000.</p>
        </div>

      </div>

    </div>
  );
}