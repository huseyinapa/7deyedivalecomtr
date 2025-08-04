import useSWR from "swr";
import {
  authService,
  type LoginCredentials,
  type RegisterData,
  type AuthResponse,
  type User,
} from "@/lib/api";

/**
 * Hook for getting current user info
 */
export function useAuth() {
  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR(
    // Only fetch if token exists
    authService.isAuthenticated() ? "/auth/me" : null,
    () => authService.getCurrentUser(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: (error) => {
        // Don't retry on 401/403 errors
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          return false;
        }
        return true;
      },
      errorRetryCount: 1,
      errorRetryInterval: 5000,
      onError: (error) => {
        // Clear auth data on authentication errors
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          authService.logout();
        }
      },
    }
  );

  return {
    user,
    isLoading,
    isError: error,
    refresh: mutate,
    isAdmin: user?.role === "admin",
    isAuthenticated: !!user,
  };
}

/**
 * Hook for user login
 */
export function useLogin() {
  const login = async (
    credentials: LoginCredentials
  ): Promise<AuthResponse> => {
    try {
      const result = await authService.login(credentials);

      // Force refresh of the auth state after successful login
      // This ensures the user state updates immediately
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-change"));
      }

      return result;
    } catch (error: any) {
      // Enhanced error handling with better messages
      if (error?.response?.status === 401) {
        throw new Error("E-posta veya şifre hatalı");
      } else if (error?.response?.status === 429) {
        throw new Error("Çok fazla deneme yaptınız. Lütfen biraz bekleyin");
      } else if (error?.response?.status === 403) {
        throw new Error("Hesabınız geçici olarak engellenmiş");
      } else if (error?.response?.status >= 500) {
        throw new Error("Sunucu hatası. Lütfen daha sonra tekrar deneyin");
      } else if (error?.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error?.message) {
        throw error;
      } else {
        throw new Error("Giriş yapılırken bir hata oluştu");
      }
    }
  };

  return { login };
}

/**
 * Hook for user registration
 */
export function useRegister() {
  const register = async (userData: RegisterData): Promise<User> => {
    return await authService.register(userData);
  };

  return { register };
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const logout = async (): Promise<void> => {
    await authService.logout();
  };

  return { logout };
}

/**
 * Hook to get current user
 */
export function useCurrentUser() {
  const getCurrentUser = () => {
    return authService.getCurrentUser();
  };

  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  return { getCurrentUser, isAuthenticated };
}
