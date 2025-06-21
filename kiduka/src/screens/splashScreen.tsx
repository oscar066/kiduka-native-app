// src/screens/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors, Fonts, Layout } from '../constants';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.sequence([
      // Logo fade in and scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Progress bar animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Animation complete, proceed to next screen
      setTimeout(onFinish, 500);
    });
  }, [fadeAnim, scaleAnim, progressAnim, onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={Colors.primary.green} />
      
      {/* Logo and Title Section */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Agricultural Logo/Icon */}
        <View style={styles.logo}>
          <Text style={styles.logoIcon}>🌱</Text>
        </View>
        
        <Text style={styles.appName}>Kiduka</Text>
        <Text style={styles.tagline}>🌱 Soil Analysis Made Easy</Text>
      </Animated.View>

      {/* Loading Section */}
      <View style={styles.loadingContainer}>
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        
        <Text style={styles.loadingText}>Initializing app...</Text>
      </View>

      {/* Growing Plant Animation */}
      <Animated.View
        style={[
          styles.plantContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, -10],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.plantEmoji}>🌿</Text>
      </Animated.View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.green,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Layout.spacing['2xl'] * 2,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 60,
  },
  appName: {
    fontSize: Fonts.sizes['4xl'],
    fontFamily: Fonts.families.poppins.bold,
    color: Colors.text.white,
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  tagline: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.families.roboto.regular,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: Fonts.sizes.lg * Fonts.lineHeights.relaxed,
  },
  loadingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBarContainer: {
    width: width * 0.7,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: Layout.radius.full,
    overflow: 'hidden',
    marginBottom: Layout.spacing.lg,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.text.white,
    borderRadius: Layout.radius.full,
  },
  loadingText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  plantContainer: {
    position: 'absolute',
    bottom: Layout.spacing['2xl'] * 2,
    right: Layout.spacing.xl,
  },
  plantEmoji: {
    fontSize: 48,
    transform: [{ rotate: '15deg' }],
  },
});