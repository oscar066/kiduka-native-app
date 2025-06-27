// src/components/results/OverallStatusCard.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Fonts, Layout } from "../../constants";
import { Card } from "../ui/cards/card";
import { ProgressBar } from "../ui/progressBar";
import { StatusBadge } from "../ui/statusBadge";

interface OverallStatusCardProps {
  status: string;
  confidence: number;
}

export const OverallStatusCard: React.FC<OverallStatusCardProps> = ({
  status,
  confidence,
}) => (
  <Card style={styles.statusCard}>
    <Text style={styles.cardTitle}>🎯 OVERALL STATUS</Text>

    <View style={styles.statusContent}>
      <StatusBadge status={status} variant="soil" size="lg" />

      <View style={styles.confidenceSection}>
        <ProgressBar
          progress={confidence}
          showPercentage={true}
          color={Colors.primary.green}
          style={styles.confidenceBar}
        />
        <Text style={styles.confidenceLabel}>Analysis Confidence</Text>
      </View>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  statusCard: {
    marginBottom: Layout.spacing.lg,
    backgroundColor: Colors.background.card,
  },
  cardTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.poppins.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  statusContent: {
    alignItems: "center",
  },
  confidenceSection: {
    width: "100%",
    marginTop: Layout.spacing.lg,
  },
  confidenceBar: {
    marginBottom: Layout.spacing.xs,
  },
  confidenceLabel: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.families.roboto.medium,
    color: Colors.text.secondary,
    textAlign: "right",
  },
});
