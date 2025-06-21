// src/services/api/client.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "../../constants/api";
import { ApiError, ApiResponse } from "../../types/api";

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.timeout;
  }

  /**
   * Get stored authentication token
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem("auth_token");
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  }

  /**
   * Create request headers
   */
  private async createHeaders(
    includeAuth: boolean = true
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (includeAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || data.detail || "Request failed",
          status: response.status,
          code: data.code || `HTTP_${response.status}`,
        } as ApiError;
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: response.status,
        } as ApiError;
      }
      throw error;
    }
  }

  /**
   * Create timeout promise
   */
  private createTimeoutPromise(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Request timeout"));
      }, this.timeout);
    });
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = await this.createHeaders(includeAuth);

      const requestOptions: RequestInit = {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      };

      const fetchPromise = fetch(url, requestOptions);
      const response = await Promise.race([
        fetchPromise,
        this.createTimeoutPromise(),
      ]);

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" }, includeAuth);
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      includeAuth
    );
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      },
      includeAuth
    );
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" }, includeAuth);
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
