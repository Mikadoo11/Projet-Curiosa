import { describe, expect, it } from "vitest";
import { normalizeSlug } from "@/lib/validation/slug";

describe("normalizeSlug", () => {
  it("normalise les accents et les espaces", () => {
    expect(normalizeSlug("Les trous noirs" )).toBe("les-trous-noirs");
    expect(normalizeSlug("Histoire & géographie !")).toBe("histoire-geographie");
  });

  it("retire les séparateurs en bordure", () => {
    expect(normalizeSlug("---Un sujet---")).toBe("un-sujet");
  });
});
