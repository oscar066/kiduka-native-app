// src/screens/auth/LoginScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/buttons/button";
import { Input } from "../../components/ui/inputs/input";
import { Colors, Fonts, Layout } from "../../constants";
import { authService, LoginCredentials } from "../../services";

// A good practice for keyboard offset if you have a standard header
const KEYBOARD_VERTICAL_OFFSET = Platform.OS === "ios" ? 64 : 0;

interface LoginScreenProps {
  onLogin: (user: any) => void;
  onNavigateToRegister: () => void;
  onContinueAsGuest: () => void;
  onBack: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onNavigateToRegister,
  onContinueAsGuest,
  onBack,
}) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    usernameOrEmail?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: { usernameOrEmail?: string; password?: string } = {};

    if (!usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = "Email or username is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({}); // Clear any previous errors

    try {
      console.log("Attempting login with:", usernameOrEmail);

      const credentials: LoginCredentials = {
        username_or_email: usernameOrEmail.trim(), // Matches backend schema
        password,
      };

      const authResponse = await authService.login(credentials);

      // Handle user data properly
      if (authResponse.user) {
        console.log("Login successful, user:", authResponse.user.username);
        onLogin(authResponse.user);
      } else {
        // Fallback: try to fetch user data separately if not returned
        console.log("No user data in auth response, fetching separately...");
        const user = await authService.getCurrentUser();
        if (user) {
          console.log("User data fetched successfully:", user.username);
          onLogin(user);
        } else {
          throw new Error("Unable to get user information after login");
        }
      }
    } catch (error) {
      console.error("Login error:", error);

      // Extract meaningful error message
      let errorMessage = "Please check your credentials and try again.";

      if (error && typeof error === "object") {
        if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message;
        } else if ("detail" in error && typeof error.detail === "string") {
          errorMessage = error.detail;
        }
      }

      // Show user-friendly error messages
      if (errorMessage.includes("Incorrect username/email or password")) {
        errorMessage = "Invalid username/email or password. Please try again.";
      } else if (errorMessage.includes("Account is deactivated")) {
        errorMessage =
          "Your account has been deactivated. Please contact support.";
      } else if (errorMessage.includes("Network error")) {
        errorMessage =
          "Network connection problem. Please check your internet connection.";
      }

      Alert.alert("Login Failed", errorMessage, [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Please contact support to reset your password.",
      [{ text: "OK" }]
    );
  };

  const clearFieldError = (field: "usernameOrEmail" | "password") => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="dark" backgroundColor={Colors.background.primary} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={Colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome Back! 🌾</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to continue analyzing your soil
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Input
              label="Email or Username"
              placeholder="Enter your email or username"
              value={usernameOrEmail}
              onChangeText={(text) => {
                setUsernameOrEmail(text);
                clearFieldError("usernameOrEmail");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.usernameOrEmail}
              leftIcon="person-outline"
              editable={!isLoading}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                clearFieldError("password");
              }}
              secureTextEntry={true}
              error={errors.password}
              leftIcon="lock-closed-outline"
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            <Button
              title={isLoading ? "LOGGING IN..." : "LOGIN"}
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              size="lg"
              style={styles.loginButton}
            />
            <Button
              title="Continue as Guest"
              onPress={onContinueAsGuest}
              variant="outline"
              size="lg"
              style={styles.guestButton}
              disabled={isLoading}
            />
          </View>

          {/* Sign Up Section */}
          <View style={styles.signUpSection}>
            <Text style={styles.signUpText}>
              Don't have an account?{" "}
              <Text
                style={[styles.signUpLink, isLoading && { opacity: 0.5 }]}
                onPress={isLoading ? undefined : onNavigateToRegister}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Layout.spacing.xl,
  },
  header: {
    paddingBottom: Layout.spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.card,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: Layout.spacing["2xl"],
  },
  welcomeTitle: {
    fontSize: Fonts.sizes["3xl"],
    fontFamily: Fonts.families.poppins.bold,
    color: Colors.text.primary,
    textAlign: "center",
    marginBottom: Layout.spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: Fonts.sizes.base * Fonts.lineHeights.relaxed,
  },
  formSection: {
    marginBottom: Layout.spacing.xl,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: Layout.spacing.xl,
  },
  forgotPasswordText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.primary.green,
  },
  loginButton: {
    marginBottom: Layout.spacing.lg,
  },
  guestButton: {
    marginBottom: Layout.spacing.lg,
  },
  signUpSection: {
    alignItems: "center",
  },
  signUpText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
  },
  signUpLink: {
    color: Colors.primary.green,
    fontFamily: Fonts.families.roboto.medium,
  },
});
