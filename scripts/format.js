/**
 * Render oracle result objects into HTML chat cards.
 *
 * The panel calls `formatResult(result)` and posts the returned HTML to chat
 * via `ChatMessage.create`. Each card is a self-contained <section> element
 * styled by styles/juice.css.
 */

import {
  fateCheckOutcomeText,
  expectationOutcomeText,
  sceneTypeText
} from "./oracles.js";
import { formatFateDice } from "./engine.js";

/** Escape user-visible strings (defensive — most data is hardcoded). */
function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Outer card wrapper. */
function card(title, bodyHtml, footerHtml = "") {
  return `<section class="juice-card">
    <header class="juice-card-header">${esc(title)}</header>
    <div class="juice-card-body">${bodyHtml}</div>
    ${footerHtml ? `<footer class="juice-card-footer">${footerHtml}</footer>` : ""}
  </section>`;
}

/** Subtle "rolled" line. */
function dice(label, value) {
  return `<span class="juice-dice"><span class="juice-dice-label">${esc(label)}</span> ${esc(value)}</span>`;
}

/** Dispatch an oracle result object to the appropriate formatter. */
export function formatResult(r) {
  switch (r.type) {
    case "fateCheck":              return _fateCheck(r);
    case "expectationCheck":       return _expectationCheck(r);
    case "nextScene":              return _nextScene(r);
    case "randomEvent":            return _randomEvent(r);
    case "discoverMeaning":        return _discoverMeaning(r);
    case "interruptPlotPoint":     return _interruptPlotPoint(r);
    case "scale":                  return _scale(r);
    case "npcAction":              return _npcAction(r);
    case "npcCombatAction":        return _npcCombatAction(r);
    case "dialogGenerator":        return _dialog(r);
    case "name":                   return _name(r);
    case "settlement":             return _settlement(r);
    case "objectTreasure":         return _objectTreasure(r);
    case "quest":                  return _quest(r);
    case "challenge":              return _challenge(r);
    case "payThePrice":            return _payThePrice(r);
    case "details":                return _details(r);
    case "immersion":              return _immersion(r);
    case "abstractIcons":          return _abstractIcons(r);
    case "wilderness":             return _wilderness(r);
    case "dungeonName":            return _dungeonName(r);
    case "dungeonNext":            return _dungeonNext(r);
    case "monsterEncounter":       return _monsterEncounter(r);
    case "extendedNpcInformation": return _extInfo(r);
    case "extendedCompanionResponse": return _extCompanion(r);
    case "extendedDialogTopic":    return _extDialogTopic(r);
    default: return card("Juice Oracle", `<pre>${esc(JSON.stringify(r, null, 2))}</pre>`);
  }
}

// ---------------------------------------------------------------------------

function _fateCheck(r) {
  const fateClass = r.outcome.startsWith("yes") ? "juice-yes"
                  : r.outcome.startsWith("no") ? "juice-no"
                  : "juice-neutral";
  const main = `
    <div class="juice-result-main ${fateClass}">${esc(fateCheckOutcomeText[r.outcome] ?? r.outcome)}</div>
    <div class="juice-meta">
      ${dice("Likelihood", r.likelihood)}
      ${dice("Fate", `${formatFateDice(r.fateDice)} (sum ${r.fateSum >= 0 ? "+" : ""}${r.fateSum})`)}
      ${dice("Intensity", r.intensity)}
      ${dice("Primary", r.primaryOnLeft ? "left" : "right")}
    </div>`;

  let trigger = "";
  if (r.specialTrigger === "randomEvent") {
    trigger = `<div class="juice-trigger juice-trigger-event">⚡ Random Event triggered (Yes, but...)</div>`;
    if (r.randomEventResult) {
      trigger += _randomEvent(r.randomEventResult);
    }
  } else if (r.specialTrigger === "invalidAssumption") {
    trigger = `<div class="juice-trigger juice-trigger-warn">⚠ Invalid Assumption — re-examine what you took for granted in your question.</div>`;
  }

  return card("Fate Check", main + trigger);
}

function _expectationCheck(r) {
  const main = `
    <div class="juice-result-main">${esc(expectationOutcomeText[r.outcome] ?? r.outcome)}</div>
    <div class="juice-meta">
      ${dice("Fate", `${formatFateDice(r.fateDice)} (sum ${r.fateSum >= 0 ? "+" : ""}${r.fateSum})`)}
    </div>`;
  let extra = "";
  if (r.outcome === "modifiedIdea" && r.meaningResult) {
    extra = `<div class="juice-subblock"><div class="juice-subhead">Modifier + Idea</div>${_innerDiscoverMeaning(r.meaningResult)}</div>`;
  }
  return card("Expectation Check", main + extra);
}

function _nextScene(r) {
  let extra = "";
  if (r.focusResult) {
    extra = `<div class="juice-subblock"><div class="juice-subhead">Focus (d10 = ${r.focusResult.roll})</div><strong>${esc(r.focusResult.focus)}</strong></div>`;
  } else if (r.plotPointResult) {
    extra = `<div class="juice-subblock"><div class="juice-subhead">Plot Point</div>${_innerInterrupt(r.plotPointResult)}</div>`;
  }
  const main = `
    <div class="juice-result-main">${esc(sceneTypeText[r.sceneType] ?? r.sceneType)}</div>
    <div class="juice-meta">
      ${dice("Fate", `${formatFateDice(r.fateDice)} (sum ${r.fateSum >= 0 ? "+" : ""}${r.fateSum})`)}
    </div>`;
  return card("Next Scene", main + extra);
}

function _randomEvent(r) {
  const body = `
    <div class="juice-result-main">${esc(r.focus)}</div>
    <div class="juice-desc">${esc(r.focusDescription ?? "")}</div>
    <div class="juice-twocol">
      <div><strong>${esc(r.modifier)}</strong> <span class="juice-tag">d10 ${r.modifierRoll}</span></div>
      <div><strong>${esc(r.idea)}</strong> <span class="juice-tag">${esc(r.ideaCategory)} d10 ${r.ideaRoll}</span></div>
    </div>
    <div class="juice-meta">
      ${dice("Focus", `d10 ${r.focusRoll}`)}
      ${dice("Category", `d10 ${r.categoryRoll} → ${r.ideaCategory}`)}
    </div>`;
  return card("Random Event", body);
}

function _innerDiscoverMeaning(r) {
  return `
    <div class="juice-result-main">${esc(r.adjective)} · ${esc(r.noun)}</div>
    <div class="juice-meta">
      ${dice("Adjective", `d20 ${r.adjectiveRoll}`)}
      ${dice("Noun", `d20 ${r.nounRoll}`)}
    </div>`;
}
function _discoverMeaning(r) { return card("Discover Meaning", _innerDiscoverMeaning(r)); }

function _innerInterrupt(r) {
  return `
    <div class="juice-result-main">${esc(r.event)}</div>
    <div class="juice-meta">
      ${dice("Category", `${r.category} (d10 ${r.categoryRoll})`)}
      ${dice("Event", `d10 ${r.eventRoll}`)}
    </div>`;
}
function _interruptPlotPoint(r) { return card("Interrupt / Plot Point", _innerInterrupt(r)); }

function _scale(r) {
  let scaled = "";
  if (r.baseValue !== undefined) {
    scaled = `<div class="juice-twocol">
      <div>Base: <strong>${esc(r.baseValue)}</strong></div>
      <div>Scaled: <strong>${esc(r.scaledValue.toFixed(2))}</strong></div>
    </div>`;
  }
  const body = `
    <div class="juice-result-main">${esc(r.modifier)} (×${r.multiplier})</div>
    ${scaled}
    <div class="juice-meta">
      ${dice("Fate", `${formatFateDice(r.fateDice)} (sum ${r.fateSum >= 0 ? "+" : ""}${r.fateSum})`)}
      ${dice("Intensity", r.intensity)}
      ${dice("Total", r.total)}
    </div>`;
  return card("Scale", body);
}

function _npcAction(r) {
  const body = `
    <div class="juice-result-main">${esc(r.action)}</div>
    <div class="juice-meta">
      ${dice("Disposition", r.disposition)}
      ${dice("Context", r.context)}
      ${dice("Action roll", r.actionAllRolls.length > 1 ? `${r.actionAllRolls.join(", ")} → ${r.actionRoll}` : r.actionRoll)}
    </div>
    <div class="juice-twocol">
      <div><strong>${esc(r.personality)}</strong> <span class="juice-tag">Personality d10 ${r.personalityRoll}</span></div>
      <div><strong>${esc(r.need)}</strong> <span class="juice-tag">Need d10 ${r.needRoll}</span></div>
    </div>
    <div><strong>${esc(r.motive)}</strong> <span class="juice-tag">Motive d10 ${r.motiveRoll}</span></div>`;
  return card("NPC Action", body);
}

function _npcCombatAction(r) {
  return card("NPC Combat Action", `
    <div class="juice-result-main">${esc(r.action)}</div>
    <div class="juice-meta">${dice("d10", r.roll)}</div>`);
}

function _dialog(r) {
  const fragments = r.path.map((p, i) =>
    `<li><strong>${esc(p.fragment)}</strong> <span class="juice-tag">(${p.row},${p.col})</span><div class="juice-desc">${esc(r.descriptions[i] ?? "")}</div></li>`).join("");
  return card("Dialog Generator", `
    <ol class="juice-list">${fragments}</ol>
    <div class="juice-meta">${dice("Direction rolls", r.dirRolls.join(", "))}</div>`);
}

function _name(r) {
  const body = `
    <div class="juice-result-main">${esc(r.name)}</div>
    <div class="juice-meta">
      ${dice("Method", r.method)}
      ${dice("Style", r.style)}
      ${r.pattern ? dice("Pattern", r.pattern) : ""}
      ${dice("Syllables", r.syllables.join(" + "))}
      ${dice("Rolls", r.rolls.join(", "))}
    </div>`;
  return card("Name", body);
}

function _settlement(r) {
  let artisan = "";
  if (r.artisanResult) {
    artisan = `<div class="juice-subblock"><div class="juice-subhead">Artisan (d10 ${r.artisanResult.roll})</div>
      <strong>${esc(r.artisanResult.name)}</strong>
      <div class="juice-desc">${esc(r.artisanResult.description ?? "")}</div></div>`;
  }
  return card("Settlement", `
    <div class="juice-result-main">${esc(r.settlementName)}</div>
    <div class="juice-meta">${dice("Size", r.size)}</div>
    <div class="juice-subblock">
      <div class="juice-subhead">Establishment (d${r.size === "village" ? 6 : 10} ${r.establishmentRoll})</div>
      <strong>${esc(r.establishment)}</strong>
      <div class="juice-desc">${esc(r.establishmentDescription ?? "")}</div>
    </div>
    ${artisan}
    <div class="juice-subblock">
      <div class="juice-subhead">News (d10 ${r.newsRoll})</div>
      <strong>${esc(r.news)}</strong>
    </div>`);
}

function _objectTreasure(r) {
  const cols = r.columns.map((c, i) =>
    `<div><span class="juice-tag">${esc(c)} d6 ${r.rolls[i]}</span><strong>${esc(r.fields[i])}</strong></div>`).join("");
  return card("Object / Treasure", `
    <div class="juice-result-main">${esc(r.summary)}</div>
    <div class="juice-meta">${dice("Category", `d6 ${r.categoryRoll} → ${r.category}`)}</div>
    <div class="juice-threecol">${cols}</div>`);
}

function _quest(r) {
  return card("Quest", `
    <div class="juice-result-main">${esc(r.objective)} the ${esc(r.description.toLowerCase())} ${esc(r.focus.toLowerCase())} ${esc(r.preposition.toLowerCase())} the ${esc(r.location.toLowerCase())}.</div>
    <div class="juice-meta">
      ${dice("Objective", `d10 ${r.rolls.objRoll}`)}
      ${dice("Description", `d10 ${r.rolls.descRoll}`)}
      ${dice("Focus", `d10 ${r.rolls.focusRoll}`)}
      ${dice("Preposition", `d10 ${r.rolls.prepRoll}`)}
      ${dice("Location", `d10 ${r.rolls.locRoll}`)}
    </div>`);
}

function _challenge(r) {
  return card("Challenge", `
    <div class="juice-result-main">${esc(r.skill)} · DC ${r.dc}</div>
    <div class="juice-meta">
      ${dice("Kind", r.kind)}
      ${dice("Skill", `d10 ${r.skillRoll}`)}
      ${dice("DC", `d10 ${r.dcRoll}`)}
    </div>`);
}

function _payThePrice(r) {
  return card(r.major ? "Pay the Price (Major Twist)" : "Pay the Price", `
    <div class="juice-result-main">${esc(r.text)}</div>
    <div class="juice-meta">${dice("d10", r.roll)}</div>`);
}

function _details(r) {
  let extras = "";
  if (r.historyResult) {
    extras += `<div class="juice-subblock"><div class="juice-subhead">History (d10 ${r.historyResult.roll})</div><strong>${esc(r.historyResult.value)}</strong></div>`;
  }
  if (r.propertyFollowUp) {
    extras += `<div class="juice-subblock"><div class="juice-subhead">Property follow-up (d10 ${r.propertyFollowUp.roll})</div><strong>${esc(r.propertyFollowUp.value)}</strong></div>`;
  }
  return card("Details", `
    <div class="juice-result-main">${esc(r.colorEmoji)} ${esc(r.color)} · ${esc(r.property)}</div>
    <div class="juice-meta">
      ${dice("Color", `d10 ${r.colorRoll}`)}
      ${dice("Property", `d10 ${r.propRoll}`)}
      ${dice("Modifier", `d10 ${r.modRoll} → ${r.modifier}`)}
    </div>${extras}`);
}

function _immersion(r) {
  return card("Immersion", `
    <div class="juice-result-main">${esc(r.summary)}</div>
    <div class="juice-meta">
      ${dice("Sense", `d10 ${r.senseRoll} → ${r.sense}`)}
      ${dice("Detail", `d10 ${r.detailRoll}`)}
      ${dice("Where", `d10 ${r.whereRoll}`)}
      ${dice("Emotion", `d10 ${r.emotionRoll} (${r.positive ? "positive" : "negative"})`)}
      ${dice("Cause", `d10 ${r.causeRoll}`)}
    </div>`);
}

function _abstractIcons(r) {
  return card("Abstract Icons", `
    <div class="juice-icon-wrapper">
      <img class="juice-abstract-icon" src="${esc(r.imagePath)}" alt="Abstract icon ${r.rowLabel}_${r.colLabel}" />
    </div>
    <div class="juice-meta">
      ${dice("d10", r.d10Roll)}
      ${dice("d6", r.d6Roll)}
      ${dice("Cell", `${r.rowLabel}_${r.colLabel}`)}
    </div>`);
}

function _wilderness(r) {
  let follow = "";
  if (r.followUp) {
    follow = `<div class="juice-subblock"><div class="juice-subhead">${esc(r.followUp.kind)}</div>`;
    if (r.followUp.kind === "Monster" && r.followUp.value) {
      const m = r.followUp.value;
      follow += `<div class="juice-result-main">${esc(m.monster)}</div>
        <div class="juice-meta">${dice("Difficulty", m.difficulty)}${dice("Row", m.rowRoll)}${dice("Col", m.colRoll)}</div>`;
    } else {
      follow += `<strong>${esc(r.followUp.value)}</strong>`;
    }
    follow += `</div>`;
  }
  return card("Wilderness", `
    <div class="juice-result-main">${esc(r.typeName)} ${esc(r.environment)}</div>
    <div class="juice-meta">
      ${dice("Environment", `d10 ${r.envRoll}`)}
      ${dice("Type Fate", r.typeFate === 1 ? "+" : r.typeFate === -1 ? "−" : "o")}
      ${dice("Weather", r.weather)}
      ${dice("Encounter", r.encounter)}
    </div>${follow}`);
}

function _dungeonName(r) {
  return card("Dungeon Name", `
    <div class="juice-result-main">${esc(r.fullName)}</div>
    <div class="juice-meta">
      ${dice("Dungeon", `d10 ${r.tRoll}`)}
      ${dice("Description", `d10 ${r.dRoll}`)}
      ${dice("Subject", `d10 ${r.sRoll}`)}
    </div>`);
}

function _dungeonNext(r) {
  let detail = "";
  if (r.encounterDetail) {
    if (r.encounterDetail.descriptor) {
      detail = `<div class="juice-subblock"><div class="juice-subhead">Monster</div><strong>${esc(r.encounterDetail.descriptor)} · ${esc(r.encounterDetail.ability)}</strong></div>`;
    } else if (r.encounterDetail.action) {
      detail = `<div class="juice-subblock"><div class="juice-subhead">Trap</div><strong>${esc(r.encounterDetail.action)} · ${esc(r.encounterDetail.subject)}</strong></div>`;
    } else if (r.encounterDetail.feature) {
      detail = `<div class="juice-subblock"><div class="juice-subhead">Feature</div><strong>${esc(r.encounterDetail.feature)}</strong></div>`;
    }
  }
  return card("Dungeon — Next Area", `
    <div class="juice-result-main">${esc(r.area)}</div>
    <div class="juice-meta">
      ${dice("Mode", r.mode)}
      ${dice("Skew", r.skew)}
      ${dice("Area roll", r.allRolls.length > 1 ? `${r.allRolls.join(", ")} → ${r.areaRoll}` : r.areaRoll)}
      ${dice("Passage", `d10 ${r.passageRoll} → ${r.passage}`)}
      ${dice("Condition", `d10 ${r.conditionRoll} → ${r.condition}`)}
      ${dice("Encounter", `d10 ${r.encounterRoll} → ${r.encounter}`)}
    </div>${detail}`);
}

function _monsterEncounter(r) {
  return card("Monster Encounter", `
    <div class="juice-result-main">${esc(r.monster)}</div>
    <div class="juice-meta">
      ${dice("Environment", r.environment)}
      ${dice("Difficulty", r.difficulty)}
      ${dice("Row", r.rowAll && r.rowAll.length > 1 ? `${r.rowAll.join(", ")} → ${r.rowRoll}` : r.rowRoll)}
      ${dice("Column", r.colRoll)}
      ${dice("Formula", `+${r.formula.modifier} @${r.formula.advantage === "0" ? "—" : r.formula.advantage}`)}
    </div>`);
}

function _extInfo(r) {
  return card("Extended NPC: Information", `
    <div class="juice-result-main">${esc(r.summary)}</div>
    <div class="juice-meta">
      ${dice("Type", `d100 ${r.typeRoll}`)}
      ${dice("Topic", `d100 ${r.topicRoll}`)}
    </div>`);
}
function _extCompanion(r) {
  return card("Extended NPC: Companion Response", `
    <div class="juice-result-main">${esc(r.response)}</div>
    <div class="juice-meta">${dice("d100", r.roll)}</div>`);
}
function _extDialogTopic(r) {
  return card("Extended NPC: Dialog Topic", `
    <div class="juice-result-main">${esc(r.topic)}</div>
    <div class="juice-meta">${dice("d100", r.roll)}</div>`);
}
