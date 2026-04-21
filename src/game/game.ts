import { renderBoard } from "./board";
import {
  initGameState,
  switchPlayer,
  addPoint,
  getWinner,
  getWinnerText,
  getScores
} from "./state";

let firstCard: HTMLButtonElement | null = null;
let secondCard: HTMLButtonElement | null = null;
let lockBoard = false;

export function initGame(): void {
  setupCardFlip();
  setupExitGame();
  setupWinnerHome();
  window.addEventListener("start-memory-game", startGame);
}

function startGame(): void {
  resetTurn();
  initGameState();
  renderBoard();
  updateGameTheme();
  closeExitModal();
  hideResultScreens();
}

function setupCardFlip(): void {
  const field = document.getElementById("field");
  if (!field) return;
  field.addEventListener("click", handleCardClick);
}

function handleCardClick(e: Event): void {
  const t = e.target as HTMLElement;
  const card = t.closest(".card") as HTMLButtonElement | null;
  if (!canFlip(card)) return;
  flipCard(card);
  saveCard(card);
  checkTurn();
}

function canFlip(card: HTMLButtonElement | null): boolean {
  if (!card) return false;
  if (lockBoard) return false;
  if (card === firstCard) return false;
  return !card.classList.contains("matched");
}

function flipCard(card: HTMLButtonElement): void {
  card.classList.add("is-flipped");
}

function saveCard(card: HTMLButtonElement): void {
  if (!firstCard) {
    firstCard = card;
    return;
  }
  secondCard = card;
  lockBoard = true;
}

function checkTurn(): void {
  if (!firstCard || !secondCard) return;
  isMatch() ? keepMatch() : unflipCards();
}

function isMatch(): boolean {
  return firstCard?.dataset.card === secondCard?.dataset.card;
}

function keepMatch(): void {
  firstCard?.classList.add("matched");
  secondCard?.classList.add("matched");
  addPoint();
  resetTurn();
  checkGameEnd();
}

function unflipCards(): void {
  setTimeout(() => {
    firstCard?.classList.remove("is-flipped");
    secondCard?.classList.remove("is-flipped");
    switchPlayer();
    resetTurn();
  }, 900);
}

function checkGameEnd(): void {
  const matched = document.querySelectorAll(".card.matched");
  const size = Number(getCheckedValue("size"));
  if (matched.length !== size) return;
  showEndFlow();
}

function showEndFlow(): void {
  if (isFoodsTheme()) {
    showFoodsEnd();
    return;
  }
  showWinner();
}

function showFoodsEnd(): void {
  fillEndScores();
  showScreen("gameEndScreen");
  setTimeout(hideEndAndShowWinner, 5000);
}

function hideEndAndShowWinner(): void {
  hideScreen("gameEndScreen");
  showWinner();
}

function fillEndScores(): void {
  const s = getScores();
  setText("resultBlueScore", s.blue);
  setText("resultOrangeScore", s.orange);
  setImg("resultBlueIcon", getPlayerIcon("blue"));
  setImg("resultOrangeIcon", getPlayerIcon("orange"));
}

function showWinner(): void {
  setWinnerText();
  setWinnerTheme();
  fillWinnerIcons();
  showScreen("winnerScreen");
}

function setWinnerText(): void {
  const title = document.getElementById("winnerTitle");
  if (title) title.textContent = getWinnerText();
}

function setWinnerTheme(): void {
  const box = document.getElementById("winnerBox");
  if (!box) return;
  box.classList.toggle("winner-box--foods", isFoodsTheme());
  box.classList.toggle("winner-box--draw", getWinner() === "draw");
}

function fillWinnerIcons(): void {
  fillWinnerIcon("winnerBlueIcon", "blue", shouldShowBlue());
  fillWinnerIcon("winnerOrangeIcon", "orange", shouldShowOrange());
}

function fillWinnerIcon(id: string, player: string, show: boolean): void {
  const img = document.getElementById(id) as HTMLImageElement | null;
  if (!img) return;
  img.src = getWinnerIcon(player);
  img.alt = `${player} player`;
  img.classList.toggle("is-hidden", !show);
}

function shouldShowBlue(): boolean {
  const winner = getWinner();
  return winner === "blue" || winner === "draw";
}

function shouldShowOrange(): boolean {
  const winner = getWinner();
  return winner === "orange" || winner === "draw";
}

function setupExitGame(): void {
  const exit = document.getElementById("exitGameBtn");
  const cancel = document.getElementById("cancelExitBtn");
  const confirm = document.getElementById("confirmExitBtn");
  if (!exit || !cancel || !confirm) return;
  exit.addEventListener("click", openExitModal);
  cancel.addEventListener("click", closeExitModal);
  confirm.addEventListener("click", quitGame);
}

function openExitModal(): void {
  showScreen("exitModal");
}

function quitGame(): void {
  closeExitModal();
  resetGameBoard();
  showSettings();
}

function showSettings(): void {
  hideScreen("game");
  showScreen("settings");
}

function setupWinnerHome(): void {
  const btn = document.getElementById("winnerHomeBtn");
  if (!btn) return;
  btn.addEventListener("click", goHome);
}

function goHome(): void {
  resetGameBoard();
  hideScreen("game");
  showScreen("hero");
}

function resetGameBoard(): void {
  const field = document.getElementById("field");
  if (field) field.innerHTML = "";
  resetTurn();
  hideResultScreens();
  closeExitModal();
}

function resetTurn(): void {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function hideResultScreens(): void {
  hideScreen("gameEndScreen");
  hideScreen("winnerScreen");
}

function closeExitModal(): void {
  hideScreen("exitModal");
}

function showScreen(id: string): void {
  document.getElementById(id)?.classList.remove("is-hidden");
}

function hideScreen(id: string): void {
  document.getElementById(id)?.classList.add("is-hidden");
}

function updateGameTheme(): void {
  const game = document.getElementById("game");
  const theme = getCheckedValue("theme");
  if (!game) return;
  game.classList.remove("theme-gaming-board", "theme-foods-board");
  if (theme === "gaming") game.classList.add("theme-gaming-board");
  if (theme === "foods") game.classList.add("theme-foods-board");
}

function isFoodsTheme(): boolean {
  return getCheckedValue("theme") === "foods";
}

function setText(id: string, value: number): void {
  const el = document.getElementById(id);
  if (el) el.textContent = String(value);
}

function setImg(id: string, src: string): void {
  const img = document.getElementById(id) as HTMLImageElement | null;
  if (!img) return;
  img.src = src;
}

function getCheckedValue(name: string): string {
  const el = document.querySelector<HTMLInputElement>(
    `input[name="${name}"]:checked`
  );
  return el ? el.value : "";
}

function getPlayerIcon(player: string): string {
  const base = import.meta.env.BASE_URL;
  if (player === "orange") return `${base}currentOrange.svg`;
  return `${base}blue_play.svg`;
}

function getWinnerIcon(player: string): string {
  const base = import.meta.env.BASE_URL;
  if (player === "orange") return `${base}foods_winner_orange.svg`;
  return `${base}foods_winner_blue.svg`;
}