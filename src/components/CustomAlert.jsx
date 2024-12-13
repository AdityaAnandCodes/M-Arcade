import React from "react";

const CustomAlert = ({ message, type, onClose }) => {
  const alertStyles = {
    base: "fixed top-5 left-1/2 transform -translate-x-1/2 p-4 rounded shadow-lg max-w-xs w-full z-50 text-center",
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-black",
  };

  return (
    <div className={`${alertStyles.base} ${alertStyles[type]}`}>
      <p>{message}</p>
      <button
        onClick={onClose}
        className="mt-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
      >
        Close
      </button>
    </div>
  );
};

export default CustomAlert;
