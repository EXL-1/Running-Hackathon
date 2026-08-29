import { describe, expect, it } from "vitest";

import { formatPace, parsePace } from "@/lib/onboarding/pace";
import { paceSchema, playerOnboardingPatchSchema } from "@/lib/onboarding/schemas";

describe("parsePace", () => {
  it("accepts mm:ss, mm.ss and bare minutes", () => {
    expect(parsePace("5:30")).toBe(330);
    expect(parsePace("5.30")).toBe(330);
    expect(parsePace("5")).toBe(300);
    expect(parsePace(" 5:30 ")).toBe(330);
  });

  it("rejects out-of-range seconds and junk", () => {
    expect(parsePace("5:60")).toBeNull();
    expect(parsePace("5:9")).toBeNull();
    expect(parsePace("")).toBeNull();
    expect(parsePace("fast")).toBeNull();
  });
});

describe("formatPace", () => {
  it("pads seconds", () => {
    expect(formatPace(330)).toBe("5:30");
    expect(formatPace(305)).toBe("5:05");
  });
});

describe("paceSchema", () => {
  it("keeps paces inside the supported range", () => {
    expect(paceSchema.parse("5:30")).toBe(330);
    expect(paceSchema.safeParse("2:00").success).toBe(false);
    expect(paceSchema.safeParse("16:00").success).toBe(false);
  });
});

describe("playerOnboardingPatchSchema", () => {
  it("requires goal and pace together", () => {
    expect(
      playerOnboardingPatchSchema.safeParse({ goalKind: "target_pace" }).success,
    ).toBe(false);
    expect(
      playerOnboardingPatchSchema.safeParse({
        goalKind: "target_pace",
        targetPaceSPerKm: 330,
      }).success,
    ).toBe(true);
  });

  it("rejects an empty patch", () => {
    expect(playerOnboardingPatchSchema.safeParse({}).success).toBe(false);
  });
});
