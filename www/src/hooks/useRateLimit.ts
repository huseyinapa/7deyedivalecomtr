import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

export interface RateLimitInfo {
  isLimited: boolean;
  message?: string;
  usedAttempts?: number;
  maxAttempts?: number;
  resetIn?: string;
}

interface UseRateLimitReturn {
  rateLimitInfo: RateLimitInfo;
  handleRateLimitError: (error: any) => void;
  clearRateLimit: () => void;
  showRateLimitWarning: (remaining: number, max: number) => void;
}

export function useRateLimit(): UseRateLimitReturn {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo>({
    isLimited: false,
  });

  const handleRateLimitError = useCallback((error: any) => {
    const errorData = error?.response?.data;
    const message = errorData?.message || "İstek limiti aşıldı";

    let resetIn = "";
    if (errorData?.retryAfter) {
      const retryDate = new Date(Date.now() + errorData.retryAfter * 1000);
      resetIn = retryDate.toLocaleString("tr-TR");
    }

    setRateLimitInfo({
      isLimited: true,
      message,
      usedAttempts: errorData?.usedAttempts,
      maxAttempts: errorData?.maxAttempts,
      resetIn: resetIn || "Bilinmiyor",
    });

    toast.error(message);
  }, []);

  const clearRateLimit = useCallback(() => {
    setRateLimitInfo({
      isLimited: false,
    });
  }, []);

  const showRateLimitWarning = useCallback((remaining: number, max: number) => {
    if (remaining <= 2) {
      toast(`Dikkat: ${remaining} deneme hakkınız kaldı (${max} maksimum)`, {
        icon: "⚠️",
      });
    }
  }, []);

  return {
    rateLimitInfo,
    handleRateLimitError,
    clearRateLimit,
    showRateLimitWarning,
  };
}
