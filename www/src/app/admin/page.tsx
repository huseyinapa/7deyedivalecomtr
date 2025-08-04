"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api";
import { toast, Toaster } from "react-hot-toast";
import AdminDashboard from "./components/AdminDashboard";
import ApplicationPageNew from "./components/ApplicationPageNew";
import { AdminDashboard as SecurityDashboard } from "@/components/AdminDashboard";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// Enhanced safe component wrapper with error boundary
function SafeComponent({
  children,
  componentName,
  fallback
}: {
  children: React.ReactNode;
  componentName?: string;
  fallback?: React.ReactNode;
}) {
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>("");

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error(`Error in ${componentName || 'component'}:`, error);
      setErrorDetails(error.message);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [componentName]);

  const defaultFallback = (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 m-4">
      <div className="flex">
        <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {componentName || 'Bileşen'} yüklenirken hata oluştu
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>Bu bileşen geçici olarak kullanılamıyor. Sayfayı yenilemeyi deneyin.</p>
            {errorDetails && (
              <details className="mt-2">
                <summary className="cursor-pointer">Hata detayları</summary>
                <pre className="mt-1 text-xs bg-red-100 p-2 rounded">{errorDetails}</pre>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (hasError) {
    return <>{fallback || defaultFallback}</>;
  }

  try {
    return <>{children}</>;
  } catch (error) {
    console.error(`Render error in ${componentName}:`, error);
    setHasError(true);
    setErrorDetails(error instanceof Error ? error.message : 'Bilinmeyen hata');
    return <>{fallback || defaultFallback}</>;
  }
}

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading) {
      // Check if token exists first
      const hasToken = typeof window !== 'undefined' &&
        (localStorage.getItem('token') || document.cookie.includes('token='));

      if (!hasToken || !user) {
        router.push("/admin/login");
      }
    }
  }, [mounted, authLoading, user, router]);

  // Show loading while mounting or authenticating
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  // Check token first before showing loading
  const hasToken = typeof window !== 'undefined' &&
    (localStorage.getItem('token') || document.cookie.includes('token='));

  if (!hasToken) {
    return null; // Will redirect to login
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Kimlik doğrulanıyor...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Router.push will handle the redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Panel
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Hoş geldiniz, {user.email}
              </p>
            </div>
            <button
              onClick={async () => {
                try {
                  await authService.logout();
                  toast.success("Başarıyla çıkış yapıldı");
                  router.push("/admin/login");
                } catch (error) {
                  console.error("Logout error:", error);
                  // Fallback logout
                  localStorage.removeItem("token");
                  router.push("/admin/login");
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "dashboard"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "applications"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Başvurular
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "orders"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Siparişler
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "security"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Güvenlik
            </button>
            <button
              onClick={() => setActiveTab("couriers")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "couriers"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Kuryeler
            </button>
          </nav>
        </div>

        {/* Tab Content with Safe Wrappers */}
        {activeTab === "dashboard" && (
          <SafeComponent
            componentName="AdminDashboard"
            fallback={<div className="p-6 text-red-500">Dashboard yüklenirken hata oluştu</div>}
          >
            <AdminDashboard />
          </SafeComponent>
        )}
        {activeTab === "applications" && (
          <SafeComponent
            componentName="ApplicationPageNew"
            fallback={<div className="p-6 text-red-500">Başvurular yüklenirken hata oluştu</div>}
          >
            <ApplicationPageNew />
          </SafeComponent>
        )}
        {activeTab === "security" && (
          <SafeComponent
            componentName="SecurityDashboard"
            fallback={<div className="p-6 text-red-500">Güvenlik paneli yüklenirken hata oluştu</div>}
          >
            <SecurityDashboard />
          </SafeComponent>
        )}
        {activeTab === "orders" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Siparişler</h2>
            <p className="text-gray-500">Sipariş yönetimi yakında eklenecek...</p>
          </div>
        )}
        {activeTab === "couriers" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Kuryeler</h2>
            <p className="text-gray-500">Kurye yönetimi yakında eklenecek...</p>
          </div>
        )}
      </div>
    </div>
  );
}
