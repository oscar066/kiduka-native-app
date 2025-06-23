// src/components/ui/inputs/input.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
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
  keyboardType?: TextInputProps["keyboardType"];
  error?: string;
  disabled?: boolean;
  editable?: boolean; // Added for disabling during loading
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;

  // Text input behavior props
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: boolean;
  autoComplete?: TextInputProps["autoComplete"];
  returnKeyType?: TextInputProps["returnKeyType"];
  blurOnSubmit?: boolean;
  onSubmitEditing?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;

  // Additional validation and UX props
  maxLength?: number;
  required?: boolean;
  testID?: string;
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
  editable = true, // Default to true
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,

  // Text input behavior props
  autoCapitalize = "sentences",
  autoCorrect = true,
  autoComplete,
  returnKeyType = "done",
  blurOnSubmit = true,
  onSubmitEditing,
  onFocus: onFocusProp,
  onBlur: onBlurProp,

  // Additional props
  maxLength,
  required = false,
  testID,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  // Determine if input is actually editable
  const isEditable = editable && !disabled;

  const containerStyle = [
    styles.container,
    isFocused && styles.focused,
    error && styles.error,
    !isEditable && styles.disabled,
    style,
  ];

  const handleFocus = () => {
    setIsFocused(true);
    onFocusProp?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlurProp?.();
  };

  const handleToggleSecure = () => {
    setIsSecure(!isSecure);
  };

  // Dynamic label text with required indicator
  const labelText = label ? (required ? `${label} *` : label) : undefined;

  return (
    <View style={styles.wrapper}>
      {labelText && (
        <Text style={[styles.label, required && styles.requiredLabel]}>
          {labelText}
        </Text>
      )}

      <View style={containerStyle}>
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={
              !isEditable
                ? Colors.text.disabled
                : isFocused
                ? Colors.primary.green
                : Colors.text.secondary
            }
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            !isEditable && styles.inputDisabled,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={
            !isEditable ? Colors.text.disabled : Colors.text.secondary
          }
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          editable={isEditable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          autoComplete={autoComplete}
          returnKeyType={returnKeyType}
          blurOnSubmit={blurOnSubmit}
          onSubmitEditing={onSubmitEditing}
          maxLength={maxLength}
          testID={testID}
        />

        {/* Character count indicator for inputs with maxLength */}
        {maxLength && value && (
          <Text style={styles.characterCount}>
            {value.length}/{maxLength}
          </Text>
        )}

        {secureTextEntry && (
          <TouchableOpacity
            onPress={handleToggleSecure}
            style={styles.rightIcon}
            disabled={!isEditable}
          >
            <Ionicons
              name={isSecure ? "eye-off" : "eye"}
              size={20}
              color={!isEditable ? Colors.text.disabled : Colors.text.secondary}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            disabled={!isEditable}
          >
            <Ionicons
              name={rightIcon as any}
              size={20}
              color={!isEditable ? Colors.text.disabled : Colors.text.secondary}
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
  requiredLabel: {
    // Optional: different styling for required fields
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: Layout.input.height,
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
    borderWidth: 2,
  },
  disabled: {
    backgroundColor: Colors.disabled || "#f5f5f5",
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
    paddingVertical: Layout.spacing.sm, // Better vertical padding
    textAlignVertical: "center", // Center text vertically
  },
  inputDisabled: {
    color: Colors.text.disabled || "#999",
  },
  rightIcon: {
    marginLeft: Layout.spacing.sm,
    padding: Layout.spacing.xs,
  },
  characterCount: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    marginLeft: Layout.spacing.xs,
  },
  errorText: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.status.error,
    marginTop: Layout.spacing.xs,
  },
});
