import {
  getWinner,
  updateWinnerDisplay,
  updateResultDisplay
} from "./state";

const RESULT_DELAY = 2000;
const HIDDEN_CLASS = "is-hidden";

/**
 * Shows the end result screen.
 *
 * @returns {void}
 */
export function showGameEndScreen(): void {
  updateResultDisplay();
  document.getElementById("gameEndScreen")?.classList.remove(HIDDEN_CLASS);
  setTimeout(showWinnerFlow, RESULT_DELAY);
}

/**
 * Hides the end screen and shows the winner screen.
 *
 * @returns {void}
 */
function showWinnerFlow(): void {
  document.getElementById("gameEndScreen")?.classList.add(HIDDEN_CLASS);
  showWinner();
}

/**
 * Shows the winner screen.
 *
 * @returns {void}
 */
function showWinner(): void {
  updateWinnerDisplay();
  toggleWinnerLayout();
  fillWinnerVisuals();
  document.getElementById("winnerScreen")?.classList.remove(HIDDEN_CLASS);
}

/**
 * Fills all winner visuals.
 *
 * @returns {void}
 */
function fillWinnerVisuals(): void {
  toggleWinnerTrophy();
  fillFoodsWinnerIcons();
  setWinnerColors();
}

/**
 * Toggles layout classes on the winner box.
 *
 * @returns {void}
 */
function toggleWinnerLayout(): void {
  const box = document.getElementById("winnerBox");
  if (!box) return;
  box.classList.toggle("winner-box--foods", isFoodsTheme());
  box.classList.toggle("winner-box--gaming", isGamingTheme());
  box.classList.toggle("winner-box--draw", getWinner() === "draw");
}

/**
 * Shows or hides the trophy icon.
 *
 * @returns {void}
 */
function toggleWinnerTrophy(): void {
  const trophy = document.getElementById("winnerTrophyIcon");
  if (!trophy) return;
  trophy.classList.toggle(HIDDEN_CLASS, !isGamingTheme());
}

/**
 * Fills winner icons for the foods theme.
 *
 * @returns {void}
 */
function fillFoodsWinnerIcons(): void {
  showWinnerIcon("winnerBlueIcon", isFoodsTheme() && shouldShowBlue());
  showWinnerIcon("winnerOrangeIcon", isFoodsTheme() && shouldShowOrange());
}

/**
 * Checks whether the blue icon should be visible.
 *
 * @returns {boolean}
 */
function shouldShowBlue(): boolean {
  const winner = getWinner();
  return winner === "blue" || winner === "draw";
}

/**
 * Checks whether the orange icon should be visible.
 *
 * @returns {boolean}
 */
function shouldShowOrange(): boolean {
  const winner = getWinner();
  return winner === "orange" || winner === "draw";
}

/**
 * Shows or hides a winner icon.
 *
 * @param {string} id
 * @param {boolean} show
 * @returns {void}
 */
function showWinnerIcon(id: string, show: boolean): void {
  const img = document.getElementById(id) as HTMLImageElement | null;
  if (!img) return;
  img.classList.toggle(HIDDEN_CLASS, !show);
}

/**
 * Applies winner title color classes.
 *
 * @returns {void}
 */
function setWinnerColors(): void {
  const title = document.getElementById("winnerTitle");
  if (!title) return;

  title.classList.remove(
    "winner-title--blue",
    "winner-title--orange",
    "winner-title--draw"
  );

  const winner = getWinner();
  if (winner === "blue") title.classList.add("winner-title--blue");
  if (winner === "orange") title.classList.add("winner-title--orange");
  if (winner === "draw") title.classList.add("winner-title--draw");
}

/**
 * Sets up exit modal events.
 *
 * @param {() => void} resetGameBoard
 * @returns {void}
 */
export function setupExitGame(resetGameBoard: () => void): void {
  const exit = document.getElementById("exitGameBtn");
  const cancel = document.getElementById("cancelExitBtn");
  const confirm = document.getElementById("confirmExitBtn");

  if (!exit || !cancel || !confirm) return;
  exit.addEventListener("click", openExitModal);
  cancel.addEventListener("click", closeExitModal);
  confirm.addEventListener("click", () => quitGame(resetGameBoard));
}

/**
 * Opens the exit modal.
 *
 * @returns {void}
 */
function openExitModal(): void {
  document.getElementById("exitModal")?.classList.remove(HIDDEN_CLASS);
}

/**
 * Closes the exit modal.
 *
 * @returns {void}
 */
export function closeExitModal(): void {
  document.getElementById("exitModal")?.classList.add(HIDDEN_CLASS);
}

/**
 * Quits the game and returns to settings.
 *
 * @param {() => void} resetGameBoard
 * @returns {void}
 */
function quitGame(resetGameBoard: () => void): void {
  closeExitModal();
  resetGameBoard();
  showSettings();
}

/**
 * Shows the settings screen.
 *
 * @returns {void}
 */
function showSettings(): void {
  document.getElementById("game")?.classList.add(HIDDEN_CLASS);
  document.getElementById("settings")?.classList.remove(HIDDEN_CLASS);
}

/**
 * Sets up the winner home button event.
 *
 * @param {() => void} resetGameBoard
 * @returns {void}
 */
export function setupWinnerHome(resetGameBoard: () => void): void {
  const btn = document.getElementById("winnerHomeBtn");
  if (!btn) return;
  btn.addEventListener("click", () => goHome(resetGameBoard));
}

/**
 * Returns from the winner screen to the hero screen.
 *
 * @param {() => void} resetGameBoard
 * @returns {void}
 */
function goHome(resetGameBoard: () => void): void {
  resetGameBoard();
  document.getElementById("game")?.classList.add(HIDDEN_CLASS);
  document.getElementById("hero")?.classList.remove(HIDDEN_CLASS);
}

/**
 * Hides all result screens.
 *
 * @returns {void}
 */
export function hideResultScreens(): void {
  document.getElementById("gameEndScreen")?.classList.add(HIDDEN_CLASS);
  document.getElementById("winnerScreen")?.classList.add(HIDDEN_CLASS);
}

/**
 * Updates the board theme class.
 *
 * @returns {void}
 */
export function updateGameTheme(): void {
  const game = document.getElementById("game");
  const theme = getCheckedValue("theme");

  if (!game) return;
  game.classList.remove("theme-gaming-board", "theme-foods-board");
  if (theme === "gaming") game.classList.add("theme-gaming-board");
  if (theme === "foods") game.classList.add("theme-foods-board");
}

/**
 * Checks if foods theme is selected.
 *
 * @returns {boolean}
 */
function isFoodsTheme(): boolean {
  return getCheckedValue("theme") === "foods";
}

/**
 * Checks if gaming theme is selected.
 *
 * @returns {boolean}
 */
function isGamingTheme(): boolean {
  return getCheckedValue("theme") === "gaming";
}

/**
 * Returns the checked value of a radio group.
 *
 * @param {string} name
 * @returns {string}
 */
function getCheckedValue(name: string): string {
  const input = document.querySelector<HTMLInputElement>(
    `input[name="${name}"]:checked`
  );
  return input ? input.value : "";
}