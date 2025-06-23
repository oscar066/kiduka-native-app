// src/services/api/client.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_CONFIG } from "../../constants/api";
import { ApiError, ApiResponse } from "../../types/api";

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    // Create axios instance with base configuration
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.timeout,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Setup interceptors
    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Only add auth token if not explicitly excluded
        if (config.headers && config.headers["exclude-auth"] !== "true") {
          const token = await this.getAuthToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        // Remove the custom header
        if (config.headers) {
          delete config.headers["exclude-auth"];
        }

        // Optional: Log requests in development
        if (__DEV__) {
          console.log(
            `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
          );
          if (config.data && config.url !== "/auth/login") {
            // Don't log login credentials
            console.log("📤 Request data:", config.data);
          }
        }

        return config;
      },
      (error) => {
        if (__DEV__) {
          console.error("❌ Request interceptor error:", error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors consistently
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Optional: Log responses in development
        if (__DEV__) {
          console.log(
            `✅ API Response: ${response.status} ${response.config.url}`
          );
        }
        return response;
      },
      async (error) => {
        // Log error for debugging
        if (__DEV__) {
          console.error(
            "❌ API Error:",
            error.response?.status,
            error.response?.data
          );
        }

        // Transform axios error to our ApiError format
        if (error.response) {
          // Server responded with error status
          const apiError: ApiError = {
            message:
              error.response.data?.message ||
              error.response.data?.detail ||
              error.message ||
              "Request failed",
            status: error.response.status,
            code: error.response.data?.code || `HTTP_${error.response.status}`,
          };

          // Handle 401 errors (unauthorized) - token might be invalid
          if (error.response.status === 401) {
            console.warn("🔒 Unauthorized request - token might be invalid");
            // Optionally clear invalid token
            await this.handleUnauthorized();
          }

          return Promise.reject(apiError);
        } else if (error.request) {
          // Network error
          const apiError: ApiError = {
            message: "Network error. Please check your connection.",
            status: 0,
            code: "NETWORK_ERROR",
          };
          return Promise.reject(apiError);
        } else if (error.code === "ECONNABORTED") {
          // Timeout error
          const apiError: ApiError = {
            message: "Request timeout. Please try again.",
            status: 0,
            code: "TIMEOUT_ERROR",
          };
          return Promise.reject(apiError);
        } else {
          // Something else happened
          const apiError: ApiError = {
            message: error.message || "An unexpected error occurred",
            status: 0,
            code: "UNKNOWN_ERROR",
          };
          return Promise.reject(apiError);
        }
      }
    );
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
   * Handle unauthorized responses - clear invalid tokens
   */
  private async handleUnauthorized(): Promise<void> {
    try {
      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("user_data");
      console.log("🧹 Cleared invalid auth token");
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  }

  /**
   * Handle successful response
   */
  private handleResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      success: true,
      data: response.data,
    };
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    includeAuth: boolean = true,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const requestConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          ...config?.headers,
          ...(includeAuth ? {} : { "exclude-auth": "true" }),
        },
      };

      const response = await this.axiosInstance.get<T>(endpoint, requestConfig);
      return this.handleResponse(response);
    } catch (error) {
      console.error("GET Request Error:", error);
      throw error;
    }
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    includeAuth: boolean = true,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const requestConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          ...config?.headers,
          ...(includeAuth ? {} : { "exclude-auth": "true" }),
        },
      };

      const response = await this.axiosInstance.post<T>(
        endpoint,
        data,
        requestConfig
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error("POST Request Error:", error);
      throw error;
    }
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    includeAuth: boolean = true,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const requestConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          ...config?.headers,
          ...(includeAuth ? {} : { "exclude-auth": "true" }),
        },
      };

      const response = await this.axiosInstance.put<T>(
        endpoint,
        data,
        requestConfig
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error("PUT Request Error:", error);
      throw error;
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    includeAuth: boolean = true,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const requestConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          ...config?.headers,
          ...(includeAuth ? {} : { "exclude-auth": "true" }),
        },
      };

      const response = await this.axiosInstance.delete<T>(
        endpoint,
        requestConfig
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error("DELETE Request Error:", error);
      throw error;
    }
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    includeAuth: boolean = true,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const requestConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          ...config?.headers,
          ...(includeAuth ? {} : { "exclude-auth": "true" }),
        },
      };

      const response = await this.axiosInstance.patch<T>(
        endpoint,
        data,
        requestConfig
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error("PATCH Request Error:", error);
      throw error;
    }
  }

  /**
   * Upload file with form data
   */
  async uploadFile<T>(
    endpoint: string,
    formData: FormData,
    includeAuth: boolean = true,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(includeAuth ? {} : { "exclude-auth": "true" }),
        },
        onUploadProgress,
      };

      const response = await this.axiosInstance.post<T>(
        endpoint,
        formData,
        config
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error("File Upload Error:", error);
      throw error;
    }
  }

  /**
   * Get axios instance for advanced usage
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * Update base URL (useful for switching environments)
   */
  updateBaseURL(newBaseURL: string): void {
    this.axiosInstance.defaults.baseURL = newBaseURL;
  }

  /**
   * Update timeout
   */
  updateTimeout(timeout: number): void {
    this.axiosInstance.defaults.timeout = timeout;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
