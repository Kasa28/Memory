import "../scss/main.scss";
import { initSettings } from "./settings/settings";
import { initGame } from "./game/game";

init();

function init(): void {
  initSettings();
  initGame();
}