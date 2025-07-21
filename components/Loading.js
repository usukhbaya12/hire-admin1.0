"use client";

export default function LoadingSpinner({ tip = "Уншиж байна..." }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-md z-[1000]">
      <div className="arc-spinner"></div>
      {tip && <div className="mt-4 font-semibold text-gray-700">{tip}</div>}
    </div>
  );
}
