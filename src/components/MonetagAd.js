import React, { useEffect } from "react";

const MonetagAd = ({ zoneId, width = 300, height = 250 }) => {
  useEffect(() => {
    // Inject Monetag SDK if not already present
    if (!window.monetagScriptLoaded) {
      const script = document.createElement("script");
      script.src = "https://cdn.monetag.com/ads.js";
      script.async = true;
      document.body.appendChild(script);
      window.monetagScriptLoaded = true;
    }

    // Initialize the ad after SDK loads
    const interval = setInterval(() => {
      if (window.monetag && window.monetag.cmd) {
        window.monetag.cmd.push(function () {
          window.monetag.createAd({
            zoneId,
            container: `monetag-ad-${zoneId}`,
            width,
            height,
          });
        });
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [zoneId, width, height]);

  return (
    <div
      id={`monetag-ad-${zoneId}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        margin: "20px auto",
        textAlign: "center",
      }}
    >
      Loading Ad...
    </div>
  );
};

export default MonetagAd;
