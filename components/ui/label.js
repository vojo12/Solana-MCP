import React from "react";

const Label = ({ 
  htmlFor, 
  children, 
  className = "", 
  ...props 
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export { Label }; 