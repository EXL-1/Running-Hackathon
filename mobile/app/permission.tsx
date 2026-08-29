import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { JarLogo } from "../src/components/JarLogo";
import { Body, Button, Screen, Title } from "../src/components/ui";
import { session } from "../src/session";

/**
 * 02 — Permission primer, shown once before the OS prompt. The real request
 * still happens inside the tracker when a run starts.
 */
export default function Permission() {
  const router = useRouter();

  function proceed() {
    session.primerSeen = true;
    router.replace(session.coach ? "/baseline" : "/coach");
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <JarLogo size={64} />
        <Title style={styles.title}>Peanut Butter needs your location</Title>
        <Body style={styles.body}>
          To coach you live, even with the screen locked. GPS never leaves your
          phone until a run ends.
        </Body>
      </View>

      <View style={styles.actions}>
        <Button label="Allow While Using App" onPress={proceed} />
        <Button
          label="Not Now"
          tone="outline"
          onPress={() => {
            session.primerSeen = true;
            router.replace("/home");
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    gap: 40,
  },
  header: {
    alignItems: "center",
    gap: 16,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    lineHeight: 36,
  },
  body: {
    textAlign: "center",
  },
  actions: {
    gap: 12,
  },
});
