// src/screens/profile/ProfileScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts, Layout } from "../../constants";
import { useTabScreenSafeArea } from "../../hooks/useTabSafeScreenArea";

interface ProfileOption {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  type: "navigate" | "toggle" | "action";
  value?: boolean;
  onPress?: () => void;
}

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { bottomPadding } = useTabScreenSafeArea();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  // Mock user data - replace with actual user data
  const user = {
    full_name: "John Farmer",
    email: "john.farmer@example.com",
    phone: "+254 712 345 678",
    location: "Nairobi, Kenya",
    subscription: "Premium User",
    joinDate: "March 2024",
  };

  const profileOptions: ProfileOption[] = [
    {
      id: "edit-profile",
      icon: "person-outline",
      title: "Edit Profile",
      subtitle: "Update your personal information",
      type: "navigate",
      onPress: () => console.log("Navigate to Edit Profile"),
    },
    {
      id: "subscription",
      icon: "diamond-outline",
      title: "Subscription",
      subtitle: "Manage your premium subscription",
      type: "navigate",
      onPress: () => console.log("Navigate to Subscription"),
    },
    {
      id: "analysis-history",
      icon: "time-outline",
      title: "Analysis History",
      subtitle: "View all your soil analyses",
      type: "navigate",
      onPress: () => console.log("Navigate to History"),
    },
    {
      id: "notifications",
      icon: "notifications-outline",
      title: "Push Notifications",
      subtitle: "Receive updates and reminders",
      type: "toggle",
      value: notificationsEnabled,
      onPress: () => setNotificationsEnabled(!notificationsEnabled),
    },
    {
      id: "location",
      icon: "location-outline",
      title: "Location Services",
      subtitle: "Allow location for better recommendations",
      type: "toggle",
      value: locationEnabled,
      onPress: () => setLocationEnabled(!locationEnabled),
    },
    {
      id: "export-data",
      icon: "download-outline",
      title: "Export Data",
      subtitle: "Download your analysis reports",
      type: "action",
      onPress: () => {
        Alert.alert(
          "Export Data",
          "Your analysis data will be exported as a PDF file.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Export", onPress: () => console.log("Export data") },
          ]
        );
      },
    },
    {
      id: "privacy",
      icon: "shield-outline",
      title: "Privacy Policy",
      subtitle: "Read our privacy policy",
      type: "navigate",
      onPress: () => console.log("Navigate to Privacy Policy"),
    },
    {
      id: "terms",
      icon: "document-text-outline",
      title: "Terms of Service",
      subtitle: "Read our terms and conditions",
      type: "navigate",
      onPress: () => console.log("Navigate to Terms"),
    },
  ];

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            // Handle sign out logic here
            console.log("User signed out");
          },
        },
      ]
    );
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.full_name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity style={styles.editAvatarButton}>
          <Ionicons name="camera" size={16} color={Colors.text.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.full_name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <View style={styles.subscriptionBadge}>
          <Ionicons name="diamond" size={14} color={Colors.primary.green} />
          <Text style={styles.subscriptionText}>{user.subscription}</Text>
        </View>
      </View>
    </View>
  );

  const renderProfileStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>12</Text>
        <Text style={styles.statLabel}>Analyses</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>8</Text>
        <Text style={styles.statLabel}>Reports</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>3</Text>
        <Text style={styles.statLabel}>Months</Text>
      </View>
    </View>
  );

  const renderProfileOption = (option: ProfileOption) => (
    <TouchableOpacity
      key={option.id}
      style={styles.optionItem}
      onPress={option.onPress}
    >
      <View style={styles.optionLeft}>
        <View style={styles.optionIconContainer}>
          <Ionicons
            name={option.icon}
            size={24}
            color={Colors.text.secondary}
          />
        </View>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{option.title}</Text>
          {option.subtitle && (
            <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
          )}
        </View>
      </View>

      <View style={styles.optionRight}>
        {option.type === "toggle" ? (
          <Switch
            value={option.value}
            onValueChange={option.onPress}
            trackColor={{
              false: Colors.border,
              true: Colors.primary.light,
            }}
            thumbColor={
              option.value ? Colors.primary.green : Colors.text.secondary
            }
          />
        ) : (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.text.secondary}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" backgroundColor={Colors.background.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => console.log("Edit profile")}
        >
          <Ionicons
            name="create-outline"
            size={24}
            color={Colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding }, // Dynamic bottom padding
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        {renderProfileHeader()}

        {/* Profile Stats */}
        {renderProfileStats()}

        {/* Options Section */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          {profileOptions.slice(0, 3).map(renderProfileOption)}
        </View>

        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {profileOptions.slice(3, 5).map(renderProfileOption)}
        </View>

        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>
          {profileOptions.slice(5).map(renderProfileOption)}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons
            name="log-out-outline"
            size={24}
            color={Colors.status.error}
          />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Kiduka v1.0.0</Text>
          <Text style={styles.buildText}>Build 2024.06.24</Text>
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
  editButton: {
    padding: Layout.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // Note: paddingBottom is set dynamically in the component
  },
  profileHeader: {
    backgroundColor: Colors.background.card,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.xl,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: Layout.spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary.green,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: Fonts.sizes["2xl"],
    fontFamily: Fonts.families.poppins.bold,
    color: Colors.text.white,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary.dark,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.background.card,
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  userEmail: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.sm,
  },
  subscriptionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary.light + "20",
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.full,
  },
  subscriptionText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.medium,
    color: Colors.primary.green,
    marginLeft: Layout.spacing.xs,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.background.card,
    paddingVertical: Layout.spacing.lg,
    marginTop: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  statNumber: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.families.poppins.bold,
    color: Colors.primary.green,
    marginBottom: Layout.spacing.xs,
  },
  statLabel: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
  },
  optionsSection: {
    backgroundColor: Colors.background.card,
    marginTop: Layout.spacing.sm,
    paddingVertical: Layout.spacing.sm,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.primary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.background.primary,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + "50",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIconContainer: {
    width: 40,
    alignItems: "center",
  },
  optionText: {
    flex: 1,
    marginLeft: Layout.spacing.md,
  },
  optionTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  optionSubtitle: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
  },
  optionRight: {
    marginLeft: Layout.spacing.md,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background.card,
    marginTop: Layout.spacing.lg,
    marginHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: Colors.status.error + "30",
  },
  signOutText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.medium,
    color: Colors.status.error,
    marginLeft: Layout.spacing.sm,
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: Layout.spacing.lg,
  },
  versionText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  buildText: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
  },
});
