import React from "react";

const Checkbox = ({ label, className, ...props }) => (
  <div className="flex items-start">
    <div className="flex items-center h-5">
      <input
        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${className}`}
        {...props}
      />
    </div>
    {label && (
      <div className="ml-3 text-sm">
        <label htmlFor={props.id} className="font-medium text-gray-700">
          {label}
        </label>
      </div>
    )}
  </div>
);

export default Checkbox;