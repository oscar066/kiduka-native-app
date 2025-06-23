// src/screens/auth/RegisterScreen.tsx
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
import { authService, RegisterData } from "../../services";

// A good practice for keyboard offset
const KEYBOARD_VERTICAL_OFFSET = Platform.OS === "ios" ? 64 : 0;

interface RegisterScreenProps {
  onRegister: (user: any) => void;
  onNavigateToLogin: () => void;
  onBack: () => void;
}

interface FormErrors {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegister,
  onNavigateToLogin,
  onBack,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const updateFormData = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (formData.username.length > 50) {
      newErrors.username = "Username must be less than 50 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation (matches backend requirements)
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (formData.password.length > 100) {
      newErrors.password = "Password must be less than 100 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({}); // Clear any previous errors

    try {
      console.log("Attempting registration for:", formData.username);

      // Prepare data to match backend UserCreate schema
      const registerData: RegisterData = {
        full_name: formData.fullName.trim(),
        username: formData.username.trim().toLowerCase(), // Ensure lowercase for consistency
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      // Step 1: Register the user (returns UserResponse, not AuthResponse)
      const userResponse = await authService.register(registerData);
      console.log("Registration successful for:", userResponse.username);

      // Step 2: Automatically log in the user after successful registration
      const loginResponse = await authService.login({
        username_or_email: registerData.username,
        password: registerData.password,
      });

      // Step 3: Handle the successful login
      if (loginResponse.user) {
        console.log("Auto-login successful for:", loginResponse.user.username);

        Alert.alert(
          "Account Created Successfully! 🎉",
          "Welcome to Kiduka! You can now start analyzing your soil and improving your farm's productivity.",
          [
            {
              text: "Get Started",
              onPress: () => onRegister(loginResponse.user),
            },
          ]
        );
      } else {
        // Fallback if user data not returned
        const user = await authService.getCurrentUser();
        if (user) {
          onRegister(user);
        } else {
          throw new Error("Unable to complete registration process");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);

      // Extract meaningful error message
      let errorMessage = "Registration failed. Please try again.";

      if (error && typeof error === "object") {
        if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message;
        } else if ("detail" in error && typeof error.detail === "string") {
          errorMessage = error.detail;
        }
      }

      // Show user-friendly error messages
      if (
        errorMessage.includes("User with this email or username already exists")
      ) {
        errorMessage =
          "An account with this email or username already exists. Please try logging in or use different credentials.";
      } else if (errorMessage.includes("validation")) {
        errorMessage = "Please check your information and try again.";
      } else if (errorMessage.includes("Network error")) {
        errorMessage =
          "Network connection problem. Please check your internet connection.";
      }

      Alert.alert("Registration Failed", errorMessage, [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFieldError = (field: keyof FormErrors) => {
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
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              disabled={isLoading}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={Colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Create Account 🌱</Text>
            <Text style={styles.welcomeSubtitle}>
              Join thousands of farmers improving their soil health
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) => {
                updateFormData("fullName")(text);
                clearFieldError("fullName");
              }}
              error={errors.fullName}
              leftIcon="person-outline"
              editable={!isLoading}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <Input
              label="Username"
              placeholder="Choose a unique username"
              value={formData.username}
              onChangeText={(text) => {
                // Remove spaces and convert to lowercase automatically
                const cleanText = text.replace(/\s/g, "").toLowerCase();
                updateFormData("username")(cleanText);
                clearFieldError("username");
              }}
              error={errors.username}
              leftIcon="at-outline"
              editable={!isLoading}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Email"
              placeholder="Enter your email address"
              value={formData.email}
              onChangeText={(text) => {
                updateFormData("email")(text);
                clearFieldError("email");
              }}
              keyboardType="email-address"
              error={errors.email}
              leftIcon="mail-outline"
              editable={!isLoading}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Password"
              placeholder="Create a strong password (8+ characters)"
              value={formData.password}
              onChangeText={(text) => {
                updateFormData("password")(text);
                clearFieldError("password");
                // Also clear confirm password error if passwords now match
                if (
                  formData.confirmPassword &&
                  text === formData.confirmPassword
                ) {
                  clearFieldError("confirmPassword");
                }
              }}
              secureTextEntry={true}
              error={errors.password}
              leftIcon="lock-closed-outline"
              editable={!isLoading}
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(text) => {
                updateFormData("confirmPassword")(text);
                clearFieldError("confirmPassword");
              }}
              secureTextEntry={true}
              error={errors.confirmPassword}
              leftIcon="lock-closed-outline"
              editable={!isLoading}
            />

            <Button
              title={isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              size="lg"
              style={styles.registerButton}
            />
          </View>

          {/* Login Section */}
          <View style={styles.loginSection}>
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text
                style={[styles.loginLink, isLoading && { opacity: 0.5 }]}
                onPress={isLoading ? undefined : onNavigateToLogin}
              >
                Login
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
  registerButton: {
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  loginSection: {
    alignItems: "center",
  },
  loginText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
  },
  loginLink: {
    color: Colors.primary.green,
    fontFamily: Fonts.families.roboto.medium,
  },
});
