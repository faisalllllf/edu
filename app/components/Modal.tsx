import React from "react";

export default function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black bg-opacity-10 transition-opacity" aria-hidden="true" />
      <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg pointer-events-auto animate-fadeIn border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-cyan-700 text-2xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
