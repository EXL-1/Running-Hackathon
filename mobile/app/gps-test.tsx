import * as Haptics from "expo-haptics";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";

import {
  formatDistanceKm,
  formatDuration,
  formatPace,
  MAX_ACCURACY_M,
} from "@shared/tracking";
import { font, theme } from "../src/theme";
import { useRunTracker } from "../src/useRunTracker";

function Metric({
  label,
  value,
  unit,
  style,
}: {
  label: string;
  value: string;
  unit?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.metric, style]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricValueRow}>
        <Text style={styles.metricValue}>{value}</Text>
        {unit ? <Text style={styles.metricUnit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

export default function GpsTest() {
  const tracker = useRunTracker();
  const isRunning = tracker.status === "running";
  const isRequesting = tracker.status === "requesting";

  const accuracy = tracker.accuracyMeters;
  const signal =
    accuracy === null
      ? "Waiting for a fix"
      : accuracy <= 10
        ? "Strong"
        : accuracy <= MAX_ACCURACY_M
          ? "Usable"
          : "Too weak — fixes ignored";

  async function onPrimaryPress() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (isRunning) {
      tracker.stop();

      return;
    }

    await tracker.start();
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.caption}>
        Foreground GPS check. Keep the screen on and this screen open — nothing
        is saved to the database.
      </Text>

      <Metric
        label="Pace (session average)"
        value={formatPace(tracker.paceSecondsPerKm)}
        unit="min/km"
        style={styles.hero}
      />

      <View style={styles.row}>
        <Metric
          label="Distance"
          value={formatDistanceKm(tracker.distanceMeters)}
          unit="km"
          style={styles.half}
        />
        <Metric
          label="Time"
          value={formatDuration(tracker.elapsedMs)}
          style={styles.half}
        />
      </View>

      <View style={styles.row}>
        <Metric
          label="Live pace"
          value={formatPace(tracker.currentPaceSecondsPerKm)}
          unit="min/km"
          style={styles.half}
        />
        <Metric
          label="GPS accuracy"
          value={accuracy === null ? "--" : `±${Math.round(accuracy)}`}
          unit={accuracy === null ? undefined : "m"}
          style={styles.half}
        />
      </View>

      <Text style={styles.signal}>
        Signal: {signal} · {tracker.fixCount} fixes
      </Text>

      {tracker.error ? <Text style={styles.error}>{tracker.error}</Text> : null}

      <Pressable
        onPress={onPrimaryPress}
        disabled={isRequesting}
        style={({ pressed }) => [
          styles.button,
          isRunning && styles.buttonStop,
          (pressed || isRequesting) && styles.buttonPressed,
        ]}
      >
        <Text style={[styles.buttonText, isRunning && styles.buttonStopText]}>
          {isRunning ? "Stop" : isRequesting ? "Starting…" : "Start"}
        </Text>
      </Pressable>

      {tracker.status === "stopped" ? (
        <Pressable onPress={tracker.reset} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Reset session</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    padding: 20,
    gap: 12,
    paddingBottom: 48,
  },
  caption: {
    color: theme.muted,
    fontFamily: font.body,
    fontSize: 14,
    lineHeight: 20,
  },
  hero: {
    paddingVertical: 28,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
  metric: {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    gap: 6,
  },
  metricLabel: {
    color: theme.muted,
    fontFamily: font.data,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  metricValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  metricValue: {
    color: theme.text,
    fontFamily: font.dataMedium,
    fontSize: 40,
    fontVariant: ["tabular-nums"],
  },
  metricUnit: {
    color: theme.muted,
    fontFamily: font.bodySemi,
    fontSize: 15,
  },
  signal: {
    color: theme.muted,
    fontFamily: font.body,
    fontSize: 13,
  },
  error: {
    color: theme.danger,
    fontFamily: font.body,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
    backgroundColor: theme.primary,
    borderRadius: theme.radius,
    paddingVertical: 18,
    alignItems: "center",
  },
  buttonStop: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.danger,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.primaryText,
    fontFamily: font.display,
    fontSize: 18,
  },
  buttonStopText: {
    color: theme.danger,
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: theme.muted,
    fontFamily: font.bodySemi,
    fontSize: 15,
  },
});
