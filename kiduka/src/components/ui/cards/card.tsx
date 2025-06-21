// src/components/ui/Card.tsx
import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { Colors, Layout } from "../../../constants";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  pressable?: boolean;
  onPress?: () => void;
  variant?: "default" | "elevated" | "outlined";
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  pressable = false,
  onPress,
  variant = "default",
}) => {
  const cardStyle = [styles.base, styles[variant], style];

  if (pressable && onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.95}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.background.card,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.lg,
  },
  default: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  elevated: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  outlined: {
    borderWidth: 1,
    borderColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
});
