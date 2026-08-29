import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { formatPace } from "@shared/tracking";
import { Button, Eyebrow, Screen } from "../src/components/ui";
import { usePlayer } from "../src/player";
import { session } from "../src/session";
import { font, theme } from "../src/theme";

const dayMonth = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
});

/**
 * 01 — Home. Leads with the runner's own Personal Best pace, taken from their
 * saved runs, and a single action: Run, which hands off into the Tap Run flow.
 */
export default function Home() {
  const router = useRouter();
  const { player, stats, refresh } = usePlayer();
  const best = stats?.personalBest ?? null;

  useEffect(() => {
    void refresh();
  }, [refresh]);

  function onRun() {
    if (!session.primerSeen) {
      router.push("/permission");

      return;
    }

    if (!player?.coachVoiceId) {
      router.push("/coach");

      return;
    }

    router.push("/baseline");
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.best}>
        <Eyebrow>{best ? "Personal best" : "No runs yet"}</Eyebrow>
        <Text style={styles.pace}>{formatPace(best?.avgPaceSPerKm ?? null)}</Text>
        <Text style={styles.meta}>
          {best
            ? `/km · ${(best.distanceM / 1000).toFixed(1)}K · ${dayMonth.format(new Date(best.startedAt))}`
            : `Hi ${player?.username ?? "runner"} — your first run sets it`}
        </Text>
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
