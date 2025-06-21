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
import { Button } from "../../components/ui/buttons/button";
import { Input } from "../../components/ui/inputs/input";
import { Colors, Fonts, Layout } from "../../constants";
import { authService, RegisterData } from "../../services";

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

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
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
    try {
      const registerData: RegisterData = {
        full_name: formData.fullName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const authResponse = await authService.register(registerData);

      Alert.alert(
        "Account Created Successfully!",
        "Welcome to Kiduka. You can now start analyzing your soil.",
        [
          {
            text: "Get Started",
            onPress: () => onRegister(authResponse.user),
          },
        ]
      );
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert(
        "Registration Failed",
        error instanceof Error ? error.message : "Please try again later.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
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
            onChangeText={updateFormData("fullName")}
            error={errors.fullName}
            leftIcon="person-outline"
          />

          <Input
            label="Username"
            placeholder="Choose a username"
            value={formData.username}
            onChangeText={updateFormData("username")}
            error={errors.username}
            leftIcon="at-outline"
          />

          <Input
            label="Email"
            placeholder="Enter your email address"
            value={formData.email}
            onChangeText={updateFormData("email")}
            keyboardType="email-address"
            error={errors.email}
            leftIcon="mail-outline"
          />

          <Input
            label="Password"
            placeholder="Create a strong password"
            value={formData.password}
            onChangeText={updateFormData("password")}
            secureTextEntry={true}
            error={errors.password}
            leftIcon="lock-closed-outline"
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={updateFormData("confirmPassword")}
            secureTextEntry={true}
            error={errors.confirmPassword}
            leftIcon="lock-closed-outline"
          />

          <Button
            title="CREATE ACCOUNT"
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
            <Text style={styles.loginLink} onPress={onNavigateToLogin}>
              Login
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
  registerButton: {
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  loginSection: {
    alignItems: "center",
    paddingBottom: Layout.safeArea.bottom,
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
