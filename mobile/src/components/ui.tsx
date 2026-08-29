import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { font, theme } from "../theme";

export function Screen({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function Title({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Body({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{children}</Text>
    </View>
  );
}

export type ButtonTone = "jam" | "butter" | "outline";

export function Button({
  label,
  onPress,
  tone = "jam",
  disabled,
}: {
  label: string;
  onPress: () => void;
  tone?: ButtonTone;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        tone === "jam" && styles.buttonJam,
        tone === "butter" && styles.buttonButter,
        tone === "outline" && styles.buttonOutline,
        (pressed || disabled) && styles.buttonPressed,
      ]}
    >
      <Text
        style={[
          styles.buttonLabel,
          tone === "butter" && styles.buttonLabelButter,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 16,
  },
  eyebrow: {
    color: theme.muted,
    fontFamily: font.data,
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  title: {
    color: theme.text,
    fontFamily: font.display,
    fontSize: 32,
    lineHeight: 38,
  },
  body: {
    color: theme.muted,
    fontFamily: font.body,
    fontSize: 15,
    lineHeight: 22,
  },
  chip: {
    alignSelf: "flex-start",
    backgroundColor: theme.cardRaised,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.radiusPill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipText: {
    color: theme.text,
    fontFamily: font.bodyMedium,
    fontSize: 13,
  },
  button: {
    borderRadius: theme.radius,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonJam: {
    backgroundColor: theme.primary,
  },
  buttonButter: {
    backgroundColor: theme.accent,
  },
  buttonOutline: {
    backgroundColor: theme.cardRaised,
    borderColor: theme.border,
    borderWidth: 1,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonLabel: {
    color: theme.primaryText,
    fontFamily: font.display,
    fontSize: 18,
  },
  buttonLabelButter: {
    color: theme.accentText,
  },
});
