"use client";

import { useEffect } from "react";

// Renders nothing server-side, so Next never emits a blocking <link> for
// this stylesheet. Once React hydrates, it inserts the <link> imperatively —
// after the browser has already parsed and painted the critical HTML/CSS,
// so it can never delay first paint. Covers carousel/offcanvas — see
// src/scss/deferred.scss for why those are safe to load this way. No
// <noscript> fallback: this app already requires JS everywhere (the whole
// booking flow is React state), so a no-JS visitor gets nothing usable
// regardless.
export default function DeferredStylesheet({ href }) {
  useEffect(() => {
    if (document.querySelector(`link[href="${href}"]`)) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }, [href]);

  return null;
}
