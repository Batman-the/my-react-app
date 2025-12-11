// src/components/AdBanner.js
import React from "react";

const AdBanner = () => {
  // ⛔ NO third-party ad scripts are included here, ensuring no push notifications or aggressive ads.
  return (
    <div
      className="w-full flex justify-center items-center my-6 rounded-xl bg-gray-100 dark:bg-gray-800 transition-colors duration-300"
      style={{ minHeight: "100px" }}
    >
      {/* This div acts purely as a placeholder for layout and spacing.
        You can remove the <p> tag entirely for a cleaner block, or add a simple
        "Ad Placeholder" text if you want.
      */}
      <p className="text-sm text-gray-400 dark:text-gray-500 select-none">
        Ad Placeholder
      </p>
    </div>
  );
};

export default AdBanner;