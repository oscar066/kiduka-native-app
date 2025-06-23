// src/constants/api.ts

export const API_CONFIG = {
  // backend URL
  BASE_URL: "http://192.168.1.71:8000", // actual backend URL
  timeout: 30000, // 30 seconds
  
  endpoints: {
    auth: {
      login: "/auth/login",           // POST - expects JSON body with username_or_email & password
      register: "/auth/register",     // POST - expects JSON body with user data
      profile: "/auth/me",            // GET, PUT, DELETE - for user profile operations
      changePassword: "/auth/change-password", // POST - for password changes
      // Note: No logout endpoint in backend
    },
    predictions: {
      predict: "/predict",            // POST - for making soil analysis predictions
      history: "/predictions",        // GET - for prediction history with pagination
      details: "/predictions",        // GET /:id - for specific prediction details
      delete: "/predictions",         // DELETE /:id - for deleting predictions
    },
    health: "/health",                // GET - health check
  },
} as const;

// For development/testing 
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper to check if we're in development mode
export const isDevelopment = __DEV__;

// API timeout configurations for different operations

export const TIMEOUTS = {
  DEFAULT: 30000,    // 30s for normal requests
  UPLOAD: 60000,     // 60s for file uploads
  PREDICTION: 45000, // 45s for predictions (might take longer)
} as const;