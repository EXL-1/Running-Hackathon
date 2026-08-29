import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { formatDistanceKm, formatDuration, formatPace } from "@shared/tracking";
import { Button, Eyebrow, Screen } from "../src/components/ui";
import { session } from "../src/session";
import { font, theme } from "../src/theme";
import { useCoachVoice } from "../src/useCoachVoice";

/**
 * 06 — Summary. A run is saved locally and to Health before Strava is ever
 * offered, so the Strava action is secondary and optional.
 */
export default function Summary() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    distanceMeters?: string;
    elapsedMs?: string;
    paceSeconds?: string;
  }>();

  const distanceMeters = Number(params.distanceMeters ?? 0);
  const elapsedMs = Number(params.elapsedMs ?? 0);
  const paceSeconds = params.paceSeconds ? Number(params.paceSeconds) : null;

  const verdict =
    paceSeconds === null
      ? "No pace"
      : paceSeconds <= session.baselinePaceSecondsPerKm - 10
        ? "Faster than baseline"
        : paceSeconds >= session.baselinePaceSecondsPerKm + 10
          ? "Slower than baseline"
          : "On target";

  const spoken = useCoachVoice("finish");

  return (
    <Screen style={styles.screen}>
      <Eyebrow>Run complete</Eyebrow>
      <Text style={styles.headline}>
        {formatDistanceKm(distanceMeters)}km in {formatDuration(elapsedMs)}
      </Text>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{formatPace(paceSeconds)}</Text>
          <Text style={styles.metricLabel}>Avg /km</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{verdict}</Text>
          <Text style={styles.metricLabel}>Coach verdict</Text>
        </View>
      </View>

      {spoken === null ? null : (
        <Text style={styles.spoken}>“{spoken}”</Text>
      )}

      <View style={styles.actions}>
        <Button label="Saved · Synced to Health ✓" onPress={() => {}} />
        <Button
          label="Send to Strava (optional)"
          tone="outline"
          onPress={() => {}}
        />
        <Button label="Done" tone="outline" onPress={() => router.replace("/home")} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 14,
  },
  headline: {
    color: theme.text,
    fontFamily: font.display,
    fontSize: 30,
  },
  metrics: {
    flexDirection: "row",
    gap: 36,
    marginTop: 4,
  },
  spoken: {
    color: theme.text,
    fontFamily: font.body,
    fontSize: 15,
    lineHeight: 21,
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    padding: 16,
  },
  metric: {
    flex: 1,
    gap: 2,
  },
  metricValue: {
    color: theme.text,
    fontFamily: font.dataMedium,
    fontSize: 24,
    fontVariant: ["tabular-nums"],
  },
  metricLabel: {
    color: theme.muted,
    fontFamily: font.body,
    fontSize: 13,
  },
  actions: {
    marginTop: "auto",
    gap: 12,
  },
});
