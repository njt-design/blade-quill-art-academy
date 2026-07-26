import { useEffect } from "react";
import { useLocation } from "wouter";
import { initGoogleAnalytics, trackPageView } from "@/lib/analytics";

/** Loads GA4 once and records SPA page views on route changes. */
export function Analytics() {
  const [location] = useLocation();

  useEffect(() => {
    initGoogleAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(location || "/");
  }, [location]);

  return null;
}
