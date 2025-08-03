"use client";

import { useEffect } from "react";
import { initializeGA } from "./google-analytics";

declare global {
  interface Window {
    GA_INITIALIZED?: boolean;
  }
}

/**
 * Google Analytics component that initializes GA on the client side
 */
export default function GoogleAnalytics(): null {
  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initializeGA();
      window.GA_INITIALIZED = true;
    }
  }, []);

  return null;
}
