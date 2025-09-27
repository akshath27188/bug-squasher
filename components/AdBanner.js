import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
export const AdBanner = () => {
    useEffect(() => {
        try {
            // This is the standard way to initialize an ad unit in a single-page app.
            // It tells AdSense to look for an ad unit on the page and fill it.
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
        catch (err) {
            console.error("AdSense error: ", err);
        }
    }, []);
    return (_jsx("div", { className: "w-full mt-8 text-center", children: _jsx("ins", { className: "adsbygoogle", style: { display: 'block' }, "data-ad-client": "ca-pub-5538272112952140" // Your publisher ID from ads.txt
            , "data-ad-slot": "1234567890", "data-ad-format": "auto", "data-full-width-responsive": "true" }) }));
};
