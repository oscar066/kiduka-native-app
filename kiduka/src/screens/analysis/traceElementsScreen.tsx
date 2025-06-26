// src/screens/analysis/TraceElementsScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../components/ui/buttons/button";
import { Card } from "../../components/ui/cards/card";
import { Input } from "../../components/ui/inputs/input";
import { ProgressBar } from "../../components/ui/progressBar";
import { Colors, Fonts, Layout } from "../../constants";
import { soilService } from "../../services";
import { SoilData } from "../../types/soil";

interface TraceElementsScreenProps {
  onAnalyze: (data: SoilData) => void;
  onBack: () => void;
  initialData: Partial<SoilData>;
}

export const TraceElementsScreen: React.FC<TraceElementsScreenProps> = ({
  onAnalyze,
  onBack,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    cu: initialData.cu?.toString() || "", // Copper
    fe: initialData.fe?.toString() || "", // Iron
    zn: initialData.zn?.toString() || "", // Zinc
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Trace elements validation - all required
    const requiredFields = [
      { key: "cu", name: "Copper", min: 0, max: 50 },
      { key: "fe", name: "Iron", min: 0, max: 500 },
      { key: "zn", name: "Zinc", min: 0, max: 100 },
    ];

    requiredFields.forEach(({ key, name, min, max }) => {
      const value = formData[key as keyof typeof formData];
      if (!value) {
        newErrors[key] = `${name} is required`;
      } else {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < min || numValue > max) {
          newErrors[key] = `${name} must be between ${min} and ${max} mg/kg`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    try {
      const draftData: Partial<SoilData> = {
        ...initialData,
        cu: formData.cu ? parseFloat(formData.cu) : undefined,
        fe: formData.fe ? parseFloat(formData.fe) : undefined,
        zn: formData.zn ? parseFloat(formData.zn) : undefined,
      };

      await soilService.saveDraft(draftData);
      Alert.alert("Draft Saved", "Your analysis data has been saved as draft.");
    } catch (error) {
      console.error("Error saving draft:", error);
      Alert.alert("Error", "Failed to save draft. Please try again.");
    }
  };

  const handleAnalyze = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      // Combine all data
      const completeData: SoilData = {
        simplified_texture: initialData.simplified_texture!,
        ph: initialData.ph!,
        n: initialData.n!,
        p: initialData.p!,
        k: initialData.k!,
        o: initialData.o!,
        ca: initialData.ca || 0,
        mg: initialData.mg || 0,
        cu: parseFloat(formData.cu),
        fe: parseFloat(formData.fe),
        zn: parseFloat(formData.zn),
        latitude: initialData.latitude!,
        longitude: initialData.longitude!,
      };

      // Clear any saved draft
      await soilService.clearDraft();

      // Proceed to analysis
      onAnalyze(completeData);
    } catch (error) {
      console.error("Error preparing analysis:", error);
      Alert.alert("Error", "Failed to prepare analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderTraceElementInput = (
    element: string,
    label: string,
    placeholder: string,
    info?: string
  ) => (
    <View key={element} style={styles.elementContainer}>
      <View style={styles.elementHeader}>
        <Text style={styles.elementLabel}>
          {label} ({element.toUpperCase()}) mg/kg
          <Text style={styles.required}> *</Text>
        </Text>
        <TouchableOpacity>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={Colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      <Input
        placeholder={placeholder}
        value={formData[element as keyof typeof formData]}
        onChangeText={updateField(element)}
        keyboardType="numeric"
        error={errors[element]}
      />
    </View>
  );

  const renderSummaryPreview = () => (
    <Card style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>📋 Summary Preview</Text>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Location:</Text>
          <Text style={styles.summaryValue}>
            ✓ {initialData.latitude ? "Location Set" : "Not Set"}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Soil Type:</Text>
          <Text style={styles.summaryValue}>
            ✓ {initialData.simplified_texture || "Not Set"}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>pH Level:</Text>
          <Text style={styles.summaryValue}>
            ✓ {initialData.ph || "Not Set"}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Nutrients:</Text>
          <Text style={styles.summaryValue}>
            ✓{" "}
            {initialData.n && initialData.p && initialData.k
              ? "8 values"
              : "Incomplete"}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark"  />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Trace Elements</Text>
          <TouchableOpacity>
            <Ionicons
              name="help-circle-outline"
              size={20}
              color={Colors.text.secondary}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.stepIndicator}>3/3</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ProgressBar progress={1.0} showPercentage={false} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Micronutrients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚗️ Micronutrients</Text>
          <Text style={styles.sectionSubtitle}>
            Essential trace elements for plant health and development
          </Text>

          {renderTraceElementInput("cu", "Copper", "2.1")}
          {renderTraceElementInput("fe", "Iron", "18.5")}
          {renderTraceElementInput("zn", "Zinc", "3.2")}
        </View>

        {renderSummaryPreview()}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Ionicons name="flask" size={20} color={Colors.primary.green} />
            <Text style={styles.infoTitle}>Micronutrient Guidelines</Text>
          </View>
          <Text style={styles.infoText}>
            • Micronutrients are needed in small amounts but are crucial{"\n"}•
            Deficiencies can severely impact crop yields{"\n"}• Iron deficiency
            causes yellowing of leaves (chlorosis){"\n"}• Zinc deficiency stunts
            plant growth{"\n"}• Copper helps with enzyme function and disease
            resistance
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="🔍 ANALYZE SOIL"
          onPress={handleAnalyze}
          loading={isLoading}
          disabled={isLoading}
          size="lg"
          style={styles.analyzeButton}
        />
        <Text style={styles.analyzeSubtext}>Generate Report</Text>

        <TouchableOpacity
          onPress={handleSaveDraft}
          style={styles.saveDraftButton}
        >
          <Text style={styles.saveDraftText}>Save as Draft</Text>
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Layout.spacing.xs,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginLeft: -32,
  },
  headerTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.primary,
    marginRight: Layout.spacing.sm,
  },
  stepIndicator: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.medium,
    color: Colors.text.secondary,
  },
  progressContainer: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Layout.spacing.lg,
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.lg,
    lineHeight: Fonts.sizes.sm * Fonts.lineHeights.relaxed,
  },
  elementContainer: {
    marginBottom: Layout.spacing.lg,
  },
  elementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.xs,
  },
  elementLabel: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.poppins.medium,
    color: Colors.text.primary,
  },
  required: {
    color: Colors.status.error,
  },
  summaryCard: {
    marginBottom: Layout.spacing.xl,
    backgroundColor: Colors.background.card,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.green,
  },
  summaryTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  summaryGrid: {
    gap: Layout.spacing.sm,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Layout.spacing.xs,
  },
  summaryLabel: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.medium,
    color: Colors.primary.green,
  },
  infoSection: {
    backgroundColor: Colors.background.card,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.accent,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Layout.spacing.sm,
  },
  infoTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.primary,
    marginLeft: Layout.spacing.sm,
  },
  infoText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    lineHeight: Fonts.sizes.sm * Fonts.lineHeights.relaxed,
  },
  footer: {
    padding: Layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background.card,
  },
  analyzeButton: {
    marginBottom: Layout.spacing.sm,
    backgroundColor: Colors.primary.green,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  analyzeSubtext: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: Layout.spacing.lg,
  },
  saveDraftButton: {
    alignSelf: "center",
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
  },
  saveDraftText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.medium,
    color: Colors.primary.green,
    textDecorationLine: "underline",
  },
});
