"use client";

import { useState, useEffect, useMemo } from "react";
import { useAdminStats, useAdminTrends, useRecentActivity, useAdminActions } from "@/hooks/useAdmin";
import {
  ChartBarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  EyeIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

// Safe wrapper component for error boundaries
function SafeAdminComponent({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('AdminDashboard component error:', error);
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Bileşen yüklenirken hata oluştu
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Dashboard bileşeni yüklenemedi. Sayfayı yenilemeyi deneyin.</p>
            </div>
          </div>
        </div>
        {fallback && <div className="mt-4">{fallback}</div>}
      </div>
    );
  }
}

export function AdminDashboard() {
  return (
    <SafeAdminComponent>
      <AdminDashboardContent />
    </SafeAdminComponent>
  );
}

function AdminDashboardContent() {
  const { stats, isLoading: statsLoading, refresh: refreshStats } = useAdminStats();
  const { trends, isLoading: trendsLoading } = useAdminTrends();
  const { activities, isLoading: activitiesLoading, refresh: refreshActivities } = useRecentActivity(20);
  const { unblockIP, unlockUser } = useAdminActions();

  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshStats();
      refreshActivities();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshStats, refreshActivities]);

  // Memoized calculations
  const securityMetrics = useMemo(() => {
    if (!stats) return null;

    const totalAttempts = stats.totalLogins + stats.failedLogins;
    const successRate = totalAttempts > 0 ? (stats.totalLogins / totalAttempts) * 100 : 0;
    const securityScore = Math.max(0, 100 - (stats.blockedIPs * 10) - (stats.suspiciousActivity * 5));

    return {
      successRate: successRate.toFixed(1),
      securityScore: Math.min(100, securityScore).toFixed(0),
      threatLevel: securityScore > 80 ? 'Düşük' : securityScore > 60 ? 'Orta' : 'Yüksek',
      threatColor: securityScore > 80 ? 'text-green-600' : securityScore > 60 ? 'text-yellow-600' : 'text-red-600'
    };
  }, [stats]);

  const handleUnblockIP = async (ip: string) => {
    try {
      await unblockIP(ip);
      toast.success(`IP ${ip} engeli kaldırıldı`);
      refreshStats();
      refreshActivities();
    } catch (error) {
      toast.error('IP engeli kaldırılırken hata oluştu');
    }
  };

  const handleUnlockUser = async (userId: string) => {
    try {
      await unlockUser(userId);
      toast.success('Kullanıcı kilidi açıldı');
      refreshStats();
      refreshActivities();
    } catch (error) {
      toast.error('Kullanıcı kilidi açılırken hata oluştu');
    }
  };

  if (statsLoading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Güvenlik Dashboard</h1>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-600">Otomatik Yenile</span>
          </label>
          <button
            onClick={() => {
              refreshStats();
              refreshActivities();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Yenile
          </button>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Aktif: {stats?.activeUsers || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Başarı Oranı</p>
              <p className="text-2xl font-bold text-green-600">{securityMetrics?.successRate || 0}%</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Toplam giriş: {(stats?.totalLogins || 0) + (stats?.failedLogins || 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Güvenlik Skoru</p>
              <p className={`text-2xl font-bold ${securityMetrics?.threatColor || 'text-gray-900'}`}>
                {securityMetrics?.securityScore || 0}/100
              </p>
            </div>
            <ShieldCheckIcon className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Tehdit: {securityMetrics?.threatLevel || 'Bilinmiyor'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Şüpheli Aktivite</p>
              <p className="text-2xl font-bold text-red-600">{stats?.suspiciousActivity || 0}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Engelli IP: {stats?.blockedIPs || 0}
          </p>
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Son Güvenlik Olayları</h2>
            <EyeIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="p-6">
          {activitiesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
            </div>
          ) : activities?.length > 0 ? (
            <div className="space-y-4">
              {activities.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${activity.type === 'failed_login' || activity.type === 'suspicious' ? 'bg-red-500' :
                      activity.type === 'blocked_ip' ? 'bg-orange-500' : 'bg-green-500'
                      }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type === 'login' && 'Başarılı Giriş'}
                        {activity.type === 'register' && 'Yeni Kayıt'}
                        {activity.type === 'failed_login' && 'Başarısız Giriş'}
                        {activity.type === 'blocked_ip' && 'IP Engellendi'}
                        {activity.type === 'suspicious' && 'Şüpheli Aktivite'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.email && `${activity.email} - `}
                        {activity.ip}
                        {activity.message && ` - ${activity.message}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString('tr-TR')}
                    </span>
                    {(activity.type === 'blocked_ip' || activity.type === 'failed_login') && (
                      <button
                        onClick={() => {
                          if (activity.type === 'blocked_ip') {
                            handleUnblockIP(activity.ip);
                          }
                        }}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                      >
                        {activity.type === 'blocked_ip' ? 'Engeli Kaldır' : 'Detay'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Henüz güvenlik olayı bulunmuyor</p>
            </div>
          )}
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Güvenlik İstatistikleri</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Başarılı Girişler</span>
              <span className="text-sm font-medium text-green-600">{stats?.totalLogins || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Başarısız Girişler</span>
              <span className="text-sm font-medium text-red-600">{stats?.failedLogins || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Engelli IP Adresleri</span>
              <span className="text-sm font-medium text-orange-600">{stats?.blockedIPs || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Şüpheli Aktiviteler</span>
              <span className="text-sm font-medium text-purple-600">{stats?.suspiciousActivity || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sistem Durumu</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rate Limiting</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Aktif</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Audit Logging</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Aktif</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Account Lockout</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Aktif</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">IP Blocking</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Aktif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
