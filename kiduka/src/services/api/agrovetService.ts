// src/services/api/agrovetService.ts
import { API_CONFIG } from "../../constants/api";
import { AgrovetInfo } from "../../types/soil";
import { apiClient } from "./client";

interface AgrovetSearchParams {
  latitude: number;
  longitude: number;
  radius?: number; // in kilometers
  fertilizer_type?: string;
}

class AgrovetService {
  /**
   * Find nearby agrovets
   */
  async findNearbyAgrovets(
    params: AgrovetSearchParams
  ): Promise<AgrovetInfo[]> {
    try {
      const queryParams = new URLSearchParams({
        latitude: params.latitude.toString(),
        longitude: params.longitude.toString(),
        radius: (params.radius || 10).toString(),
        ...(params.fertilizer_type && {
          fertilizer_type: params.fertilizer_type,
        }),
      });

      const response = await apiClient.get<AgrovetInfo[]>(
        `${API_CONFIG.endpoints.agrovets}?${queryParams.toString()}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error("Error finding agrovets:", error);
      throw error;
    }
  }

  /**
   * Get agrovet details by ID
   */
  async getAgrovetDetails(id: string): Promise<AgrovetInfo | null> {
    try {
      const response = await apiClient.get<AgrovetInfo>(
        `${API_CONFIG.endpoints.agrovets}/${id}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error("Error fetching agrovet details:", error);
      throw error;
    }
  }
}

export const agrovetService = new AgrovetService();
