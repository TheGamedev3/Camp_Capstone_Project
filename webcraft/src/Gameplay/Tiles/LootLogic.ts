

export function LootTable<T = string>(
  entries: Array<[T, number | "else"]>
): T {
  // Sum weights, remember fallback
  let total = 0;
  let elseOutcome: T | undefined;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, p] of entries) {
    if (p === "else") continue;
    if (p < 0) throw new Error("LootTable: negative weight");
    total += p;
  }

  // Roll
  const roll = Math.random() * (total || 1); // if no weights, roll in [0,1)

  // Walk buckets
  let acc = 0;
  for (const [outcome, p] of entries) {
    if (p === "else") { elseOutcome = outcome; continue; }
    acc += p;
    if (roll < acc) return outcome;
  }

  // Fallback
  if (elseOutcome !== undefined) return elseOutcome;

  // If we get here, weights were 0 or missing and no else provided
  throw new Error('LootTable: no outcome selected and no "else" provided');
}

