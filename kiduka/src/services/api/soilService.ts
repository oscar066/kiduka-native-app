// src/services/api/soilService.ts
import { API_CONFIG } from "../../constants/api";
import { SoilAnalysisResult, SoilData } from "../../types/soil";
import { apiClient } from "./client";
import AsyncStorage from '@react-native-async-storage/async-storage';

class SoilService {
  /**
   * Analyze soil data
   */
  async analyzeSoil(soilData: SoilData): Promise<SoilAnalysisResult> {
    try {
      const response = await apiClient.post<SoilAnalysisResult>(
        API_CONFIG.endpoints.soil.analyze,
        soilData
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error("Failed to analyze soil data");
    } catch (error) {
      console.error("Soil analysis error:", error);
      throw error;
    }
  }

  /**
   * Get soil analysis history
   */
  async getAnalysisHistory(
    page: number = 1,
    limit: number = 10
  ): Promise<SoilAnalysisResult[]> {
    try {
      const response = await apiClient.get<SoilAnalysisResult[]>(
        `${API_CONFIG.endpoints.soil.history}?page=${page}&limit=${limit}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error("Error fetching analysis history:", error);
      throw error;
    }
  }

  /**
   * Get detailed analysis by ID
   */
  async getAnalysisById(id: string): Promise<SoilAnalysisResult | null> {
    try {
      const response = await apiClient.get<SoilAnalysisResult>(
        `${API_CONFIG.endpoints.soil.details}/${id}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error("Error fetching analysis details:", error);
      throw error;
    }
  }

  /**
   * Save analysis as draft
   */
  async saveDraft(soilData: Partial<SoilData>): Promise<boolean> {
    try {
      // This would save to local storage or send to API for draft saving
      await AsyncStorage.setItem(
        "soil_analysis_draft",
        JSON.stringify(soilData)
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
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  }
}

export const soilService = new SoilService();
