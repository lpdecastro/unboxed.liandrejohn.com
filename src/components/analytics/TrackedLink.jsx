"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export default function TrackedLink({
  eventName,
  eventParams,
  onClick,
  ...props
}) {
  function handleClick(e) {
    trackEvent(eventName, eventParams);
    onClick?.(e);
  }

  return <Link {...props} onClick={handleClick} />;
}
