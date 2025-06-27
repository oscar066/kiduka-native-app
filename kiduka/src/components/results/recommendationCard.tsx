// src/components/results/RecommendationCard.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Fonts, Layout } from "../../constants";
import { Card } from "../ui/cards/card";
import { ProgressBar } from "../ui/progressBar";

interface RecommendationCardProps {
  recommendation: string;
  confidence: number;
  justification?: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  confidence,
  justification,
}) => (
  <Card style={styles.recommendationCard}>
    <Text style={styles.cardTitle}>💊 FERTILIZER RECOMMENDATION</Text>

    <View style={styles.recommendationContent}>
      <Text style={styles.fertilizerName}>{recommendation}</Text>

      <View style={styles.recommendationConfidence}>
        <ProgressBar
          progress={confidence}
          showPercentage={true}
          color={Colors.primary.green}
          style={styles.confidenceBar}
        />
        <Text style={styles.confidenceLabel}>Recommendation Confidence</Text>
      </View>

      {/* {justification && (
        <Text style={styles.justificationText}>{justification}</Text>
      )} */}
    </View>
  </Card>
);

const styles = StyleSheet.create({
  recommendationCard: {
    marginBottom: Layout.spacing.lg,
    backgroundColor: Colors.background.card,
  },
  cardTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.poppins.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  recommendationContent: {
    alignItems: "center",
  },
  fertilizerName: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.families.poppins.bold,
    color: Colors.primary.accent,
    textAlign: "center",
    marginBottom: Layout.spacing.lg,
  },
  recommendationConfidence: {
    width: "100%",
    marginBottom: Layout.spacing.md,
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
  justificationText: {
    marginTop: Layout.spacing.sm,
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: Fonts.sizes.sm * Fonts.lineHeights.relaxed,
  },
});
