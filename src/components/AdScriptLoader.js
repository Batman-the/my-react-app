import { useEffect } from "react";

const AdScriptLoader = ({ zoneId }) => {
  useEffect(() => {
    // Prevent duplicate script injections
    if (!window.Monetag) {
      const script = document.createElement("script");
      script.src = "https://alwingulla.com/400/10127706"; // your Monetag global ad script
      script.async = true;
      document.body.appendChild(script);
    }

    // Process ads again after script load
    const timer = setTimeout(() => {
      if (window.Monetag && typeof window.Monetag.processAds === "function") {
        window.Monetag.processAds();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [zoneId]);

  return null;
};

export default AdScriptLoader;
