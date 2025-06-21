// src/services/index.ts
export { agrovetService } from "./api/agrovetService";
export { authService } from "./api/authService";
export { apiClient } from "./api/client";
export { soilService } from "./api/soilService";

// Re-export types for convenience
export type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
} from "./api/authService";
