import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { formatPace } from "@shared/tracking";
import { Button, Chip, Eyebrow, Screen, Title } from "../src/components/ui";
import { session, type BaselineAnswer } from "../src/session";
import { font, theme } from "../src/theme";

/**
 * 04 — Baseline setup. Faster / Slower / On Target for today, the active coach,
 * voice-cache confirmation and the Strava Companion Mode toggle.
 */
export default function Baseline() {
  const router = useRouter();
  const [openStrava, setOpenStrava] = useState(session.openStravaOnStart);

  function begin(answer: BaselineAnswer) {
    session.baseline = answer;
    session.openStravaOnStart = openStrava;
    router.replace("/run");
  }

  return (
    <Screen>
      <Eyebrow>
        Baseline · {formatPace(session.baselinePaceSecondsPerKm)} /km
      </Eyebrow>
      <Title>Faster or slower than usual today?</Title>

      <View style={styles.chips}>
        <Pressable onPress={() => router.push("/coach")}>
          <Chip>Coach: {session.coach?.name ?? "Not set"} · Change</Chip>
        </Pressable>
        <Chip>Voice cached, ready to run</Chip>
      </View>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Open Strava when I start</Text>
        <Switch
          value={openStrava}
          onValueChange={setOpenStrava}
          trackColor={{ true: theme.primary, false: theme.border }}
          thumbColor={theme.primaryText}
        />
      </View>

      <View style={styles.actions}>
        <Button label="Faster" onPress={() => begin("faster")} />
        <Button
          label="Slower"
          tone="butter"
          onPress={() => begin("slower")}
        />
        <Button
          label="On Target"
          tone="outline"
          onPress={() => begin("on-target")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: {
    gap: 10,
    alignItems: "flex-start",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  toggleLabel: {
    color: theme.text,
    fontFamily: font.body,
    fontSize: 15,
  },
  actions: {
    marginTop: "auto",
    gap: 12,
  },
});
