import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Eyebrow, Screen, Title } from "../src/components/ui";
import { usePlayer } from "../src/player";
import { coaches, type Coach, type CoachId } from "../src/session";
import { font, theme } from "../src/theme";
import { coachClipSource, preloadCoachClips } from "../src/voice";

/**
 * 03 — Choose your coach. The play button previews a real ElevenLabs line
 * through the app's own API; choosing a coach saves it against the username
 * and warms the rest of that coach's clips so a run can narrate offline.
 */
export default function ChooseCoach() {
  const router = useRouter();
  const { player, chooseCoach } = usePlayer();
  const [selected, setSelected] = useState<CoachId | null>(
    player?.coachVoiceId ?? null,
  );
  const [previewing, setPreviewing] = useState<CoachId | null>(null);
  const audio = useAudioPlayer();
  const status = useAudioPlayerStatus(audio);
  const nextLine = useRef(0);

  useEffect(() => {
    if (status.didJustFinish) {
      setPreviewing(null);
    }
  }, [status.didJustFinish]);

  function preview(coach: Coach) {
    if (previewing === coach.id && status.playing) {
      audio.pause();
      setPreviewing(null);
      return;
    }

    const line = previewing === coach.id ? nextLine.current : 0;
    nextLine.current = (line + 1) % coach.lines.length;

    audio.replace(coachClipSource(coach.id, line));
    audio.play();
    setPreviewing(coach.id);
  }

  return (
    <Screen>
      <Eyebrow>Onboarding · one-time</Eyebrow>
      <Title>Pick your coach&apos;s voice</Title>

      <ScrollView contentContainerStyle={styles.list}>
        {coaches.map((coach) => {
          const isSelected = coach.id === selected;

          return (
            <Pressable
              key={coach.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              onPress={() => {
                setSelected(coach.id);
                void chooseCoach(coach.id);
                void preloadCoachClips(coach.id);
                router.replace("/baseline");
              }}
              style={({ pressed }) => [
                styles.row,
                isSelected && styles.rowSelected,
                pressed && styles.rowPressed,
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Preview ${coach.name}`}
                onPress={() => preview(coach)}
                style={({ pressed }) => [
                  styles.play,
                  previewing === coach.id && styles.playActive,
                  pressed && styles.rowPressed,
                ]}
              >
                {previewing === coach.id ? (
                  <View style={styles.pauseGlyph} />
                ) : (
                  <View style={styles.playGlyph} />
                )}
              </Pressable>

              <View style={styles.rowText}>
                <Text style={styles.name}>{coach.name}</Text>
                <Text style={styles.descriptor}>{coach.descriptor}</Text>
              </View>

              <View
                style={[styles.radio, isSelected && styles.radioSelected]}
              />
            </Pressable>
          );
        })}

        <Text style={styles.libraryLink}>
          Browse the full ElevenLabs voice library →
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    padding: 16,
  },
  rowSelected: {
    backgroundColor: theme.cardRaised,
    borderColor: theme.accent,
  },
  rowPressed: {
    opacity: 0.8,
  },
  play: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: theme.muted,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  playActive: {
    borderColor: theme.accent,
  },
  pauseGlyph: {
    width: 9,
    height: 11,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderLeftColor: theme.text,
    borderRightColor: theme.text,
  },
  playGlyph: {
    width: 0,
    height: 0,
    marginLeft: 3,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 9,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: theme.text,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: theme.text,
    fontFamily: font.display,
    fontSize: 18,
  },
  descriptor: {
    color: theme.muted,
    fontFamily: font.body,
    fontSize: 13,
    lineHeight: 18,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderColor: theme.border,
    borderWidth: 1,
  },
  radioSelected: {
    backgroundColor: theme.live,
    borderColor: theme.live,
  },
  libraryLink: {
    color: theme.muted,
    fontFamily: font.bodyMedium,
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
});
