// src/components/DirectAdLink.js
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * DirectAdLink — Ad Autoclose + Download in SAME TAB
 *
 * - Opens ad in a new tab.
 * - After 3 seconds the ad tab closes.
 * - Then the *current GameHub tab* loads the real download URL.
 */
const DirectAdLink = ({
  gameId,
  gameName,
  adZoneId,
  downloadUrl,
  isDownloadButton = false,
  className,
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e) => {
    e.preventDefault();

    // 1️⃣ Open the ad in a new tab
    let adWindow = null;
    if (adZoneId) {
      adWindow = window.open(
        `https://otieu.com/4/${adZoneId}`,
        "_blank",
        "noopener,noreferrer"
      );
    }

    // 2️⃣ For download button → auto-close ad → open download in SAME TAB
    if (isDownloadButton && downloadUrl) {
      setTimeout(() => {
        // Close ad tab safely
        try {
          if (adWindow && !adWindow.closed) adWindow.close();
        } catch (_) {}

        // ⭐ Open download in SAME current GameHub tab
        window.location.href = downloadUrl;

      }, 3000);
    }

    // 3️⃣ Navigation logic (download stays on same page until redirect)
    if (!isDownloadButton) {
      navigate(`/game/${encodeURIComponent(gameName)}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer ${className || ""}`}
      role="link"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick(e);
        }
      }}
    >
      {children}
    </div>
  );
};

export default DirectAdLink;
