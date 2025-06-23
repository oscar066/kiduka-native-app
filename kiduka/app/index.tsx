import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreenExpo from "expo-splash-screen";
import React, { useEffect, useState } from "react";

// Import Expo Google Fonts
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import {
  RobotoMono_400Regular,
  RobotoMono_500Medium,
} from "@expo-google-fonts/roboto-mono";

// Import the screens
import { AnalysisLoadingScreen } from "../src/screens/analysis/analysisLoadingScreen";
import { NutrientsInputScreen } from "../src/screens/analysis/nutrientsInputScreen";
import { SoilInputScreen } from "../src/screens/analysis/soil-inputScreen";
import { TraceElementsScreen } from "../src/screens/analysis/traceElementsScreen";
import { LoginScreen } from "../src/screens/auth/loginScreen";
import { RegisterScreen } from "../src/screens/auth/registerScreen";
import { DashboardScreen } from "../src/screens/dashboard/dashboardScreen";
import { OnboardingScreen } from "../src/screens/onboarding/onboardingScreen";
import { ResultsOverviewScreen } from "../src/screens/results/resultsOverviewScreen";
import { SplashScreen } from "../src/screens/splashScreen";

// Import basic types and services
import { Text, View } from "react-native";
import { RootStackParamList } from "../src/types/navigation";
import { SoilData } from "../src/types/soil";
import { User } from "../src/types/user";
import { StorageService } from "../src/utils/storage";

// Prevent splash screen from auto-hiding
SplashScreenExpo.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

type AppState = "loading" | "onboarding" | "auth" | "main";

export default function App() {
  // State management
  const [appState, setAppState] = useState<AppState>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [soilData, setSoilData] = useState<Partial<SoilData>>({});

  // Load fonts using Expo Google Fonts
  const [fontsLoaded, fontError] = useFonts({
    // Poppins fonts
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,

    // Roboto fonts
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,

    // Roboto Mono fonts
    RobotoMono_400Regular,
    RobotoMono_500Medium,
  });

  // Initialize app when fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      initializeApp();
    }
  }, [fontsLoaded, fontError]);

  const initializeApp = async () => {
    try {
      console.log("Initializing app...");

      // Check if user has seen onboarding
      const hasSeenOnboarding = await StorageService.getHasSeenOnboarding();

      if (hasSeenOnboarding) {
        setAppState("auth"); // Go straight to auth if onboarding was seen
      } else {
        setAppState("onboarding"); // Show onboarding first
      }
    } catch (error) {
      console.error("App initialization error:", error);
      setAppState("onboarding"); // Default to onboarding on error
    } finally {
      // Hide splash screen
      await SplashScreenExpo.hideAsync();
    }
  };

  // Show loading until fonts are ready
  if (!fontsLoaded && !fontError) {
    return null; // Expo splash screen will show
  }

  // Show font error if fonts failed to load
  if (fontError) {
    console.error("Font loading error:", fontError);
    // Still continue to app even if fonts fail
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Loading/Splash Screen */}
      {appState === "loading" && (
        <Stack.Screen name="Splash">
          {() => <SplashScreen onFinish={() => setAppState("onboarding")} />}
        </Stack.Screen>
      )}

      {/* Onboarding Screen */}
      {appState === "onboarding" && (
        <Stack.Screen name="Onboarding">
          {() => (
            <OnboardingScreen
              onComplete={async () => {
                await StorageService.setHasSeenOnboarding(true);
                setAppState("auth");
              }}
              onSkip={async () => {
                await StorageService.setHasSeenOnboarding(true);
                setAppState("auth");
              }}
            />
          )}
        </Stack.Screen>
      )}

      {/* Auth Screens */}
      {appState === "auth" && (
        <>
          <Stack.Screen name="Login" options={{ title: "Login" ,headerShown: false}}>
            {({ navigation }) => (
              <LoginScreen
                onLogin={(user) => {
                  setUser(user);
                  setAppState("main");
                }}
                onNavigateToRegister={() => navigation.navigate("Register")}
                onContinueAsGuest={() => setAppState("main")}
                onBack={() => setAppState("onboarding")}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Register" options={{ title: "Register" ,headerShown: false}}>
            {({ navigation }) => (
              <RegisterScreen
                onRegister={(user) => {
                  setUser(user);
                  setAppState("main");
                }}
                onNavigateToLogin={() => navigation.navigate("Login")}
                onBack={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>
        </>
      )}

      {/* Main App Screens */}
      {appState === "main" && (
        <>
          {/* Dashboard - Main Landing Screen */}
          <Stack.Screen name="Dashboard">
            {({ navigation }) => (
              <DashboardScreen
                user={user}
                onStartAnalysis={() => navigation.navigate("SoilInput")}
                onViewReports={() => {
                  // Navigate to reports screen (to be implemented)
                  console.log("Navigate to reports");
                }}
                onFindAgrovets={() => {
                  // Navigate to agrovet locator (to be implemented)
                  console.log("Navigate to agrovets");
                }}
                onViewAnalysisDetail={(analysis) => {
                  navigation.navigate("ResultsOverview", { results: analysis });
                }}
                onOpenProfile={() => {
                  // Navigate to profile (to be implemented)
                  console.log("Open profile");
                }}
                onOpenNotifications={() => {
                  // Navigate to notifications (to be implemented)
                  console.log("Open notifications");
                }}
              />
            )}
          </Stack.Screen>

          {/* Soil Analysis Flow */}
          <Stack.Screen name="SoilInput">
            {({ navigation }) => (
              <SoilInputScreen
                onNext={(data) => {
                  setSoilData(data);
                  navigation.navigate("NutrientsInput", { soilData: data });
                }}
                onBack={() => navigation.navigate("Dashboard")}
                initialData={soilData}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="NutrientsInput">
            {({ navigation, route }) => (
              <NutrientsInputScreen
                onNext={(data) => {
                  setSoilData(data);
                  navigation.navigate("TraceElements", { soilData: data });
                }}
                onBack={() => navigation.goBack()}
                initialData={route.params?.soilData || soilData}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="TraceElements">
            {({ navigation, route }) => (
              <TraceElementsScreen
                onAnalyze={(data) => {
                  setSoilData(data);
                  navigation.navigate("AnalysisLoading", { soilData: data });
                }}
                onBack={() => navigation.goBack()}
                initialData={route.params?.soilData || soilData}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="AnalysisLoading">
            {({ navigation, route }) => (
              <AnalysisLoadingScreen
                soilData={route.params.soilData}
                onComplete={(results) => {
                  navigation.replace("ResultsOverview", { results });
                }}
                onCancel={() => navigation.navigate("Dashboard")}
              />
            )}
          </Stack.Screen>

          {/* Results Screens */}
          <Stack.Screen name="ResultsOverview">
            {({ navigation, route }) => (
              <ResultsOverviewScreen
                results={route.params.results}
                onBack={() => navigation.navigate("Dashboard")}
                onViewDetails={() => {
                  // Navigate to detailed results (to be implemented)
                  console.log("View detailed results");
                }}
                onFindAgrovets={() => {
                  // Navigate to agrovet locator with fertilizer filter
                  console.log(
                    "Find agrovets for:",
                    route.params.results.fertilizer_recommendation
                  );
                }}
                onSaveToFavorites={() => {
                  // Save to favorites (to be implemented)
                  console.log("Save to favorites");
                }}
              />
            )}
          </Stack.Screen>

          {/* Placeholder screens for future implementation */}
          <Stack.Screen name="Profile">
            {({ navigation }) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#F5F5F5",
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    fontSize: 24,
                    marginBottom: 10,
                    textAlign: "center",
                  }}
                >
                  👤 Profile Screen
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto_400Regular",
                    fontSize: 16,
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  User profile and settings will be implemented here
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto_400Regular",
                    fontSize: 14,
                    color: "#666",
                    textAlign: "center",
                  }}
                  onPress={() => navigation.goBack()}
                >
                  ← Back to Dashboard
                </Text>
              </View>
            )}
          </Stack.Screen>

          <Stack.Screen name="History">
            {({ navigation }) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#F5F5F5",
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    fontSize: 24,
                    marginBottom: 10,
                    textAlign: "center",
                  }}
                >
                  📊 Analysis History
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto_400Regular",
                    fontSize: 16,
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  Previous soil analysis reports will be shown here
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto_400Regular",
                    fontSize: 14,
                    color: "#666",
                    textAlign: "center",
                  }}
                  onPress={() => navigation.goBack()}
                >
                  ← Back to Dashboard
                </Text>
              </View>
            )}
          </Stack.Screen>

          <Stack.Screen name="AgrovetLocator">
            {({ navigation, route }) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#F5F5F5",
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    fontSize: 24,
                    marginBottom: 10,
                    textAlign: "center",
                  }}
                >
                  🏪 Agrovet Locator
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto_400Regular",
                    fontSize: 16,
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  Find nearby agrovets and fertilizer suppliers
                </Text>
                {route.params?.fertilizer && (
                  <Text
                    style={{
                      fontFamily: "Roboto_500Medium",
                      fontSize: 14,
                      color: "#2E7D32",
                      textAlign: "center",
                      marginBottom: 20,
                    }}
                  >
                    Recommended: {route.params.fertilizer}
                  </Text>
                )}
                <Text
                  style={{
                    fontFamily: "Roboto_400Regular",
                    fontSize: 14,
                    color: "#666",
                    textAlign: "center",
                  }}
                  onPress={() => navigation.goBack()}
                >
                  ← Back to Dashboard
                </Text>
              </View>
            )}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}
