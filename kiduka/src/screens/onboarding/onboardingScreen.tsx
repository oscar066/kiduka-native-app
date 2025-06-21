// src/screens/onboarding/OnboardingScreen.tsx
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../components/ui/buttons/button";
import { Colors, Fonts, Layout } from "../../constants";

interface OnboardingSlide {
  id: number;
  icon: string;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    icon: "🧪",
    title: "Analyze Your Soil",
    description:
      "Get instant soil fertility analysis using advanced AI technology",
  },
  {
    id: 2,
    icon: "💡",
    title: "Smart Recommendations",
    description: "Receive personalized fertilizer suggestions for your crops",
  },
  {
    id: 3,
    icon: "🏪",
    title: "Find Nearby Agrovets",
    description:
      "Locate fertilizer suppliers in your area with competitive prices",
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  onSkip,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get("window");

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => (
    <View key={slide.id} style={[styles.slide, { width }]}>
      <View style={styles.slideContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.slideIcon}>{slide.icon}</Text>
        </View>

        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideDescription}>{slide.description}</Text>
      </View>
    </View>
  );

  const renderPaginationDots = () => (
    <View style={styles.pagination}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            currentSlide === index ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.background.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onSkip}>
          <Text style={styles.skipButton}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.nextButton}>
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {slides.map(renderSlide)}
      </ScrollView>

      {/* Pagination and CTA */}
      <View style={styles.footer}>
        {renderPaginationDots()}

        <View style={styles.buttonContainer}>
          <Button
            title={currentSlide === slides.length - 1 ? "Get Started" : "Next"}
            onPress={handleNext}
            size="lg"
            style={styles.nextButtonStyle}
          />
        </View>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

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
  },
  skipButton: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
  },
  nextButton: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.poppins.medium,
    color: Colors.primary.green,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Layout.spacing.xl,
  },
  slideContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.background.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Layout.spacing["2xl"],
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  slideIcon: {
    fontSize: 60,
  },
  slideTitle: {
    fontSize: Fonts.sizes["2xl"],
    fontFamily: Fonts.families.poppins.bold,
    color: Colors.text.primary,
    textAlign: "center",
    marginBottom: Layout.spacing.lg,
  },
  slideDescription: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: Fonts.sizes.lg * Fonts.lineHeights.relaxed,
    paddingHorizontal: Layout.spacing.md,
  },
  footer: {
    paddingHorizontal: Layout.spacing.xl,
    paddingBottom: Layout.safeArea.bottom + Layout.spacing.lg,
    paddingTop: Layout.spacing.lg,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Layout.spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary.green,
    width: 24,
  },
  inactiveDot: {
    backgroundColor: Colors.border,
  },
  buttonContainer: {
    width: "100%",
  },
  nextButtonStyle: {
    width: "100%",
  },
});
