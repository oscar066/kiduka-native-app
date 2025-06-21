// src/components/ui/StatusBadge.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Fonts, Layout } from "../../constants";

interface StatusBadgeProps {
  status: string;
  variant?: "soil" | "general";
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = "general",
  size = "md",
}) => {
  const getStatusColor = (status: string, variant: string) => {
    if (variant === "soil") {
      switch (status.toLowerCase()) {
        case "excellent":
          return Colors.soilHealth.excellent;
        case "good":
          return Colors.soilHealth.good;
        case "moderately healthy":
        case "moderate":
          return Colors.soilHealth.moderate;
        case "poor":
          return Colors.soilHealth.poor;
        case "very poor":
          return Colors.soilHealth.veryPoor;
        default:
          return Colors.text.secondary;
      }
    }
    return Colors.primary.green;
  };

  const backgroundColor = getStatusColor(status, variant);
  const textColor = Colors.text.white;

  return (
    <View style={[styles.badge, styles[`size_${size}`], { backgroundColor }]}>
      <Text style={[styles.text, styles[`text_${size}`], { color: textColor }]}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: Layout.radius.full,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    alignSelf: "flex-start",
  },

  size_sm: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs / 2,
  },
  size_md: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
  },
  size_lg: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
  },

  text: {
    fontFamily: Fonts.families.poppins.semiBold,
    textAlign: "center",
  },

  text_sm: {
    fontSize: Fonts.sizes.xs,
  },
  text_md: {
    fontSize: Fonts.sizes.sm,
  },
  text_lg: {
    fontSize: Fonts.sizes.base,
  },
});
