"use client";

import Link from "next/link";
import { 
  ChevronLeft, 
  Printer, 
  Pencil, 
  Check, 
  Truck, 
  CreditCard 
} from "lucide-react";

export default function OrderDetailPage() {
  const orderData = {
    id: "ORD-12345",
    date: "2025-04-15",
    customer: {
      name: "Alice Johnson",
      email: "alice@example.com",
      address: "123 Main St, Anytown, AN 12345",
      paymentMethod: "Visa ending in **** 1234",
    },
    summary: {
      subtotal: 101.97,
      shipping: 10.00,
      total: 111.97,
    },
    delivery: {
      currentStatus: "Shipped",
      statusDate: "December 23, 2024",
      steps: [
        { label: "Processing", completed: true },
        { label: "Shipped", completed: true, active: true },
        { label: "Out for Delivery", completed: false },
        { label: "Delivered", completed: false },
      ],
    },
    items: [
      {
        id: 1,
        title: "Wireless Headphones",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=150&auto=format&fit=crop&q=80",
        quantity: 2,
        price: 25.99,
        total: 51.98,
      },
      {
        id: 2,
        title: "Bluetooth Speaker",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&auto=format&fit=crop&q=80",
        quantity: 1,
        price: 49.99,
        total: 49.99,
      },
    ],
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-screen font-sans text-gray-800">
      
      {/* ================= TOP TOOLBAR ================= */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/orders"
          className="p-2 bg-white border border-gray-200/80 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()}
            className="bg-white border border-gray-200/80 hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-gray-600" />
            <span>Print</span>
          </button>
          
          <button className="bg-black hover:bg-gray-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer">
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* ================= TOP GRID: ORDER INFO & SUMMARY ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Customer & Order Details (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs space-y-6">
          
          {/* Order Title */}
          <div className="border-b border-gray-100 pb-5">
            <h1 className="text-xl font-bold text-gray-900">Order {orderData.id}</h1>
            <p className="text-xs text-gray-400 mt-1">Placed on {orderData.date}</p>
          </div>

          {/* Customer Information */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-gray-700">Customer Information</h2>
            <div className="text-xs space-y-1 text-gray-600">
              <p className="font-semibold text-gray-900">{orderData.customer.name}</p>
              <p>{orderData.customer.email}</p>
              <p>{orderData.customer.address}</p>
            </div>

            {/* Payment Method Container */}
            <div className="mt-4 p-3.5 bg-gray-50/70 border border-gray-100 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-gray-700 mb-1">Payment Method</p>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span>{orderData.customer.paymentMethod}</span>
                </div>
              </div>
              <button className="p-1.5 bg-white border border-gray-200/80 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Card: Order Summary (1 col) */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">${orderData.summary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">${orderData.summary.shipping.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="border-t border-gray-100 my-4" />
            <div className="flex items-center justify-between text-sm font-bold text-gray-900">
              <span>Total</span>
              <span>${orderData.summary.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ================= DELIVERY STATUS CARD ================= */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs space-y-6">
        <h2 className="text-sm font-bold text-gray-900">Delivery Status</h2>

        {/* Timeline Stepper */}
        <div className="relative pt-2 pb-4">
          
          {/* Progress Line */}
          <div className="absolute top-[26px] left-8 right-8 h-1 bg-gray-200 -z-0">
            <div className="h-full bg-black w-[42%]" />
          </div>

          {/* Stepper Nodes */}
          <div className="relative z-10 flex items-center justify-between">
            
            {/* Step 1: Processing */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xs">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-semibold text-gray-700">Processing</span>
            </div>

            {/* Step 2: Shipped */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xs">
                <Truck className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-[11px] font-semibold text-gray-700">Shipped</span>
            </div>

            {/* Step 3: Out for Delivery */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 text-gray-500 flex items-center justify-center">
                <Truck className="w-5 h-5 stroke-[1.8]" />
              </div>
              <span className="text-[11px] font-medium text-gray-500">Out for Delivery</span>
            </div>

            {/* Step 4: Delivered */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 text-gray-500 flex items-center justify-center">
                <Check className="w-5 h-5 stroke-[1.8]" />
              </div>
              <span className="text-[11px] font-medium text-gray-500">Delivered</span>
            </div>

          </div>
        </div>

        {/* Active Status Badge Tag */}
        <div className="flex items-center gap-2 pt-2">
          <span className="px-3 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full">
            {orderData.delivery.currentStatus}
          </span>
          <span className="text-xs text-gray-500">on {orderData.delivery.statusDate}</span>
        </div>
      </div>

      {/* ================= ORDER ITEMS TABLE ================= */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-gray-900">Order Items</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500">
                <th className="py-3 font-medium text-gray-600">Product</th>
                <th className="py-3 font-medium text-gray-600 text-center">Quantity</th>
                <th className="py-3 font-medium text-gray-600 text-right">Price</th>
                <th className="py-3 font-medium text-gray-600 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orderData.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Product Details */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200/60"
                      />
                      <span className="font-semibold text-gray-900">{item.title}</span>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="py-4 text-center text-gray-700 font-medium">
                    {item.quantity}
                  </td>

                  {/* Price */}
                  <td className="py-4 text-right text-gray-700 font-medium">
                    ${item.price.toFixed(2)}
                  </td>

                  {/* Total */}
                  <td className="py-4 text-right font-semibold text-gray-900">
                    ${item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}