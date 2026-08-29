import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { formatDistanceKm, formatDuration, formatPace } from "@shared/tracking";
import type { LineTrigger } from "@shared/voices";
import { JarLogo } from "../src/components/JarLogo";
import { Screen } from "../src/components/ui";
import { session } from "../src/session";
import { font, theme } from "../src/theme";
import { useCoachVoice } from "../src/useCoachVoice";
import { useRunTracker } from "../src/useRunTracker";

const TRACE_POINTS = 24;

/**
 * 05 — Active run. Voice-first, so this screen is only for the moments someone
 * checks the phone: pace trace, rolling pace, target zone, time and distance,
 * the ducking badge and the coaching caption.
 *
 * The MapKit route polyline from the brief is not drawn yet — it needs a map
 * module in a development build; the trace panel below stands in for it.
 */
export default function Run() {
  const router = useRouter();
  const tracker = useRunTracker();
  const started = useRef(false);
  const [trace, setTrace] = useState<number[]>([]);

  useEffect(() => {
    if (started.current) {
      return;
    }

    started.current = true;
    void tracker.start();
  }, [tracker]);

  const livePace = tracker.currentPaceSecondsPerKm ?? tracker.paceSecondsPerKm;

  useEffect(() => {
    if (livePace === null) {
      return;
    }

    setTrace((current) => [...current, livePace].slice(-TRACE_POINTS));
  }, [livePace]);

  const target = session.baselinePaceSecondsPerKm;
  const drift = livePace === null ? 0 : livePace - target;
  const onTarget = Math.abs(drift) <= 10;
  const zoneOffset = Math.max(0, Math.min(1, 0.5 + drift / 120));

  /**
   * Which side of the aim pace you are on decides which of the selected
   * coach's lines is spoken; holding the aim pace with the personal best in
   * reach is its own state.
   */
  const trigger: LineTrigger =
    livePace === null
      ? "start"
      : drift > 10
        ? "behind"
        : livePace <= session.personalBestSecondsPerKm
          ? "pb-in-sight"
          : "ahead";

  const spoken = useCoachVoice(trigger);

  const caption =
    spoken !== null
      ? `“${spoken}”`
      : livePace === null
        ? "Warming up — waiting for a clean fix."
        : onTarget
          ? "“Nice — hold right there.”"
          : drift > 0
            ? "“You're drifting. Give me ten seconds back.”"
            : "“That's quicker than usual. Keep it honest.”";

  function finish() {
    tracker.stop();
    router.replace({
      pathname: "/summary",
      params: {
        distanceMeters: String(Math.round(tracker.distanceMeters)),
        elapsedMs: String(Math.round(tracker.elapsedMs)),
        paceSeconds:
          tracker.paceSecondsPerKm === null
            ? ""
            : String(Math.round(tracker.paceSecondsPerKm)),
      },
    });
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.trace}>
        {[0, 1, 2].map((line) => (
          <View key={line} style={[styles.gridLine, { top: `${25 * (line + 1)}%` }]} />
        ))}

        <View style={styles.traceBars}>
          {trace.map((pace, index) => (
            <View
              key={`${index}-${pace}`}
              style={[
                styles.traceBar,
                {
                  height: `${Math.max(12, Math.min(100, (target / pace) * 70))}%`,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.traceBadge}>
          <Text style={styles.traceBadgeText}>Live pace trace</Text>
        </View>
      </View>

      <Text style={styles.eyebrow}>
        Current pace · km {formatDistanceKm(tracker.distanceMeters)}
      </Text>
      <Text style={styles.pace}>{formatPace(livePace)}</Text>

      <View style={styles.zone}>
        <View style={[styles.zoneMarker, { left: `${zoneOffset * 100}%` }]} />
      </View>

      <View style={styles.metrics}>
        <View>
          <Text style={styles.metricValue}>
            {formatDuration(tracker.elapsedMs)}
          </Text>
          <Text style={styles.metricLabel}>Time</Text>
        </View>
        <View>
          <Text style={styles.metricValue}>
            {formatDistanceKm(tracker.distanceMeters)}
          </Text>
          <Text style={styles.metricLabel}>Km</Text>
        </View>
      </View>

      <View style={styles.duckBadge}>
        <Text style={styles.duckBadgeText}>Spotify ducked</Text>
      </View>

      <View style={styles.caption}>
        <JarLogo size={34} />
        <Text style={styles.captionText}>{caption}</Text>
      </View>

      {tracker.error ? (
        <Text style={styles.error}>{tracker.error}</Text>
      ) : null}

      <Pressable
        onPress={finish}
        style={({ pressed }) => [styles.finish, pressed && styles.pressed]}
      >
        <Text style={styles.finishText}>Finish</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 12,
  },
  trace: {
    height: 150,
    borderRadius: theme.radius,
    backgroundColor: "#F0E4CE",
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#DCCBAC",
  },
  traceBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    padding: 12,
    height: "100%",
  },
  traceBar: {
    flex: 1,
    borderRadius: 3,
    backgroundColor: theme.live,
  },
  traceBadge: {
    position: "absolute",
    left: 12,
    bottom: 12,
    backgroundColor: "rgba(30, 20, 13, 0.78)",
    borderRadius: theme.radiusPill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  traceBadgeText: {
    color: theme.text,
    fontFamily: font.bodyMedium,
    fontSize: 12,
  },
  eyebrow: {
    color: theme.muted,
    fontFamily: font.data,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  pace: {
    color: theme.text,
    fontFamily: font.dataMedium,
    fontSize: 56,
    fontVariant: ["tabular-nums"],
  },
  zone: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.card,
    justifyContent: "center",
  },
  zoneMarker: {
    position: "absolute",
    width: 64,
    height: 8,
    marginLeft: -32,
    borderRadius: 4,
    backgroundColor: theme.live,
  },
  metrics: {
    flexDirection: "row",
    gap: 40,
    marginTop: 8,
  },
  metricValue: {
    color: theme.text,
    fontFamily: font.dataMedium,
    fontSize: 26,
    fontVariant: ["tabular-nums"],
  },
  metricLabel: {
    color: theme.muted,
    fontFamily: font.body,
    fontSize: 13,
  },
  duckBadge: {
    alignSelf: "flex-start",
    backgroundColor: theme.card,
    borderRadius: theme.radiusPill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  duckBadgeText: {
    color: theme.muted,
    fontFamily: font.bodyMedium,
    fontSize: 12,
  },
  caption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    padding: 16,
  },
  captionText: {
    flex: 1,
    color: theme.text,
    fontFamily: font.body,
    fontSize: 15,
    lineHeight: 21,
  },
  error: {
    color: theme.danger,
    fontFamily: font.body,
    fontSize: 13,
  },
  finish: {
    marginTop: "auto",
    borderRadius: theme.radius,
    borderColor: theme.border,
    borderWidth: 1,
    backgroundColor: theme.cardRaised,
    paddingVertical: 16,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.75,
  },
  finishText: {
    color: theme.text,
    fontFamily: font.display,
    fontSize: 17,
  },
});
