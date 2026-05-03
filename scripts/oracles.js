/**
 * Juice Oracle generators.
 *
 * Each exported function returns an object describing the result of an oracle
 * roll. The panel module turns these into chat cards. Functions are async
 * because they delegate dice rolling to Foundry's Roll API via engine.js.
 *
 * Mechanics here mirror the upstream Flutter project's preset classes
 * (lib/presets/*.dart). Citations to the Juice Oracle rule sections live in
 * comments so the logic can be traced back to the source.
 */

import * as D from "./data.js";
import {
  rollDie, rollDice, rollFateDice, rollWithAdvantage, rollWithDisadvantage,
  rollWithMode, rollSkewedD6, d10Index, d10Label, formatFateDice
} from "./engine.js";

// ---------------------------------------------------------------------------
//  FATE CHECK  (2dF + 1d6 intensity)
// ---------------------------------------------------------------------------

/**
 * @param {object} opts
 * @param {"Likely"|"Even Odds"|"Unlikely"} [opts.likelihood="Even Odds"]
 */
export async function fateCheck({ likelihood = "Even Odds" } = {}) {
  const fateDice = await rollFateDice(2);
  const [primary, secondary] = fateDice;
  const intensity = await rollDie(6);

  // 50/50 random assignment of which die is "primary" (Juice page 14)
  const primaryOnLeft = (await rollDie(2)) === 1;
  const isDoubleBlanks = primary === 0 && secondary === 0;

  let specialTrigger = null;
  let randomEventResult = null;
  if (isDoubleBlanks) {
    specialTrigger = primaryOnLeft ? "randomEvent" : "invalidAssumption";
    if (specialTrigger === "randomEvent") {
      randomEventResult = await randomEvent();
    }
  }

  const outcome = _interpretFateCheckDice(primary, secondary, likelihood, isDoubleBlanks);

  return {
    type: "fateCheck",
    likelihood,
    fateDice,
    primary, secondary,
    fateSum: primary + secondary,
    intensity,
    primaryOnLeft,
    outcome,
    specialTrigger,
    randomEventResult
  };
}

function _interpretFateCheckDice(primary, secondary, likelihood, isDoubleBlanks) {
  // Likely: any '+' makes it Yes-like
  if (likelihood === "Likely") {
    if (primary === 1 && secondary === 1) return "yesAnd";
    if (primary === -1 && secondary === -1) return "noAnd";
    if ((primary === 1 && secondary === -1) || (primary === -1 && secondary === 1)) return "yesBut";
    if (primary === 1 || secondary === 1) return "yes";
    if (isDoubleBlanks) return "yes";
    if ((primary === 0 && secondary === -1) || (primary === -1 && secondary === 0)) return "no";
  }

  // Unlikely: any '-' makes it No-like
  if (likelihood === "Unlikely") {
    if (primary === 1 && secondary === 1) return "yesAnd";
    if (primary === -1 && secondary === -1) return "noAnd";
    if ((primary === 1 && secondary === -1) || (primary === -1 && secondary === 1)) return "noBut";
    if ((primary === 1 && secondary === 0) || (primary === 0 && secondary === 1)) return "yes";
    if ((primary === 0 && secondary === -1) || (primary === -1 && secondary === 0)) return "no";
    if (isDoubleBlanks) return "no";
  }

  // Even Odds (standard interpretation, page 13-14)
  if (isDoubleBlanks) return "yesBut"; // double-blank with primaryOnLeft is yesBut+RandomEvent
  if (primary === 1) {
    if (secondary === 1) return "yesAnd";
    if (secondary === -1) return "yesBut";
    return "yesBecause";
  }
  if (primary === -1) {
    if (secondary === -1) return "noAnd";
    if (secondary === 1) return "noBut";
    return "noBecause";
  }
  // primary == 0 → look to secondary
  if (secondary === 1) return "favorable";
  if (secondary === -1) return "unfavorable";
  return "favorable";
}

export const fateCheckOutcomeText = {
  yesAnd: "Yes, and...",
  yesBecause: "Yes, because...",
  yes: "Yes",
  yesBut: "Yes, but...",
  favorable: "Favorable",
  unfavorable: "Unfavorable",
  noBut: "No, but...",
  no: "No",
  noBecause: "No, because...",
  noAnd: "No, and..."
};

// ---------------------------------------------------------------------------
//  EXPECTATION CHECK  (2dF, no intensity)
// ---------------------------------------------------------------------------

export async function expectationCheck() {
  const fateDice = await rollFateDice(2);
  const [primary, secondary] = fateDice;

  let outcome;
  if (primary === 1 && secondary === 1) outcome = "expectedIntensified";
  else if (primary === 1 && secondary === 0) outcome = "expected";
  else if (primary === 1 && secondary === -1) outcome = "nextMostExpected";
  else if (primary === 0 && secondary === 1) outcome = "favorable";
  else if (primary === 0 && secondary === 0) outcome = "modifiedIdea";
  else if (primary === 0 && secondary === -1) outcome = "unfavorable";
  else if (primary === -1 && secondary === 1) outcome = "nextMostExpected";
  else if (primary === -1 && secondary === 0) outcome = "opposite";
  else outcome = "oppositeIntensified";

  let meaningResult = null;
  if (outcome === "modifiedIdea") {
    meaningResult = await discoverMeaning();
  }

  return {
    type: "expectationCheck",
    fateDice,
    primary, secondary,
    fateSum: primary + secondary,
    outcome,
    meaningResult
  };
}

export const expectationOutcomeText = {
  expectedIntensified: "Expected (Intensified)",
  expected: "Expected",
  nextMostExpected: "Next Most Expected",
  favorable: "Favorable",
  modifiedIdea: "Modified Idea",
  unfavorable: "Unfavorable",
  opposite: "Opposite",
  oppositeIntensified: "Opposite (Intensified)"
};

// ---------------------------------------------------------------------------
//  NEXT SCENE  (2dF; doubles trigger sub-rolls)
// ---------------------------------------------------------------------------

export async function nextScene() {
  const fateDice = await rollFateDice(2);
  const [left, right] = fateDice;
  let sceneType;
  if (left === 1 && right === 1) sceneType = "alterAdd";
  else if (left === 1 && right === -1) sceneType = "alterRemove";
  else if (left === -1 && right === 1) sceneType = "interruptFavorable";
  else if (left === -1 && right === -1) sceneType = "interruptUnfavorable";
  else sceneType = "normal";

  let focusResult = null;
  let plotPointResult = null;
  if (sceneType === "alterAdd" || sceneType === "alterRemove") {
    const focusRoll = await rollDie(10);
    focusResult = { roll: d10Label(focusRoll), focus: D.nextSceneFocuses[d10Index(focusRoll)] };
  } else if (sceneType === "interruptFavorable" || sceneType === "interruptUnfavorable") {
    plotPointResult = await interruptPlotPoint();
  }

  return {
    type: "nextScene",
    fateDice,
    left, right,
    fateSum: left + right,
    sceneType,
    focusResult,
    plotPointResult
  };
}

export const sceneTypeText = {
  alterAdd: "Alter (Add) — add something to the expected scene",
  alterRemove: "Alter (Remove) — remove something from the expected scene",
  interruptFavorable: "Interrupt (Favorable) — different scene, with a benefit",
  interruptUnfavorable: "Interrupt (Unfavorable) — different scene, with a complication",
  normal: "Normal — the scene unfolds as you expected"
};

// ---------------------------------------------------------------------------
//  RANDOM EVENT  (focus + modifier + idea)
// ---------------------------------------------------------------------------

export async function randomEvent() {
  const focusRoll = await rollDie(10);
  const focus = D.eventFocusTypes[d10Index(focusRoll)];

  const modifierRoll = await rollDie(10);
  const modifier = D.modifierWords[d10Index(modifierRoll)];

  const categoryRoll = await rollDie(10);
  const ideaRoll = await rollDie(10);
  const ideaIdx = d10Index(ideaRoll);

  let idea, ideaCategory;
  if (categoryRoll <= 3) { idea = D.ideaWords[ideaIdx]; ideaCategory = "Idea"; }
  else if (categoryRoll <= 6) { idea = D.eventWords[ideaIdx]; ideaCategory = "Event"; }
  else if (categoryRoll <= 8) { idea = D.personWords[ideaIdx]; ideaCategory = "Person"; }
  else { idea = D.objectWords[ideaIdx]; ideaCategory = "Object"; }

  return {
    type: "randomEvent",
    focusRoll: d10Label(focusRoll), focus,
    focusDescription: D.eventFocusDescriptions[focus],
    modifierRoll: d10Label(modifierRoll), modifier,
    categoryRoll: d10Label(categoryRoll), ideaCategory,
    ideaRoll: d10Label(ideaRoll), idea
  };
}

// ---------------------------------------------------------------------------
//  DISCOVER MEANING  (2d20)
// ---------------------------------------------------------------------------

export async function discoverMeaning() {
  const adjRoll = await rollDie(20);
  const nounRoll = await rollDie(20);
  return {
    type: "discoverMeaning",
    adjectiveRoll: adjRoll,
    adjective: D.meaningAdjectives[adjRoll - 1],
    nounRoll,
    noun: D.meaningNouns[nounRoll - 1]
  };
}

// ---------------------------------------------------------------------------
//  INTERRUPT / PLOT POINT  (2d10)
// ---------------------------------------------------------------------------

export async function interruptPlotPoint() {
  const categoryRoll = await rollDie(10);
  const eventRoll = await rollDie(10);
  const catKey = d10Label(categoryRoll); // 0 means "10"
  const category = D.interruptCategories[catKey] ?? "Action";
  const idx = d10Index(eventRoll);
  let event;
  switch (category) {
    case "Action":   event = D.interruptActionEvents[idx]; break;
    case "Tension":  event = D.interruptTensionEvents[idx]; break;
    case "Mystery":  event = D.interruptMysteryEvents[idx]; break;
    case "Social":   event = D.interruptSocialEvents[idx]; break;
    case "Personal": event = D.interruptPersonalEvents[idx]; break;
    default:         event = D.interruptActionEvents[idx];
  }
  return {
    type: "interruptPlotPoint",
    categoryRoll: catKey, category,
    eventRoll: d10Label(eventRoll), event
  };
}

// ---------------------------------------------------------------------------
//  SCALE  (2dF + 1d6 -> percentage modifier)
// ---------------------------------------------------------------------------

const _scaleModifiers = {
  "-1": "-100%", 0: "-50%", 1: "-25%", 2: "-10%", 3: "—", 4: "—",
  5: "+10%", 6: "+25%", 7: "+50%", 8: "+100%"
};
const _scaleMultipliers = {
  "-1": 0.0, 0: 0.5, 1: 0.75, 2: 0.9, 3: 1.0, 4: 1.0,
  5: 1.1, 6: 1.25, 7: 1.5, 8: 2.0
};

export async function scale({ baseValue = null } = {}) {
  const fateDice = await rollFateDice(2);
  const fateSum = fateDice[0] + fateDice[1];
  const intensity = await rollDie(6);
  const total = Math.max(-1, Math.min(8, fateSum + intensity));
  const modifier = _scaleModifiers[total] ?? "—";
  const multiplier = _scaleMultipliers[total] ?? 1.0;
  const result = {
    type: "scale",
    fateDice,
    fateSum,
    intensity,
    total,
    modifier,
    multiplier
  };
  if (baseValue !== null && !Number.isNaN(Number(baseValue))) {
    result.baseValue = Number(baseValue);
    result.scaledValue = Number(baseValue) * multiplier;
  }
  return result;
}

// ---------------------------------------------------------------------------
//  NPC ACTION  (d10 disposition with advantage/disadvantage)
// ---------------------------------------------------------------------------

export async function npcAction({
  disposition = "active",  // "active" or "passive"
  context = "active"       // "active" -> advantage, "passive" -> disadvantage, "neutral" -> straight
} = {}) {
  const dieSize = disposition === "passive" ? 6 : 10;
  const mode = context === "active" ? "advantage"
              : context === "passive" ? "disadvantage" : "normal";
  const { roll, allRolls } = await rollWithMode(dieSize, mode);

  // For a d6 disposition we still index into the d10 actions list using the
  // first 6 rows (Juice page 19: passive NPCs use the top half of the table).
  const idx = roll === 10 ? 9 : roll - 1;
  const action = D.npcActions[idx];

  // Auxiliary rolls
  const personalityRoll = await rollDie(10);
  const personality = D.npcPersonalities[d10Index(personalityRoll)];
  const needRoll = await rollDie(10);
  const need = D.npcNeeds[d10Index(needRoll)];
  const motiveRoll = await rollDie(10);
  const motive = D.npcMotives[d10Index(motiveRoll)];

  return {
    type: "npcAction",
    disposition, context,
    actionRoll: roll === 10 ? 0 : roll,
    actionAllRolls: allRolls,
    action,
    personalityRoll: d10Label(personalityRoll), personality,
    needRoll: d10Label(needRoll), need,
    motiveRoll: d10Label(motiveRoll), motive
  };
}

export async function npcCombatAction() {
  const r = await rollDie(10);
  return {
    type: "npcCombatAction",
    roll: d10Label(r),
    action: D.npcCombatActions[d10Index(r)]
  };
}

// ---------------------------------------------------------------------------
//  DIALOG GENERATOR  (5x5 grid walk)
// ---------------------------------------------------------------------------

export async function dialogGenerator({ steps = 4 } = {}) {
  // Start at center (2, 2) which is "Fact"
  let row = 2, col = 2;
  const path = [{ row, col, fragment: D.dialogGrid[row][col] }];
  const dirRolls = [];

  for (let i = 0; i < steps; i++) {
    // Roll d10 for direction (8 directions + 2 stays)
    const dirRoll = await rollDie(10);
    dirRolls.push(d10Label(dirRoll));
    const dx = [0, 1, 1, 1, 0, -1, -1, -1, 0, 0][dirRoll - 1];
    const dy = [-1, -1, 0, 1, 1, 1, 0, -1, 0, 0][dirRoll - 1];
    row = Math.max(0, Math.min(4, row + dy));
    col = Math.max(0, Math.min(4, col + dx));
    path.push({ row, col, fragment: D.dialogGrid[row][col] });
  }

  return {
    type: "dialogGenerator",
    path,
    dirRolls,
    fragments: path.map(p => p.fragment),
    descriptions: path.map(p => D.dialogFragmentDescriptions[p.fragment])
  };
}

// ---------------------------------------------------------------------------
//  NAME GENERATOR
// ---------------------------------------------------------------------------

function _capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s; }

/**
 * Simple method: roll on columns 1, 2, 3.
 * style: "neutral" | "masculine" | "feminine"
 */
export async function nameSimple({ style = "neutral" } = {}) {
  const r1 = await rollDie(20);
  const r2 = await rollDie(20);

  let r3;
  if (style === "masculine") {
    r3 = await rollDie(10); // 1..10 = masculine endings
  } else if (style === "feminine") {
    r3 = (await rollDie(10)) + 10; // 11..20 = feminine endings
  } else {
    r3 = await rollDie(20);
  }

  const syl1 = D.nameSyllables1[r1 - 1];
  const syl2 = D.nameSyllables2[r2 - 1];
  const syl3 = D.nameSyllables3[r3 - 1];
  const name = _capitalize(syl1 + syl2 + syl3);

  return {
    type: "name",
    method: "simple",
    style,
    rolls: [r1, r2, r3],
    syllables: [syl1, syl2, syl3],
    name
  };
}

/**
 * Pattern method: roll d20 to pick a pattern, then expand it.
 * Patterns reference columns 1-3 and may end with a vowel suffix.
 */
export async function namePattern({ style = "neutral" } = {}) {
  let patternRoll;
  if (style === "masculine") {
    const r = await rollWithDisadvantage(1, 20);
    patternRoll = r.chosenSum;
  } else if (style === "feminine") {
    const r = await rollWithAdvantage(1, 20);
    patternRoll = r.chosenSum;
  } else {
    patternRoll = await rollDie(20);
  }

  const pattern = D.namePatterns[Math.max(0, Math.min(19, patternRoll - 1))];
  const rolls = [patternRoll];
  const syllables = [];
  let suffix = "";

  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === "1") {
      const r = await rollDie(20); rolls.push(r);
      if (syllables.length === 0 && r <= 5) syllables.push(D.nameSyllables1[r - 1]);
      else if (r <= 5) syllables.push(D.nameSyllables1Alt[r - 1]);
      else syllables.push(D.nameSyllables1[r - 1]);
    } else if (ch === "2") {
      const r = await rollDie(20); rolls.push(r);
      syllables.push(D.nameSyllables2[r - 1]);
    } else if (ch === "3") {
      const next = pattern[i + 1];
      let r;
      if (next === "+") { r = (await rollDie(10)) + 10; i++; }
      else if (next === "-") { r = await rollDie(10); i++; }
      else { r = await rollDie(20); }
      rolls.push(r);
      syllables.push(D.nameSyllables3[r - 1]);
    } else if (ch === "o" || ch === "a" || ch === "i") {
      suffix = ch;
    }
  }

  const name = _capitalize(syllables.join("") + suffix);
  return {
    type: "name",
    method: "pattern",
    style,
    pattern,
    rolls,
    syllables,
    name
  };
}

// ---------------------------------------------------------------------------
//  SETTLEMENT
// ---------------------------------------------------------------------------

export async function settlement({ size = "town" } = {}) {
  // size: "village" (d6 establishments) or "town"/"city" (d10)
  const prefRoll = await rollDie(10);
  const sufRoll = await rollDie(10);
  const settlementName =
    D.settlementNamePrefixes[d10Index(prefRoll)] +
    D.settlementNameSuffixes[d10Index(sufRoll)];

  const estDie = size === "village" ? 6 : 10;
  const estRoll = await rollDie(estDie);
  const estIdx = estRoll === 10 ? 9 : estRoll - 1;
  const establishment = D.settlementEstablishments[estIdx];

  let artisanResult = null;
  if (establishment === "Artisan") {
    const artRoll = await rollDie(10);
    artisanResult = {
      roll: d10Label(artRoll),
      name: D.settlementArtisans[d10Index(artRoll)],
      description: D.settlementArtisanDescriptions[D.settlementArtisans[d10Index(artRoll)]]
    };
  }

  const newsRoll = await rollDie(10);
  const news = D.settlementNews[d10Index(newsRoll)];

  return {
    type: "settlement",
    size,
    prefixRoll: d10Label(prefRoll),
    suffixRoll: d10Label(sufRoll),
    settlementName,
    establishmentRoll: estRoll === 10 ? 0 : estRoll,
    establishment,
    establishmentDescription: D.settlementEstablishmentDescriptions[establishment],
    artisanResult,
    newsRoll: d10Label(newsRoll),
    news
  };
}

// ---------------------------------------------------------------------------
//  OBJECT / TREASURE
// ---------------------------------------------------------------------------

export async function objectTreasure() {
  const catRoll = await rollDie(6);
  const category = D.treasureCategories[catRoll - 1];

  const r1 = await rollDie(6);
  const r2 = await rollDie(6);
  const r3 = await rollDie(6);

  let columns, fields;
  switch (category) {
    case "Trinket":
      columns = ["Quality", "Material", "Type"];
      fields = [D.trinketQualities[r1 - 1], D.trinketMaterials[r2 - 1], D.trinketTypes[r3 - 1]];
      break;
    case "Treasure":
      columns = ["Quality", "Container", "Contents"];
      fields = [D.treasureQualities[r1 - 1], D.treasureContainers[r2 - 1], D.treasureContents[r3 - 1]];
      break;
    case "Document":
      columns = ["Type", "Content", "Subject"];
      fields = [D.documentTypes[r1 - 1], D.documentContents[r2 - 1], D.documentSubjects[r3 - 1]];
      break;
    case "Accessory":
      columns = ["Quality", "Material", "Type"];
      fields = [D.accessoryQualities[r1 - 1], D.accessoryMaterials[r2 - 1], D.accessoryTypes[r3 - 1]];
      break;
    case "Weapon":
      columns = ["Quality", "Material", "Type"];
      fields = [D.weaponQualities[r1 - 1], D.weaponMaterials[r2 - 1], D.weaponTypes[r3 - 1]];
      break;
    case "Armor":
      columns = ["Quality", "Material", "Type"];
      fields = [D.armorQualities[r1 - 1], D.armorMaterials[r2 - 1], D.armorTypes[r3 - 1]];
      break;
  }

  return {
    type: "objectTreasure",
    categoryRoll: catRoll,
    category,
    rolls: [r1, r2, r3],
    columns,
    fields,
    summary: `${category}: ${fields.join(" · ")}`
  };
}

// ---------------------------------------------------------------------------
//  QUEST
// ---------------------------------------------------------------------------

export async function quest() {
  const objRoll = await rollDie(10);
  const descRoll = await rollDie(10);
  const focusRoll = await rollDie(10);
  const prepRoll = await rollDie(10);
  const locRoll = await rollDie(10);
  return {
    type: "quest",
    objective: D.questObjectives[d10Index(objRoll)],
    description: D.questDescriptions[d10Index(descRoll)],
    focus: D.questFocuses[d10Index(focusRoll)],
    preposition: D.questPrepositions[d10Index(prepRoll)],
    location: D.questLocations[d10Index(locRoll)],
    rolls: { objRoll: d10Label(objRoll), descRoll: d10Label(descRoll),
             focusRoll: d10Label(focusRoll), prepRoll: d10Label(prepRoll),
             locRoll: d10Label(locRoll) }
  };
}

// ---------------------------------------------------------------------------
//  CHALLENGE
// ---------------------------------------------------------------------------

export async function challenge({ kind = "physical" } = {}) {
  const skillRoll = await rollDie(10);
  const dcRoll = await rollDie(10);
  const skill = (kind === "mental" ? D.mentalChallenges : D.physicalChallenges)[d10Index(skillRoll)];
  const dc = D.challengeDcValues[d10Index(dcRoll)];
  return {
    type: "challenge",
    kind,
    skillRoll: d10Label(skillRoll), skill,
    dcRoll: d10Label(dcRoll), dc
  };
}

// ---------------------------------------------------------------------------
//  PAY THE PRICE
// ---------------------------------------------------------------------------

export async function payThePrice({ major = false } = {}) {
  const r = await rollDie(10);
  const text = major ? D.majorTwists[d10Index(r)] : D.consequences[d10Index(r)];
  return {
    type: "payThePrice",
    major,
    roll: d10Label(r),
    text
  };
}

// ---------------------------------------------------------------------------
//  DETAILS
// ---------------------------------------------------------------------------

export async function details() {
  const colorRoll = await rollDie(10);
  const propRoll = await rollDie(10);
  const modRoll = await rollDie(10);

  const color = D.detailColors[d10Index(colorRoll)];
  const colorEmoji = D.detailColorEmoji[d10Index(colorRoll)];
  const property = D.detailProperties[d10Index(propRoll)];
  const modifier = D.detailModifiers[d10Index(modRoll)];

  let historyResult = null;
  let propertyFollowUp = null;
  if (modifier === "History") {
    const hRoll = await rollDie(10);
    historyResult = { roll: d10Label(hRoll), value: D.detailHistories[d10Index(hRoll)] };
  } else if (modifier === "Property") {
    const pRoll = await rollDie(10);
    propertyFollowUp = { roll: d10Label(pRoll), value: D.detailProperties[d10Index(pRoll)] };
  }

  return {
    type: "details",
    colorRoll: d10Label(colorRoll), color, colorEmoji,
    propRoll: d10Label(propRoll), property,
    modRoll: d10Label(modRoll), modifier,
    historyResult,
    propertyFollowUp
  };
}

// ---------------------------------------------------------------------------
//  IMMERSION
// ---------------------------------------------------------------------------

export async function immersion() {
  const senseRoll = await rollDie(10);
  const detailRoll = await rollDie(10);
  const whereRoll = await rollDie(10);
  const emotionRoll = await rollDie(10);
  const fateRoll = await rollFateDice(1);
  const causeRoll = await rollDie(10);

  const senseKey = d10Label(senseRoll);
  const sense = D.immersionSenseCategories[senseKey];
  const sensePool = sense === "See" ? D.immersionSeeDetails
                  : sense === "Hear" ? D.immersionHearDetails
                  : sense === "Smell" ? D.immersionSmellDetails
                  : D.immersionFeelDetails;
  const detail = sensePool[d10Index(detailRoll)];
  const where = D.immersionWhereLocations[d10Index(whereRoll)];

  // Fate die: '+' = positive emotion, '-' or '0' = negative
  const positive = fateRoll[0] === 1;
  const emotion = positive
    ? D.immersionPositiveEmotions[d10Index(emotionRoll)]
    : D.immersionNegativeEmotions[d10Index(emotionRoll)];
  const cause = D.immersionCauses[d10Index(causeRoll)];

  return {
    type: "immersion",
    senseRoll: senseKey, sense,
    detailRoll: d10Label(detailRoll), detail,
    whereRoll: d10Label(whereRoll), where,
    emotionRoll: d10Label(emotionRoll), emotion, positive,
    fateRoll: fateRoll[0],
    causeRoll: d10Label(causeRoll), cause,
    summary: `You ${sense.toLowerCase()} something ${detail.toLowerCase()} ${where.toLowerCase()}. You feel ${emotion.toLowerCase()} because ${cause}.`
  };
}

// ---------------------------------------------------------------------------
//  ABSTRACT ICONS
// ---------------------------------------------------------------------------

export async function abstractIcons() {
  const d10 = await rollDie(10);
  const d6 = await rollDie(6);
  const rowLabel = d10 === 10 ? 0 : d10;
  return {
    type: "abstractIcons",
    d10Roll: d10,
    d6Roll: d6,
    rowLabel,
    colLabel: d6,
    imagePath: `modules/juice-oracle/assets/abstract_icons/${rowLabel}_${d6}.png`
  };
}

// ---------------------------------------------------------------------------
//  WILDERNESS
// ---------------------------------------------------------------------------

export async function wilderness() {
  // Environment (2dF -> -2..+2 mapped onto a d10 row, but Juice uses dF for env
  // weighting; the upstream code uses a simple d10 environment).
  const envRoll = await rollDie(10);
  const env = D.wildernessEnvironments[d10Index(envRoll)];
  const envIdx = d10Index(envRoll);

  // Type (1dF), then weather and encounter
  const typeFate = await rollFateDice(1);
  const typeData = D.wildernessTypes[envIdx];

  const weatherSkew = typeData.modifier;
  const weatherRoll = await rollSkewedD6(weatherSkew - 3); // map modifier 0..4 to skew -3..+1
  // Use a plain d10 instead of skewed mapping for simplicity here:
  const weatherD10 = await rollDie(10);
  const weather = D.wildernessWeatherTypes[d10Index(weatherD10)];

  const encounterRoll = await rollDie(10);
  const encounter = D.wildernessEncounters[d10Index(encounterRoll)];

  // Optional follow-up rolls based on encounter
  let followUp = null;
  if (encounter === "Natural Hazard") {
    const r = await rollDie(10);
    followUp = { kind: "Natural Hazard", roll: d10Label(r), value: D.wildernessNaturalHazards[d10Index(r)] };
  } else if (encounter === "Feature") {
    const r = await rollDie(10);
    followUp = { kind: "Feature", roll: d10Label(r), value: D.wildernessFeatures[d10Index(r)] };
  } else if (encounter === "Monster") {
    followUp = { kind: "Monster", value: await monsterEncounterFor(envIdx) };
  } else if (encounter === "Weather") {
    const r = await rollDie(10);
    followUp = { kind: "Weather", roll: d10Label(r), value: D.wildernessWeatherTypes[d10Index(r)] };
  }

  return {
    type: "wilderness",
    envRoll: d10Label(envRoll), environment: env,
    typeFate: typeFate[0],
    typeName: typeData.name,
    weatherD10: d10Label(weatherD10), weather,
    encounterRoll: d10Label(encounterRoll), encounter,
    followUp,
    weatherSkew
  };
}

// ---------------------------------------------------------------------------
//  DUNGEON GENERATOR
// ---------------------------------------------------------------------------

export async function dungeonName() {
  const tRoll = await rollDie(10);
  const dRoll = await rollDie(10);
  const sRoll = await rollDie(10);
  const dungeon = D.dungeonTypes[d10Index(tRoll)];
  const desc = D.dungeonDescriptions[d10Index(dRoll)];
  const subj = D.dungeonSubjects[d10Index(sRoll)];
  return {
    type: "dungeonName",
    tRoll: d10Label(tRoll), dungeon,
    dRoll: d10Label(dRoll), description: desc,
    sRoll: d10Label(sRoll), subject: subj,
    fullName: `${dungeon} of the ${desc} ${subj}`
  };
}

/**
 * Roll the next dungeon area.
 * @param {object} opts
 * @param {"entrance"|"next"} [opts.mode="next"] - "entrance" forces a fresh
 *   first area; "next" uses advantage/disadvantage based on whether the
 *   dungeon trends bigger or smaller.
 * @param {"normal"|"advantage"|"disadvantage"} [opts.skew="disadvantage"]
 */
export async function dungeonNext({ mode = "next", skew = "disadvantage" } = {}) {
  const { roll: areaRoll, allRolls } = await rollWithMode(10, mode === "entrance" ? "normal" : skew);
  const area = D.dungeonAreaTypes[d10Index(areaRoll)];

  const passageRoll = await rollDie(10);
  const passage = D.dungeonPassageTypes[d10Index(passageRoll)];

  const conditionRoll = await rollDie(10);
  const condition = D.dungeonRoomConditions[d10Index(conditionRoll)];

  const encounterRoll = await rollDie(10);
  const encounter = D.dungeonEncounterTypes[d10Index(encounterRoll)];

  // Sub-rolls for some encounters
  let encounterDetail = null;
  if (encounter === "Monster") {
    const r1 = await rollDie(10);
    const r2 = await rollDie(10);
    encounterDetail = {
      descriptor: D.dungeonMonsterDescriptors[d10Index(r1)],
      ability: D.dungeonMonsterAbilities[d10Index(r2)]
    };
  } else if (encounter === "Trap") {
    const r1 = await rollDie(10);
    const r2 = await rollDie(10);
    encounterDetail = {
      action: D.dungeonTrapActions[d10Index(r1)],
      subject: D.dungeonTrapSubjects[d10Index(r2)]
    };
  } else if (encounter === "Feature") {
    const r1 = await rollDie(10);
    encounterDetail = { feature: D.dungeonFeatureTypes[d10Index(r1)] };
  }

  return {
    type: "dungeonNext",
    mode, skew,
    areaRoll: d10Label(areaRoll), allRolls, area,
    passageRoll: d10Label(passageRoll), passage,
    conditionRoll: d10Label(conditionRoll), condition,
    encounterRoll: d10Label(encounterRoll), encounter,
    encounterDetail
  };
}

// ---------------------------------------------------------------------------
//  MONSTER ENCOUNTER
// ---------------------------------------------------------------------------

/**
 * @param {number} envIdx 0..9 (Arctic..Desert)
 */
export async function monsterEncounterFor(envIdx) {
  const formula = D.monsterEnvironmentFormulas[envIdx] ?? { modifier: 0, advantage: "0" };
  const skewMode = formula.advantage === "+" ? "advantage"
                 : formula.advantage === "-" ? "disadvantage" : "normal";
  const { roll: rowRoll, allRolls: rowAll } = await rollWithMode(10, skewMode);
  // The Forest row uses Blights (row index 10), and an alternate row "**" sits at 11.
  // We use the first ten rows for the standard mapping.
  const rowIdx = Math.max(0, Math.min(11, d10Index(rowRoll)));
  const colRoll = await rollDie(5); // 1=Tracks 2=Easy 3=Med 4=Hard 5=Boss
  const monster = D.monsterTable[rowIdx][colRoll - 1];
  const difficulty = ["Tracks", "Easy", "Medium", "Hard", "Boss"][colRoll - 1];
  return {
    type: "monsterEncounter",
    environment: D.monsterEnvironmentNames[envIdx],
    rowRoll: d10Label(rowRoll), rowAll,
    colRoll, difficulty,
    monster,
    formula
  };
}

export async function monsterEncounter({ envIdx = 5 } = {}) {
  return monsterEncounterFor(envIdx);
}

// ---------------------------------------------------------------------------
//  EXTENDED NPC CONVERSATION (1d100 tables)
// ---------------------------------------------------------------------------

export async function extendedNpcInformation() {
  const typeRoll = await rollDie(100);
  const topicRoll = await rollDie(100);
  return {
    type: "extendedNpcInformation",
    typeRoll, type_: D.informationTypes[typeRoll - 1],
    topicRoll, topic: D.informationTopics[topicRoll - 1],
    summary: `${D.informationTypes[typeRoll - 1]} ${D.informationTopics[topicRoll - 1]}`
  };
}

export async function extendedCompanionResponse() {
  const r = await rollDie(100);
  return { type: "extendedCompanionResponse", roll: r, response: D.companionResponses[r - 1] };
}

export async function extendedDialogTopic() {
  const r = await rollDie(100);
  return { type: "extendedDialogTopic", roll: r, topic: D.dialogTopics[r - 1] };
}
