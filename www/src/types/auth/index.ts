// Authentication related types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  isActive?: boolean;
  createdAt?: string;
}

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
  user: User;
}
