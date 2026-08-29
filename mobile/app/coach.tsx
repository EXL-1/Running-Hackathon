import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Eyebrow, Screen, Title } from "../src/components/ui";
import { coaches, session, type CoachId } from "../src/session";
import { font, theme } from "../src/theme";

/**
 * 03 — Choose your coach. Voice previews are stubbed until VoiceService is
 * wired in; selection is what the run flow reads.
 */
export default function ChooseCoach() {
  const router = useRouter();
  const [selected, setSelected] = useState<CoachId | null>(
    session.coach?.id ?? null,
  );

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
                session.coach = coach;
                router.replace("/baseline");
              }}
              style={({ pressed }) => [
                styles.row,
                isSelected && styles.rowSelected,
                pressed && styles.rowPressed,
              ]}
            >
              <View style={styles.play}>
                <View style={styles.playGlyph} />
              </View>

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
