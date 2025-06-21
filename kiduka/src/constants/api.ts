// src/constants/api.ts

export const API_CONFIG = {
  // Base URL - replace with your actual API endpoint
  BASE_URL: __DEV__
    ? "http://localhost:8000" // Development
    : "https://your-production-api.com", // Production

  // API Endpoints
  endpoints: {
    auth: {
      login: "/auth/login",
      register: "/auth/register",
      refresh: "/auth/refresh",
      logout: "/auth/logout",
    },
    soil: {
      analyze: "/predict",
      history: "/predictions/history",
      details: "/predictions",
    },
    agrovets: "/agrovets/nearby",
  },

  // Request Configuration
  timeout: 30000, // 30 seconds
  retries: 3,
} as const;
