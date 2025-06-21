// src/types/navigation.ts
import { SoilData, SoilAnalysisResult } from "./soil";


export type RootStackParamList = {
  // Onboarding
  Splash: undefined;
  Onboarding: undefined;

  // Authentication
  Login: undefined;
  Register: undefined;

  // Main App
  Main: undefined;
  Dashboard: undefined;

  // Soil Analysis Flow
  SoilInput: undefined;
  NutrientsInput: { soilData: Partial<SoilData> };
  TraceElements: { soilData: Partial<SoilData> };
  AnalysisLoading: { soilData: SoilData };

  // Results
  ResultsOverview: { results: SoilAnalysisResult };
  ResultsDetail: { results: SoilAnalysisResult };

  // Other
  Profile: undefined;
  History: undefined;
  AgrovetLocator: { fertilizer?: string };
};
