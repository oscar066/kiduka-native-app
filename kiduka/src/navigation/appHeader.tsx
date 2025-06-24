// src/components/navigation/AppHeader.tsx
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Fonts, Layout } from "../constants";

interface AppHeaderProps {
  title?: string;
  showDrawerToggle?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = "Kiduka",
  showDrawerToggle = true,
  showNotifications = true,
  showProfile = true,
  onNotificationPress,
  onProfilePress,
  rightComponent,
  leftComponent,
}) => {
  const navigation = useNavigation();

  const handleDrawerToggle = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderLeftSection = () => {
    if (leftComponent) {
      return leftComponent;
    }

    return (
      <View style={styles.headerLeft}>
        {showDrawerToggle && (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleDrawerToggle}
            accessibilityLabel="Open navigation menu"
            accessibilityRole="button"
          >
            <Ionicons name="menu" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        )}
        <Text style={styles.appName}>{title}</Text>
      </View>
    );
  };

  const renderRightSection = () => {
    if (rightComponent) {
      return rightComponent;
    }

    return (
      <View style={styles.headerRight}>
        {showNotifications && (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onNotificationPress}
            accessibilityLabel="View notifications"
            accessibilityRole="button"
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={Colors.text.primary}
            />
            {/* Notification badge - you can make this dynamic */}
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        )}

        {showProfile && (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onProfilePress}
            accessibilityLabel="View profile"
            accessibilityRole="button"
          >
            <Ionicons
              name="person-outline"
              size={24}
              color={Colors.text.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.header}>
      {renderLeftSection()}
      {renderRightSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    height: 60,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuButton: {
    marginRight: Layout.spacing.md,
    padding: Layout.spacing.xs,
  },
  appName: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.families.poppins.bold,
    color: Colors.primary.green,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: Layout.spacing.md,
    position: "relative",
    padding: Layout.spacing.xs,
  },
  notificationBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.status.error,
  },
});
