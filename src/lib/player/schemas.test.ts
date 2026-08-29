import { describe, expect, it } from "vitest";

import { createRunSchema, usernameSchema } from "@/lib/player/schemas";

describe("usernameSchema", () => {
  it("trims and lowercases", () => {
    expect(usernameSchema.parse("  LuCas  ")).toBe("lucas");
  });

  it("rejects lengths and punctuation outside the allowed set", () => {
    expect(usernameSchema.safeParse("ab").success).toBe(false);
    expect(usernameSchema.safeParse("a".repeat(21)).success).toBe(false);
    expect(usernameSchema.safeParse("lucas malik").success).toBe(false);
    expect(usernameSchema.safeParse("lucas-malik").success).toBe(false);
    expect(usernameSchema.safeParse("lucas_03").success).toBe(true);
  });
});

describe("createRunSchema", () => {
  it("coerces numeric strings from form posts", () => {
    expect(
      createRunSchema.parse({ mode: "chase", distanceM: "1234", durationS: "600" }),
    ).toMatchObject({ distanceM: 1234, durationS: 600 });
  });

  it("rejects non-positive distances and unknown modes", () => {
    const base = { mode: "chase", distanceM: 1000, durationS: 600 };

    expect(createRunSchema.safeParse({ ...base, distanceM: -1 }).success).toBe(false);
    expect(createRunSchema.safeParse({ ...base, distanceM: 0 }).success).toBe(false);
    expect(createRunSchema.safeParse({ ...base, durationS: 90_000 }).success).toBe(false);
    expect(createRunSchema.safeParse({ ...base, mode: "sprint" }).success).toBe(false);
  });
});
