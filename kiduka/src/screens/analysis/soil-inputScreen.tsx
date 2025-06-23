// src/screens/analysis/SoilInputScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/buttons/button";
import { Card } from "../../components/ui/cards/card";
import { Input } from "../../components/ui/inputs/input";
import { ProgressBar } from "../../components/ui/progressBar";
import { Colors, Fonts, Layout } from "../../constants";
import { SoilData } from "../../types/soil";

interface SoilInputScreenProps {
  onNext: (data: Partial<SoilData>) => void;
  onBack: () => void;
  initialData?: Partial<SoilData>;
}

const SOIL_TEXTURES = [
  "Sandy",
  "Loamy",
  "Clay",
  "Silt",
  "Sandy Loam",
  "Clay Loam",
  "Silty Clay",
  "Sandy Clay",
];

// Calculate the height of the fixed header elements to offset the keyboard
// This is an approximation. You might need to fine-tune it.
const HEADER_PLUS_PROGRESS_HEIGHT = 90;
const KEYBOARD_VERTICAL_OFFSET =
  Platform.OS === "ios" ? HEADER_PLUS_PROGRESS_HEIGHT : 0;

export const SoilInputScreen: React.FC<SoilInputScreenProps> = ({
  onNext,
  onBack,
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    simplified_texture: initialData.simplified_texture || "",
    ph: initialData.ph?.toString() || "",
    o: initialData.o?.toString() || "", // Organic matter
    latitude: initialData.latitude || 0,
    longitude: initialData.longitude || 0,
  });
  const [locationStatus, setLocationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [locationName, setLocationName] = useState("Getting location...");
  const [showTexturePicker, setShowTexturePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLocationStatus("loading");
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationStatus("error");
        setLocationName("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      setFormData((prev) => ({ ...prev, latitude, longitude }));
      setLocationName(
        `${address.city || "Unknown"}, ${address.country || "Unknown"}`
      );
      setLocationStatus("success");
    } catch (error) {
      console.error("Location error:", error);
      setLocationStatus("error");
      setLocationName("Unable to get location");
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

    if (!formData.simplified_texture) {
      newErrors.simplified_texture = "Please select soil texture";
    }

    const phValue = parseFloat(formData.ph);
    if (!formData.ph) {
      newErrors.ph = "pH level is required";
    } else if (isNaN(phValue) || phValue < 0 || phValue > 14) {
      newErrors.ph = "pH must be between 0 and 14";
    }

    const organicValue = parseFloat(formData.o);
    if (!formData.o) {
      newErrors.o = "Organic matter percentage is required";
    } else if (isNaN(organicValue) || organicValue < 0 || organicValue > 100) {
      newErrors.o = "Organic matter must be between 0 and 100%";
    }

    if (locationStatus !== "success") {
      newErrors.location = "Location is required for analysis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    const dataToPass: Partial<SoilData> = {
      ...initialData,
      simplified_texture: formData.simplified_texture,
      ph: parseFloat(formData.ph),
      o: parseFloat(formData.o),
      latitude: formData.latitude,
      longitude: formData.longitude,
    };

    onNext(dataToPass);
  };

  const renderLocationSection = () => (
    <Card style={styles.locationCard}>
      <View style={styles.locationHeader}>
        <Text style={styles.sectionTitle}>📍 Location Information</Text>
      </View>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={getCurrentLocation}
        disabled={locationStatus === "loading"}
      >
        <View style={styles.locationContent}>
          <Ionicons
            name="location"
            size={20}
            color={
              locationStatus === "success"
                ? Colors.status.success
                : Colors.text.secondary
            }
          />
          <View style={styles.locationText}>
            <Text style={styles.locationTitle}>
              {locationStatus === "loading"
                ? "Getting location..."
                : "Use Current Location"}
            </Text>
            <Text
              style={[
                styles.locationSubtitle,
                locationStatus === "success" && styles.locationSuccess,
                locationStatus === "error" && styles.locationError,
              ]}
            >
              {locationStatus === "success" && "✓ "}
              {locationName}
            </Text>
          </View>
          {locationStatus === "loading" && (
            <View style={styles.locationLoader}>
              <Text>⏳</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {errors.location && (
        <Text style={styles.errorText}>{errors.location}</Text>
      )}
    </Card>
  );

  const renderSoilCharacteristics = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🏔️ Soil Characteristics</Text>

      {/* Soil Texture Selector */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Soil Texture</Text>
        <TouchableOpacity
          style={[
            styles.pickerButton,
            errors.simplified_texture && styles.pickerError,
          ]}
          onPress={() => setShowTexturePicker(!showTexturePicker)}
        >
          <Text
            style={[
              styles.pickerText,
              !formData.simplified_texture && styles.pickerPlaceholder,
            ]}
          >
            {formData.simplified_texture || "Select soil texture"}
          </Text>
          <Ionicons
            name={showTexturePicker ? "chevron-up" : "chevron-down"}
            size={20}
            color={Colors.text.secondary}
          />
        </TouchableOpacity>

        {showTexturePicker && (
          <View style={styles.pickerOptions}>
            {SOIL_TEXTURES.map((texture) => (
              <TouchableOpacity
                key={texture}
                style={[
                  styles.pickerOption,
                  formData.simplified_texture === texture &&
                    styles.pickerOptionSelected,
                ]}
                onPress={() => {
                  updateField("simplified_texture")(texture);
                  setShowTexturePicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    formData.simplified_texture === texture &&
                      styles.pickerOptionTextSelected,
                  ]}
                >
                  {texture}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {errors.simplified_texture && (
          <Text style={styles.errorText}>{errors.simplified_texture}</Text>
        )}
      </View>

      {/* pH Level */}
      <View style={styles.inputContainer}>
        <View style={styles.inputHeader}>
          <Text style={styles.inputLabel}>pH Level</Text>
          <TouchableOpacity>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={Colors.text.secondary}
            />
          </TouchableOpacity>
        </View>

        <Input
          placeholder="6.5"
          value={formData.ph}
          onChangeText={updateField("ph")}
          keyboardType="numeric"
          error={errors.ph}
        />

        {formData.ph && !errors.ph && (
          <View style={styles.phIndicator}>
            <View style={styles.phScale}>
              <View
                style={[
                  styles.phMarker,
                  { left: `${(parseFloat(formData.ph) / 14) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.phLabel}>
              {parseFloat(formData.ph) < 7
                ? "Acidic"
                : parseFloat(formData.ph) === 7
                ? "Neutral"
                : "Alkaline"}
            </Text>
          </View>
        )}
      </View>

      {/* Organic Matter */}
      <Input
        label="Organic Matter (%)"
        placeholder="3.2"
        value={formData.o}
        onChangeText={updateField("o")}
        keyboardType="numeric"
        error={errors.o}
        style={styles.inputContainer}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="dark" backgroundColor={Colors.background.primary} />

      {/* Header and Progress are outside the KeyboardAvoidingView */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Soil Analysis</Text>
          <TouchableOpacity>
            <Ionicons
              name="help-circle-outline"
              size={20}
              color={Colors.text.secondary}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.stepIndicator}>1/3</Text>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar progress={0.33} showPercentage={false} />
      </View>

      {/* KeyboardAvoidingView wraps the scrollable area and the footer */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderLocationSection()}
          {renderSoilCharacteristics()}
        </ScrollView>

        {/* Footer is inside so it moves with the keyboard */}
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
          <Text style={styles.footerText}>Nutrients ────►</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Layout.spacing.lg,
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
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
  },
  locationCard: {
    marginBottom: Layout.spacing.xl,
  },
  locationHeader: {
    marginBottom: Layout.spacing.md,
  },
  locationButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
  },
  locationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    flex: 1,
    marginLeft: Layout.spacing.sm,
  },
  locationTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.poppins.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  locationSubtitle: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
  },
  locationSuccess: {
    color: Colors.status.success,
  },
  locationError: {
    color: Colors.status.error,
  },
  locationLoader: {
    marginLeft: Layout.spacing.sm,
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.lg,
  },
  inputContainer: {
    marginBottom: Layout.spacing.lg,
  },
  inputLabel: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.poppins.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.xs,
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: Layout.input.height,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.background.card,
    paddingHorizontal: Layout.spacing.md,
  },
  pickerError: {
    borderColor: Colors.status.error,
  },
  pickerText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.primary,
  },
  pickerPlaceholder: {
    color: Colors.text.secondary,
  },
  pickerOptions: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.background.card,
    marginTop: Layout.spacing.xs,
    maxHeight: 200,
  },
  pickerOption: {
    padding: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerOptionSelected: {
    backgroundColor: Colors.primary.green + "10",
  },
  pickerOptionText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.primary,
  },
  pickerOptionTextSelected: {
    color: Colors.primary.green,
    fontFamily: Fonts.families.roboto.medium,
  },
  phIndicator: {
    marginTop: Layout.spacing.sm,
  },
  phScale: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    position: "relative",
    marginBottom: Layout.spacing.xs,
  },
  phMarker: {
    position: "absolute",
    top: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary.green,
  },
  phLabel: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    textAlign: "center",
  },
  footer: {
    padding: Layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background.primary,
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
  errorText: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.status.error,
    marginTop: Layout.spacing.xs,
  },
});
