// src/types/user.ts
export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  created_at: string;
  is_active: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
