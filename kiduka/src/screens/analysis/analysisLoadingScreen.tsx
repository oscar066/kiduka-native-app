// src/screens/analysis/AnalysisLoadingScreen.tsx
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ProgressBar } from "../../components/ui/progressBar";
import { Colors, Fonts, Layout } from "../../constants";
import { soilService } from "../../services";
import { SoilAnalysisResult, SoilData } from "../../types/soil";

interface AnalysisLoadingScreenProps {
  soilData: SoilData;
  onComplete: (results: SoilAnalysisResult) => void;
  onCancel: () => void;
}

interface AnalysisStep {
  id: string;
  label: string;
  completed: boolean;
}

export const AnalysisLoadingScreen: React.FC<AnalysisLoadingScreenProps> = ({
  soilData,
  onComplete,
  onCancel,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([
    { id: "composition", label: "Soil composition analyzed", completed: false },
    { id: "ph", label: "pH levels evaluated", completed: false },
    { id: "nutrients", label: "Nutrient balance checked", completed: false },
    {
      id: "recommendations",
      label: "Generating recommendations",
      completed: false,
    },
    { id: "agrovets", label: "Finding nearby agrovets", completed: false },
  ]);

  const scannerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startAnalysis();
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Scanner animation
    const scannerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scannerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scannerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    scannerAnimation.start();
    pulseAnimation.start();
  };

  const startAnalysis = async () => {
    try {
      // Simulate step-by-step analysis
      for (let i = 0; i < analysisSteps.length; i++) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 + Math.random() * 1000)
        );

        setCurrentStep(i);
        setProgress((i + 1) / analysisSteps.length);

        setAnalysisSteps((prev) =>
          prev.map((step, index) =>
            index <= i ? { ...step, completed: true } : step
          )
        );
      }

      // Wait a bit for the last step animation
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Perform actual API call
      const results = await soilService.analyzeSoil(soilData);

      // Complete the analysis
      onComplete(results);
    } catch (error) {
      console.error("Analysis error:", error);
      Alert.alert(
        "Analysis Failed",
        "Failed to analyze soil data. Please check your connection and try again.",
        [
          { text: "Cancel", onPress: onCancel },
          { text: "Retry", onPress: startAnalysis },
        ]
      );
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Analysis",
      "Are you sure you want to cancel the soil analysis?",
      [
        { text: "Continue Analysis" },
        { text: "Cancel", style: "destructive", onPress: onCancel },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analyzing Soil 🔬</Text>
      </View>

      {/* Scanner Animation */}
      <View style={styles.scannerContainer}>
        <Animated.View
          style={[
            styles.scannerCircle,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Text style={styles.scannerIcon}>🧪</Text>

          {/* Scanning beam effect */}
          <Animated.View
            style={[
              styles.scanBeam,
              {
                transform: [
                  {
                    rotate: scannerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          />
        </Animated.View>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <ProgressBar
          progress={progress}
          showPercentage={true}
          height={8}
          style={styles.progressBar}
        />

        <Text style={styles.currentStepText}>
          {analysisSteps[currentStep]?.label || "Preparing analysis..."}
        </Text>
      </View>

      {/* Steps List */}
      <View style={styles.stepsContainer}>
        {analysisSteps.map((step, index) => (
          <View key={step.id} style={styles.stepItem}>
            <View
              style={[
                styles.stepIcon,
                step.completed && styles.stepIconCompleted,
                index === currentStep &&
                  !step.completed &&
                  styles.stepIconActive,
              ]}
            >
              {step.completed ? (
                <Text style={styles.stepIconText}>✓</Text>
              ) : index === currentStep ? (
                <Text style={styles.stepIconText}>⏳</Text>
              ) : (
                <Text style={styles.stepIconText}>○</Text>
              )}
            </View>
            <Text
              style={[
                styles.stepLabel,
                step.completed && styles.stepLabelCompleted,
                index === currentStep && styles.stepLabelActive,
              ]}
            >
              {step.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>This may take a few seconds</Text>

        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel Analysis</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.green,
  },
  header: {
    alignItems: "center",
    paddingTop: Layout.safeArea.top + Layout.spacing.xl,
    paddingBottom: Layout.spacing.xl,
  },
  headerTitle: {
    fontSize: Fonts.sizes["2xl"],
    fontFamily: Fonts.families.poppins.bold,
    color: Colors.text.white,
    textAlign: "center",
  },
  scannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Layout.spacing["2xl"],
  },
  scannerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  scannerIcon: {
    fontSize: 80,
  },
  scanBeam: {
    position: "absolute",
    width: 2,
    height: 80,
    backgroundColor: Colors.text.white,
    top: 10,
    opacity: 0.7,
  },
  progressSection: {
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
  },
  progressBar: {
    marginBottom: Layout.spacing.md,
  },
  currentStepText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.medium,
    color: Colors.text.white,
    textAlign: "center",
  },
  stepsContainer: {
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Layout.spacing.md,
  },
  stepIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Layout.spacing.md,
  },
  stepIconCompleted: {
    backgroundColor: Colors.status.success,
  },
  stepIconActive: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  stepIconText: {
    fontSize: Fonts.sizes.xs,
    color: Colors.text.white,
    fontFamily: Fonts.families.roboto.bold,
  },
  stepLabel: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: "rgba(255, 255, 255, 0.7)",
    flex: 1,
  },
  stepLabelCompleted: {
    color: Colors.text.white,
    fontFamily: Fonts.families.roboto.medium,
  },
  stepLabelActive: {
    color: Colors.text.white,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: Layout.spacing.xl,
    paddingBottom: Layout.safeArea.bottom + Layout.spacing.lg,
  },
  footerText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: Layout.spacing.lg,
    textAlign: "center",
  },
  cancelButton: {
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
  },
  cancelButtonText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.medium,
    color: "rgba(255, 255, 255, 0.9)",
    textDecorationLine: "underline",
  },
});
