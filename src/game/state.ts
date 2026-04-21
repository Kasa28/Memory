let currentPlayer = "";
let blueScore = 0;
let orangeScore = 0;

export function initGameState(): void {
  currentPlayer = getCheckedValue("player");
  blueScore = 0;
  orangeScore = 0;
  updateScoreIcons();
  updatePlayerDisplay();
  updateScoreDisplay();
}

export function switchPlayer(): void {
  currentPlayer = currentPlayer === "blue" ? "orange" : "blue";
  updatePlayerDisplay();
}

export function addPoint(): void {
  if (currentPlayer === "blue") blueScore++;
  if (currentPlayer === "orange") orangeScore++;
  updateScoreDisplay();
}

export function getWinner(): string {
  if (blueScore > orangeScore) return "blue";
  if (orangeScore > blueScore) return "orange";
  return "draw";
}

export function getWinnerText(): string {
  const winner = getWinner();
  if (winner === "blue") return "Blue Player";
  if (winner === "orange") return "Orange Player";
  return "Draw";
}

export function getScores(): { blue: number; orange: number } {
  return { blue: blueScore, orange: orangeScore };
}

export function updateWinnerDisplay(): void {
  updateWinnerTitle();
  updateWinnerIcons();
}

export function updateResultDisplay(): void {
  updateResultScores();
  updateResultIcons();
}

function updateWinnerTitle(): void {
  const title = document.getElementById("winnerTitle");
  if (title) title.textContent = getWinnerText();
}

function updateWinnerIcons(): void {
  const blue = getImage("winnerBlueIcon");
  const orange = getImage("winnerOrangeIcon");
  if (!blue || !orange) return;
  setWinnerIconSources(blue, orange);
}

function setWinnerIconSources(
  blue: HTMLImageElement,
  orange: HTMLImageElement
): void {
  blue.src = getFoodsWinnerIcon("blue");
  orange.src = getFoodsWinnerIcon("orange");
  blue.alt = "Blue Player";
  orange.alt = "Orange Player";
}

function updateResultScores(): void {
  const blue = document.getElementById("resultBlueScore");
  const orange = document.getElementById("resultOrangeScore");
  if (blue) blue.textContent = String(blueScore);
  if (orange) orange.textContent = String(orangeScore);
}

function updateResultIcons(): void {
  const blue = getImage("resultBlueIcon");
  const orange = getImage("resultOrangeIcon");
  if (!blue || !orange) return;
  blue.src = getPlayerIcon("blue");
  orange.src = getPlayerIcon("orange");
  blue.alt = "Blue Player";
  orange.alt = "Orange Player";
}

function updatePlayerDisplay(): void {
  const icon = getImage("currentPlayerIcon");
  if (!icon) return;
  icon.src = getPlayerIcon(currentPlayer);
  icon.alt = `${currentPlayer} player`;
}

function updateScoreDisplay(): void {
  const blue = document.getElementById("blueScore");
  const orange = document.getElementById("orangeScore");
  if (blue) blue.textContent = String(blueScore);
  if (orange) orange.textContent = String(orangeScore);
}

function updateScoreIcons(): void {
  const orange = getImage("orangeScoreIcon");
  const blue = getImage("blueScoreIcon");
  if (!orange || !blue) return;
  orange.src = getPlayerIcon("orange");
  blue.src = getPlayerIcon("blue");
}

function getImage(id: string): HTMLImageElement | null {
  return document.getElementById(id) as HTMLImageElement | null;
}

function getPlayerIcon(player: string): string {
  const base = import.meta.env.BASE_URL;
  if (player === "orange") return `${base}currentOrange.svg`;
  return `${base}blue_play.svg`;
}

function getFoodsWinnerIcon(player: string): string {
  const base = import.meta.env.BASE_URL;
  if (player === "orange") return `${base}foods_winner_orange.svg`;
  return `${base}foods_winner_blue.svg`;
}

function getCheckedValue(name: string): string {
  const input = document.querySelector<HTMLInputElement>(
    `input[name="${name}"]:checked`
  );
  return input ? input.value : "";
}