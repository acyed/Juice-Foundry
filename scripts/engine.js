/**
 * Juice Oracle roll engine.
 *
 * A small wrapper around Foundry's Roll API for the dice mechanics the
 * Juice Oracle uses: NdX, Fate dice, advantage/disadvantage, and skewed d6.
 *
 * Every public function uses Foundry's Roll evaluator under the hood so
 * that results are reproducible and could in principle be sent through the
 * Dice So Nice 3D dice integration.
 */

/** Roll a single die with the given number of sides. */
export async function rollDie(sides) {
  if (sides < 1) throw new Error("Dice must have at least 1 side");
  const roll = await new Roll(`1d${sides}`).evaluate();
  return roll.total;
}

/** Roll [count] dice of [sides] sides. Returns an array of individual results. */
export async function rollDice(count, sides) {
  if (count < 1) throw new Error("Must roll at least 1 die");
  const roll = await new Roll(`${count}d${sides}`).evaluate();
  // The first term of an NdX roll is a Die with `.results` of {result, active}.
  return roll.dice[0].results.map(r => r.result);
}

/** Roll [count]d[sides] and return the total. */
export async function rollNdX(count, sides) {
  const dice = await rollDice(count, sides);
  return dice.reduce((a, b) => a + b, 0);
}

/**
 * Roll a single Fate die. Returns -1, 0, or +1 with equal probability.
 * Implemented with a uniform 1d3 (mapped to {-1, 0, +1}).
 */
export async function rollFateDie() {
  const r = await rollDie(3);
  return r - 2;
}

/** Roll [count] Fate dice. Returns an array of individual results. */
export async function rollFateDice(count) {
  if (count < 1) throw new Error("Must roll at least 1 Fate die");
  const out = [];
  for (let i = 0; i < count; i++) out.push(await rollFateDie());
  return out;
}

/** Roll [count] Fate dice and return the sum. */
export async function rollFate(count) {
  const dice = await rollFateDice(count);
  return dice.reduce((a, b) => a + b, 0);
}

/**
 * Roll [count]d[sides] twice; keep the higher total.
 * Returns { roll1, roll2, sum1, sum2, chosenSum, usedFirst }.
 */
export async function rollWithAdvantage(count, sides) {
  const roll1 = await rollDice(count, sides);
  const roll2 = await rollDice(count, sides);
  const sum1 = roll1.reduce((a, b) => a + b, 0);
  const sum2 = roll2.reduce((a, b) => a + b, 0);
  const usedFirst = sum1 >= sum2;
  return { roll1, roll2, sum1, sum2, chosenSum: usedFirst ? sum1 : sum2, usedFirst };
}

/**
 * Roll [count]d[sides] twice; keep the lower total.
 * Returns { roll1, roll2, sum1, sum2, chosenSum, usedFirst }.
 */
export async function rollWithDisadvantage(count, sides) {
  const roll1 = await rollDice(count, sides);
  const roll2 = await rollDice(count, sides);
  const sum1 = roll1.reduce((a, b) => a + b, 0);
  const sum2 = roll2.reduce((a, b) => a + b, 0);
  const usedFirst = sum1 <= sum2;
  return { roll1, roll2, sum1, sum2, chosenSum: usedFirst ? sum1 : sum2, usedFirst };
}

/**
 * Roll a skewed d6.
 *  skew < 0  => roll |skew|+1 d6 and take the lowest (favors low results)
 *  skew == 0 => single d6
 *  skew > 0  => roll  skew+1  d6 and take the highest (favors high results)
 * `skew` should typically be in [-3, 3].
 */
export async function rollSkewedD6(skew) {
  if (skew === 0) return rollDie(6);
  const absSkew = Math.abs(skew);
  const rolls = await rollDice(absSkew + 1, 6);
  return skew > 0 ? Math.max(...rolls) : Math.min(...rolls);
}

/**
 * Convenience helper: roll a single d[sides] with optional advantage/disadvantage.
 * mode: 'normal' | 'advantage' | 'disadvantage'
 * Returns { roll, allRolls } where `allRolls` is the full pair when applicable.
 */
export async function rollWithMode(sides, mode) {
  if (mode === "advantage") {
    const r = await rollWithAdvantage(1, sides);
    return { roll: r.chosenSum, allRolls: [r.sum1, r.sum2] };
  } else if (mode === "disadvantage") {
    const r = await rollWithDisadvantage(1, sides);
    return { roll: r.chosenSum, allRolls: [r.sum1, r.sum2] };
  } else {
    const roll = await rollDie(sides);
    return { roll, allRolls: [roll] };
  }
}

/**
 * Convert a d10 roll (1..10) into a 0..9 array index.
 * In the Juice Oracle's tables, a roll of 10 is treated as the "0/10" row.
 */
export function d10Index(roll) {
  return roll === 10 ? 9 : roll - 1;
}

/**
 * Convert a d10 roll into the Juice "label" (1..9, 0 for ten).
 */
export function d10Label(roll) {
  return roll === 10 ? 0 : roll;
}

/** Format Fate dice as +/-/o glyphs. */
export function formatFateDice(diceArr) {
  return diceArr.map(d => (d === 1 ? "+" : d === -1 ? "−" : "o")).join(" ");
}
