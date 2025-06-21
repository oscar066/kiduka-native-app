// src/screens/analysis/NutrientsInputScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../components/ui/buttons/button";
import { Input } from "../../components/ui/inputs/input";
import { ProgressBar } from "../../components/ui/progressBar";
import { Colors, Fonts, Layout } from "../../constants";
import { SoilData } from "../../types/soil";

interface NutrientsInputScreenProps {
  onNext: (data: Partial<SoilData>) => void;
  onBack: () => void;
  initialData: Partial<SoilData>;
}

interface NutrientLevel {
  value: number;
  status: "low" | "adequate" | "high";
  color: string;
}

export const NutrientsInputScreen: React.FC<NutrientsInputScreenProps> = ({
  onNext,
  onBack,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    n: initialData.n?.toString() || "", // Nitrogen
    p: initialData.p?.toString() || "", // Phosphorus
    k: initialData.k?.toString() || "", // Potassium
    ca: initialData.ca?.toString() || "", // Calcium
    mg: initialData.mg?.toString() || "", // Magnesium
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Nutrient level thresholds (mg/kg)
  const getNutrientLevel = (value: number, nutrient: string): NutrientLevel => {
    const thresholds = {
      n: { low: 20, adequate: 40 },
      p: { low: 15, adequate: 30 },
      k: { low: 150, adequate: 300 },
      ca: { low: 1000, adequate: 2000 },
      mg: { low: 120, adequate: 250 },
    };

    const threshold = thresholds[nutrient as keyof typeof thresholds];
    if (!threshold)
      return { value, status: "adequate", color: Colors.status.success };

    if (value < threshold.low) {
      return { value, status: "low", color: Colors.status.error };
    } else if (value < threshold.adequate) {
      return { value, status: "adequate", color: Colors.status.success };
    } else {
      return { value, status: "high", color: Colors.primary.accent };
    }
  };

  const updateField = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate primary nutrients (NPK) - required
    const requiredFields = [
      { key: "n", name: "Nitrogen", min: 0, max: 1000 },
      { key: "p", name: "Phosphorus", min: 0, max: 500 },
      { key: "k", name: "Potassium", min: 0, max: 2000 },
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

    // Validate secondary nutrients (Ca, Mg) - optional but if provided, must be valid
    const optionalFields = [
      { key: "ca", name: "Calcium", min: 0, max: 10000 },
      { key: "mg", name: "Magnesium", min: 0, max: 1000 },
    ];

    optionalFields.forEach(({ key, name, min, max }) => {
      const value = formData[key as keyof typeof formData];
      if (value) {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < min || numValue > max) {
          newErrors[key] = `${name} must be between ${min} and ${max} mg/kg`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    const dataToPass: Partial<SoilData> = {
      ...initialData,
      n: parseFloat(formData.n),
      p: parseFloat(formData.p),
      k: parseFloat(formData.k),
      ca: formData.ca ? parseFloat(formData.ca) : 0,
      mg: formData.mg ? parseFloat(formData.mg) : 0,
    };

    onNext(dataToPass);
  };

  const renderNutrientInput = (
    nutrient: string,
    label: string,
    unit: string = "mg/kg",
    required: boolean = true,
    info?: string
  ) => {
    const value = formData[nutrient as keyof typeof formData];
    const numValue = parseFloat(value);
    const level = !isNaN(numValue)
      ? getNutrientLevel(numValue, nutrient)
      : null;

    return (
      <View key={nutrient} style={styles.nutrientContainer}>
        <View style={styles.nutrientHeader}>
          <Text style={styles.nutrientLabel}>
            {label} ({nutrient.toUpperCase()}) {unit}
            {required && <Text style={styles.required}> *</Text>}
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
          placeholder={
            nutrient === "n" ? "20.5" : nutrient === "p" ? "15.2" : "28.7"
          }
          value={value}
          onChangeText={updateField(nutrient)}
          keyboardType="numeric"
          error={errors[nutrient]}
        />

        {level && !errors[nutrient] && (
          <View style={styles.nutrientStatus}>
            <View
              style={[styles.statusIndicator, { backgroundColor: level.color }]}
            />
            <Text style={[styles.statusText, { color: level.color }]}>
              Status: {level.status.toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.background.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Nutrients Input</Text>
          <TouchableOpacity>
            <Ionicons
              name="help-circle-outline"
              size={20}
              color={Colors.text.secondary}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.stepIndicator}>2/3</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ProgressBar progress={0.66} showPercentage={false} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Primary Nutrients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧪 Primary Nutrients (NPK)</Text>
          <Text style={styles.sectionSubtitle}>
            Essential macronutrients required for plant growth
          </Text>

          {renderNutrientInput("n", "Nitrogen", "mg/kg", true)}
          {renderNutrientInput("p", "Phosphorus", "mg/kg", true)}
          {renderNutrientInput("k", "Potassium", "mg/kg", true)}
        </View>

        {/* Secondary Nutrients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧪 Secondary Nutrients</Text>
          <Text style={styles.sectionSubtitle}>
            Important nutrients for soil structure and plant health (optional)
          </Text>

          {renderNutrientInput("ca", "Calcium", "mg/kg", false)}
          {renderNutrientInput("mg", "Magnesium", "mg/kg", false)}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Ionicons
              name="information-circle"
              size={20}
              color={Colors.primary.green}
            />
            <Text style={styles.infoTitle}>Nutrient Testing Tips</Text>
          </View>
          <Text style={styles.infoText}>
            • Get soil tested at a certified laboratory for accurate readings
            {"\n"}• Values should be from recent soil tests (within 6 months)
            {"\n"}• Nitrogen levels can vary significantly with season{"\n"}•
            Contact your local agricultural extension office for testing
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="NEXT STEP"
          onPress={handleNext}
          size="lg"
          style={styles.nextButton}
          icon={
            <Ionicons
              name="arrow-forward"
              size={16}
              color={Colors.text.white}
            />
          }
        />
        <Text style={styles.footerText}>Trace Elements ────►</Text>
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
    marginLeft: -32, // Compensate for back button
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
  nutrientContainer: {
    marginBottom: Layout.spacing.lg,
  },
  nutrientHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.xs,
  },
  nutrientLabel: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.poppins.medium,
    color: Colors.text.primary,
  },
  required: {
    color: Colors.status.error,
  },
  nutrientStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Layout.spacing.sm,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Layout.spacing.sm,
  },
  statusText: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.families.roboto.medium,
  },
  infoSection: {
    backgroundColor: Colors.background.card,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.green,
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
  nextButton: {
    marginBottom: Layout.spacing.sm,
  },
  footerText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    textAlign: "center",
  },
});
