// src/services/api/soilService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SoilAnalysisResult, SoilData } from "../../types/soil";
import { apiClient } from "./client";

// Backend request/response types (exactly matching backend schema)
export interface BackendSoilData {
  simplified_texture: string;
  ph: number;
  n: number; // Nitrogen
  p: number; // Phosphorus
  k: number; // Potassium
  o: number; // Organic matter
  ca: number; // Calcium
  mg: number; // Magnesium
  cu: number; // Copper
  fe: number; // Iron
  zn: number; // Zinc
  latitude: number;
  longitude: number;
}

export interface BackendPredictionResponse {
  soil_fertility_status: string;
  soil_fertility_confidence: number;
  fertilizer_recommendation: string;
  fertilizer_confidence: number;
  nearest_agrovets: BackendAgrovetInfo[];
  structured_response?: BackendStructuredResponse;
  prediction_id?: string;
  timestamp: string;
}

export interface BackendAgrovetInfo {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  products: string[];
  prices: number[];
  distance_km: number;
  address?: string;
  phone?: string;
  email?: string;
  rating?: number;
  services?: string[];
}

export interface BackendStructuredResponse {
  explanation: {
    summary: string;
    fertility_analysis: string;
    nutrient_analysis: string;
    ph_analysis: string;
    soil_texture_analysis: string;
    overall_assessment: string;
  };
  recommendations: Array<{
    category: string;
    priority: string;
    action: string;
    reasoning: string;
    timeframe: string;
  }>;
  fertilizer_justification: string;
  confidence_assessment: string;
  long_term_strategy: string;
}

export interface BackendPredictionHistory {
  id: string;
  user_id: string;
  simplified_texture?: string;
  soil_ph?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  organic_matter?: number;
  calcium?: number;
  magnesium?: number;
  copper?: number;
  iron?: number;
  zinc?: number;
  location_lat?: number;
  location_lng?: number;
  location_name?: string;
  fertility_prediction?: string;
  fertility_confidence?: number;
  fertilizer_recommendation?: string;
  fertilizer_confidence?: number;
  structured_response?: BackendStructuredResponse;
  agrovets: BackendAgrovetInfo[];
  created_at: string;
  updated_at: string;
}

export interface BackendPredictionListResponse {
  predictions: BackendPredictionHistory[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

class SoilService {
  /**
   * Analyze soil data - POST /predict endpoint
   */
  async analyzeSoil(soilData: SoilData): Promise<SoilAnalysisResult> {
    try {
      console.log("Starting soil analysis for:", soilData.simplified_texture);

      // Convert frontend SoilData to backend format (exact match)
      const backendData: BackendSoilData = {
        simplified_texture: soilData.simplified_texture,
        ph: soilData.ph,
        n: soilData.n,
        p: soilData.p,
        k: soilData.k,
        o: soilData.o,
        ca: soilData.ca,
        mg: soilData.mg,
        cu: soilData.cu,
        fe: soilData.fe,
        zn: soilData.zn,
        latitude: soilData.latitude,
        longitude: soilData.longitude,
      };

      console.log("Sending data to backend:", backendData);

      const response = await apiClient.post<BackendPredictionResponse>(
        "/predict", // Backend endpoint is /predict at root level
        backendData,
        true // Include auth token
      );

      if (response.success && response.data) {
        console.log(
          "Analysis successful:",
          response.data.soil_fertility_status
        );

        // Convert backend response to frontend format
        const result: SoilAnalysisResult = {
          soil_fertility_status: response.data.soil_fertility_status,
          soil_fertility_confidence: response.data.soil_fertility_confidence,
          fertilizer_recommendation: response.data.fertilizer_recommendation,
          fertilizer_confidence: response.data.fertilizer_confidence,
          nearest_agrovets: response.data.nearest_agrovets.map(
            this.convertAgrovetInfo
          ),
          structured_response: response.data.structured_response,
          prediction_id: response.data.prediction_id,
          timestamp: response.data.timestamp,
        };

        return result;
      }

      throw new Error("Failed to analyze soil data - no response data");
    } catch (error) {
      console.error("Soil analysis error:", error);

      // Extract meaningful error message
      let errorMessage = "Failed to analyze soil data";
      if (error && typeof error === "object") {
        if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message;
        } else if ("detail" in error && typeof error.detail === "string") {
          errorMessage = error.detail;
        }
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Get soil analysis history - GET /predictions endpoint
   */
  async getAnalysisHistory(
    page: number = 1,
    size: number = 10,
    sortBy: string = "created_at",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<{
    predictions: SoilAnalysisResult[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
  }> {
    try {
      console.log(`Fetching analysis history: page ${page}, size ${size}`);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      const response = await apiClient.get<BackendPredictionListResponse>(
        `/predictions?${queryParams.toString()}`,
        true // Include auth token
      );

      if (response.success && response.data) {
        // Convert backend predictions to frontend format
        const predictions: SoilAnalysisResult[] = response.data.predictions.map(
          (pred) => ({
            soil_fertility_status: pred.fertility_prediction || "Unknown",
            soil_fertility_confidence: pred.fertility_confidence || 0,
            fertilizer_recommendation:
              pred.fertilizer_recommendation || "No recommendation",
            fertilizer_confidence: pred.fertilizer_confidence || 0,
            nearest_agrovets: pred.agrovets?.map(this.convertAgrovetInfo) || [],
            structured_response: pred.structured_response,
            prediction_id: pred.id,
            timestamp: pred.created_at,
          })
        );

        return {
          predictions,
          total: response.data.total,
          page: response.data.page,
          size: response.data.size,
          totalPages: response.data.pages,
        };
      }

      return {
        predictions: [],
        total: 0,
        page: 1,
        size: 10,
        totalPages: 0,
      };
    } catch (error) {
      console.error("Error fetching analysis history:", error);
      throw error;
    }
  }

  /**
   * Get detailed analysis by ID - GET /predictions/{prediction_id} endpoint
   */
  async getAnalysisById(id: string): Promise<SoilAnalysisResult | null> {
    try {
      console.log("Fetching analysis details for ID:", id);

      const response = await apiClient.get<BackendPredictionHistory>(
        `/predictions/${id}`,
        true // Include auth token
      );

      if (response.success && response.data) {
        // Convert backend prediction to frontend format
        const result: SoilAnalysisResult = {
          soil_fertility_status:
            response.data.fertility_prediction || "Unknown",
          soil_fertility_confidence: response.data.fertility_confidence || 0,
          fertilizer_recommendation:
            response.data.fertilizer_recommendation || "No recommendation",
          fertilizer_confidence: response.data.fertilizer_confidence || 0,
          nearest_agrovets:
            response.data.agrovets?.map(this.convertAgrovetInfo) || [],
          structured_response: response.data.structured_response,
          prediction_id: response.data.id,
          timestamp: response.data.created_at,
        };

        return result;
      }

      return null;
    } catch (error) {
      console.error("Error fetching analysis details:", error);
      throw error;
    }
  }

  /**
   * Delete analysis - DELETE /predictions/{prediction_id} endpoint
   */
  async deleteAnalysis(id: string): Promise<boolean> {
    try {
      console.log("Deleting analysis:", id);

      const response = await apiClient.delete(
        `/predictions/${id}`,
        true // Include auth token
      );

      return response.success;
    } catch (error) {
      console.error("Error deleting analysis:", error);
      throw error;
    }
  }

  /**
   * Convert backend agrovet info to frontend format
   */
  private convertAgrovetInfo = (backendAgrovet: BackendAgrovetInfo) => ({
    name: backendAgrovet.name,
    latitude: backendAgrovet.latitude,
    longitude: backendAgrovet.longitude,
    products: backendAgrovet.products || [],
    prices: backendAgrovet.prices || [],
    distance_km: backendAgrovet.distance_km,
    address: backendAgrovet.address,
    phone: backendAgrovet.phone,
    email: backendAgrovet.email,
    rating: backendAgrovet.rating,
  });

  /**
   * Save analysis as draft (local storage)
   */
  async saveDraft(soilData: Partial<SoilData>): Promise<boolean> {
    try {
      console.log("Saving soil analysis draft");

      await AsyncStorage.setItem(
        "soil_analysis_draft",
        JSON.stringify({
          ...soilData,
          timestamp: new Date().toISOString(),
        })
      );
      return true;
    } catch (error) {
      console.error("Error saving draft:", error);
      return false;
    }
  }

  /**
   * Load saved draft
   */
  async loadDraft(): Promise<Partial<SoilData> | null> {
    try {
      const draftData = await AsyncStorage.getItem("soil_analysis_draft");
      return draftData ? JSON.parse(draftData) : null;
    } catch (error) {
      console.error("Error loading draft:", error);
      return null;
    }
  }

  /**
   * Clear saved draft
   */
  async clearDraft(): Promise<void> {
    try {
      await AsyncStorage.removeItem("soil_analysis_draft");
      console.log("Draft cleared successfully");
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  }

  /**
   * Check if user is authenticated before making requests
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      return !!token;
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate soil data before sending to backend
   */
  validateSoilData(soilData: SoilData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!soilData.simplified_texture) {
      errors.push("Soil texture is required");
    }

    // Numeric validations
    if (soilData.ph < 0 || soilData.ph > 14) {
      errors.push("pH must be between 0 and 14");
    }

    if (soilData.n < 0) errors.push("Nitrogen cannot be negative");
    if (soilData.p < 0) errors.push("Phosphorus cannot be negative");
    if (soilData.k < 0) errors.push("Potassium cannot be negative");
    if (soilData.o < 0 || soilData.o > 100) {
      errors.push("Organic matter must be between 0 and 100%");
    }

    // Location validation
    if (soilData.latitude < -90 || soilData.latitude > 90) {
      errors.push("Invalid latitude");
    }
    if (soilData.longitude < -180 || soilData.longitude > 180) {
      errors.push("Invalid longitude");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get cache key for storing temporary analysis data
   */
  private getCacheKey(prefix: string): string {
    return `soil_service_${prefix}_${Date.now()}`;
  }
}

export const soilService = new SoilService();
