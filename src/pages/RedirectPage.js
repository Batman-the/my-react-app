// src/pages/RedirectPage.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const pending = sessionStorage.getItem("pendingDownload");
    // Optional: show ad or wait a few seconds
    const timer = setTimeout(() => {
      if (pending) {
        sessionStorage.removeItem("pendingDownload");
        window.open(pending, "_blank"); // open the real download link
      }
      navigate(-1); // go back to GameDetails page
    }, 4000); // wait 4 seconds for ad display

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center">
      <h1 className="text-3xl font-bold mb-4">Preparing Your Download...</h1>
      <p className="mb-2">Please wait a few seconds while we prepare your download link.</p>
      <p className="text-sm opacity-80">(Your download will start automatically)</p>
    </div>
  );
};

export default RedirectPage;
