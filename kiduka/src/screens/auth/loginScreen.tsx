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
import { Button } from "../../components/ui/buttons/button";
import { Input } from "../../components/ui/inputs/input";
import { Colors, Fonts, Layout } from "../../constants";
import { authService, LoginCredentials } from "../../services";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email or username is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const credentials: LoginCredentials = {
        username: email, // Backend expects username field
        password,
      };

      const authResponse = await authService.login(credentials);
      onLogin(authResponse.user);
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Failed",
        error instanceof Error
          ? error.message
          : "Please check your credentials and try again.",
        [{ text: "OK" }]
      );
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" backgroundColor={Colors.background.primary} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
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
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
            leftIcon="person-outline"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            error={errors.password}
            leftIcon="lock-closed-outline"
          />

          <TouchableOpacity
            onPress={handleForgotPassword}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="LOGIN"
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
          />
        </View>

        {/* Sign Up Section */}
        <View style={styles.signUpSection}>
          <Text style={styles.signUpText}>
            Don't have an account?{" "}
            <Text style={styles.signUpLink} onPress={onNavigateToRegister}>
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Layout.spacing.xl,
  },
  header: {
    paddingTop: Layout.safeArea.top,
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
    paddingBottom: Layout.safeArea.bottom,
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
