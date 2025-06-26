// src/screens/reports/ReportsScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts, Layout } from "../../constants";
import { useTabScreenSafeArea } from "../../hooks/useTabSafeScreenArea";

export const ReportsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { bottomPadding } = useTabScreenSafeArea();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Reports</Text>

        <TouchableOpacity style={styles.filterButton}>
          <Ionicons
            name="filter-outline"
            size={24}
            color={Colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No Reports Yet</Text>
          <Text style={styles.emptyDescription}>
            Start by analyzing your soil to generate reports
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// src/screens/scan/ScanScreen.tsx
export const ScanScreen: React.FC = () => {
  const navigation = useNavigation();
  const { bottomPadding } = useTabScreenSafeArea();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark"/>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Soil Scanner</Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📱</Text>
          <Text style={styles.emptyTitle}>Camera Scanner</Text>
          <Text style={styles.emptyDescription}>
            Use your camera to scan soil samples for quick analysis
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// src/screens/shop/ShopScreen.tsx
export const ShopScreen: React.FC = () => {
  const navigation = useNavigation();
  const { bottomPadding } = useTabScreenSafeArea();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Agrovet Shop</Text>

        <TouchableOpacity style={styles.searchButton}>
          <Ionicons
            name="search-outline"
            size={24}
            color={Colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🏪</Text>
          <Text style={styles.emptyTitle}>Find Nearby Agrovets</Text>
          <Text style={styles.emptyDescription}>
            Discover fertilizer suppliers and agricultural products in your area
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// src/screens/analytics/AnalyticsScreen.tsx
export const AnalyticsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { bottomPadding } = useTabScreenSafeArea();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Analytics</Text>

        <TouchableOpacity style={styles.exportButton}>
          <Ionicons
            name="download-outline"
            size={24}
            color={Colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📈</Text>
          <Text style={styles.emptyTitle}>Analytics Dashboard</Text>
          <Text style={styles.emptyDescription}>
            View detailed analytics and trends from your soil analyses
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// src/screens/settings/SettingsScreen.tsx
export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { bottomPadding } = useTabScreenSafeArea();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark"/>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Settings</Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⚙️</Text>
          <Text style={styles.emptyTitle}>App Settings</Text>
          <Text style={styles.emptyDescription}>
            Customize your app preferences and account settings
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// src/screens/help/HelpScreen.tsx
export const HelpScreen: React.FC = () => {
  const navigation = useNavigation();
  const { bottomPadding } = useTabScreenSafeArea();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Help & FAQ</Text>

        <TouchableOpacity style={styles.searchButton}>
          <Ionicons
            name="search-outline"
            size={24}
            color={Colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>❓</Text>
          <Text style={styles.emptyTitle}>Help Center</Text>
          <Text style={styles.emptyDescription}>
            Find answers to frequently asked questions and get help
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// src/screens/support/SupportScreen.tsx
export const SupportScreen: React.FC = () => {
  const navigation = useNavigation();
  const { bottomPadding } = useTabScreenSafeArea();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Support</Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📞</Text>
          <Text style={styles.emptyTitle}>Contact Support</Text>
          <Text style={styles.emptyDescription}>
            Get in touch with our support team for assistance
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// src/screens/about/AboutScreen.tsx
export const AboutScreen: React.FC = () => {
  const navigation = useNavigation();
  const { bottomPadding } = useTabScreenSafeArea();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>About</Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>ℹ️</Text>
          <Text style={styles.emptyTitle}>About Kiduka</Text>
          <Text style={styles.emptyDescription}>
            Learn more about our app, version info, and terms of service
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuButton: {
    padding: Layout.spacing.sm,
  },
  headerTitle: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.primary,
  },
  filterButton: {
    padding: Layout.spacing.sm,
  },
  searchButton: {
    padding: Layout.spacing.sm,
  },
  exportButton: {
    padding: Layout.spacing.sm,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Layout.spacing.lg,
    // Note: paddingBottom is set dynamically in the component
  },
  emptyState: {
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Layout.spacing.lg,
  },
  emptyTitle: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: Fonts.sizes.base * 1.5,
    maxWidth: 280,
  },
});
