import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface SecurityNoticeProps {
  type: 'rate-limit' | 'account-locked' | 'suspicious-activity';
  message?: string;
  onRetry?: () => void;
}

export function SecurityNotice({ type, message, onRetry }: SecurityNoticeProps) {
  const getNoticeConfig = () => {
    switch (type) {
      case 'rate-limit':
        return {
          title: 'Çok Fazla İstek',
          description: message || 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.',
          bgColor: 'bg-yellow-50',
          iconColor: 'text-yellow-400',
          textColor: 'text-yellow-800',
          retryDelay: '1 dakika',
        };
      case 'account-locked':
        return {
          title: 'Hesap Kilitlendi',
          description: message || 'Hesabınız güvenlik nedeniyle geçici olarak kilitlenmiştir.',
          bgColor: 'bg-red-50',
          iconColor: 'text-red-400',
          textColor: 'text-red-800',
          retryDelay: '15 dakika',
        };
      case 'suspicious-activity':
        return {
          title: 'Şüpheli Aktivite',
          description: message || 'Şüpheli aktivite tespit edildi. Güvenlik kontrolü yapılıyor.',
          bgColor: 'bg-orange-50',
          iconColor: 'text-orange-400',
          textColor: 'text-orange-800',
          retryDelay: '5 dakika',
        };
      default:
        return {
          title: 'Güvenlik Uyarısı',
          description: message || 'Bir güvenlik uyarısı oluştu.',
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-400',
          textColor: 'text-gray-800',
          retryDelay: '1 dakika',
        };
    }
  };

  const config = getNoticeConfig();

  return (
    <div className={`rounded-md p-4 ${config.bgColor}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon
            className={`h-5 w-5 ${config.iconColor}`}
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${config.textColor}`}>
            {config.title}
          </h3>
          <div className={`mt-2 text-sm ${config.textColor}`}>
            <p>{config.description}</p>
            <p className="mt-2">
              Lütfen <strong>{config.retryDelay}</strong> bekleyip tekrar deneyin.
            </p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  type="button"
                  onClick={onRetry}
                  className={`rounded-md px-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${type === 'rate-limit'
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-600'
                      : type === 'account-locked'
                        ? 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-600'
                        : 'bg-orange-100 text-orange-800 hover:bg-orange-200 focus:ring-orange-600'
                    } ${config.bgColor}`}
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
