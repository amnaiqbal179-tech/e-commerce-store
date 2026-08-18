"use client";

import { XCircle, AlertTriangle } from "lucide-react";
import { useState, useTransition } from "react";

interface CancelOrderButtonProps {
  orderId: string;
  onCancel: (formData: FormData) => void;
}

export default function CancelOrderButton({ orderId, onCancel }: CancelOrderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      {/* Cancel Trigger Button */}
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-100 transition shadow-sm cursor-pointer"
      >
        <XCircle size={16} />
        <span>Cancel Order</span>
      </button>

      {/* Custom Professional Modal (No Localhost Text) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 border border-black/10">
            
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-50 rounded-2xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-black">Cancel Order</h3>
                <p className="text-xs text-black/60">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm text-black/80 leading-relaxed">
              Are you sure you want to cancel this order? Once cancelled, your items will be returned to stock.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-black text-xs font-semibold py-3 rounded-xl transition cursor-pointer"
              >
                Keep Order
              </button>

              <form 
                action={(formData) => {
                  startTransition(() => {
                    onCancel(formData);
                    setIsOpen(false);
                  });
                }}
                className="flex-1"
              >
                <input type="hidden" name="orderId" value={orderId} />
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-3 rounded-xl transition cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isPending ? "Cancelling..." : "Yes, Cancel"}
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
}