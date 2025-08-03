import apiClient from "@/utils/axiosInstance";
import { ApiResponse } from "@/utils/axiosInstance";

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
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials
    );

    // Handle NestJS ApiResponse format or direct data
    const authData = response.data.data || response.data;

    // Ensure we have the expected response structure
    if (
      !authData ||
      typeof authData !== "object" ||
      !("access_token" in authData) ||
      !authData.access_token
    ) {
      throw new Error("Invalid authentication response");
    }

    const validAuthData = authData as AuthResponse;

    // Store token and user data
    if (validAuthData.access_token) {
      localStorage.setItem("token", validAuthData.access_token);
      localStorage.setItem("user", JSON.stringify(validAuthData.user));
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
  }

  /**
   * Get current user from API
   */
  async getCurrentUser(): Promise<User> {
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

    const token = localStorage.getItem("token");
    return !!token;
  }

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    if (typeof window === "undefined") return null;

    return localStorage.getItem("token");
  }
}

export const authService = new AuthService();
export default authService;
