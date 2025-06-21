// src/services/api/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './client';
import { API_CONFIG } from '../../constants/api';
import { User, AuthState } from '../../types/user';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

class AuthService {
  /**
   * Store authentication token
   */
  private async storeToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error storing auth token:', error);
      throw error;
    }
  }

  /**
   * Remove authentication token
   */
  private async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  /**
   * Store user data
   */
  private async storeUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
      throw error;
    }
  }

  /**
   * Get stored user data
   */
  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Create form data for OAuth2 login
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.endpoints.auth.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const authData: AuthResponse = await response.json();

      // Store token and user data
      await this.storeToken(authData.access_token);
      await this.storeUser(authData.user);

      return authData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.endpoints.auth.register,
        userData,
        false // Don't include auth token for registration
      );

      if (response.success && response.data) {
        // Store token and user data
        await this.storeToken(response.data.access_token);
        await this.storeUser(response.data.user);
        return response.data;
      }

      throw new Error('Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if available
      await apiClient.post(API_CONFIG.endpoints.auth.logout);
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Always clean up local storage
      await this.removeToken();
      await AsyncStorage.removeItem('user_data');
    }
  }

  /**
   * Get current authentication state
   */
  async getAuthState(): Promise<AuthState> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const user = await this.getStoredUser();

      return {
        user,
        token,
        isLoading: false,
        isAuthenticated: !!(token && user),
      };
    } catch (error) {
      console.error('Error getting auth state:', error);
      return {
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const response = await apiClient.post<{ access_token: string }>(
        API_CONFIG.endpoints.auth.refresh
      );

      if (response.success && response.data) {
        await this.storeToken(response.data.access_token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      await this.logout();
      return false;
    }
  }
}

export const authService = new AuthService();