// app/index.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreenExpo from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";

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

// Import the screens for auth flow
import { LoginScreen } from "../src/screens/auth/loginScreen";
import { RegisterScreen } from "../src/screens/auth/registerScreen";
import { OnboardingScreen } from "../src/screens/onboarding/onboardingScreen";
import { SplashScreen } from "../src/screens/splashScreen";

// Import navigation
import { MainNavigator } from "../src/navigation/mainNavigation";

// Import basic types and services
import { RootStackParamList } from "../src/types/navigation";
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

  const handleSignOut = async () => {
    try {
      // Clear any stored authentication data
      // await authService.signOut(); // Uncomment when you have auth service
      setUser(null);
      setAppState("auth");
      console.log("User signed out");
    } catch (error) {
      console.error("Sign out error:", error);
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

  // Show main app with navigation
  if (appState === "main") {
    return <MainNavigator user={user} onSignOut={handleSignOut} />;
  }

  // Show authentication/onboarding flow
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
      <Stack.Screen
        name="Login"
        options={{ title: "Login", headerShown: false }}
      >
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

      <Stack.Screen
        name="Register"
        options={{ title: "Register", headerShown: false }}
      >
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
  );
}
