import React from 'react';
import { RateLimitInfo } from '@/hooks/useRateLimit';

interface RateLimitWarningProps {
  rateLimitInfo: RateLimitInfo;
  onRetry?: () => void;
}

export function RateLimitWarning({ rateLimitInfo, onRetry }: RateLimitWarningProps) {
  if (!rateLimitInfo.isLimited) return null;

  return (
    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            İstek Limiti Aşıldı
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>{rateLimitInfo.message}</p>
            {rateLimitInfo.usedAttempts && rateLimitInfo.maxAttempts && (
              <p className="mt-1">
                Kullanılan: {rateLimitInfo.usedAttempts}/{rateLimitInfo.maxAttempts}
              </p>
            )}
            {rateLimitInfo.resetIn && (
              <p className="mt-1">
                Tekrar deneyebilirsiniz: {rateLimitInfo.resetIn}
              </p>
            )}
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="bg-yellow-100 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600"
              >
                Tekrar Dene
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
