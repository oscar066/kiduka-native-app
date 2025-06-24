// src/navigation/CustomDrawerContent.tsx
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import React from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Fonts, Layout } from "../constants";
import { User } from "../types/user";

interface CustomDrawerContentProps extends DrawerContentComponentProps {
  user: User | null;
  onSignOut: () => void;
}

interface DrawerItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  screen: string;
  badge?: number;
}

const drawerItems: DrawerItem[] = [
  {
    id: "dashboard",
    icon: "home-outline",
    label: "Dashboard",
    screen: "MainTabs",
  },
  {
    id: "new-analysis",
    icon: "flask-outline",
    label: "New Analysis",
    screen: "SoilAnalysisStack",
  },
  {
    id: "reports",
    icon: "bar-chart-outline",
    label: "My Reports",
    screen: "Reports",
  },
  {
    id: "agrovets",
    icon: "storefront-outline",
    label: "Agrovets",
    screen: "Shop",
  },
  {
    id: "analytics",
    icon: "trending-up-outline",
    label: "Analytics",
    screen: "Analytics",
  },
  {
    id: "settings",
    icon: "settings-outline",
    label: "Settings",
    screen: "Settings",
  },
  {
    id: "help",
    icon: "help-circle-outline",
    label: "Help & FAQ",
    screen: "Help",
  },
  {
    id: "support",
    icon: "call-outline",
    label: "Support",
    screen: "Support",
  },
  {
    id: "about",
    icon: "information-circle-outline",
    label: "About",
    screen: "About",
  },
];

export const CustomDrawerContent: React.FC<CustomDrawerContentProps> = ({
  navigation,
  state,
  user,
  onSignOut,
}) => {
  const activeRoute = state.routeNames[state.index];

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: onSignOut,
      },
    ]);
  };

  const renderDrawerItem = (item: DrawerItem) => {
    const isActive = activeRoute === item.screen;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.drawerItem, isActive && styles.activeDrawerItem]}
        onPress={() => navigation.navigate(item.screen)}
      >
        <View style={styles.drawerItemLeft}>
          <Ionicons
            name={item.icon}
            size={24}
            color={isActive ? Colors.primary.green : Colors.text.secondary}
          />
          <Text
            style={[
              styles.drawerItemText,
              isActive && styles.activeDrawerItemText,
            ]}
          >
            {item.label}
          </Text>
        </View>

        {item.badge && item.badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.full_name?.charAt(0)?.toUpperCase() || "F"}
            </Text>
          </View>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user?.full_name || "John Farmer"}
          </Text>
          <Text style={styles.userStatus}>Premium User</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Drawer Items */}
      <DrawerContentScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.drawerContent}
      >
        {drawerItems.map(renderDrawerItem)}
      </DrawerContentScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.divider} />

        <TouchableOpacity
          style={[styles.drawerItem, styles.signOutItem]}
          onPress={handleSignOut}
        >
          <View style={styles.drawerItemLeft}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color={Colors.status.error}
            />
            <Text style={[styles.drawerItemText, styles.signOutText]}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.card,
  },
  profileSection: {
    padding: Layout.spacing.lg,
    backgroundColor: Colors.primary.green,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: Layout.spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background.card,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.families.poppins.bold,
    color: Colors.primary.green,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.white,
    marginBottom: Layout.spacing.xs,
  },
  userStatus: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: "rgba(255, 255, 255, 0.8)",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Layout.spacing.sm,
  },
  drawerContent: {
    paddingVertical: Layout.spacing.sm,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    marginHorizontal: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
  },
  activeDrawerItem: {
    backgroundColor: Colors.primary.light + "20",
  },
  drawerItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  drawerItemText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    marginLeft: Layout.spacing.md,
  },
  activeDrawerItemText: {
    color: Colors.primary.green,
    fontFamily: Fonts.families.roboto.medium,
  },
  badge: {
    backgroundColor: Colors.status.error,
    borderRadius: Layout.radius.full,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Layout.spacing.xs,
  },
  badgeText: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.families.roboto.bold,
    color: Colors.text.white,
  },
  bottomSection: {
    paddingBottom: Layout.spacing.lg,
  },
  signOutItem: {
    marginTop: Layout.spacing.sm,
  },
  signOutText: {
    color: Colors.status.error,
  },
});
