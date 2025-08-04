"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  TruckIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalCouriers: number;
  activeCouriers: number;
  pendingApplications: number;
  todayOrders: number;
  weeklyRevenue: number;
  averageDeliveryTime: number;
}

interface RecentActivity {
  id: string;
  type: "order" | "courier" | "application";
  message: string;
  timestamp: Date;
  status: "success" | "warning" | "error" | "info";
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalCouriers: 0,
    activeCouriers: 0,
    pendingApplications: 0,
    todayOrders: 0,
    weeklyRevenue: 0,
    averageDeliveryTime: 0,
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch dashboard data
  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockStats: DashboardStats = {
        totalOrders: 156,
        activeOrders: 23,
        completedOrders: 133,
        totalCouriers: 45,
        activeCouriers: 32,
        pendingApplications: 8,
        todayOrders: 12,
        weeklyRevenue: 15600,
        averageDeliveryTime: 28,
      };

      const mockActivities: RecentActivity[] = [
        {
          id: "1",
          type: "order",
          message: "Yeni sipariş oluşturuldu #1234",
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          status: "info",
        },
        {
          id: "2",
          type: "courier",
          message: "Kurye başvurusu onaylandı",
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          status: "success",
        },
        {
          id: "3",
          type: "application",
          message: "Bekleyen başvuru var",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          status: "warning",
        },
      ];

      setStats(mockStats);
      setRecentActivities(mockActivities);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Veriler yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  // Memoized calculations
  const completionRate = useMemo(() => {
    if (stats.totalOrders === 0) return 0;
    return Math.round((stats.completedOrders / stats.totalOrders) * 100);
  }, [stats.totalOrders, stats.completedOrders]);

  const courierUtilization = useMemo(() => {
    if (stats.totalCouriers === 0) return 0;
    return Math.round((stats.activeCouriers / stats.totalCouriers) * 100);
  }, [stats.totalCouriers, stats.activeCouriers]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color = "blue",
    subtext,
    trend,
    onClick,
  }: {
    title: string;
    value: number | string;
    icon: any;
    color?: "blue" | "green" | "yellow" | "red" | "purple" | "indigo";
    subtext?: string;
    trend?: { value: number; isPositive: boolean };
    onClick?: () => void;
  }) => {
    const colorClasses = {
      blue: "bg-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100",
      green: "bg-green-500 text-green-600 bg-green-50 hover:bg-green-100",
      yellow: "bg-yellow-500 text-yellow-600 bg-yellow-50 hover:bg-yellow-100",
      red: "bg-red-500 text-red-600 bg-red-50 hover:bg-red-100",
      purple: "bg-purple-500 text-purple-600 bg-purple-50 hover:bg-purple-100",
      indigo: "bg-indigo-500 text-indigo-600 bg-indigo-50 hover:bg-indigo-100",
    };

    return (
      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 ${onClick ? "cursor-pointer hover:shadow-md hover:scale-105" : ""
          }`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-md ${colorClasses[color].split(' ')[2]} transition-colors`}>
              <Icon className={`h-6 w-6 ${colorClasses[color].split(' ')[1]}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {isLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  typeof value === "number" ? value.toLocaleString() : value
                )}
              </p>
              {subtext && (
                <p className="text-sm text-gray-400">{subtext}</p>
              )}
            </div>
          </div>
          {trend && !isLoading && (
            <div className={`flex items-center ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
              <ArrowTrendingUpIcon
                className={`h-4 w-4 ${trend.isPositive ? "" : "rotate-180"}`}
              />
              <span className="text-sm font-medium ml-1">
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }; if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Hata</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchStats}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Son güncelleme: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={fetchStats}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Yenileniyor..." : "Yenile"}
        </button>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Bugünkü Siparişler"
          value={stats.todayOrders}
          icon={ClockIcon}
          color="blue"
          subtext="Son 24 saat"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Haftalık Gelir"
          value={`₺${stats.weeklyRevenue.toLocaleString()}`}
          icon={ChartBarIcon}
          color="green"
          subtext="Son 7 gün"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Ortalama Teslimat"
          value={`${stats.averageDeliveryTime} dk`}
          icon={TruckIcon}
          color="purple"
          subtext="Ortalama süre"
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Tamamlanma Oranı"
          value={`%${completionRate}`}
          icon={CheckCircleIcon}
          color="indigo"
          subtext="Başarı oranı"
        />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Toplam Siparişler"
          value={stats.totalOrders}
          icon={ChartBarIcon}
          color="blue"
          subtext="Tüm zamanlar"
        />
        <StatCard
          title="Aktif Siparişler"
          value={stats.activeOrders}
          icon={ClockIcon}
          color="yellow"
          subtext="Devam eden"
        />
        <StatCard
          title="Tamamlanan Siparişler"
          value={stats.completedOrders}
          icon={CheckCircleIcon}
          color="green"
          subtext="Bu ay"
        />
        <StatCard
          title="Toplam Kuryeler"
          value={stats.totalCouriers}
          icon={UserGroupIcon}
          color="purple"
          subtext="Kayıtlı"
        />
        <StatCard
          title={`Aktif Kuryeler (%${courierUtilization})`}
          value={stats.activeCouriers}
          icon={TruckIcon}
          color="green"
          subtext="Çevrimiçi"
        />
        <StatCard
          title="Bekleyen Başvurular"
          value={stats.pendingApplications}
          icon={XCircleIcon}
          color="red"
          subtext="İnceleme bekliyor"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Hızlı İşlemler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <TruckIcon className="h-8 w-8 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900">Yeni Sipariş</p>
            <p className="text-sm text-gray-500">Manuel sipariş oluştur</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <UserGroupIcon className="h-8 w-8 text-green-600 mb-2" />
            <p className="font-medium text-gray-900">Kurye Yönetimi</p>
            <p className="text-sm text-gray-500">Kuryeler ve başvurular</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <ChartBarIcon className="h-8 w-8 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900">Raporlar</p>
            <p className="text-sm text-gray-500">İstatistik ve analiz</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <ClockIcon className="h-8 w-8 text-yellow-600 mb-2" />
            <p className="font-medium text-gray-900">Geçmiş</p>
            <p className="text-sm text-gray-500">Tüm işlem geçmişi</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Son Aktiviteler</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Tümünü Gör
          </button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${activity.status === "success" ? "bg-green-400" :
                      activity.status === "warning" ? "bg-yellow-400" :
                        activity.status === "error" ? "bg-red-400" : "bg-blue-400"
                    }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${activity.status === "success" ? "bg-green-100 text-green-800" :
                      activity.status === "warning" ? "bg-yellow-100 text-yellow-800" :
                        activity.status === "error" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                    }`}>
                    {activity.type}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <ClockIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">Henüz aktivite bulunmuyor</p>
              <p className="text-sm">Son işlemler burada görünecek</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
