/**
 * Juice Oracle entry point.
 *
 * Registers a scene-controls button that opens the floating panel, plus a
 * thin macro/console API exposed at `game.modules.get("juice-oracle").api`.
 */

import { JuiceOraclePanel } from "./panel.js";
import * as O from "./oracles.js";
import { formatResult } from "./format.js";

const MODULE_ID = "juice-oracle";

let panelInstance = null;

function getPanel() {
  if (!panelInstance) panelInstance = new JuiceOraclePanel();
  return panelInstance;
}

function openPanel() {
  const p = getPanel();
  if (p.rendered) p.bringToFront();
  else p.render({ force: true });
}

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing Juice Oracle module`);

  // Expose a small public API on the module.
  const mod = game.modules.get(MODULE_ID);
  if (mod) {
    mod.api = {
      open: openPanel,
      panel: getPanel,
      oracles: O,
      formatResult
    };
  }
});

/**
 * Add a button to the Scene Controls left toolbar so the panel is reachable
 * from anywhere in the world. Foundry v13 still fires `getSceneControlButtons`
 * with the controls array as its first argument.
 */
Hooks.on("getSceneControlButtons", (controls) => {
  // controls in v13 is keyed object on some installations and array on others;
  // handle both shapes defensively.
  const tokenControls = Array.isArray(controls)
    ? controls.find(c => c.name === "token")
    : controls?.tokens ?? controls?.token;
  if (!tokenControls) return;

  const tools = Array.isArray(tokenControls.tools) ? tokenControls.tools : Object.values(tokenControls.tools ?? {});
  const button = {
    name: "juice-oracle",
    title: "Juice Oracle",
    icon: "fa-solid fa-dice-d20",
    button: true,
    visible: true,
    onChange: (_event, active) => { if (active) openPanel(); },
    onClick: () => openPanel()
  };

  if (Array.isArray(tokenControls.tools)) {
    tokenControls.tools.push(button);
  } else if (tokenControls.tools && typeof tokenControls.tools === "object") {
    tokenControls.tools["juice-oracle"] = button;
  }
});

/**
 * Also add a chat command: `/juice` opens the panel.
 */
Hooks.on("chatMessage", (_chatLog, content) => {
  const trimmed = content.trim();
  if (trimmed === "/juice" || trimmed === "/juice-oracle") {
    openPanel();
    return false; // suppress the message
  }
  return true;
});
