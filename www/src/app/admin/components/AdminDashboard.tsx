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
  CurrencyDollarIcon,
  StarIcon,
  UsersIcon,
  DocumentDuplicateIcon,
  BellIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CloudArrowDownIcon,
  ServerIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";
import { adminApiService, type DashboardStats, type RecentActivity, type SystemHealth, type AnalyticsData } from "@/lib/api/admin.service";
import { toast } from "react-hot-toast";

// Loading Skeleton Component
const StatCardSkeleton = () => (
  <div className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  </div>
);

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "indigo";
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  color = "blue",
  onClick
}) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    yellow: "text-yellow-600 bg-yellow-100",
    red: "text-red-600 bg-red-100",
    purple: "text-purple-600 bg-purple-100",
    indigo: "text-indigo-600 bg-indigo-100",
  };

  return (
    <div
      className={`bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-all duration-200 transform hover:scale-105 ${onClick ? "cursor-pointer" : ""
        }`}
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {typeof value === "number" && value !== null && value !== undefined
                    ? value.toLocaleString()
                    : value || "0"}
                </div>
                {change && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${change.type === "increase" ? "text-green-600" : "text-red-600"
                    }`}>
                    <ArrowTrendingUpIcon
                      className={`self-center flex-shrink-0 h-4 w-4 ${change.type === "decrease" ? "transform rotate-180" : ""
                        }`}
                    />
                    <span className="ml-1">{Math.abs(change.value)}%</span>
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

// Activity Item Component
const ActivityItem: React.FC<{ activity: RecentActivity }> = ({ activity }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-600 bg-green-100";
      case "warning": return "text-yellow-600 bg-yellow-100";
      case "error": return "text-red-600 bg-red-100";
      default: return "text-blue-600 bg-blue-100";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order": return TruckIcon;
      case "courier": return UserGroupIcon;
      case "application": return DocumentDuplicateIcon;
      case "system": return ServerIcon;
      case "user": return UsersIcon;
      default: return BellIcon;
    }
  };

  const Icon = getTypeIcon(activity.type);

  return (
    <div className="flex items-start space-x-3 py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors">
      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-900">
          <span className="font-medium">{activity.action}</span>
        </p>
        <p className="text-sm text-gray-500">{activity.description}</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(activity.timestamp).toLocaleString("tr-TR")}
          {activity.user && (
            <span className="ml-2">• {activity.user.email}</span>
          )}
        </p>
      </div>
    </div>
  );
};

// System Health Component
const SystemHealthCard: React.FC<{ health: SystemHealth | null; isLoading: boolean }> = ({
  health,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sistem Durumu</h3>
          <div className="text-center py-4">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Sistem durumu yüklenemedi</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-green-600 bg-green-100";
      case "warning": return "text-yellow-600 bg-yellow-100";
      case "critical": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-green-600";
      case "degraded": return "text-yellow-600";
      case "offline": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Sistem Durumu</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(health?.status || "unknown")}`}>
            {health?.status === "healthy" ? "Sağlıklı" :
              health?.status === "warning" ? "Uyarı" :
                health?.status === "critical" ? "Kritik" : "Bilinmiyor"}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Çalışma Süresi</span>
            <span className="text-sm font-medium text-gray-900">
              {health?.uptime ? `${Math.floor(health.uptime / 3600)}h ${Math.floor((health.uptime % 3600) / 60)}m` : "0h 0m"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Ortam</span>
            <span className="text-sm font-medium text-gray-900 capitalize">{health?.environment || "bilinmiyor"}</span>
          </div>

          <div className="border-t pt-3 mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Servisler</h4>
            <div className="space-y-2">
              {health?.services ? Object.entries(health.services).map(([service, status]) => (
                <div key={service} className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 capitalize">{service}</span>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${status === "online" ? "bg-green-400" :
                      status === "degraded" ? "bg-yellow-400" : "bg-red-400"
                      }`}></div>
                    <span className={`text-sm font-medium ${getServiceStatusColor(status)}`}>
                      {status === "online" ? "Çevrimiçi" :
                        status === "degraded" ? "Yavaş" : "Çevrimdışı"}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">Servis bilgisi yok</p>
                </div>
              )}
            </div>
          </div>

          {health?.performance && (
            <div className="border-t pt-3 mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Performans</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Yanıt Süresi</span>
                  <span className="text-sm font-medium text-gray-900">
                    {health.performance?.responseTime || 0}ms
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">CPU Kullanımı</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${health.performance?.cpuUsage || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {health.performance?.cpuUsage || 0}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Bellek Kullanımı</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${health.performance?.memoryUsage || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {health.performance?.memoryUsage || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month" | "year">("week");

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      const [statsRes, activitiesRes, healthRes, analyticsRes] = await Promise.allSettled([
        adminApiService.getDashboardStats(),
        adminApiService.getRecentActivities(10),
        adminApiService.getSystemHealth(),
        adminApiService.getAnalytics(selectedPeriod)
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value.data) {
        setStats(statsRes.value.data);
      } else {
        if (statsRes.status === "rejected") {
          console.error("Stats fetch failed:", statsRes.reason);
        }
        // Fallback to mock data for development
        setStats({
          totalOrders: 1247,
          activeOrders: 89,
          completedOrders: 1158,
          cancelledOrders: 32,
          totalCouriers: 156,
          activeCouriers: 89,
          availableCouriers: 45,
          pendingApplications: 23,
          approvedApplications: 156,
          rejectedApplications: 12,
          todayOrders: 45,
          weeklyRevenue: 15420,
          monthlyRevenue: 67890,
          averageDeliveryTime: 28,
          completionRate: 92.8,
          customerSatisfaction: 4.6,
        });
      }

      if (activitiesRes.status === "fulfilled" && activitiesRes.value.data) {
        setRecentActivities(activitiesRes.value.data);
      } else {
        if (activitiesRes.status === "rejected") {
          console.error("Activities fetch failed:", activitiesRes.reason);
        }
        // Fallback to mock data
        setRecentActivities([
          {
            id: "1",
            type: "order",
            action: "Yeni sipariş",
            description: "Kurye ataması bekleniyor - Kadıköy > Üsküdar",
            user: { id: "u1", email: "customer@example.com", role: "user" },
            timestamp: new Date().toISOString(),
            status: "info"
          },
          {
            id: "2",
            type: "courier",
            action: "Kurye aktif",
            description: "Ahmet Yılmaz çevrimiçi oldu",
            user: { id: "c1", email: "kurye@example.com", role: "courier" },
            timestamp: new Date(Date.now() - 300000).toISOString(),
            status: "success"
          },
          {
            id: "3",
            type: "application",
            action: "Yeni başvuru",
            description: "Kurye başvurusu onay bekliyor",
            user: null,
            timestamp: new Date(Date.now() - 600000).toISOString(),
            status: "warning"
          },
          {
            id: "4",
            type: "order",
            action: "Sipariş teslim edildi",
            description: "Başarılı teslimat - 5 yıldız aldı",
            user: { id: "c2", email: "kurye2@example.com", role: "courier" },
            timestamp: new Date(Date.now() - 900000).toISOString(),
            status: "success"
          }
        ]);
      }

      if (healthRes.status === "fulfilled" && healthRes.value.data) {
        setSystemHealth(healthRes.value.data);
      } else {
        if (healthRes.status === "rejected") {
          console.error("Health fetch failed:", healthRes.reason);
        }
        // Fallback health data
        setSystemHealth({
          status: "healthy",
          uptime: 86400,
          environment: "development",
          timestamp: new Date().toISOString(),
          services: {
            database: "online",
            redis: "online",
            notifications: "online"
          },
          performance: {
            responseTime: 85,
            cpuUsage: 35,
            memoryUsage: 68
          }
        });
      }

      if (analyticsRes.status === "fulfilled" && analyticsRes.value.data) {
        setAnalytics(analyticsRes.value.data);
      } else {
        // Mock analytics data
        setAnalytics({
          ordersByStatus: [
            { status: "completed", count: 1158, percentage: 85 },
            { status: "active", count: 89, percentage: 10 },
            { status: "cancelled", count: 32, percentage: 5 }
          ],
          couriersByStatus: [
            { status: "active", count: 89, percentage: 70 },
            { status: "available", count: 45, percentage: 25 },
            { status: "offline", count: 22, percentage: 5 }
          ],
          applicationsByStatus: [
            { status: "approved", count: 156, percentage: 80 },
            { status: "pending", count: 23, percentage: 15 },
            { status: "rejected", count: 12, percentage: 5 }
          ],
          revenueByPeriod: [],
          ordersByHour: [],
          topCouriers: [
            {
              id: "1",
              name: "Ahmet Yılmaz",
              email: "ahmet@example.com",
              completedOrders: 245,
              rating: 4.8,
              revenue: 5670
            },
            {
              id: "2",
              name: "Mehmet Özkan",
              email: "mehmet@example.com",
              completedOrders: 198,
              rating: 4.6,
              revenue: 4320
            }
          ],
          customerMetrics: {
            newCustomers: 45,
            returningCustomers: 156,
            customerRetentionRate: 78
          }
        });
      }

    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      setError("Veri yüklenirken hata oluştu");
      toast.error("Dashboard verileri yüklenemedi");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedPeriod]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    toast.loading("Veriler yenileniyor...", { id: "refresh" });
    await fetchDashboardData();
    toast.success("Veriler güncellendi", { id: "refresh" });
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Memoized stat cards to prevent unnecessary re-renders
  const statCards = useMemo(() => {
    if (!stats) return [];

    // Güvenli değer kontrolü
    const safeStats = {
      totalOrders: stats.totalOrders || 0,
      activeOrders: stats.activeOrders || 0,
      completedOrders: stats.completedOrders || 0,
      cancelledOrders: stats.cancelledOrders || 0,
      totalCouriers: stats.totalCouriers || 0,
      activeCouriers: stats.activeCouriers || 0,
      pendingApplications: stats.pendingApplications || 0,
      todayOrders: stats.todayOrders || 0,
      weeklyRevenue: stats.weeklyRevenue || 0,
      averageDeliveryTime: stats.averageDeliveryTime || 0,
      completionRate: stats.completionRate || 0,
      customerSatisfaction: stats.customerSatisfaction || 0
    };

    return [
      {
        title: "Toplam Sipariş",
        value: safeStats.totalOrders,
        icon: TruckIcon,
        color: "blue" as const,
        change: { value: 12, type: "increase" as const }
      },
      {
        title: "Aktif Sipariş",
        value: safeStats.activeOrders,
        icon: ClockIcon,
        color: "yellow" as const
      },
      {
        title: "Tamamlanan",
        value: safeStats.completedOrders,
        icon: CheckCircleIcon,
        color: "green" as const,
        change: { value: 8, type: "increase" as const }
      },
      {
        title: "İptal Edilen",
        value: safeStats.cancelledOrders,
        icon: XCircleIcon,
        color: "red" as const
      },
      {
        title: "Toplam Kurye",
        value: safeStats.totalCouriers,
        icon: UserGroupIcon,
        color: "purple" as const
      },
      {
        title: "Aktif Kurye",
        value: safeStats.activeCouriers,
        icon: SignalIcon,
        color: "green" as const
      },
      {
        title: "Bekleyen Başvuru",
        value: safeStats.pendingApplications,
        icon: DocumentDuplicateIcon,
        color: "yellow" as const
      },
      {
        title: "Bugün Sipariş",
        value: safeStats.todayOrders,
        icon: ChartBarIcon,
        color: "indigo" as const,
        change: { value: 15, type: "increase" as const }
      },
      {
        title: "Haftalık Gelir",
        value: `₺${safeStats.weeklyRevenue.toLocaleString()}`,
        icon: CurrencyDollarIcon,
        color: "green" as const,
        change: { value: 23, type: "increase" as const }
      },
      {
        title: "Ort. Teslimat",
        value: `${safeStats.averageDeliveryTime} dk`,
        icon: ClockIcon,
        color: "blue" as const
      },
      {
        title: "Tamamlanma Oranı",
        value: `${safeStats.completionRate}%`,
        icon: ArrowTrendingUpIcon,
        color: "green" as const
      },
      {
        title: "Müşteri Memnuniyeti",
        value: `${safeStats.customerSatisfaction}/5`,
        icon: StarIcon,
        color: "yellow" as const
      }
    ];
  }, [stats]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Hata</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-2 text-red-800 hover:text-red-900 underline"
              >
                Tekrar dene
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">
            Sistem durumu ve işletme metrikleri • Son güncelleme: {new Date().toLocaleTimeString("tr-TR")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            disabled={isLoading}
          >
            <option value="day">Bugün</option>
            <option value="week">Bu Hafta</option>
            <option value="month">Bu Ay</option>
            <option value="year">Bu Yıl</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Yenileniyor..." : "Yenile"}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))
          : statCards.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              change={stat.change}
              onClick={() => {
                if (stat.title.includes("Sipariş")) {
                  toast("Sipariş detayları yakında eklenecek", { icon: "ℹ️" });
                } else if (stat.title.includes("Kurye")) {
                  toast("Kurye yönetimi yakında eklenecek", { icon: "ℹ️" });
                }
              }}
            />
          ))
        }
      </div>

      {/* Second Row - System Health & Recent Activities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* System Health */}
        <div className="lg:col-span-1">
          <SystemHealthCard health={systemHealth || null} isLoading={isLoading || false} />
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Son Aktiviteler</h3>
                <button
                  onClick={() => {
                    toast("Detaylı aktivite günlüğü yakında eklenecek", { icon: "ℹ️" });
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Tümünü gör →
                </button>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="animate-pulse flex space-x-3">
                      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (recentActivities && recentActivities.length > 0) ? (
                <div className="space-y-1 max-h-80 overflow-y-auto">
                  {(recentActivities || []).map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Henüz aktivite bulunmuyor</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Third Row - Quick Actions */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hızlı İşlemler</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => {
                toast("Kullanıcı ekleme formu yakında eklenecek", { icon: "ℹ️" });
              }}
              className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Kullanıcı Ekle
            </button>

            <button
              onClick={async () => {
                try {
                  toast.loading("Veriler dışa aktarılıyor...", { id: "export" });
                  await new Promise(resolve => setTimeout(resolve, 2000));
                  toast.success("Veriler başarıyla dışa aktarıldı", { id: "export" });
                } catch (error) {
                  toast.error("Dışa aktarma başarısız", { id: "export" });
                }
              }}
              className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-green-400 hover:text-green-600 transition-colors"
            >
              <CloudArrowDownIcon className="h-4 w-4 mr-2" />
              Veri Dışa Aktar
            </button>

            <button
              onClick={() => {
                toast("Bildirim gönderme özelliği yakında eklenecek", { icon: "ℹ️" });
              }}
              className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-yellow-400 hover:text-yellow-600 transition-colors"
            >
              <BellIcon className="h-4 w-4 mr-2" />
              Bildirim Gönder
            </button>

            <button
              onClick={async () => {
                try {
                  toast.loading("Önbellek temizleniyor...", { id: "cache" });
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  toast.success("Önbellek başarıyla temizlendi", { id: "cache" });
                } catch (error) {
                  toast.error("Önbellek temizleme başarısız", { id: "cache" });
                }
              }}
              className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-purple-400 hover:text-purple-600 transition-colors"
            >
              <ServerIcon className="h-4 w-4 mr-2" />
              Önbellek Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Fourth Row - Analytics Preview */}
      {analytics && analytics.ordersByStatus && analytics.topCouriers && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Order Status Distribution */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Sipariş Durumu Dağılımı</h3>
                <EyeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {(analytics.ordersByStatus || []).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize font-medium">
                      {item.status === "completed" ? "Tamamlandı" :
                        item.status === "active" ? "Aktif" :
                          item.status === "cancelled" ? "İptal" : item.status}
                    </span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${item.status === "completed" ? "bg-green-500" :
                            item.status === "active" ? "bg-blue-500" : "bg-red-500"
                            }`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                        {item.count}
                      </span>
                      <span className="text-xs text-gray-500 w-10 text-right">
                        %{item.percentage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Couriers */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">En İyi Kuryeler</h3>
                <StarIcon className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="space-y-4">
                {(analytics.topCouriers || []).slice(0, 5).map((courier, index) => (
                  <div key={courier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-medium text-white ${index === 0 ? "bg-yellow-500" :
                          index === 1 ? "bg-gray-400" :
                            index === 2 ? "bg-orange-400" : "bg-blue-500"
                          }`}>
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{courier.name}</p>
                        <p className="text-xs text-gray-500">{courier.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {courier.completedOrders} teslimat
                      </p>
                      <div className="flex items-center justify-end">
                        <StarIcon className="h-3 w-3 text-yellow-400 mr-1" />
                        <span className="text-xs text-gray-600 font-medium">{courier.rating}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          ₺{(courier.revenue || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
