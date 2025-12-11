import React, { useEffect } from "react";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(onClose, 2000);
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-slide-in">
      {message}
    </div>
  );
};

export default Toast;
