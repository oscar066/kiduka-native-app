// src/components/ui/ProgressBar.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Fonts, Layout } from "../../constants";

interface ProgressBarProps {
  progress: number; // 0-1
  height?: number;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  style?: any;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  showPercentage = false,
  color = Colors.primary.green,
  backgroundColor = Colors.border,
  style,
}) => {
  const percentage = Math.round(progress * 100);

  return (
    <View style={[styles.container, style]}>
      {showPercentage && <Text style={styles.percentage}>{percentage}%</Text>}
      <View style={[styles.track, { height, backgroundColor }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              height,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  percentage: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.medium,
    color: Colors.text.secondary,
    textAlign: "right",
    marginBottom: Layout.spacing.xs,
  },
  track: {
    borderRadius: Layout.radius.full,
    overflow: "hidden",
  },
  fill: {
    borderRadius: Layout.radius.full,
  },
});
