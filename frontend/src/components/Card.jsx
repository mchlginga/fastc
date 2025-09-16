import React from "react";

const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-opacity-90 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;