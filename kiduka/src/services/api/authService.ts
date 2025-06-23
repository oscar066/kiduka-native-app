// src/services/api/authService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "../../constants/api";
import { AuthState, User } from "../../types/user";
import { apiClient } from "./client";

export interface LoginCredentials {
  username_or_email: string; // Matches backend UserLogin schema
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name?: string; // Optional in backend schema
}

// Backend Token response
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user?: User; // Will be fetched separately since login doesn't return user
}

// Backend UserResponse (from /auth/me endpoint)
export interface UserResponse {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

class AuthService {
  /**
   * Store authentication token
   */
  private async storeToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem("auth_token", token);
    } catch (error) {
      console.error("Error storing auth token:", error);
      throw error;
    }
  }

  /**
   * Remove authentication token
   */
  private async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem("auth_token");
    } catch (error) {
      console.error("Error removing auth token:", error);
    }
  }

  /**
   * Store user data
   */
  private async storeUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem("user_data", JSON.stringify(user));
    } catch (error) {
      console.error("Error storing user data:", error);
      throw error;
    }
  }

  /**
   * Get stored user data
   */
  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem("user_data");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting stored user:", error);
      return null;
    }
  }

  /**
   * Login user - Using axios with JSON body (not form data)
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log("Attempting login with:", credentials.username_or_email);

      // Send JSON request body using axios (via apiClient)
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.endpoints.auth.login,
        {
          username_or_email: credentials.username_or_email,
          password: credentials.password,
        },
        false // Don't include auth token for login request
      );

      if (!response.success || !response.data) {
        throw new Error("Login failed - no response data");
      }

      const authData = response.data;

      // Store the token
      await this.storeToken(authData.access_token);

      // Backend doesn't return user data with login, fetch it separately
      try {
        const userInfo = await this.getCurrentUser();
        if (userInfo) {
          await this.storeUser(userInfo);
          return {
            ...authData,
            user: userInfo,
          };
        }
      } catch (userError) {
        console.warn("Could not fetch user info after login:", userError);
        // Continue without user info - it will be fetched later
      }

      return authData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /**
   * Register new user - Returns UserResponse, not AuthResponse
   */
  async register(userData: RegisterData): Promise<UserResponse> {
    try {
      console.log("Attempting registration for:", userData.username);

      const response = await apiClient.post<UserResponse>(
        API_CONFIG.endpoints.auth.register,
        {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          full_name: userData.full_name || null,
        },
        false // Don't include auth token for registration
      );

      if (!response.success || !response.data) {
        throw new Error("Registration failed - no response data");
      }

      console.log("Registration successful for:", response.data.username);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  /**
   * Get current user info from /auth/me endpoint
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<UserResponse>(
        API_CONFIG.endpoints.auth.profile // Should be "/auth/me"
      );

      if (response.success && response.data) {
        const user: User = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          full_name: response.data.full_name,
          is_active: response.data.is_active,
          is_verified: response.data.is_verified,
          created_at: response.data.created_at,
        };

        // Update stored user data
        await this.storeUser(user);
        return user;
      }

      return null;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  }

  /**
   * Update current user profile using PUT /auth/me
   */
  async updateProfile(userData: {
    username?: string;
    email?: string;
    full_name?: string;
    is_active?: boolean;
  }): Promise<User> {
    try {
      const response = await apiClient.put<UserResponse>(
        API_CONFIG.endpoints.auth.profile,
        userData
      );

      if (response.success && response.data) {
        const user: User = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          full_name: response.data.full_name,
          is_active: response.data.is_active,
          is_verified: response.data.is_verified,
          created_at: response.data.created_at,
        };

        // Update stored user data
        await this.storeUser(user);
        return user;
      }

      throw new Error("Profile update failed");
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  }

  /**
   * Change password using /auth/change-password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const response = await apiClient.post(
        API_CONFIG.endpoints.auth.changePassword,
        {
          current_password: currentPassword,
          new_password: newPassword,
        }
      );

      return response.success;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  }

  /**
   * Logout user (clean local storage)
   */
  async logout(): Promise<void> {
    try {
      // Backend doesn't have logout endpoint, just clean local storage
      console.log("Logging out user (cleaning local storage)");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clean up local storage
      await this.removeToken();
      await AsyncStorage.removeItem("user_data");
    }
  }

  /**
   * Delete current user account using DELETE /auth/me
   */
  async deleteAccount(): Promise<boolean> {
    try {
      const response = await apiClient.delete(
        API_CONFIG.endpoints.auth.profile
      );

      if (response.success) {
        // Clean up local storage after successful deletion
        await this.removeToken();
        await AsyncStorage.removeItem("user_data");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Delete account error:", error);
      throw error;
    }
  }

  /**
   * Get current authentication state
   */
  async getAuthState(): Promise<AuthState> {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const user = await this.getStoredUser();

      // If we have a token but no user data, try to fetch it
      if (token && !user) {
        try {
          const fetchedUser = await this.getCurrentUser();
          return {
            user: fetchedUser,
            token,
            isLoading: false,
            isAuthenticated: !!(token && fetchedUser),
          };
        } catch (error) {
          console.warn("Could not fetch user data:", error);
        }
      }

      return {
        user,
        token,
        isLoading: false,
        isAuthenticated: !!(token && user),
      };
    } catch (error) {
      console.error("Error getting auth state:", error);
      return {
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    }
  }

  /**
   * Register and login flow - Helper method
   */
  async registerAndLogin(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Step 1: Register
      await this.register(userData);

      // Step 2: Login with the same credentials
      return await this.login({
        username_or_email: userData.username, // Can use username for login
        password: userData.password,
      });
    } catch (error) {
      console.error("Register and login error:", error);
      throw error;
    }
  }

  /**
   * Check if token is still valid by calling /auth/me
   */
  async validateToken(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  }
}

export const authService = new AuthService();
