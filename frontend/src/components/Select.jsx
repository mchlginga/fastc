import React from "react";

const Select = ({ label, options, className, ...props }) => (
    <div>
        {label && (
            <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
        )}
        <select
            className={`input-focus w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200 ${className}`}
            {...props}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

export default Select;