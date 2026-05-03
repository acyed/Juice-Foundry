/**
 * Juice Oracle data tables.
 *
 * All static lookup tables used by the 21 oracles. Ported verbatim from the
 * upstream Flutter project (lib/data/*.dart). Each list is indexed 1..N where
 * the d10 result of "10" maps to index 9 (i.e. 0/10 in the original sheets).
 *
 * Reference: https://github.com/johnkord/juice-roll
 *            https://thunder9861.itch.io/juice-oracle
 */

// ============================================================================
//  RANDOM EVENT
// ============================================================================

export const eventFocusTypes = [
  "Advance Time", "Close Thread", "Converge Thread", "Diverge Thread",
  "Immersion", "Keyed Event", "New Character", "NPC Action",
  "Plot Armor", "Remote Event"
];

export const eventFocusDescriptions = {
  "Advance Time": "Time has advanced. Day turns to night, seasons change, guards change patrol. Do bookkeeping; if in a settlement, roll News.",
  "Close Thread": "Roll on your thread list. That thread has ended without your intervention. Determine WHY and remove it.",
  "Converge Thread": "Roll on your thread list. Something moves you closer to that thread. What connection was just revealed?",
  "Diverge Thread": "Roll on your thread list. Something moves you away from that thread. What obstacle or distraction appeared?",
  "Immersion": "Roll on the Immersion table and incorporate the sensory details into what is currently happening.",
  "Keyed Event": "Something you WANT to happen, happens. Check your Keyed Event list. None prepared? Roll a Plot Point instead.",
  "New Character": "A new NPC is present. Roll on NPC + Name tables and add to your character list.",
  "NPC Action": "Roll on your Character list. That NPC performs an action.",
  "Plot Armor": "✨ Whatever issue you are dealing with is SOLVED. ✨ Accept this gift!",
  "Remote Event": "Something happens in a far-away place that you don't yet know about. Add to News for next Settlement visit."
};

export const modifierWords = [
  "Change", "Continue", "Decrease", "Extra", "Increase",
  "Mundane", "Mysterious", "Start", "Stop", "Strange"
];

export const ideaWords = [
  "Attention", "Communication", "Danger", "Element", "Food",
  "Home", "Resource", "Rumor", "Secret", "Vow"
];

export const eventWords = [
  "Ambush", "Anomaly", "Blessing", "Caravan", "Curse",
  "Discovery", "Escape", "Journey", "Prophecy", "Ritual"
];

export const personWords = [
  "Criminal", "Entertainer", "Expert", "Mage", "Mercenary",
  "Noble", "Priest", "Ranger", "Soldier", "Transporter"
];

export const objectWords = [
  "Arrow", "Candle", "Cauldron", "Chain", "Claw",
  "Hook", "Hourglass", "Quill", "Rose", "Skull"
];

// ============================================================================
//  DISCOVER MEANING
// ============================================================================

export const meaningAdjectives = [
  "Ancient", "Betray", "Conceal", "Dangerous", "Helpful",
  "Loud", "Powerful", "Reveal", "Transform", "Unexpected",
  "Artificial", "Burning", "Communicate", "Deceive", "Dirty",
  "Disagreeable", "Oppose", "Peaceful", "Reassuring", "Specialized"
];

export const meaningNouns = [
  "Burden", "Complexity", "Conflict", "Control", "Direction",
  "Happiness", "Memory", "Move", "Shadow", "Trust",
  "Assist", "Break", "Command", "Delay", "Duration",
  "Failure", "Fight", "Leave", "Sacrifice", "Threshold"
];

// ============================================================================
//  NEXT SCENE
// ============================================================================

export const nextSceneFocuses = [
  "Enemy", "Monster", "Event", "Environment", "Community",
  "Person", "Information", "Location", "Object", "Ally"
];

// ============================================================================
//  INTERRUPT / PLOT POINT
// ============================================================================

// d10 -> category. 0 represents a roll of 10.
export const interruptCategories = {
  1: "Action", 2: "Action",
  3: "Tension", 4: "Tension",
  5: "Mystery", 6: "Mystery",
  7: "Social", 8: "Social",
  9: "Personal", 0: "Personal"
};

export const interruptActionEvents = [
  "Abduction", "Barrier", "Battle", "Chase", "Collateral",
  "Crash", "Culmination", "Distraction", "Harm", "Intensify"
];

export const interruptTensionEvents = [
  "Choice", "Depletion", "Enemy", "Intimidation", "Night",
  "Public", "Recurrence", "Remote", "Shady", "Trapped"
];

export const interruptMysteryEvents = [
  "Alternate", "Behavior", "Connected", "Information", "Intercept",
  "Lucky", "Reappearance", "Revelation", "Secret", "Source"
];

export const interruptSocialEvents = [
  "Agreement", "Gathering", "Government", "Inadequate", "Injustice",
  "Misbehave", "Outcast", "Outside", "Reinforcements", "Savior"
];

export const interruptPersonalEvents = [
  "Animosity", "Connection", "Dependent", "Ethical", "Flee",
  "Friend", "Help", "Home", "Humiliation", "Offer"
];

// ============================================================================
//  NPC ACTION
// ============================================================================

export const npcPersonalities = [
  "Cautious", "Curious", "Careless", "Organized", "Reserved",
  "Outgoing", "Critical", "Compassionate", "Confident", "Sensitive"
];

export const npcNeeds = [
  "Sustenance", "Shelter", "Recovery", "Security", "Stability",
  "Friendship", "Acceptance", "Status", "Recognition", "Fulfillment"
];

export const npcMotives = [
  "History", "Family", "Experience", "Flaws", "Reputation",
  "Superiors", "Wealth", "Equipment", "Treasure", "Focus"
];

export const npcActions = [
  "Ambiguous Action", "Talks", "Continues", "Acts (PC Interest)",
  "Next Most Logical", "Gives Something", "Ends Encounter",
  "Acts (Self Interest)", "Takes Something", "Enters Combat"
];

export const npcCombatActions = [
  "Defend", "Shift Focus", "Seize", "Intimidate", "Advantage",
  "Coordinate", "Lure", "Destroy", "Precision", "Power"
];

// ============================================================================
//  DIALOG GRID
// ============================================================================

export const dialogGrid = [
  ["Fact", "Denial", "Query", "Denial", "Action"],
  ["Want", "Query", "Need", "Query", "Fact"],
  ["Action", "Need", "Fact", "Action", "Denial"],
  ["Need", "Query", "Denial", "Query", "Want"],
  ["Query", "Support", "Query", "Support", "Need"]
];

export const dialogFragmentDescriptions = {
  "Fact": "NPC states a fact or observation",
  "Query": "NPC asks a question",
  "Need": "NPC expresses a need or requirement",
  "Want": "NPC expresses a desire or wish",
  "Action": "NPC describes or suggests an action",
  "Denial": "NPC denies, refuses, or disagrees",
  "Support": "NPC offers support or agreement"
};

// ============================================================================
//  NAME GENERATOR
// ============================================================================

export const nameSyllables1 = [
  "a", "e", "i", "o", "u", "de", "ka", "li", "ma", "ro",
  "be", "da", "ki", "le", "mi", "ne", "ru", "si", "ta", "to"
];

export const nameSyllables1Alt = ["fa", "pe", "vi", "no", "su"];

export const nameSyllables2 = [
  "hal", "ris", "del", "mor", "bar", "net", "kel", "lim", "tur", "pen",
  "rond", "kay", "jam", "vash", "zab", "yos", "gran", "ched", "sark", "kic"
];

export const nameSyllables3 = [
  "an", "ar", "er", "ian", "ic", "in", "o", "on", "or", "us",
  "a", "aea", "aya", "elle", "ene", "ess", "ette", "ice", "id", "osa"
];

export const namePatterns = [
  "12o", "12", "12", "23-o", "23-", "23-", "123-o", "123-", "123-", "111",
  "111", "123", "12a", "12i", "23-a", "23-i", "23+", "123-a", "123-i", "123+"
];

// ============================================================================
//  SETTLEMENT
// ============================================================================

export const settlementNamePrefixes = [
  "Frost", "High", "Long", "Lost", "Raven",
  "Shield", "Storm", "Sword", "Thorn", "Wolf"
];

export const settlementNameSuffixes = [
  "Barrow", "Brook", "Fall", "Haven", "Ridge",
  "River", "Rock", "Stead", "Stone", "Wood"
];

export const settlementEstablishments = [
  "Stable", "Tavern", "Inn", "Entertainment", "General Store",
  "Artisan", "Courier", "Temple", "Guild Hall", "Magic Shop"
];

export const settlementEstablishmentDescriptions = {
  "Stable": "Rent/buy horses, transportation to another area.",
  "Tavern": "Food, drink, stories, rumors. NPC info and side quests.",
  "Inn": "Spend the night and rest safely. Sometimes combined with Tavern.",
  "Entertainment": "Market, bath house, casino, brothel, etc.",
  "General Store": "Basics and common items. Rations and torches.",
  "Artisan": "Specialist craftsperson. Repairs, custom orders.",
  "Courier": "Send messages, money, packages. News from elsewhere.",
  "Temple": "Pray, receive blessings, remove curses. Library access.",
  "Guild Hall": "Quest distribution, guild services, food and lodging.",
  "Magic Shop": "Potions, arcane books, dark secrets, trinkets."
};

export const settlementArtisans = [
  "Artist", "Baker", "Tailor", "Tanner", "Archer",
  "Blacksmith", "Carpenter", "Apothecary", "Jeweler", "Scribe"
];

export const settlementArtisanDescriptions = {
  "Artist": "Painter, calligrapher, cartographer, glassblower.",
  "Baker": "Meals, breads, rations.",
  "Tailor": "Clothing, costumes, light armor.",
  "Tanner": "Leather armor, accessories, saddles.",
  "Archer": "Bows, bowstrings, arrows, quivers.",
  "Blacksmith": "Weapons, heavy armor, metal accessories.",
  "Carpenter": "Wagons, structures, furniture, wood items.",
  "Apothecary": "Medicine, herbs, pharmacy.",
  "Jeweler": "Gems, appraisal, cutting, engravings.",
  "Scribe": "Formal letters, magical scrolls, legal documents."
};

export const settlementNews = [
  "War", "Sickness", "Natural Disaster", "Crime", "Succession",
  "Remote Event", "Arrival", "Mail", "Sale", "Celebration"
];

// ============================================================================
//  PAY THE PRICE
// ============================================================================

export const consequences = [
  "Action has Unintended Effect",
  "Current Situation Worsens",
  "Delayed / Disadvantaged",
  "Forced to Act Against Intentions",
  "New Danger / Foe Revealed",
  "Person / Community Exposed to Danger",
  "Separated from Person / Thing",
  "Something of Value Lost / Destroyed",
  "Surprise Complication",
  "Trusted Person Betrays You"
];

export const majorTwists = [
  "Actions Benefit Enemy",
  "Assumption Is False",
  "Dark Secret Revealed",
  "Enemy Gains New Allies",
  "Enemy Shares a Common Goal",
  "It was all a Diversion",
  "Secret Alliance Revealed",
  "Someone Returns Unexpectedly",
  "Unrelated Situations Connected",
  "You are too late"
];

// ============================================================================
//  CHALLENGE
// ============================================================================

export const physicalChallenges = [
  "Medicine", "Survival", "Animal Handling", "Performance", "Intimidation",
  "Perception", "Sleight of Hand", "Stealth", "Acrobatics", "Athletics"
];

export const mentalChallenges = [
  "Tool", "Nature", "Investigate", "Persuasion", "Deception",
  "Language", "Religion", "Arcana", "History", "Insight"
];

export const challengeDcValues = [17, 16, 15, 14, 13, 12, 11, 10, 9, 8];

// ============================================================================
//  DETAILS
// ============================================================================

export const detailColors = [
  "Shade Black", "Leather Brown", "Highlight Yellow", "Forest Green",
  "Cobalt Blue", "Crimson Red", "Royal Violet", "Metallic Silver",
  "Midas Gold", "Holy White"
];

export const detailColorEmoji = [
  "⬛", "🟫", "🟨", "🟩", "🟦", "🟥", "🟪", "⬜", "🟨", "⬜"
];

export const detailProperties = [
  "Age", "Durability", "Familiarity", "Power", "Quality",
  "Rarity", "Size", "Style", "Value", "Weight"
];

export const detailModifiers = [
  "Negative Emotion", "Disfavors PC", "Disfavors Thread", "Disfavors NPC",
  "History", "Property", "Favors NPC", "Favors Thread", "Favors PC",
  "Positive Emotion"
];

export const detailHistories = [
  "Backstory", "Past Thread", "Previous Thread", "Past Scene",
  "Previous Scene", "Current Thread", "Past Action", "Current Scene",
  "Previous Action", "Current Action"
];

// ============================================================================
//  IMMERSION
// ============================================================================

// d10 -> sense. 0 = roll of 10.
export const immersionSenseCategories = {
  1: "See", 2: "See", 3: "See",
  4: "Hear", 5: "Hear", 6: "Hear",
  7: "Smell", 8: "Smell",
  9: "Feel", 0: "Feel"
};

export const immersionSeeDetails = [
  "Broken", "Colorful", "Discarded", "Edible", "Liquid",
  "Natural", "Odd", "Round", "Shiny", "Written"
];

export const immersionHearDetails = [
  "Dripping", "Fire", "Footsteps", "Growling", "Laughter",
  "Music", "Scratching", "Silence", "Talking", "Wind"
];

export const immersionSmellDetails = [
  "Alcohol", "Blood", "Smoke", "Cooking", "Decay",
  "Dust", "Flowers", "Leather", "Oil", "Soil"
];

export const immersionFeelDetails = [
  "Cold", "Damp", "Flexible", "Furry", "Rough",
  "Sharp", "Slippery", "Smooth", "Sticky", "Warm"
];

export const immersionWhereLocations = [
  "Above", "Behind", "In Front", "In The Air", "In The Distance",
  "In The Next Room", "In The Shadows", "Next To You", "On The Ground", "Under"
];

export const immersionNegativeEmotions = [
  "Despair", "Panic", "Fear", "Disgust", "Anger",
  "Sadness", "Arrogance", "Confusion", "Apathy", "Deja Vu"
];

export const immersionPositiveEmotions = [
  "Hope", "Relief", "Courage", "Desire", "Calm",
  "Joy", "Selflessness", "Clarity", "Nostalgia", "Awe"
];

export const immersionCauses = [
  "help is on the way",
  "it is getting closer",
  "it may be valuable",
  "of a childhood event",
  "of a recent memory",
  "the source is unknown",
  "then it is suddenly gone",
  "you recognize it",
  "you were warned about it",
  "you weren't expecting it"
];

// ============================================================================
//  OBJECT / TREASURE
// ============================================================================

export const treasureCategories = [
  "Trinket", "Treasure", "Document", "Accessory", "Weapon", "Armor"
];

export const trinketQualities = ["Broken", "Damaged", "Worn", "Simple", "Exceptional", "Magic"];
export const trinketMaterials = ["Wood", "Bone", "Leather", "Silver", "Gold", "Gem"];
export const trinketTypes = ["Toy/Game", "Bottle", "Instrument", "Charm", "Tool", "Key"];

export const treasureQualities = ["Dusty", "Worn", "Sturdy", "Fine", "New", "Ornate"];
export const treasureContainers = ["None", "Pouch", "Box", "Satchel", "Crate", "Chest"];
export const treasureContents = ["Food", "Art", "Deed", "Silver Coins", "Gold Coins", "Gems"];

export const documentTypes = ["Song", "Picture", "Letter/Note", "Scroll", "Journal", "Book"];
export const documentContents = ["Lewd", "Common", "Map", "Prophecy", "Arcane", "Forbidden"];
export const documentSubjects = ["Religion", "Art", "Science", "Creatures", "History", "Magic"];

export const accessoryQualities = ["Ruined", "Crude", "Simple", "Fine", "Crafted", "Magic"];
export const accessoryMaterials = ["Wood", "Bone", "Leather", "Silver", "Gold", "Gem"];
export const accessoryTypes = ["Headpiece", "Emblem", "Earring", "Bracelet", "Necklace", "Ring"];

export const weaponQualities = ["Broken", "Improvised", "Rough", "Simple", "Martial", "Masterwork"];
export const weaponMaterials = ["Wood", "Bone", "Steel", "Silver", "Mithral", "Adamantine"];
export const weaponTypes = ["Axe/Hammer", "Halberd/Spear", "Sword/Dagger", "Staff/Wand", "Bow", "Exotic"];

export const armorQualities = ["Broken", "Crude", "Rough", "Simple", "Martial", "Masterwork"];
export const armorMaterials = ["Cloth", "Leather", "Bone", "Steel", "Mithral", "Adamantine"];
export const armorTypes = ["Helmet", "Torso", "Arms", "Legs", "Shield", "Full Suit"];

// ============================================================================
//  QUEST
// ============================================================================

export const questObjectives = [
  "Attain", "Create", "Deliver", "Destroy", "Fetch",
  "Infiltrate", "Investigate", "Negotiate", "Protect", "Survive"
];

export const questDescriptions = [
  "Abandoned", "Cold", "Colorful", "Connected", "Dark",
  "Friendly", "Hidden", "Mystical", "Remote", "Wounded"
];

export const questFocuses = [
  "Enemy", "Monster", "Event", "Environment", "Community",
  "Person", "Information", "Location", "Object", "Ally"
];

export const questPrepositions = [
  "Around", "Behind", "In Front Of", "Near", "On Top Of",
  "At", "From", "Inside Of", "Outside Of", "Under"
];

export const questLocations = [
  "Community", "Dungeon Feature", "Dungeon", "Environment", "Event",
  "Natural Hazard", "Outpost", "Settlement", "Transportation", "Wilderness Feature"
];

// ============================================================================
//  WILDERNESS
// ============================================================================

export const wildernessEnvironments = [
  "Arctic", "Mountains", "Cavern", "Hills", "Grassland",
  "Forest", "Swamp", "Water", "Coast", "Desert"
];

export const wildernessTypes = [
  { modifier: 0, name: "Snowy" },
  { modifier: 2, name: "Rocky" },
  { modifier: 3, name: "Expansive" },
  { modifier: 2, name: "Windy" },
  { modifier: 4, name: "Scrub" },
  { modifier: 3, name: "Tropical" },
  { modifier: 1, name: "Dark" },
  { modifier: 3, name: "Exotic" },
  { modifier: 4, name: "Sandy" },
  { modifier: 4, name: "Arid" }
];

export const wildernessEncounters = [
  "Natural Hazard", "Monster", "Weather", "Challenge", "Dungeon",
  "River/Road", "Feature", "Settlement/Camp", "Advance Plot", "Destination/Lost"
];

export const wildernessWeatherTypes = [
  "Blizzard", "Snow Flurries", "Freezing Cold", "Thunder Storm", "Heavy Rain",
  "Light Rain", "Heavy Clouds", "High Winds", "Clear Skies", "Scorching Heat"
];

export const wildernessNaturalHazards = [
  "Creature Tracks", "Dust Storm", "Flood", "Fog", "Rockslide",
  "Unstable Ground", "Crevice", "Escarpment", "River Crossing", "Thick Plants"
];

export const wildernessFeatures = [
  "Bones", "Cairn", "Chasm", "Circle", "Spring",
  "Grave", "Monument", "Tower", "Tree", "Well"
];

// monster formula by environment index (0 = Arctic ... 9 = Desert)
// advantage: '+' = advantage, '-' = disadvantage, '0' = none
export const wildernessMonsterFormulas = [
  { modifier: 0, advantage: "-" }, { modifier: 0, advantage: "0" },
  { modifier: 1, advantage: "-" }, { modifier: 1, advantage: "0" },
  { modifier: 3, advantage: "-" }, { modifier: 2, advantage: "0" },
  { modifier: 3, advantage: "+" }, { modifier: 3, advantage: "0" },
  { modifier: 4, advantage: "-" }, { modifier: 4, advantage: "+" }
];

// ============================================================================
//  DUNGEON
// ============================================================================

export const dungeonAreaTypes = [
  "Passage", "Small Chamber: 3 Doors", "Large Chamber: 3 Doors",
  "Small Chamber: 2 Doors", "Small Chamber: 1 Door (dead end!)",
  "Locked Door", "Known / Expected", "Exit / Stairs",
  "Connection to Previous Area", "Passage"
];

export const dungeonPassageTypes = [
  "Dead End", "Narrow Crawlspace", "Bridge", "Long", "Wide",
  "Expected", "Right Angle Turn", "Side Passage",
  "3-Way Intersection", "4-Way Intersection"
];

export const dungeonRoomConditions = [
  "Partially Collapsed", "Holes in Floor", "Flooded", "Ashes / Burned",
  "Damaged", "Expected", "Stripped Bare", "Used as Campsite",
  "Converted to Other Use", "Pristine"
];

export const dungeonTypes = [
  "Catacombs", "Cavern", "Crypt", "Fortress", "Hideout",
  "Lair", "Mine", "Ruins", "Sanctuary", "Temple"
];

export const dungeonDescriptions = [
  "Bloodstained", "Chaotic", "Endless", "Fallen", "Forbidden",
  "Forgotten", "Shattered", "Shrouded", "Silent", "Unknown"
];

export const dungeonSubjects = [
  "Blades", "Blight", "Darkness", "Fury", "Lies",
  "Madness", "Mist", "Prophecy", "Runes", "Terror"
];

export const dungeonEncounterTypes = [
  "Monster", "Natural Hazard", "Challenge", "Immersion", "Safety",
  "Known", "Trap", "Feature", "Key", "Treasure"
];

export const dungeonMonsterDescriptors = [
  "Agile", "Beast", "Clothed", "Composite", "Decayed",
  "Elemental", "Inscribed", "Intimidating", "Levitating", "Nightmarish"
];

export const dungeonMonsterAbilities = [
  "Climb", "Detect", "Drain", "Entangle", "Illusion",
  "Immune", "Magic", "Paralyze", "Pierce", "Ranged"
];

export const dungeonTrapActions = [
  "Ambush", "Collapse", "Divert", "Imitate", "Lure",
  "Obscure", "Summon", "Surprise", "Surround", "Trigger"
];

export const dungeonTrapSubjects = [
  "Alarm", "Barrier", "Decay", "Denizen", "Fall",
  "Fire", "Light", "Path", "Poison", "Projectile"
];

export const dungeonFeatureTypes = [
  "Library", "Mural", "Mushrooms", "Prison", "Runes",
  "Shrine", "Storage", "Vault", "Well", "Workshop"
];

// ============================================================================
//  MONSTER ENCOUNTER
// ============================================================================

// Each row: [Tracks, Easy, Medium, Hard, Boss]
// "+ X" indicates roughly half-CR; "- X" indicates roughly double-CR.
export const monsterTable = [
  ["+ Wolf", "- Ice Mephit", "- Winter Wolf", "Yeti", "Werebear"],
  ["+ Skeleton", "- Warhorse Skeleton", "- Wight", "- Nightmare", "Wraith"],
  ["+ Drow", "- Giant Spider", "- Quaggoth", "- Phase Spider", "Drider"],
  ["+ Goblin", "- Worg", "+ Hobgoblin", "+ Bugbear", "Hobgoblin Captain"],
  ["Orc", "- Orog", "Orc Eye of Gruumsh", "- Troll", "Orc War Chief"],
  ["Kobold", "+ Giant Weasel", "+ Winged Kobold", "+ Stirge", "Young Dragon"],
  ["Lizardfolk", "Giant Lizard", "Lizardfolk Shaman", "- Giant Crocodile", "Lizard King"],
  ["+ Zombie", "Ghoul", "- Mummy", "Ogre Zombie", "Vampire Spawn"],
  ["Yuan-ti Pureblood", "- Cockatrice", "- Yuan-ti Malison", "Basilisk", "Medusa"],
  ["Gnoll", "- Giant Hyena", "Gnoll Pack Lord", "+ Jackalwere", "Lamia"],
  ["+ Twig Blight", "+ Needle Blight", "+ Vine Blight", "- Shambling Mound", "Green Hag"],
  ["+ Bandit", "Thug", "Scout", "- Veteran", "Bandit Captain"]
];

export const monsterEnvironmentNames = [
  "Arctic", "Mountains", "Cavern", "Hills", "Grassland",
  "Forest", "Swamp", "Water", "Coast", "Desert"
];

export const monsterEnvironmentFormulas = wildernessMonsterFormulas;

// ============================================================================
//  EXTENDED NPC CONVERSATION (1d100)
// ============================================================================

// Each entry below is the value for percentile rolls 1..100. We store as an
// array of length 100 where index 0 = roll of 1.

// Information types (33 unique entries, each repeated 3x for d100 mapping)
const _infoTypeBlocks = [
  "A connection between a PC and",
  "A connection between an antagonist and",
  "A connection between an NPC and",
  "A financial boon involving",
  "A financial loss involving",
  "A gain in influence involving",
  "A loss of influence involving",
  "A loss of opportunity involving",
  "A material boon involving",
  "A material loss involving",
  "A mental boon involving",
  "A mental loss involving",
  "A negative change in",
  "A physical boon involving",
  "A physical loss involving",
  "A positive change in",
  "A significant insight related to",
  "A spiritual boon involving",
  "A spiritual loss involving",
  "An additional opportunity involving",
  "An alteration of",
  "An ambush concerning",
  "An emotional boon involving",
  "An emotional loss involving",
  "Historical/background knowledge about",
  "Negative news about",
  "Positive news about",
  "The acquisition of an ability involving",
  "The acquisition of authority involving",
  "The location of",
  "The loss of an ability involving",
  "The loss of authority involving",
  "The motivations behind"
];

// Build the d100 array: 33 blocks * 3 = 99, plus a final entry for 100
function _expandD100(blocks, finalEntry) {
  const out = [];
  for (const b of blocks) { out.push(b); out.push(b); out.push(b); }
  out.push(finalEntry ?? blocks[blocks.length - 1]);
  return out;
}

export const informationTypes = _expandD100(_infoTypeBlocks, "The motivations behind");

const _infoTopicBlocks = [
  "an artifact", "an event", "an item", "an organization",
  "a community", "a creature", "a deity", "a dungeon",
  "a faction", "a family", "a journey", "a location",
  "a magic item", "a monster", "a person", "a piece of equipment",
  "a plan", "a plot", "a promise", "a question",
  "a region", "a relationship", "a religion", "a resource",
  "a ritual", "a rumor", "a secret", "a settlement",
  "a substance", "a threat", "a tradition", "a weapon",
  "a wilderness area"
];

export const informationTopics = _expandD100(_infoTopicBlocks, "a wilderness area");

const _companionResponseBlocks = [
  "Wholeheartedly agrees and offers help",
  "Agrees enthusiastically",
  "Agrees with some reservations",
  "Reluctantly goes along",
  "Asks for clarification before deciding",
  "Suggests an alternative approach",
  "Wants to delay or postpone",
  "Refuses politely",
  "Refuses firmly",
  "Tries to talk you out of it"
];

const _companionResponseExpanded = (() => {
  const out = [];
  for (const r of _companionResponseBlocks) {
    for (let i = 0; i < 10; i++) out.push(r);
  }
  return out;
})();

export const companionResponses = _companionResponseExpanded;

const _dialogTopicBlocks = [
  "the weather and recent events",
  "local rumors and gossip",
  "a recent crime or scandal",
  "an upcoming festival or celebration",
  "the cost of goods or services",
  "a missing person or thing",
  "strange occurrences in the area",
  "old legends and folklore",
  "their family or relationships",
  "their work or trade"
];

const _dialogTopicExpanded = (() => {
  const out = [];
  for (const r of _dialogTopicBlocks) {
    for (let i = 0; i < 10; i++) out.push(r);
  }
  return out;
})();

export const dialogTopics = _dialogTopicExpanded;

// ============================================================================
//  ABSTRACT ICONS
// ============================================================================

// 1d10 (row, 1-9 then 0) + 1d6 (column 1-6) = 60 total
// Image filenames are `${row}_${col}.png`
export const abstractIconRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
export const abstractIconCols = [1, 2, 3, 4, 5, 6];
