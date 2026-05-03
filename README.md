# Juice Oracle for Foundry VTT

A Foundry VTT v13 module that ports the [Juice Oracle](https://thunder9861.itch.io/juice-oracle) dice mechanics for solo roleplaying. All 21 oracles from the original [juice-roll Flutter app](https://github.com/johnkord/juice-roll) are available from a single floating panel; results are posted to chat as cleanly-formatted cards.

## What's included

A floating panel grouped into five sections, with 21 oracles total:

**Core**

- Fate Check — yes/no questions with 2dF + 1d6 intensity (Likely / Even Odds / Unlikely)
- Expectation Check — test an assumption you've already made
- Next Scene — does the expected scene happen, get altered, or get interrupted?
- Random Event — focus + modifier + idea
- Discover Meaning — adjective + noun for open interpretation
- Interrupt / Plot Point — story interruptions across 5 categories
- Scale — convert 2dF + 1d6 into a percentage modifier (optionally applied to a base value)

**Character**

- NPC Action — disposition × context + personality, need, motive
- NPC Combat Action
- Dialog Generator — walks the 5×5 fragment grid
- Name Generator — Simple (3d20) or Pattern method, neutral / masculine / feminine
- Extended NPC — Information (2d100), Companion Response, or Dialog Topic

**World**

- Settlement — name + establishment (with artisan sub-roll) + news
- Wilderness — environment, weather, encounter (with monster / hazard / feature follow-ups)
- Dungeon: Next Area — area, passage, condition, encounter (with monster / trap / feature sub-rolls)
- Dungeon Name — "Catacombs of the Forgotten Runes," etc.
- Monster Encounter — environment-specific row + difficulty
- Quest — full sentence: Objective + Description + Focus + Preposition + Location
- Object / Treasure — Trinkets, Treasure, Documents, Accessories, Weapons, Armor

**Challenge**

- Challenge — physical or mental skill + DC
- Pay the Price — standard consequence or major twist

**Flavor**

- Details — color, property, modifier (with History / Property follow-ups)
- Immersion — sensory detail + emotion + cause
- Abstract Icons — picture prompts (60 included)

## Installation

Manual install:

1. Download or clone this folder into your Foundry `Data/modules/juice-oracle` directory.
2. Restart Foundry and enable **Juice Oracle** in your world's module settings.

Manifest URL install (once published): paste your `module.json` URL into Foundry's *Install Module* dialog.

## How to use

- Click the new **die** button on the Token controls toolbar, or type `/juice` (or `/juice-oracle`) in chat.
- The panel opens; click any oracle.
- For oracles that need a parameter (e.g. Fate Check likelihood, Settlement size, Monster environment), a small dialog appears.
- The result is posted to chat as a styled card. Anyone in the world will see it.

## Macros & API

The module exposes a small public API for macros:

```javascript
const api = game.modules.get("juice-oracle").api;

// Open the panel programmatically
api.open();

// Roll any oracle directly. All return a result object.
const r = await api.oracles.fateCheck({ likelihood: "Likely" });
console.log(r);

// Render a result to chat-card HTML yourself
const html = api.formatResult(r);
ChatMessage.create({ content: html });
```

Available oracles in `api.oracles`:

`fateCheck`, `expectationCheck`, `nextScene`, `randomEvent`, `discoverMeaning`, `interruptPlotPoint`, `scale`, `npcAction`, `npcCombatAction`, `dialogGenerator`, `nameSimple`, `namePattern`, `settlement`, `objectTreasure`, `quest`, `challenge`, `payThePrice`, `details`, `immersion`, `abstractIcons`, `wilderness`, `dungeonName`, `dungeonNext`, `monsterEncounter`, `extendedNpcInformation`, `extendedCompanionResponse`, `extendedDialogTopic`.

## Compatibility

- **Foundry**: v13 (verified). Uses ApplicationV2 + HandlebarsApplicationMixin and DialogV2.
- **System**: system-agnostic. Does not register actors/items or modify any documents.
- **Dice So Nice!**: rolls go through Foundry's `Roll` API, so DSN should pick up dice rolls automatically.

## Differences from the upstream Flutter app

- Session management was intentionally omitted for v1. Roll history is just chat history.
- Some compound oracles are simplified — for example, the wilderness weather skew is computed straightforwardly rather than tracking long-term wilderness state. The 21 oracle results match the upstream tables and probabilities.

## Credits

- Original Juice Oracle system: [thunder9861](https://thunder9861.itch.io/juice-oracle), licensed under CC BY-NC-SA 4.0.
- Reference implementation (Flutter): [johnkord/juice-roll](https://github.com/johnkord/juice-roll), CC BY-NC-SA 4.0.
- This Foundry module: CC BY-NC-SA 4.0 (per the upstream license).

## License

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0). See the upstream project for full license text.
