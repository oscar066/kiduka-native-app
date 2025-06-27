// src/components/results/ResultsHeader.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Fonts, Layout } from "../../constants";

interface ResultsHeaderProps {
  onBack: () => void;
  onShare: () => void;
  onSaveToFavorites: () => void;
}

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  onBack,
  onShare,
  onSaveToFavorites,
}) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
    </TouchableOpacity>

    <Text style={styles.headerTitle}>Analysis Results</Text>

    <View style={styles.headerActions}>
      <TouchableOpacity onPress={onShare} style={styles.headerAction}>
        <Ionicons name="share-outline" size={24} color={Colors.text.primary} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onSaveToFavorites} style={styles.headerAction}>
        <Ionicons name="star-outline" size={24} color={Colors.text.primary} />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginTop: Layout.spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.card,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.primary,
    flex: 1,
    textAlign: "center",
    marginLeft: -32,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerAction: {
    marginLeft: Layout.spacing.md,
    padding: Layout.spacing.xs,
  },
});
