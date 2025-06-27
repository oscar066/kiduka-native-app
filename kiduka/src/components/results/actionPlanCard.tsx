// src/components/results/ActionPlanCard.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Fonts, Layout } from "../../constants";
import { Card } from "../ui/cards/card";

interface Recommendation {
  category: string;
  priority: "high" | "medium" | "low";
  action: string;
  reasoning: string;
  timeframe: string;
}

interface ActionPlanCardProps {
  recommendations: Recommendation[];
  longTermStrategy?: string;
}

export const ActionPlanCard: React.FC<ActionPlanCardProps> = ({
  recommendations,
  longTermStrategy,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Group recommendations by priority
  const highPriority = recommendations.filter((r) => r.priority === "high");
  const mediumPriority = recommendations.filter((r) => r.priority === "medium");
  const lowPriority = recommendations.filter((r) => r.priority === "low");

  return (
    <Card style={styles.recommendationsCard}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.cardTitle}>📋 ACTION PLAN</Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={Colors.text.secondary}
        />
      </TouchableOpacity>

      {/* Always show high priority items */}
      {highPriority.length > 0 && (
        <PriorityGroup
          title="🔴 HIGH PRIORITY"
          recommendations={highPriority}
        />
      )}

      {isExpanded && (
        <>
          {mediumPriority.length > 0 && (
            <PriorityGroup
              title="🟡 MEDIUM PRIORITY"
              recommendations={mediumPriority}
            />
          )}

          {lowPriority.length > 0 && (
            <PriorityGroup
              title="🟢 LOW PRIORITY"
              recommendations={lowPriority}
            />
          )}

          {longTermStrategy && (
            <View style={styles.longTermStrategy}>
              <Text style={styles.strategyTitle}>🚀 Long-term Strategy</Text>
              <Text style={styles.strategyText}>{longTermStrategy}</Text>
            </View>
          )}
        </>
      )}
    </Card>
  );
};

const PriorityGroup: React.FC<{
  title: string;
  recommendations: Recommendation[];
}> = ({ title, recommendations }) => (
  <View style={styles.priorityGroup}>
    <Text style={styles.priorityHeader}>{title}</Text>
    {recommendations.map((rec, index) => (
      <RecommendationItem key={index} recommendation={rec} />
    ))}
  </View>
);

const RecommendationItem: React.FC<{ recommendation: Recommendation }> = ({
  recommendation,
}) => (
  <View style={styles.recommendationItem}>
    <View style={styles.recHeader}>
      <Text style={styles.recCategory}>
        {recommendation.category.toUpperCase()}
      </Text>
      <Text style={styles.recTimeframe}>{recommendation.timeframe}</Text>
    </View>
    <Text style={styles.recAction}>{recommendation.action}</Text>
    <Text style={styles.recReasoning}>{recommendation.reasoning}</Text>
  </View>
);

const styles = StyleSheet.create({
  recommendationsCard: {
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
  priorityGroup: {
    marginBottom: Layout.spacing.lg,
  },
  priorityHeader: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.poppins.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  recommendationItem: {
    backgroundColor: Colors.background.primary,
    padding: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    marginBottom: Layout.spacing.sm,
  },
  recHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.xs,
  },
  recCategory: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.families.roboto.bold,
    color: Colors.primary.green,
    backgroundColor: Colors.primary.green + "20",
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.sm,
  },
  recTimeframe: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.families.roboto.medium,
    color: Colors.text.secondary,
  },
  recAction: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.poppins.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  recReasoning: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    lineHeight: Fonts.sizes.xs * Fonts.lineHeights.relaxed,
  },
  longTermStrategy: {
    backgroundColor: Colors.primary.green + "10",
    padding: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.green,
  },
  strategyTitle: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  strategyText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    lineHeight: Fonts.sizes.sm * Fonts.lineHeights.relaxed,
  },
});
