import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "../src/theme";

export default function Home() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Runaway</Text>
      <Text style={styles.body}>
        Native run tracking. Nothing here talks to the database yet — start with
        the GPS check to confirm pace and distance look right on your phone.
      </Text>

      <Link href="/gps-test" style={styles.button}>
        Open GPS test
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 24,
    gap: 16,
    justifyContent: "center",
  },
  title: {
    color: theme.text,
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -1,
  },
  body: {
    color: theme.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    marginTop: 8,
    backgroundColor: theme.primary,
    color: theme.primaryText,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    paddingVertical: 16,
    borderRadius: 999,
    overflow: "hidden",
  },
});
