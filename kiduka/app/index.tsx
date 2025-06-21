// App.tsx - Main entry point
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreenExpo from "expo-splash-screen";
import React, { useEffect, useState } from "react";

// Import screens
import { SplashScreen } from "../src/screens/splashScreen";
import { AnalysisLoadingScreen } from "../src/screens/analysis/analysisLoadingScreen";
import { NutrientsInputScreen } from "../src/screens/analysis/nutrientsInputScreen";
import { SoilInputScreen } from "../src/screens/analysis/soil-inputScreen";
import { TraceElementsScreen } from "../src/screens/analysis/traceElementsScreen";
import { LoginScreen } from "../src/screens/auth/loginScreen";
import { RegisterScreen } from "../src/screens/auth/registerScreen";
import { DashboardScreen } from "../src/screens/dashboard/dashboardScreen";
import { OnboardingScreen } from "../src/screens/onboarding/onboardingScreen";
import { ResultsOverviewScreen } from "../src/screens/results/resultsOverviewScreen";

// Import services and types
import { authService } from "../src/services";
import { RootStackParamList } from "../src/types/navigation";
import { SoilData } from "../src/types/soil";
import { User } from "../src/types/user";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

import {
  RobotoMono_400Regular,
  RobotoMono_500Medium,
} from '@expo-google-fonts/roboto-mono';

const [fontsLoaded] = useFonts({
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  RobotoMono_400Regular,
  RobotoMono_500Medium,
});

// Prevent splash screen from auto-hiding
SplashScreenExpo.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

type AppState = "loading" | "onboarding" | "auth" | "main";

export default function App() {
  const [appState, setAppState] = useState<AppState>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [soilData, setSoilData] = useState<Partial<SoilData>>({});

  // Load fonts
 const [fontsLoaded] = useFonts({
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

  useEffect(() => {
    initializeApp();
  }, [fontsLoaded]);

  const initializeApp = async () => {
    if (!fontsLoaded) return;

    try {
      // Check authentication state
      const authState = await authService.getAuthState();

      // Check if user has seen onboarding (you can store this in AsyncStorage)
      // For now, we'll assume they haven't seen it
      const hasSeenOnboarding = false; // await AsyncStorage.getItem('hasSeenOnboarding');

      setUser(authState.user);
      setHasSeenOnboarding(!!hasSeenOnboarding);

      // Determine initial app state
      if (authState.isAuthenticated) {
        setAppState("main");
      } else if (hasSeenOnboarding) {
        setAppState("auth");
      } else {
        setAppState("onboarding");
      }
    } catch (error) {
      console.error("App initialization error:", error);
      setAppState("onboarding");
    } finally {
      // Hide splash screen
      await SplashScreenExpo.hideAsync();
    }
  };

  // Splash Screen Component
  const renderSplash = () => (
    <SplashScreen onFinish={() => setAppState("onboarding")} />
  );

  // Onboarding Navigator
  const renderOnboarding = () => (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding">
          {() => (
            <OnboardingScreen
              onComplete={() => setAppState("auth")}
              onSkip={() => setAppState("auth")}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  // Auth Navigator
  const renderAuth = () => (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login">
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

        <Stack.Screen name="Register">
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
      </Stack.Navigator>
    </NavigationContainer>
  );

  // Main App Navigator
  const renderMainApp = () => (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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

        <Stack.Screen name="SoilInput">
          {({ navigation }) => (
            <SoilInputScreen
              onNext={(data) => {
                setSoilData(data);
                navigation.navigate("NutrientsInput", { soilData: data });
              }}
              onBack={() => navigation.goBack()}
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
      </Stack.Navigator>
    </NavigationContainer>
  );

  // Render appropriate screen based on app state
  switch (appState) {
    case "loading":
      return renderSplash();
    case "onboarding":
      return renderOnboarding();
    case "auth":
      return renderAuth();
    case "main":
      return renderMainApp();
    default:
      return renderSplash();
  }
}
