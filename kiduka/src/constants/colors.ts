// src/constants/colors.ts
export const Colors = {
  // Primary Colors (Agricultural Theme)
  primary: {
    green: "#2E7D32",
    secondary: "#4CAF50",
    accent: "#FF8F00",
  },

  // Background Colors
  background: {
    primary: "#F8F9FA",
    card: "#FFFFFF",
    overlay: "rgba(0, 0, 0, 0.5)",
  },

  // Text Colors
  text: {
    primary: "#212121",
    secondary: "#757575",
    light: "#9E9E9E",
    white: "#FFFFFF",
    disabled: "#BDBDBD", // Added for disabled input text
  },

  // Status Colors
  status: {
    error: "#D32F2F",
    success: "#388E3C",
    warning: "#FF8F00",
    info: "#1976D2",
  },

  // Soil Health Colors
  soilHealth: {
    excellent: "#4CAF50",
    good: "#8BC34A",
    moderate: "#FF9800",
    poor: "#FF5722",
    veryPoor: "#D32F2F",
  },

  // Additional Colors
  border: "#E0E0E0",
  shadow: "rgba(0, 0, 0, 0.1)",
  disabled: "#BDBDBD",
} as const;
