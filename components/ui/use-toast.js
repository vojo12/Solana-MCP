import React, { createContext, useContext, useState } from "react";

// Create a context for the toast
const ToastContext = createContext(null);

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
    
    return id;
  };

  const dismiss = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm"
          >
            {t.title && <div className="font-semibold">{t.title}</div>}
            {t.description && <div className="text-sm text-gray-500">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook to use the toast
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
}; 