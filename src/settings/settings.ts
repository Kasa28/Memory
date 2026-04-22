import {
  initPreview,
  updatePreview
} from "./settingsPreview";

const THEME_LABELS: Record<string, string> = {
  gaming: "Gaming Theme",
  foods: "Foods Theme"
};

const PLAYER_LABELS: Record<string, string> = {
  blue: "Blue Player",
  orange: "Orange Player"
};

/**
 * Initializes the settings screen.
 *
 * @returns {void}
 */
export function initSettings(): void {
  setupHero();
  setupGameStart();
  setupSummary();
  initPreview();
  updatePreview();
  updateSummary();
  updateStartButton();
}

/**
 * Sets up hero button event.
 *
 * @returns {void}
 */
function setupHero(): void {
  const playBtn = document.getElementById("playBtn");
  const heroRef = document.getElementById("hero");
  const settingsRef = document.getElementById("settings");

  if (!playBtn || !heroRef || !settingsRef) return;
  playBtn.addEventListener("click", () => toggleView(heroRef, settingsRef));
}

/**
 * Sets up start game button event.
 *
 * @returns {void}
 */
function setupGameStart(): void {
  const startBtn = document.getElementById("startBtn");
  const settingsRef = document.getElementById("settings");
  const gameRef = document.getElementById("game");

  if (!startBtn || !settingsRef || !gameRef) return;
  startBtn.addEventListener("click", () => startGame(settingsRef, gameRef));
}

/**
 * Starts the game and switches screen.
 *
 * @param {HTMLElement} settingsRef
 * @param {HTMLElement} gameRef
 * @returns {void}
 */
function startGame(settingsRef: HTMLElement, gameRef: HTMLElement): void {
  window.dispatchEvent(new CustomEvent("start-memory-game"));
  toggleView(settingsRef, gameRef);
}

/**
 * Sets up summary listeners.
 *
 * @returns {void}
 */
function setupSummary(): void {
  ["theme", "player", "size"].forEach(addSummaryListeners);
}

/**
 * Adds change listeners for summary values.
 *
 * @param {string} name
 * @returns {void}
 */
function addSummaryListeners(name: string): void {
  getRadios(name).forEach(addSettingsChangeListener);
}

/**
 * Adds a settings change listener.
 *
 * @param {HTMLInputElement} radio
 * @returns {void}
 */
function addSettingsChangeListener(radio: HTMLInputElement): void {
  radio.addEventListener("change", handleSettingsChange);
}

/**
 * Handles general settings changes.
 *
 * @returns {void}
 */
function handleSettingsChange(): void {
  updateSummary();
  updateStartButton();
}

/**
 * Updates the start button state.
 *
 * @returns {void}
 */
function updateStartButton(): void {
  const startBtn = document.getElementById("startBtn") as HTMLButtonElement | null;
  if (!startBtn) return;
  startBtn.disabled = !isGameReady();
}

/**
 * Checks whether all required game settings are chosen.
 *
 * @returns {boolean}
 */
function isGameReady(): boolean {
  const theme = getCheckedValue("theme");
  const player = getCheckedValue("player");
  const size = getCheckedValue("size");
  return Boolean(theme && player && size);
}

/**
 * Updates all summary values.
 *
 * @returns {void}
 */
function updateSummary(): void {
  updateThemeSummary();
  updatePlayerSummary();
  updateSizeSummary();
}

/**
 * Updates theme summary text.
 *
 * @returns {void}
 */
function updateThemeSummary(): void {
  const theme = getCheckedValue("theme");
  updateText("summaryTheme", THEME_LABELS[theme] || "Game theme");
}

/**
 * Updates player summary text.
 *
 * @returns {void}
 */
function updatePlayerSummary(): void {
  const player = getCheckedValue("player");
  updateText("summaryPlayer", PLAYER_LABELS[player] || "Player");
}

/**
 * Updates board size summary text.
 *
 * @returns {void}
 */
function updateSizeSummary(): void {
  const size = getCheckedValue("size");
  const text = size ? `Board-${size} Cards` : "Board size";
  updateText("summarySize", text);
}

/**
 * Updates text content of an element.
 *
 * @param {string} id
 * @param {string} text
 * @returns {void}
 */
function updateText(id: string, text: string): void {
  const element = document.getElementById(id);
  if (!element) return;
  element.textContent = text;
}

/**
 * Returns all radios for a group.
 *
 * @param {string} name
 * @returns {HTMLInputElement[]}
 */
function getRadios(name: string): HTMLInputElement[] {
  return Array.from(
    document.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`)
  );
}

/**
 * Returns the checked value of a radio group.
 *
 * @param {string} name
 * @returns {string}
 */
function getCheckedValue(name: string): string {
  const checked = document.querySelector<HTMLInputElement>(
    `input[name="${name}"]:checked`
  );
  return checked ? checked.value : "";
}

/**
 * Hides one element and shows another.
 *
 * @param {HTMLElement} hideEl
 * @param {HTMLElement} showEl
 * @returns {void}
 */
function toggleView(hideEl: HTMLElement, showEl: HTMLElement): void {
  hideEl.classList.add("is-hidden");
  showEl.classList.remove("is-hidden");
}