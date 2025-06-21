// src/screens/dashboard/DashboardScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "../../components/ui/cards/card";
import { StatusBadge } from "../../components/ui/statusBadge";
import { Colors, Fonts, Layout } from "../../constants";
import { soilService } from "../../services";
import { SoilAnalysisResult } from "../../types/soil";

interface DashboardScreenProps {
  user: any;
  onStartAnalysis: () => void;
  onViewReports: () => void;
  onFindAgrovets: () => void;
  onViewAnalysisDetail: (analysis: SoilAnalysisResult) => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  onStartAnalysis,
  onViewReports,
  onFindAgrovets,
  onViewAnalysisDetail,
  onOpenProfile,
  onOpenNotifications,
}) => {
  const [recentAnalyses, setRecentAnalyses] = useState<SoilAnalysisResult[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRecentAnalyses();
  }, []);

  const loadRecentAnalyses = async () => {
    try {
      setIsLoading(true);
      const analyses = await soilService.getAnalysisHistory(1, 5);
      setRecentAnalyses(analyses);
    } catch (error) {
      console.error("Error loading recent analyses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecentAnalyses();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.appName}>Kiduka</Text>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onOpenNotifications}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={Colors.text.primary}
          />
          {/* Notification badge */}
          <View style={styles.notificationBadge} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerButton} onPress={onOpenProfile}>
          <Ionicons
            name="person-outline"
            size={24}
            color={Colors.text.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderWelcomeSection = () => (
    <View style={styles.welcomeSection}>
      <Text style={styles.greetingText}>
        {getGreeting()}, {user?.full_name?.split(" ")[0] || "Farmer"}! 👋
      </Text>
      <Text style={styles.welcomeSubtext}>Ready to analyze soil?</Text>
    </View>
  );

  const renderQuickAnalysis = () => (
    <Card style={styles.quickAnalysisCard} pressable onPress={onStartAnalysis}>
      <View style={styles.quickAnalysisContent}>
        <View style={styles.quickAnalysisLeft}>
          <Text style={styles.quickAnalysisIcon}>📊</Text>
          <View style={styles.quickAnalysisText}>
            <Text style={styles.quickAnalysisTitle}>Quick Analysis</Text>
            <Text style={styles.quickAnalysisSubtitle}>
              Scan soil in 3 steps
            </Text>
          </View>
        </View>

        <View style={styles.quickAnalysisRight}>
          <View style={styles.startButton}>
            <Text style={styles.startButtonText}>START</Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={Colors.text.white}
            />
          </View>
        </View>
      </View>
    </Card>
  );

  const renderActionCards = () => (
    <View style={styles.actionCardsContainer}>
      <Card style={styles.actionCard} pressable onPress={onViewReports}>
        <Text style={styles.actionCardIcon}>📈</Text>
        <Text style={styles.actionCardTitle}>My Reports</Text>
        <Text style={styles.actionCardSubtitle}>View history</Text>
      </Card>

      <Card style={styles.actionCard} pressable onPress={onFindAgrovets}>
        <Text style={styles.actionCardIcon}>🏪</Text>
        <Text style={styles.actionCardTitle}>Agrovets</Text>
        <Text style={styles.actionCardSubtitle}>Find nearby</Text>
      </Card>
    </View>
  );

  const renderRecentAnalysis = (
    analysis: SoilAnalysisResult,
    index: number
  ) => (
    <Card
      key={`${analysis.prediction_id}-${index}`}
      style={styles.analysisCard}
      pressable
      onPress={() => onViewAnalysisDetail(analysis)}
    >
      <View style={styles.analysisHeader}>
        <Text style={styles.analysisDate}>
          📅 {formatDate(analysis.timestamp)}
        </Text>
        <StatusBadge
          status={analysis.soil_fertility_status}
          variant="soil"
          size="sm"
        />
      </View>

      <Text style={styles.analysisLocation}>
        Field Analysis - {analysis.prediction_id?.slice(-8) || "Unknown"}
      </Text>

      <View style={styles.analysisFooter}>
        <Text style={styles.recommendationText}>
          Recommended: {analysis.fertilizer_recommendation}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={Colors.text.secondary}
        />
      </View>
    </Card>
  );

  const renderRecentAnalyses = () => (
    <View style={styles.recentSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Analysis</Text>
        {recentAnalyses.length > 0 && (
          <TouchableOpacity onPress={onViewReports}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.loadingText}>Loading recent analyses...</Text>
        </Card>
      ) : recentAnalyses.length > 0 ? (
        recentAnalyses.map(renderRecentAnalysis)
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🌱</Text>
          <Text style={styles.emptyTitle}>No analyses yet</Text>
          <Text style={styles.emptySubtitle}>
            Start your first soil analysis to see results here
          </Text>
          <TouchableOpacity
            onPress={onStartAnalysis}
            style={styles.emptyButton}
          >
            <Text style={styles.emptyButtonText}>Start Analysis</Text>
          </TouchableOpacity>
        </Card>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.background.primary} />

      {renderHeader()}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary.green]}
            tintColor={Colors.primary.green}
          />
        }
      >
        {renderWelcomeSection()}
        {renderQuickAnalysis()}
        {renderActionCards()}
        {renderRecentAnalyses()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.safeArea.top,
    paddingBottom: Layout.spacing.md,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    marginRight: Layout.spacing.md,
  },
  appName: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.families.poppins.bold,
    color: Colors.primary.green,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: Layout.spacing.md,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.status.error,
  },
  scrollContent: {
    padding: Layout.spacing.lg,
  },
  welcomeSection: {
    marginBottom: Layout.spacing.xl,
  },
  greetingText: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  welcomeSubtext: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
  },
  quickAnalysisCard: {
    backgroundColor: Colors.primary.green,
    marginBottom: Layout.spacing.lg,
  },
  quickAnalysisContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quickAnalysisLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  quickAnalysisIcon: {
    fontSize: 32,
    marginRight: Layout.spacing.md,
  },
  quickAnalysisText: {
    flex: 1,
  },
  quickAnalysisTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.white,
    marginBottom: Layout.spacing.xs,
  },
  quickAnalysisSubtitle: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: "rgba(255, 255, 255, 0.9)",
  },
  quickAnalysisRight: {
    alignItems: "flex-end",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
  },
  startButtonText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.white,
    marginRight: Layout.spacing.xs,
  },
  actionCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Layout.spacing.xl,
  },
  actionCard: {
    flex: 0.48,
    alignItems: "center",
    paddingVertical: Layout.spacing.xl,
  },
  actionCardIcon: {
    fontSize: 32,
    marginBottom: Layout.spacing.md,
  },
  actionCardTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  actionCardSubtitle: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    textAlign: "center",
  },
  recentSection: {
    marginBottom: Layout.spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.primary,
  },
  viewAllText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.medium,
    color: Colors.primary.green,
  },
  analysisCard: {
    marginBottom: Layout.spacing.md,
  },
  analysisHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.sm,
  },
  analysisDate: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
  },
  analysisLocation: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.poppins.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  analysisFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recommendationText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    flex: 1,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: Layout.spacing["2xl"],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Layout.spacing.lg,
  },
  emptyTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  emptySubtitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: Fonts.sizes.base * Fonts.lineHeights.relaxed,
    marginBottom: Layout.spacing.lg,
  },
  emptyButton: {
    backgroundColor: Colors.primary.green,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
  },
  emptyButtonText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.poppins.medium,
    color: Colors.text.white,
  },
  loadingText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    textAlign: "center",
  },
});
