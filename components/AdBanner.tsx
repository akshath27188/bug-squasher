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
    // Fix: Corrected the syntax of the try...catch block.
    // The original code was missing curly braces {} around the catch block's body,
    // and had an extra closing brace, which is a syntax error.
    } catch (err) {
      console.error("AdSense error: ", err);
    }
  }, []);

  return (
    <div className="w-full mt-8 flex justify-center">
      {/* 
        This ad unit is now configured for AdSense "Auto ads".
        This requires "Auto ads" to be enabled for your site in your AdSense account.
        It does NOT require a data-ad-slot ID.
      */}
      <div className="w-full max-w-4xl">
        <ins 
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-client="ca-pub-5538272112952140" // Your publisher ID from ads.txt
          data-ad-layout="in-article"
          data-ad-format="fluid"
        ></ins>
      </div>
    </div>
  );
};
