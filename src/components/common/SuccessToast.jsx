import React, { useEffect } from "react";

const SuccessToast = ({ show, message, onClose }) => {
  useEffect(() => {
    if (!show) return undefined;
    const timer = setTimeout(() => {
      onClose?.();
    }, 3200);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 drop-shadow-[0_20px_35px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-3 rounded-[999px] bg-emerald-500 px-6 py-4 text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <svg
            className="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <p className="text-sm font-semibold">{message}</p>
      </div>
    </div>
  );
};

export default SuccessToast;

