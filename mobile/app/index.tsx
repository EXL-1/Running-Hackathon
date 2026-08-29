import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

import { JarLogo } from "../src/components/JarLogo";
import { font, palette, theme } from "../src/theme";

const LAUNCH_MS = 1100;

/**
 * 00 — Launch. Plays once, never loops: the jar mark in its running pose, the
 * wordmark, then the tagline, then straight to Home.
 */
export default function Launch() {
  const router = useRouter();
  const mark = useRef(new Animated.Value(0)).current;
  const wordmark = useRef(new Animated.Value(0)).current;
  const tagline = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(mark, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(wordmark, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(tagline, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();

    const handoff = setTimeout(() => router.replace("/home"), LAUNCH_MS);

    return () => clearTimeout(handoff);
  }, [mark, router, tagline, wordmark]);

  return (
    <View style={styles.screen}>
      <Animated.View
        style={{
          opacity: mark,
          transform: [
            {
              translateY: mark.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ],
        }}
      >
        <JarLogo size={84} />
      </Animated.View>

      <Animated.View style={{ opacity: wordmark }}>
        <Text style={styles.wordmark}>
          Peanut <Text style={styles.wordmarkButter}>Butter</Text>
        </Text>
      </Animated.View>

      <Animated.Text style={[styles.tagline, { opacity: tagline }]}>
        Spread the pace.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  wordmark: {
    color: theme.text,
    fontFamily: font.display,
    fontSize: 34,
  },
  wordmarkButter: {
    color: palette.peanutButter,
  },
  tagline: {
    color: theme.muted,
    fontFamily: font.body,
    fontSize: 15,
  },
});
