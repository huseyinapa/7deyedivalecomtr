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
        refreshInterval: 30000, // Refresh data every 30 seconds
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 2000,
        errorRetryCount: 3,
        onError: (error) => {
          console.error("SWR Error:", error);
          // You can add global error handling here if needed
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
