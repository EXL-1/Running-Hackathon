import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { formatPace } from "@shared/tracking";
import { Button, Eyebrow, Screen } from "../src/components/ui";
import { session } from "../src/session";
import { font, theme } from "../src/theme";

/**
 * 01 — Home. Leads with the runner's own Personal Best pace and a single
 * action: Run, which hands off into the Tap Run flow.
 */
export default function Home() {
  const router = useRouter();

  function onRun() {
    if (!session.primerSeen) {
      router.push("/permission");

      return;
    }

    if (!session.coach) {
      router.push("/coach");

      return;
    }

    router.push("/baseline");
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.best}>
        <Eyebrow>Personal best</Eyebrow>
        <Text style={styles.pace}>
          {formatPace(session.personalBestSecondsPerKm)}
        </Text>
        <Text style={styles.meta}>/km · {session.personalBestLabel}</Text>
      </View>

      <Button label="Run" onPress={onRun} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    gap: 28,
  },
  best: {
    alignItems: "center",
    gap: 6,
  },
  pace: {
    color: theme.text,
    fontFamily: font.dataMedium,
    fontSize: 72,
    fontVariant: ["tabular-nums"],
    letterSpacing: 2,
  },
  meta: {
    color: theme.muted,
    fontFamily: font.body,
    fontSize: 14,
  },
});
