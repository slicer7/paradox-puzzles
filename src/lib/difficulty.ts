export const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Easy",
  3: "Moderate",
  4: "Hard",
  5: "Expert",
};

const TAG_PREFIX = "difficulty-";

function toList(tags: string | string[] | null | undefined): string[] {
  if (!tags) return [];
  return Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim());
}

/** Reads the difficulty (1-5) stored as a Shopify tag like `difficulty-4`. */
export function getDifficulty(tags: string | string[] | null | undefined): number | null {
  for (const tag of toList(tags)) {
    const match = tag.toLowerCase().match(/^difficulty[-:]\s*([1-5])$/);
    if (match) return Number(match[1]);
  }
  return null;
}

/** Returns the tag string with the difficulty tag replaced (or removed when null). */
export function setDifficultyTag(
  tags: string | string[] | null | undefined,
  difficulty: number | null,
): string {
  const rest = toList(tags).filter(
    (t) => t && !t.toLowerCase().startsWith(TAG_PREFIX) && !t.toLowerCase().startsWith("difficulty:"),
  );
  if (difficulty) rest.push(`${TAG_PREFIX}${difficulty}`);
  return rest.join(", ");
}

export function difficultyLabel(value: number): string {
  return DIFFICULTY_LABELS[value] ?? `${value}/5`;
}
