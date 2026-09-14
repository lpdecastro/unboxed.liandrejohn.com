"use client";

import { trackEvent } from "@/lib/analytics";

// Generic click-tracking wrapper for non-Link interactive elements —
// Bootstrap modal/accordion/offcanvas triggers that rely on
// data-bs-toggle/data-bs-target rather than a JS handler. Renders as
// `as` (default "button"), forwards every other prop, and fires the
// tracked event alongside Bootstrap's own delegated click handling.
export default function TrackedElement({
  as: As = "button",
  eventName,
  eventParams,
  onClick,
  ...props
}) {
  function handleClick(e) {
    trackEvent(eventName, eventParams);
    onClick?.(e);
  }

  return <As {...props} onClick={handleClick} />;
}
