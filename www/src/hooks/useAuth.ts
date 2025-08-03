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
  } = useSWR("/auth/me", () => authService.getCurrentUser(), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    user,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook for user login
 */
export function useLogin() {
  const login = async (
    credentials: LoginCredentials
  ): Promise<AuthResponse> => {
    return await authService.login(credentials);
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
