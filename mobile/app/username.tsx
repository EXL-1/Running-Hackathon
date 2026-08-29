import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, TextInput, View } from "react-native";

import { Body, Button, Eyebrow, Screen, Title } from "../src/components/ui";
import { usePlayer } from "../src/player";
import { font, theme } from "../src/theme";

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

/**
 * 00b — Pick your username. There is no account and no password: the username
 * is the handle everything is tracked against, kept on the phone from here on.
 */
export default function Username() {
  const router = useRouter();
  const { claim } = usePlayer();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  const cleaned = username.trim().toLowerCase();

  async function start() {
    if (!USERNAME_PATTERN.test(cleaned)) {
      setError("3–20 characters: letters, numbers and underscores.");

      return;
    }

    setClaiming(true);
    setError(null);

    try {
      await claim(cleaned);
      router.replace("/home");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not start.");
    } finally {
      setClaiming(false);
    }
  }

  return (
    <Screen style={styles.screen}>
      <Eyebrow>One time</Eyebrow>
      <Title>Pick a username</Title>
      <Body>
        No password, no email. Your runs are tracked against this name, so keep
        using it.
      </Body>

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="peanut_runner"
        placeholderTextColor={theme.muted}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={20}
        returnKeyType="go"
        onSubmitEditing={() => void start()}
        style={styles.input}
      />

      {error ? <Body style={styles.error}>{error}</Body> : null}

      <View style={styles.actions}>
        {claiming ? (
          <ActivityIndicator color={theme.accent} />
        ) : (
          <Button label="Start running" onPress={() => void start()} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
  },
  input: {
    marginTop: 8,
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: theme.text,
    fontFamily: font.dataMedium,
    fontSize: 18,
  },
  error: {
    color: theme.danger,
  },
  actions: {
    marginTop: 12,
  },
});
