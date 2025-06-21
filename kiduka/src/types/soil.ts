// src/types/soil.ts
export interface SoilData {
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

export interface SoilAnalysisResult {
  soil_fertility_status: string;
  soil_fertility_confidence: number;
  fertilizer_recommendation: string;
  fertilizer_confidence: number;
  nearest_agrovets: AgrovetInfo[];
  structured_response?: StructuredResponse;
  prediction_id?: string;
  timestamp: string;
}

export interface AgrovetInfo {
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
}

export interface StructuredResponse {
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