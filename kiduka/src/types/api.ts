// src/types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code: string;
}

// Backend error response format (FastAPI style)
export interface BackendError {
  detail: string;
  type?: string;
}

// Validation error format (from Pydantic)
export interface ValidationError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

// Generic API request config
export interface ApiRequestConfig {
  timeout?: number;
  includeAuth?: boolean;
  headers?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}
