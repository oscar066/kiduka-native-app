// src/navigation/MainNavigator.tsx - Complete Safe Area Implementation
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Import your existing screens
import { AnalysisLoadingScreen } from "../screens/analysis/analysisLoadingScreen";
import { NutrientsInputScreen } from "../screens/analysis/nutrientsInputScreen";
import { SoilInputScreen } from "../screens/analysis/soil-inputScreen";
import { TraceElementsScreen } from "../screens/analysis/traceElementsScreen";
import { DashboardScreen } from "../screens/dashboard/dashboardScreen";
import { ResultsOverviewScreen } from "../screens/results/resultsOverviewScreen";

// Import placeholder screens
import {
  AboutScreen,
  AnalyticsScreen,
  HelpScreen,
  ReportsScreen,
  ScanScreen,
  SettingsScreen,
  ShopScreen,
  SupportScreen,
} from "../screens/about/placeholderScreen";

import { ProfileScreen } from "../screens/profile/profileScreen";

// Import custom drawer component
import { CustomDrawerContent } from "./customDrawerContent";

// Import types
import { Colors } from "../constants";
import { SoilData } from "../types/soil";
import { User } from "../types/user";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

interface MainNavigatorProps {
  user: User | null;
  onSignOut: () => void;
}

// Stack Navigator for Soil Analysis Flow with State Management
const SoilAnalysisStackNavigator = () => {
  const [soilData, setSoilData] = useState<Partial<SoilData>>({});

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SoilInput">
        {({ navigation }) => (
          <SoilInputScreen
            onNext={(data) => {
              setSoilData(data);
              navigation.navigate("NutrientsInput", { soilData: data });
            }}
            onBack={() => navigation.navigate("MainTabs")}
            initialData={soilData}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="NutrientsInput">
        {({ navigation, route }) => {
          const params = route.params as
            | { soilData?: Partial<SoilData> }
            | undefined;
          return (
            <NutrientsInputScreen
              onNext={(data) => {
                setSoilData(data);
                navigation.navigate("TraceElements", { soilData: data });
              }}
              onBack={() => navigation.goBack()}
              initialData={params?.soilData || soilData}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="TraceElements">
        {({ navigation, route }) => {
          const params = route.params as
            | { soilData?: Partial<SoilData> }
            | undefined;
          return (
            <TraceElementsScreen
              onAnalyze={(data) => {
                setSoilData(data);
                navigation.navigate("AnalysisLoading", { soilData: data });
              }}
              onBack={() => navigation.goBack()}
              initialData={params?.soilData || soilData}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="AnalysisLoading">
        {({ navigation, route }) => {
          const params = route.params as { soilData: SoilData };
          return (
            <AnalysisLoadingScreen
              soilData={params.soilData}
              onComplete={(results) => {
                navigation.replace("ResultsOverview", { results });
              }}
              onCancel={() => navigation.navigate("MainTabs")}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="ResultsOverview">
        {({ navigation, route }) => {
          const params = route.params as { results: any };
          return (
            <ResultsOverviewScreen
              results={params.results}
              onBack={() => navigation.navigate("MainTabs")}
              onViewDetails={() => {
                console.log("View detailed results");
              }}
              onFindAgrovets={() => {
                navigation.navigate("MainTabs", { screen: "Shop" });
              }}
              onSaveToFavorites={() => {
                console.log("Save to favorites");
              }}
            />
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator with Safe Area Support
const BottomTabNavigator = ({ user }: { user: User | null }) => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Reports":
              iconName = focused ? "bar-chart" : "bar-chart-outline";
              break;
            case "Scan":
              iconName = focused ? "scan" : "scan-outline";
              break;
            case "Shop":
              iconName = focused ? "storefront" : "storefront-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "home-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary.green,
        tabBarInactiveTintColor: Colors.text.secondary,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          backgroundColor: Colors.background.card,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, 8), // Dynamic safe area padding
          paddingTop: 8,
          height: Math.max(60 + insets.bottom, 85), // Dynamic height based on device
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Roboto_500Medium",
          marginBottom: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      })}
    >
      <Tab.Screen name="Home" options={{ title: "Home" }}>
        {({ navigation }) => (
          <DashboardScreen
            user={user}
            onStartAnalysis={() =>
              navigation.navigate("SoilAnalysisStack", { screen: "SoilInput" })
            }
            onViewReports={() => navigation.navigate("Reports")}
            onFindAgrovets={() => navigation.navigate("Shop")}
            onViewAnalysisDetail={(analysis) =>
              navigation.navigate("SoilAnalysisStack", {
                screen: "ResultsOverview",
                params: { results: analysis },
              })
            }
            onOpenProfile={() => navigation.navigate("Profile")}
            onOpenNotifications={() => {
              console.log("Open notifications");
            }}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ title: "Reports" }}
      />

      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{ title: "Scan" }}
      />

      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{ title: "Shop" }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
};

// Drawer Navigator with Bottom Tabs
const DrawerNavigator = ({ user, onSignOut }: MainNavigatorProps) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: {
          backgroundColor: Colors.background.card,
          width: 280,
        },
      }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} user={user} onSignOut={onSignOut} />
      )}
    >
      <Drawer.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{ title: "Dashboard" }}
        initialParams={{ user }}
      />

      <Drawer.Screen
        name="SoilAnalysisStack"
        component={SoilAnalysisStackNavigator}
        options={{ title: "New Analysis" }}
      />

      <Drawer.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ title: "Analytics" }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />

      <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={{ title: "Help & FAQ" }}
      />

      <Drawer.Screen
        name="Support"
        component={SupportScreen}
        options={{ title: "Support" }}
      />

      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{ title: "About" }}
      />
    </Drawer.Navigator>
  );
};

// Main Navigator Component
export const MainNavigator: React.FC<MainNavigatorProps> = ({
  user,
  onSignOut,
}) => {
  return <DrawerNavigator user={user} onSignOut={onSignOut} />;
};
