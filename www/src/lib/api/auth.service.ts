import apiClient from "@/utils/axiosInstance";
import { ApiResponse } from "@/utils/axiosInstance";

/**
 * Cookie utilities for token management
 */
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string) => {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

/**
 * Authentication service
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

class AuthService {
  /**
   * User login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<
      ApiResponse<{
        user: any;
        access_token: string;
      }>
    >("/auth/login", credentials);

    // Handle NestJS ApiResponse format - data is nested in response.data.data
    const authData = response.data.data;

    // Ensure we have the expected response structure
    if (
      !authData ||
      typeof authData !== "object" ||
      !("access_token" in authData) ||
      !authData.access_token ||
      !authData.user
    ) {
      console.error("Invalid auth data structure:", authData);
      throw new Error("Invalid authentication response");
    }

    const validAuthData: AuthResponse = {
      access_token: authData.access_token,
      user: {
        id: authData.user.id,
        name: authData.user.name,
        email: authData.user.email,
        role: authData.user.role,
        isActive: authData.user.isActive,
      },
    };

    // Store token and user data
    if (validAuthData.access_token) {
      localStorage.setItem("token", validAuthData.access_token);
      localStorage.setItem("user", JSON.stringify(validAuthData.user));

      // Also store in secure cookies
      setCookie("token", validAuthData.access_token, 7);
      setCookie("user", JSON.stringify(validAuthData.user), 7);
    }

    return validAuthData;
  }

  /**
   * User registration
   */
  async register(userData: RegisterData): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(
      "/auth/register",
      userData
    );

    const user = response.data.data || response.data;

    // Ensure we have a valid user object
    if (!user || typeof user !== "object" || !("id" in user)) {
      throw new Error("Invalid registration response");
    }

    return user as User;
  }

  /**
   * User logout
   */
  async logout(): Promise<void> {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear cookies
    deleteCookie("token");
    deleteCookie("user");
  }

  /**
   * Get current user from API
   */
  async getCurrentUser(): Promise<User> {
    // Check if token exists before making request
    const token = this.getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await apiClient.get<ApiResponse<User>>("/auth/me");

    const user = response.data.data || response.data;

    // Ensure we have a valid user object
    if (!user || typeof user !== "object" || !("id" in user)) {
      throw new Error("Invalid user response");
    }

    return user as User;
  }

  /**
   * Get current user from localStorage (sync)
   */
  getCurrentUserFromStorage(): User | null {
    if (typeof window === "undefined") return null;

    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;

    const token = localStorage.getItem("token") || getCookie("token");
    return !!token;
  }

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    if (typeof window === "undefined") return null;

    return localStorage.getItem("token") || getCookie("token");
  }
}

export const authService = new AuthService();
export default authService;
