// src/types/user.ts
export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Additional types that might be useful
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: any) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (userData: any) => Promise<User>;
  refreshAuth: () => Promise<void>;
}

// For form handling
export interface LoginFormData {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  full_name?: string;
}
