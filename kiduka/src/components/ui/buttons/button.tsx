// src/components/ui/Button.tsx
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Colors, Fonts, Layout } from "../../../constants";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary" ? Colors.text.white : Colors.primary.green
          }
        />
      ) : (
        <>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Layout.radius.md,
    paddingHorizontal: Layout.spacing.lg,
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary.green,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  secondary: {
    backgroundColor: Colors.primary.secondary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.primary.green,
  },
  ghost: {
    backgroundColor: "transparent",
  },

  // Sizes
  size_sm: {
    height: Layout.button.heightSm,
    paddingHorizontal: Layout.spacing.md,
  },
  size_md: {
    height: Layout.button.height,
  },
  size_lg: {
    height: Layout.button.heightLg,
    paddingHorizontal: Layout.spacing.xl,
  },

  // States
  disabled: {
    backgroundColor: Colors.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },

  // Text Styles
  text: {
    fontFamily: Fonts.families.poppins.medium,
    textAlign: "center",
  },

  text_primary: {
    color: Colors.text.white,
  },
  text_secondary: {
    color: Colors.text.white,
  },
  text_outline: {
    color: Colors.primary.green,
  },
  text_ghost: {
    color: Colors.primary.green,
  },

  text_sm: {
    fontSize: Fonts.sizes.sm,
  },
  text_md: {
    fontSize: Fonts.sizes.base,
  },
  text_lg: {
    fontSize: Fonts.sizes.lg,
  },

  textDisabled: {
    color: Colors.text.secondary,
  },
});
