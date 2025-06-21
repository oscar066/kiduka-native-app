// src/utils/storage.ts - Storage utilities
import AsyncStorage from "@react-native-async-storage/async-storage";

export class StorageService {
  // Onboarding
  static async setHasSeenOnboarding(value: boolean): Promise<void> {
    await AsyncStorage.setItem("hasSeenOnboarding", JSON.stringify(value));
  }

  static async getHasSeenOnboarding(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem("hasSeenOnboarding");
      return value ? JSON.parse(value) : false;
    } catch {
      return false;
    }
  }

  // App preferences
  static async setAppPreferences(
    preferences: Record<string, any>
  ): Promise<void> {
    await AsyncStorage.setItem("appPreferences", JSON.stringify(preferences));
  }

  static async getAppPreferences(): Promise<Record<string, any>> {
    try {
      const value = await AsyncStorage.getItem("appPreferences");
      return value ? JSON.parse(value) : {};
    } catch {
      return {};
    }
  }

  // Clear all data
  static async clearAll(): Promise<void> {
    await AsyncStorage.clear();
  }
}
