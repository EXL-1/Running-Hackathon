import { StyleSheet, View } from "react-native";

import { palette } from "../theme";

/**
 * The jam-jar mark: two-tone jar (tan top third, jam body), a lid at a fixed
 * tilt, mid-stride legs and three motion dashes. Composed from views so the
 * mark scales without shipping a raster asset.
 */
export function JarLogo({ size = 72 }: { size?: number }) {
  const unit = size / 72;
  const jarWidth = 34 * unit;
  const jarHeight = 40 * unit;

  return (
    <View style={{ width: size, height: size, justifyContent: "center" }}>
      <View style={[styles.dashes, { left: 0, gap: 3 * unit }]}>
        {[16, 22, 13].map((width) => (
          <View
            key={width}
            style={{
              width: width * unit,
              height: 3 * unit,
              borderRadius: 2 * unit,
              backgroundColor: palette.jamBright,
            }}
          />
        ))}
      </View>

      <View style={{ alignSelf: "flex-end", width: jarWidth }}>
        <View
          style={{
            alignSelf: "center",
            width: 18 * unit,
            height: 9 * unit,
            borderRadius: 3 * unit,
            backgroundColor: palette.roast,
            transform: [{ rotate: "-14deg" }],
            marginBottom: -2 * unit,
          }}
        />

        <View
          style={{
            width: jarWidth,
            height: jarHeight,
            borderRadius: 10 * unit,
            backgroundColor: palette.jam,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: jarHeight / 3,
              backgroundColor: palette.peanutButter,
            }}
          />
        </View>

        <View style={[styles.legs, { height: 16 * unit }]}>
          <View
            style={{
              width: 5 * unit,
              height: 14 * unit,
              borderRadius: 3 * unit,
              backgroundColor: palette.roast,
              transform: [{ rotate: "34deg" }, { translateY: -2 * unit }],
            }}
          />
          <View
            style={{
              width: 5 * unit,
              height: 16 * unit,
              borderRadius: 3 * unit,
              backgroundColor: palette.roast,
              transform: [{ rotate: "-22deg" }],
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dashes: {
    position: "absolute",
    top: "38%",
  },
  legs: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: -4,
  },
});
