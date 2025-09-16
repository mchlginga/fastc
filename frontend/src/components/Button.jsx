import React from "react";

const Button = ({ className, children, ...props }) => (
    <button
        className={`px-4 py-2 rounded-lg font-medium text-sm transition duration-200 ${className}`}
        {...props}
    >
        {children}
    </button>
);

export default Button;