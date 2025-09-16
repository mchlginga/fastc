import React from "react";

const Input = ({ label, icon, className, ...props }) => (
  <div>
    {label && (
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i data-feather={icon} className="text-gray-400 mr-2"></i>
        </div>
      )}
      <input
        className={`input-focus w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200 ${icon ? "pl-12" : ""} ${className}`}
        {...props}
      />
    </div>
  </div>
);

export default Input;