import React from "react";

const RadioGroup = ({ 
  children, 
  defaultValue, 
  value, 
  onValueChange, 
  className = "", 
  ...props 
}) => {
  const handleChange = (newValue) => {
    if (onValueChange) {
      onValueChange(newValue);
    }
  };
  
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            checked: value === child.props.value || defaultValue === child.props.value,
            onChange: () => handleChange(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
};

const RadioGroupItem = ({ 
  id, 
  value, 
  checked, 
  onChange, 
  children, 
  className = "", 
  ...props 
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        type="radio"
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-primary"
        {...props}
      />
      {children}
    </div>
  );
};

export { RadioGroup, RadioGroupItem }; 