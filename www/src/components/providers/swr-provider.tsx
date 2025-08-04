"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";

interface SWRProviderProps {
  children: ReactNode;
}

export default function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 60000, // Refresh data every 60 seconds (reduced frequency)
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 5000, // Increased deduping interval
        errorRetryCount: 3,
        errorRetryInterval: 1000,
        loadingTimeout: 5000,
        focusThrottleInterval: 5000,
        onError: (error) => {
          // Only log errors in development
          if (process.env.NODE_ENV === 'development') {
            console.error("SWR Error:", error);
          }
        },
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          // Don't retry on 404s
          if (error.status === 404) return;

          // Don't retry more than 3 times
          if (retryCount >= 3) return;

          // Exponential backoff
          setTimeout(() => revalidate({ retryCount }), Math.pow(2, retryCount) * 1000);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
