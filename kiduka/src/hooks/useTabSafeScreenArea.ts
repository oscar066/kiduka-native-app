// src/hooks/useTabScreenSafeArea.ts
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useTabScreenSafeArea = () => {
  const insets = useSafeAreaInsets();
  
  // Calculate the bottom padding needed for tab screens
  // This accounts for the tab bar height + safe area + extra padding
  const bottomPadding = Math.max(60 + insets.bottom + 16, 100);
  
  // Calculate tab bar height for reference
  const tabBarHeight = Math.max(60 + insets.bottom, 85);
  
  return {
    bottomPadding,
    tabBarHeight,
    insets,
  };
};