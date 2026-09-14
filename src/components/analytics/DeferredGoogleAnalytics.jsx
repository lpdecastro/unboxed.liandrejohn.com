"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

// `<GoogleAnalytics>` renders two <script> tags via next/script; Next.js
// preloads "afterInteractive" scripts with high priority in the initial
// HTML, which put gtag.js (175KB) in contention with critical CSS/font
// requests during the LCP window. Rendering nothing until after window
// `load` keeps it out of the initial HTML entirely (no preload emitted)
// and off the critical path completely — analytics doesn't need to be
// live before the page has finished loading everything else.
export default function DeferredGoogleAnalytics({ gaId }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (document.readyState === "complete") {
      setReady(true);
      return;
    }
    const onLoad = () => setReady(true);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  if (!ready) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
