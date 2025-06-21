// src/hooks/useAuth.ts - Custom hook for authentication
import { useEffect, useState } from "react";
import { authService } from "../services";
import { AuthState } from "../types/user";

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const state = await authService.getAuthState();
      setAuthState(state);
    } catch (error) {
      console.error("Error loading auth state:", error);
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = async (credentials: any) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const response = await authService.login(credentials);

      const newState: AuthState = {
        user: response.user,
        token: response.access_token,
        isLoading: false,
        isAuthenticated: true,
      };

      setAuthState(newState);
      return response;
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const response = await authService.register(userData);

      const newState: AuthState = {
        user: response.user,
        token: response.access_token,
        isLoading: false,
        isAuthenticated: true,
      };

      setAuthState(newState);
      return response;
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    refreshAuth: loadAuthState,
  };
};
