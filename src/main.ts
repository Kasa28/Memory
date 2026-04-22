import "../scss/main.scss";
import { initSettings } from "./settings/settings";
import { initGame } from "./game/game";

/**
 * Initializes the full application.
 *
 * @returns {void}
 */
function init(): void {
  initSettings();
  initGame();
}

init();