import React from "react";

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ className, children, ...props }) => {
  return (
    <div className={`p-6 ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

const DialogHeader = ({ className, children, ...props }) => {
  return (
    <div className={`mb-4 ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

const DialogTitle = ({ className, children, ...props }) => {
  return (
    <h2 className={`text-xl font-semibold ${className || ""}`} {...props}>
      {children}
    </h2>
  );
};

const DialogFooter = ({ className, children, ...props }) => {
  return (
    <div className={`mt-6 flex justify-end gap-2 ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter }; 