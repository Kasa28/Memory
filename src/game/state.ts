const BASE_URL = import.meta.env.BASE_URL;

const PLAYER_ICONS: Record<string, string> = {
  orange: `${BASE_URL}currentOrange.svg`,
  blue: `${BASE_URL}blue_play.svg`
};

const SCORE_ICONS: Record<string, string> = {
  orange: `${BASE_URL}orange_player.svg`,
  blue: `${BASE_URL}blue_player.svg`
};

const FOODS_WINNER_ICONS: Record<string, string> = {
  orange: `${BASE_URL}foods_winner_orange.svg`,
  blue: `${BASE_URL}foods_winner_blue.svg`
};

let currentPlayer = "";
let blueScore = 0;
let orangeScore = 0;

/**
 * Initializes a fresh game state.
 *
 * @returns {void}
 */
export function initGameState(): void {
  currentPlayer = getCheckedValue("player");
  blueScore = 0;
  orangeScore = 0;
  updateScoreIcons();
  updatePlayerDisplay();
  updateScoreDisplay();
}

/**
 * Switches the current player.
 *
 * @returns {void}
 */
export function switchPlayer(): void {
  currentPlayer = currentPlayer === "blue" ? "orange" : "blue";
  updatePlayerDisplay();
}

/**
 * Adds a point to the current player.
 *
 * @returns {void}
 */
export function addPoint(): void {
  if (currentPlayer === "blue") blueScore++;
  if (currentPlayer === "orange") orangeScore++;
  updateScoreDisplay();
}

/**
 * Returns the current winner.
 *
 * @returns {string}
 */
export function getWinner(): string {
  if (blueScore > orangeScore) return "blue";
  if (orangeScore > blueScore) return "orange";
  return "draw";
}

/**
 * Returns the winner label text.
 *
 * @returns {string}
 */
export function getWinnerText(): string {
  const winner = getWinner();
  if (winner === "blue") return "Blue Player";
  if (winner === "orange") return "Orange Player";
  return "Draw";
}

/**
 * Returns the current score values.
 *
 * @returns {{ blue: number; orange: number }}
 */
export function getScores(): { blue: number; orange: number } {
  return { blue: blueScore, orange: orangeScore };
}

/**
 * Updates all winner screen values.
 *
 * @returns {void}
 */
export function updateWinnerDisplay(): void {
  updateWinnerTitle();
  updateWinnerIcons();
}

/**
 * Updates all result screen values.
 *
 * @returns {void}
 */
export function updateResultDisplay(): void {
  updateResultScores();
  updateResultIcons();
}

/**
 * Updates the winner title text.
 *
 * @returns {void}
 */
function updateWinnerTitle(): void {
  const title = document.getElementById("winnerTitle");
  if (title) title.textContent = getWinnerText();
}

/**
 * Updates the winner icon sources.
 *
 * @returns {void}
 */
function updateWinnerIcons(): void {
  const blue = getImage("winnerBlueIcon");
  const orange = getImage("winnerOrangeIcon");

  if (!blue || !orange) return;
  blue.src = getFoodsWinnerIcon("blue");
  orange.src = getFoodsWinnerIcon("orange");
  blue.alt = "Blue Player";
  orange.alt = "Orange Player";
}

/**
 * Updates the result score text.
 *
 * @returns {void}
 */
function updateResultScores(): void {
  const blue = document.getElementById("resultBlueScore");
  const orange = document.getElementById("resultOrangeScore");

  if (blue) blue.textContent = String(blueScore);
  if (orange) orange.textContent = String(orangeScore);
}

/**
 * Updates the result icon sources.
 *
 * @returns {void}
 */
function updateResultIcons(): void {
  const blue = getImage("resultBlueIcon");
  const orange = getImage("resultOrangeIcon");

  if (!blue || !orange) return;
  blue.src = getPlayerIcon("blue");
  orange.src = getPlayerIcon("orange");
  blue.alt = "Blue Player";
  orange.alt = "Orange Player";
}

/**
 * Updates the current player display.
 *
 * @returns {void}
 */
function updatePlayerDisplay(): void {
  const icon = getImage("currentPlayerIcon");
  if (!icon) return;
  icon.src = getPlayerIcon(currentPlayer);
  icon.alt = `${currentPlayer} player`;
}

/**
 * Updates score text in the top bar.
 *
 * @returns {void}
 */
function updateScoreDisplay(): void {
  const blue = document.getElementById("blueScore");
  const orange = document.getElementById("orangeScore");

  if (blue) blue.textContent = String(blueScore);
  if (orange) orange.textContent = String(orangeScore);
}

/**
 * Updates the score icon sources.
 *
 * @returns {void}
 */
function updateScoreIcons(): void {
  const orange = getImage("orangeScoreIcon");
  const blue = getImage("blueScoreIcon");

  if (!orange || !blue) return;
  orange.src = getScoreIcon("orange");
  blue.src = getScoreIcon("blue");
  orange.alt = "Orange score";
  blue.alt = "Blue score";
}

/**
 * Returns an image element by id.
 *
 * @param {string} id
 * @returns {HTMLImageElement | null}
 */
function getImage(id: string): HTMLImageElement | null {
  return document.getElementById(id) as HTMLImageElement | null;
}

/**
 * Returns the current player icon path.
 *
 * @param {string} player
 * @returns {string}
 */
function getPlayerIcon(player: string): string {
  return PLAYER_ICONS[player] || PLAYER_ICONS.blue;
}

/**
 * Returns the score icon path.
 *
 * @param {string} player
 * @returns {string}
 */
function getScoreIcon(player: string): string {
  return SCORE_ICONS[player] || SCORE_ICONS.blue;
}

/**
 * Returns the foods winner icon path.
 *
 * @param {string} player
 * @returns {string}
 */
function getFoodsWinnerIcon(player: string): string {
  return FOODS_WINNER_ICONS[player] || FOODS_WINNER_ICONS.blue;
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