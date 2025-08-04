"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin, useAuth } from "@/hooks/useAuth";
import { toast, Toaster } from "react-hot-toast";
import { checkRateLimit } from "@/lib/rate-limiter";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { SecurityNotice } from "@/components/ui/SecurityNotice";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useLogin();
  const { user, isLoading: authLoading } = useAuth();

  const [credentials, setCredentials] = useState({
    email: "", // Debug: admin credentials pre-filled
    password: "", // Debug: admin credentials pre-filled
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mount check
  useEffect(() => {
    setMounted(true);

    // Debug: Auto login for development
    // if (process.env.NODE_ENV === 'development' && !user && !authLoading) {
    //   console.log("Debug: Auto-login attempt");
    //   setTimeout(() => {
    //     if (!isLoading && credentials.email && credentials.password) {
    //       console.log("Debug: Performing auto-login");
    //       handleSubmit(new Event('submit') as any);
    //     }
    //   }, 1000);
    // }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (mounted && !authLoading) {
      // Check token first
      const hasToken = typeof window !== 'undefined' &&
        (localStorage.getItem('token') || document.cookie.includes('token='));

      if (hasToken && user) {
        const from = searchParams.get("from") || "/admin";
        router.push(from);
      }
    }
  }, [mounted, authLoading, user, router, searchParams]);

  // Input validation
  const isFormValid = useCallback(() => {
    return (
      credentials.email.trim() !== "" &&
      credentials.password.trim() !== "" &&
      credentials.email.includes("@") &&
      credentials.password.length >= 6
    );
  }, [credentials]);

  // Handle input changes with debouncing
  const handleInputChange = useCallback((field: "email" | "password", value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Lütfen geçerli bilgiler giriniz");
      return;
    }

    // Rate limiting temporarily disabled for development
    // const clientIp = "client-login";
    // const rateLimitResult = checkRateLimit(clientIp, "LOGIN");

    // if (rateLimitResult.isLimited) {
    //   const minutes = Math.ceil(rateLimitResult.resetTime / (1000 * 60));
    //   toast.error(`Çok fazla deneme yaptınız. ${minutes} dakika sonra tekrar deneyin.`);
    //   setRateLimitInfo(rateLimitResult);
    //   return;
    // }

    setIsLoading(true);

    try {
      const result = await login(credentials);

      toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");

      // Clear form for security
      setCredentials({ email: "", password: "" });

      // Redirect after successful login
      setTimeout(() => {
        const from = searchParams.get("from") || "/admin";
        router.push(from);
      }, 1000);
    } catch (error: any) {

      // Rate limiting disabled for development
      // const newRateLimitResult = checkRateLimit(clientIp, "LOGIN");
      // setRateLimitInfo(newRateLimitResult);

      // Extract error message with better handling
      let errorMessage = "Giriş yapılırken bir hata oluştu";

      try {
        if (error?.message && typeof error.message === 'string') {
          // Use the processed error message from useLogin hook
          errorMessage = error.message;
        } else if (error?.response?.data?.message && typeof error.response.data.message === 'string') {
          // Use backend error message if available
          errorMessage = error.response.data.message;
        } else if (error?.response?.status === 401) {
          errorMessage = "E-posta veya şifre hatalı";
        } else if (error?.response?.status === 429) {
          errorMessage = "Çok fazla deneme yaptınız. Lütfen biraz bekleyin";
        } else if (error?.response?.status >= 500) {
          errorMessage = "Sunucu hatası. Lütfen daha sonra tekrar deneyin";
        }
      } catch (msgError) {
        console.error("Error processing error message:", msgError);
        errorMessage = "Giriş yapılırken beklenmeyen bir hata oluştu";
      }

      toast.error(errorMessage);

      // Clear password on error for security
      setCredentials(prev => ({ ...prev, password: "" }));
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking auth or redirecting
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if already authenticated (avoid showing login form)
  const hasToken = typeof window !== 'undefined' &&
    (localStorage.getItem('token') || document.cookie.includes('token='));

  if (hasToken && authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-sm text-gray-600">Yönlendiriliyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Giriş</h1>
          {searchParams.get("from") && (
            <p className="text-sm text-gray-600 mt-2">
              Devam etmek için giriş yapmanız gerekiyor
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              value={credentials.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${credentials.email && !credentials.email.includes("@")
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
                }`}
              placeholder="admin@example.com"
              required
              disabled={isLoading}
              autoComplete="email"
            />
            {credentials.email && !credentials.email.includes("@") && (
              <p className="text-xs text-red-600 mt-1">Geçerli bir e-posta adresi giriniz</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 transition-colors ${credentials.password && credentials.password.length < 6
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
                  }`}
                placeholder="Şifrenizi giriniz"
                required
                disabled={isLoading}
                autoComplete="current-password"
                minLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {credentials.password && credentials.password.length < 6 && (
              <p className="text-xs text-red-600 mt-1">Şifre en az 6 karakter olmalıdır</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isFormValid()
              ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Giriş yapılıyor...
              </span>
            ) : (
              "Giriş Yap"
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isLoading}
          >
            Ana Sayfaya Dön
          </button>
        </div>

        {/* Security note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Bu sayfa SSL ile korunmaktadır
          </p>
        </div>
      </div>
    </div>
  );
}
