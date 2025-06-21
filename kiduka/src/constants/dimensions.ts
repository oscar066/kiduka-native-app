// src/constants/dimensions.ts
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const Layout = {
  screen: {
    width,
    height,
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
  },

  // Border Radius
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 999,
  },

  // Component Dimensions
  button: {
    height: 48,
    heightSm: 36,
    heightLg: 56,
  },

  input: {
    height: 48,
    heightSm: 36,
  },

  header: {
    height: 60,
  },

  tabBar: {
    height: 60,
  },

  // Safe Areas (adjust based on your needs)
  safeArea: {
    top: 44,
    bottom: 34,
  },
} as const;
