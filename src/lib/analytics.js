import { sendGAEvent } from "@next/third-parties/google";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// sendGAEvent warns to the console if GoogleAnalytics was never rendered
// (i.e. NEXT_PUBLIC_GA_MEASUREMENT_ID is unset) — skip the call entirely so
// every tracked interaction stays silent in that case.
export function trackEvent(eventName, params = {}) {
  if (!gaMeasurementId || typeof window === "undefined") return;
  sendGAEvent("event", eventName, params);
}
