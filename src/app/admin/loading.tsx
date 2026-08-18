import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-gray-800" />
      <p className="text-xs text-gray-500 font-semibold">Connecting to Database & Loading Products...</p>
    </div>
  );
}