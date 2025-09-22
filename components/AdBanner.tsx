import React, { useEffect } from 'react';

// Declaration to inform TypeScript that 'adsbygoogle' exists on the window object.
declare global {
    interface Window {
        adsbygoogle?: { [key: string]: unknown }[];
    }
}

export const AdBanner: React.FC = () => {
  useEffect(() => {
    try {
      // This is the standard way to initialize an ad unit in a single-page app.
      // It tells AdSense to look for an ad unit on the page and fill it.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error: ", err);
    }
  }, []);

  return (
    <div className="w-full mt-8 text-center">
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5538272112952140" // Your publisher ID from ads.txt
        // ==============================================================================
        // IMPORTANT: Replace "1234567890" with your actual Ad Slot ID from AdSense.
        // Without this, ads will NOT show up.
        // ==============================================================================
        data-ad-slot="1234567890" 
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};