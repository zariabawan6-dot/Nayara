import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, ShoppingBag } from "lucide-react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // --- 1. Logic to Add Toast ---
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  // --- 2. Logic to Remove Toast ---
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* --- 3. The Toast Container (Fixed Overlay) --- */}
      <div className="fixed top-15 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-4 min-w-[300px] max-w-sm 
              bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
              p-1 rounded-lg transform transition-all duration-500 ease-out animate-slide-in
            `}
          >
            {/* Icon Based on Type */}
            <div
              className={`p-2 rounded-full ${
                toast.type === "success"
                  ? "bg-[#FAF9F6] text-gray-900"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {toast.type === "success" ? (
                <ShoppingBag size={20} />
              ) : (
                <X size={20} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h4 className="font-serif text-sm font-semibold text-gray-900">
                {toast.message}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                {toast.type === "success" ? "Added to Bag" : "Notice"}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
