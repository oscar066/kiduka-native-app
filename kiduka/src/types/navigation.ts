// src/types/navigation.ts

import { NavigationProp, RouteProp } from "@react-navigation/native";
import { SoilAnalysisResult, SoilData } from "./soil";

// Root Stack (Authentication Flow)
export type RootStackParamList = {
  // Onboarding
  Splash: undefined;
  Onboarding: undefined;

  // Authentication
  Login: undefined;
  Register: undefined;

  // Main App Entry Point
  Main: undefined;
};

// Main Drawer Navigator
export type DrawerParamList = {
  MainTabs: { user?: any };
  SoilAnalysisStack: { screen?: string; params?: any };
  Analytics: undefined;
  Settings: undefined;
  Help: undefined;
  Support: undefined;
  About: undefined;
};

// Bottom Tab Navigator
export type TabParamList = {
  Home: undefined;
  Reports: undefined;
  Scan: undefined;
  Shop: undefined;
  Profile: undefined;
};

// Soil Analysis Stack Navigator
export type SoilAnalysisStackParamList = {
  SoilInput: undefined;
  NutrientsInput: { soilData: Partial<SoilData> };
  TraceElements: { soilData: Partial<SoilData> };
  AnalysisLoading: { soilData: SoilData };
  ResultsOverview: { results: SoilAnalysisResult };
  ResultsDetail: { results: SoilAnalysisResult };
};

// Legacy support for existing screens (keeping for backward compatibility)
export type LegacyStackParamList = {
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

// Navigation prop types for type safety

export type DrawerNavigationProp = NavigationProp<DrawerParamList>;
export type TabNavigationProp = NavigationProp<TabParamList>;
export type SoilAnalysisNavigationProp =
  NavigationProp<SoilAnalysisStackParamList>;

// Route prop types
export type DrawerRouteProp<T extends keyof DrawerParamList> = RouteProp<
  DrawerParamList,
  T
>;
export type TabRouteProp<T extends keyof TabParamList> = RouteProp<
  TabParamList,
  T
>;
export type SoilAnalysisRouteProp<T extends keyof SoilAnalysisStackParamList> =
  RouteProp<SoilAnalysisStackParamList, T>;

// Combined navigation type for type safety
declare global {
  namespace ReactNavigation {
    interface RootParamList extends DrawerParamList {}
  }
}
