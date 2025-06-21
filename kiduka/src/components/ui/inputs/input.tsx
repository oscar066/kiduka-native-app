// src/components/ui/Input.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Colors, Fonts, Layout } from "../../../constants";

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const containerStyle = [
    styles.container,
    isFocused && styles.focused,
    error && styles.error,
    disabled && styles.disabled,
    style,
  ];

  const handleToggleSecure = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={containerStyle}>
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={Colors.text.secondary}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.secondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={handleToggleSecure}
            style={styles.rightIcon}
          >
            <Ionicons
              name={isSecure ? "eye-off" : "eye"}
              size={20}
              color={Colors.text.secondary}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Ionicons
              name={rightIcon as any}
              size={20}
              color={Colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Layout.spacing.md,
  },
  label: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.poppins.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: Layout.input.height,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.background.card,
    paddingHorizontal: Layout.spacing.md,
  },
  focused: {
    borderColor: Colors.primary.green,
    borderWidth: 2,
  },
  error: {
    borderColor: Colors.status.error,
  },
  disabled: {
    backgroundColor: Colors.disabled,
    opacity: 0.6,
  },
  leftIcon: {
    marginRight: Layout.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.primary,
    paddingVertical: 0, // Remove default padding on Android
  },
  rightIcon: {
    marginLeft: Layout.spacing.sm,
    padding: Layout.spacing.xs,
  },
  errorText: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.status.error,
    marginTop: Layout.spacing.xs,
  },
});
