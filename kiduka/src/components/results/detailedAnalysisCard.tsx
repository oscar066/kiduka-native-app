// src/components/results/DetailedAnalysisCard.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Fonts, Layout } from "../../constants";
import { Card } from "../ui/cards/card";

interface DetailedAnalysisCardProps {
  explanation: {
    summary: string;
    fertility_analysis: string;
    nutrient_analysis: string;
    ph_analysis: string;
    soil_texture_analysis: string;
    overall_assessment: string;
  };
}

export const DetailedAnalysisCard: React.FC<DetailedAnalysisCardProps> = ({
  explanation,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card style={styles.analysisCard}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.cardTitle}>🔬 DETAILED ANALYSIS</Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={Colors.text.secondary}
        />
      </TouchableOpacity>

      <Text style={styles.summaryText}>{explanation.summary}</Text>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <AnalysisSection
            title="🌱 Fertility Analysis"
            content={explanation.fertility_analysis}
          />
          <AnalysisSection
            title="🧪 Nutrient Analysis"
            content={explanation.nutrient_analysis}
          />
          <AnalysisSection
            title="⚗️ pH Analysis"
            content={explanation.ph_analysis}
          />
          <AnalysisSection
            title="🏔️ Soil Texture"
            content={explanation.soil_texture_analysis}
          />
          <AnalysisSection
            title="📋 Overall Assessment"
            content={explanation.overall_assessment}
          />
        </View>
      )}
    </Card>
  );
};

const AnalysisSection: React.FC<{ title: string; content: string }> = ({
  title,
  content,
}) => (
  <View style={styles.analysisSection}>
    <Text style={styles.analysisSubtitle}>{title}</Text>
    <Text style={styles.analysisText}>{content}</Text>
  </View>
);

const styles = StyleSheet.create({
  analysisCard: {
    marginBottom: Layout.spacing.lg,
    backgroundColor: Colors.background.card,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.md,
  },
  cardTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.poppins.bold,
    color: Colors.text.primary,
  },
  summaryText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    lineHeight: Fonts.sizes.base * Fonts.lineHeights.relaxed,
    marginBottom: Layout.spacing.md,
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Layout.spacing.md,
  },
  analysisSection: {
    marginBottom: Layout.spacing.lg,
  },
  analysisSubtitle: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  analysisText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    lineHeight: Fonts.sizes.sm * Fonts.lineHeights.relaxed,
  },
});
