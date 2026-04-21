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
  const w = getWinner();
  if (w === "blue") return "Blue Player";
  if (w === "orange") return "Orange Player";
  return "Draw";
}

export function getScores(): { blue: number; orange: number } {
  return { blue: blueScore, orange: orangeScore };
}

function updatePlayerDisplay(): void {
  const el = document.getElementById("currentPlayerIcon") as HTMLImageElement | null;
  if (!el) return;
  el.src = getPlayerIcon(currentPlayer);
}

function updateScoreDisplay(): void {
  const b = document.getElementById("blueScore");
  const o = document.getElementById("orangeScore");
  if (b) b.textContent = String(blueScore);
  if (o) o.textContent = String(orangeScore);
}

function getPlayerIcon(player: string): string {
  const base = import.meta.env.BASE_URL;
  return player === "blue"
    ? `${base}blue_player.svg`
    : `${base}orange_player.svg`;
}

function updateScoreIcons(): void {
  const base = import.meta.env.BASE_URL;
  const o = document.getElementById("orangeScoreIcon") as HTMLImageElement | null;
  const b = document.getElementById("blueScoreIcon") as HTMLImageElement | null;
  if (o) o.src = `${base}orange_player.svg`;
  if (b) b.src = `${base}blue_player.svg`;
}

function getCheckedValue(name: string): string {
  const el = document.querySelector<HTMLInputElement>(
    `input[name="${name}"]:checked`
  );
  return el ? el.value : "";
}