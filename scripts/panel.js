/**
 * Juice Oracle Panel — a floating ApplicationV2 window showing all oracles.
 *
 * Each tile is a clickable area_; some require a small follow-up dialog to
 * pick a parameter (likelihood, environment, kind, etc.). Results are posted
 * to chat.
 */

import * as O from "./oracles.js";
import { formatResult } from "./format.js";

const { ApplicationV2, HandlebarsApplicationMixin, DialogV2 } = foundry.applications.api;

const MODULE_ID = "juice-oracle";

// All 21 oracles, in the same broad ordering the upstream Flutter app uses.
// Each entry has a key, a localization string, an icon, and an `action` name
// that maps to an entry in DEFAULT_OPTIONS.actions.
const ORACLES = [
  // Core
  { key: "fateCheck",        label: "Fate Check",        group: "core",   icon: "fa-solid fa-circle-question", action: "rollFateCheck" },
  { key: "expectationCheck", label: "Expectation Check", group: "core",   icon: "fa-solid fa-eye",             action: "rollExpectation" },
  { key: "nextScene",        label: "Next Scene",        group: "core",   icon: "fa-solid fa-forward",         action: "rollNextScene" },
  { key: "randomEvent",      label: "Random Event",      group: "core",   icon: "fa-solid fa-bolt",            action: "rollRandomEvent" },
  { key: "discoverMeaning",  label: "Discover Meaning",  group: "core",   icon: "fa-solid fa-lightbulb",       action: "rollDiscoverMeaning" },
  { key: "interruptPlot",    label: "Interrupt Plot",    group: "core",   icon: "fa-solid fa-circle-exclamation", action: "rollInterrupt" },
  { key: "scale",            label: "Scale",             group: "core",   icon: "fa-solid fa-scale-balanced",  action: "rollScale" },

  // Character
  { key: "npcAction",            label: "NPC Action",        group: "character", icon: "fa-solid fa-person-running", action: "rollNpcAction" },
  { key: "npcCombatAction",      label: "NPC Combat",        group: "character", icon: "fa-solid fa-khanda",         action: "rollNpcCombat" },
  { key: "dialog",               label: "Dialog Generator",  group: "character", icon: "fa-solid fa-comments",       action: "rollDialog" },
  { key: "name",                 label: "Name Generator",    group: "character", icon: "fa-solid fa-id-card",        action: "rollName" },
  { key: "extendedNpc",          label: "Extended NPC",      group: "character", icon: "fa-solid fa-user-plus",      action: "rollExtendedNpc" },

  // World
  { key: "settlement",       label: "Settlement",        group: "world",  icon: "fa-solid fa-house-chimney",   action: "rollSettlement" },
  { key: "wilderness",       label: "Wilderness",        group: "world",  icon: "fa-solid fa-tree",            action: "rollWilderness" },
  { key: "dungeonNext",      label: "Dungeon: Next Area",group: "world",  icon: "fa-solid fa-dungeon",         action: "rollDungeonNext" },
  { key: "dungeonName",      label: "Dungeon Name",      group: "world",  icon: "fa-solid fa-tag",             action: "rollDungeonName" },
  { key: "monsterEncounter", label: "Monster Encounter", group: "world",  icon: "fa-solid fa-dragon",          action: "rollMonster" },
  { key: "quest",            label: "Quest",             group: "world",  icon: "fa-solid fa-scroll",          action: "rollQuest" },
  { key: "objectTreasure",   label: "Object / Treasure", group: "world",  icon: "fa-solid fa-gem",             action: "rollTreasure" },

  // Challenge
  { key: "challenge",        label: "Challenge",         group: "challenge", icon: "fa-solid fa-mountain",     action: "rollChallenge" },
  { key: "payThePrice",      label: "Pay the Price",     group: "challenge", icon: "fa-solid fa-coins",        action: "rollPayThePrice" },

  // Flavor
  { key: "details",          label: "Details",           group: "flavor", icon: "fa-solid fa-palette",         action: "rollDetails" },
  { key: "immersion",        label: "Immersion",         group: "flavor", icon: "fa-solid fa-wind",            action: "rollImmersion" },
  { key: "abstractIcons",    label: "Abstract Icons",    group: "flavor", icon: "fa-solid fa-shapes",          action: "rollAbstractIcons" }
];

const GROUP_LABELS = {
  core:       "Core Oracles",
  character:  "Character Oracles",
  world:      "World Building",
  challenge:  "Challenge Oracles",
  flavor:     "Flavor Oracles"
};

export class JuiceOraclePanel extends HandlebarsApplicationMixin(ApplicationV2) {

  static DEFAULT_OPTIONS = {
    id: "juice-oracle-panel",
    classes: ["juice-oracle", "juice-oracle-panel"],
    tag: "section",
    window: {
      title: "Juice Oracle",
      icon: "fa-solid fa-dice",
      resizable: true,
      contentClasses: ["juice-oracle-content"]
    },
    position: {
      width: 460,
      height: "auto"
    },
    actions: {
      rollFateCheck:       JuiceOraclePanel._rollFateCheck,
      rollExpectation:     JuiceOraclePanel._wrap(O.expectationCheck),
      rollNextScene:       JuiceOraclePanel._wrap(O.nextScene),
      rollRandomEvent:     JuiceOraclePanel._wrap(O.randomEvent),
      rollDiscoverMeaning: JuiceOraclePanel._wrap(O.discoverMeaning),
      rollInterrupt:       JuiceOraclePanel._wrap(O.interruptPlotPoint),
      rollScale:           JuiceOraclePanel._rollScale,
      rollNpcAction:       JuiceOraclePanel._rollNpcAction,
      rollNpcCombat:       JuiceOraclePanel._wrap(O.npcCombatAction),
      rollDialog:          JuiceOraclePanel._rollDialog,
      rollName:            JuiceOraclePanel._rollName,
      rollExtendedNpc:     JuiceOraclePanel._rollExtendedNpc,
      rollSettlement:      JuiceOraclePanel._rollSettlement,
      rollWilderness:      JuiceOraclePanel._wrap(O.wilderness),
      rollDungeonNext:     JuiceOraclePanel._rollDungeonNext,
      rollDungeonName:     JuiceOraclePanel._wrap(O.dungeonName),
      rollMonster:         JuiceOraclePanel._rollMonster,
      rollQuest:           JuiceOraclePanel._wrap(O.quest),
      rollTreasure:        JuiceOraclePanel._wrap(O.objectTreasure),
      rollChallenge:       JuiceOraclePanel._rollChallenge,
      rollPayThePrice:     JuiceOraclePanel._rollPayThePrice,
      rollDetails:         JuiceOraclePanel._wrap(O.details),
      rollImmersion:       JuiceOraclePanel._wrap(O.immersion),
      rollAbstractIcons:   JuiceOraclePanel._wrap(O.abstractIcons)
    }
  };

  static PARTS = {
    main: {
      template: "modules/juice-oracle/templates/panel.hbs"
    }
  };

  /** @override */
  async _prepareContext(_options) {
    const groups = {};
    for (const oracle of ORACLES) {
      if (!groups[oracle.group]) groups[oracle.group] = { label: GROUP_LABELS[oracle.group], oracles: [] };
      groups[oracle.group].oracles.push(oracle);
    }
    return {
      groups: Object.entries(groups).map(([id, g]) => ({ id, ...g }))
    };
  }

  // -------------------------------------------------------------------------
  //  Action helpers
  // -------------------------------------------------------------------------

  /** Wrap a parameter-less oracle function into an action handler. */
  static _wrap(fn) {
    return async function() {
      const result = await fn();
      await JuiceOraclePanel._postChat(result);
    };
  }

  /** Post the formatted result to the active chat. */
  static async _postChat(result) {
    const html = formatResult(result);
    await ChatMessage.create({
      content: html,
      speaker: ChatMessage.getSpeaker(),
      flags: { [MODULE_ID]: { result } }
    });
  }

  // -------------------------------------------------------------------------
  //  Oracles that need a small parameter dialog
  // -------------------------------------------------------------------------

  static async _rollFateCheck() {
    const choice = await JuiceOraclePanel._chooseFromButtons("Likelihood", [
      { label: "Unlikely", value: "Unlikely" },
      { label: "Even Odds", value: "Even Odds" },
      { label: "Likely", value: "Likely" }
    ]);
    if (!choice) return;
    const r = await O.fateCheck({ likelihood: choice });
    await JuiceOraclePanel._postChat(r);
  }

  static async _rollScale() {
    const baseStr = await JuiceOraclePanel._promptText("Base value (optional)",
      "Enter a number to multiply, or leave blank.", "");
    if (baseStr === null) return;
    const baseValue = baseStr.trim() === "" ? null : Number(baseStr);
    const r = await O.scale({ baseValue });
    await JuiceOraclePanel._postChat(r);
  }

  static async _rollNpcAction() {
    const dispChoice = await JuiceOraclePanel._chooseFromButtons("Disposition", [
      { label: "Active (d10)", value: "active" },
      { label: "Passive (d6)", value: "passive" }
    ]);
    if (!dispChoice) return;
    const ctxChoice = await JuiceOraclePanel._chooseFromButtons("Context", [
      { label: "Active (advantage)", value: "active" },
      { label: "Neutral", value: "neutral" },
      { label: "Passive (disadvantage)", value: "passive" }
    ]);
    if (!ctxChoice) return;
    const r = await O.npcAction({ disposition: dispChoice, context: ctxChoice });
    await JuiceOraclePanel._postChat(r);
  }

  static async _rollDialog() {
    const stepsStr = await JuiceOraclePanel._promptText("Dialog steps", "How many fragments to walk?", "4");
    if (stepsStr === null) return;
    const steps = Math.max(1, Math.min(20, Number(stepsStr) || 4));
    const r = await O.dialogGenerator({ steps });
    await JuiceOraclePanel._postChat(r);
  }

  static async _rollName() {
    const method = await JuiceOraclePanel._chooseFromButtons("Method", [
      { label: "Simple (3d20)", value: "simple" },
      { label: "Pattern", value: "pattern" }
    ]);
    if (!method) return;
    const style = await JuiceOraclePanel._chooseFromButtons("Style", [
      { label: "Neutral", value: "neutral" },
      { label: "Masculine", value: "masculine" },
      { label: "Feminine", value: "feminine" }
    ]);
    if (!style) return;
    const r = method === "pattern"
      ? await O.namePattern({ style })
      : await O.nameSimple({ style });
    await JuiceOraclePanel._postChat(r);
  }

  static async _rollExtendedNpc() {
    const kind = await JuiceOraclePanel._chooseFromButtons("Extended NPC table", [
      { label: "Information (2d100)", value: "info" },
      { label: "Companion Response", value: "companion" },
      { label: "Dialog Topic", value: "topic" }
    ]);
    if (!kind) return;
    let r;
    if (kind === "info") r = await O.extendedNpcInformation();
    else if (kind === "companion") r = await O.extendedCompanionResponse();
    else r = await O.extendedDialogTopic();
    await JuiceOraclePanel._postChat(r);
  }

  static async _rollSettlement() {
    const size = await JuiceOraclePanel._chooseFromButtons("Settlement size", [
      { label: "Village (d6 establishments)", value: "village" },
      { label: "Town (d10)", value: "town" },
      { label: "City (d10)", value: "city" }
    ]);
    if (!size) return;
    const r = await O.settlement({ size });
    await JuiceOraclePanel._postChat(r);
  }

  static async _rollDungeonNext() {
    const mode = await JuiceOraclePanel._chooseFromButtons("Mode", [
      { label: "Entrance (no skew)", value: "entrance" },
      { label: "Next area", value: "next" }
    ]);
    if (!mode) return;
    let skew = "normal";
    if (mode === "next") {
      skew = await JuiceOraclePanel._chooseFromButtons("Skew", [
        { label: "Disadvantage (sprawling, branching)", value: "disadvantage" },
        { label: "Advantage (interconnected, many exits)", value: "advantage" },
        { label: "None", value: "normal" }
      ]);
      if (!skew) return;
    }
    const r = await O.dungeonNext({ mode, skew });
    await JuiceOraclePanel._postChat(r);
  }

  static async _rollMonster() {
    const envs = ["Arctic","Mountains","Cavern","Hills","Grassland","Forest","Swamp","Water","Coast","Desert"];
    const env = await JuiceOraclePanel._chooseFromButtons(
      "Environment",
      envs.map((e, i) => ({ label: e, value: String(i) }))
    );
    if (env === null) return;
    const r = await O.monsterEncounter({ envIdx: Number(env) });
    await JuiceOraclePanel._postChat(r);
  }

  static async _rollChallenge() {
    const kind = await JuiceOraclePanel._chooseFromButtons("Challenge kind", [
      { label: "Physical", value: "physical" },
      { label: "Mental", value: "mental" }
    ]);
    if (!kind) return;
    const r = await O.challenge({ kind });
    await JuiceOraclePanel._postChat(r);
  }

  static async _rollPayThePrice() {
    const major = await JuiceOraclePanel._chooseFromButtons("Severity", [
      { label: "Standard consequence", value: "no" },
      { label: "Major Twist", value: "yes" }
    ]);
    if (!major) return;
    const r = await O.payThePrice({ major: major === "yes" });
    await JuiceOraclePanel._postChat(r);
  }

  // -------------------------------------------------------------------------
  //  Generic dialog helpers
  // -------------------------------------------------------------------------

  /**
   * Show a button-choice dialog; resolves with the chosen value or null.
   */
  static _chooseFromButtons(title, options) {
    return new Promise((resolve) => {
      const buttons = options.map(opt => ({
        action: opt.value,
        label: opt.label,
        callback: () => resolve(opt.value)
      }));
      // Add a final "Cancel" button that resolves null.
      buttons.push({
        action: "_cancel",
        label: "Cancel",
        callback: () => resolve(null)
      });
      new DialogV2({
        window: { title, icon: "fa-solid fa-dice" },
        content: `<p class="juice-prompt">Choose an option:</p>`,
        buttons,
        rejectClose: false,
        close: () => resolve(null)
      }).render({ force: true });
    });
  }

  /**
   * Show a text input dialog. Resolves with the entered string or null on
   * cancel.
   */
  static _promptText(title, prompt, defaultValue = "") {
    return new Promise((resolve) => {
      new DialogV2({
        window: { title, icon: "fa-solid fa-keyboard" },
        content: `<p>${prompt}</p>
          <input type="text" id="juice-prompt-input" value="${defaultValue ?? ""}" autofocus />`,
        buttons: [
          {
            action: "ok",
            label: "OK",
            default: true,
            callback: (_event, _button, dialog) => {
              const input = dialog.element.querySelector("#juice-prompt-input");
              resolve(input?.value ?? "");
            }
          },
          {
            action: "cancel",
            label: "Cancel",
            callback: () => resolve(null)
          }
        ],
        rejectClose: false,
        close: () => resolve(null)
      }).render({ force: true });
    });
  }
}
