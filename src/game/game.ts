import { renderBoard } from "./board";
import {
  initGameState,
  switchPlayer,
  addPoint,
  getWinner,
  getWinnerText,
  updateWinnerDisplay,
  updateResultDisplay
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
  const target = e.target as HTMLElement;
  const card = target.closest(".card") as HTMLButtonElement | null;
  if (!card || !isCardClickable(card)) return;
  flipCard(card);
  saveCard(card);
  checkTurn();
}

function isCardClickable(card: HTMLButtonElement): boolean {
  return !lockBoard && card !== firstCard && !card.classList.contains("matched");
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
  updateResultDisplay();
  document.getElementById("gameEndScreen")?.classList.remove("is-hidden");

  setTimeout(() => {
    document.getElementById("gameEndScreen")?.classList.add("is-hidden");
    showWinner();
  }, 5000);
}

function showWinner(): void {
  updateWinnerDisplay();
  toggleWinnerLayout();
  fillWinnerVisuals();
  document.getElementById("winnerScreen")?.classList.remove("is-hidden");
}

function fillWinnerVisuals(): void {
  toggleWinnerTrophy();
  fillFoodsWinnerIcons();
  setWinnerColors();
}

function toggleWinnerLayout(): void {
  const box = document.getElementById("winnerBox");
  if (!box) return;
  box.classList.toggle("winner-box--foods", isFoodsTheme());
  box.classList.toggle("winner-box--gaming", isGamingTheme());
  box.classList.toggle("winner-box--draw", getWinner() === "draw");
}

function toggleWinnerTrophy(): void {
  const trophy = document.getElementById("winnerTrophyIcon");
  if (!trophy) return;
  trophy.classList.toggle("is-hidden", !isGamingTheme());
}

function fillFoodsWinnerIcons(): void {
  showWinnerIcon("winnerBlueIcon", isFoodsTheme() && shouldShowBlue());
  showWinnerIcon("winnerOrangeIcon", isFoodsTheme() && shouldShowOrange());
}

function shouldShowBlue(): boolean {
  const winner = getWinner();
  return winner === "blue" || winner === "draw";
}

function shouldShowOrange(): boolean {
  const winner = getWinner();
  return winner === "orange" || winner === "draw";
}

function showWinnerIcon(id: string, show: boolean): void {
  const img = document.getElementById(id) as HTMLImageElement | null;
  if (!img) return;
  img.classList.toggle("is-hidden", !show);
}

function setWinnerColors(): void {
  const title = document.getElementById("winnerTitle");
  if (!title) return;

  title.classList.remove(
    "winner-title--blue",
    "winner-title--orange",
    "winner-title--draw"
  );

  if (!isGamingTheme()) return;

  const winner = getWinner();
  if (winner === "blue") title.classList.add("winner-title--blue");
  if (winner === "orange") title.classList.add("winner-title--orange");
  if (winner === "draw") title.classList.add("winner-title--draw");
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
  document.getElementById("exitModal")?.classList.remove("is-hidden");
}

function closeExitModal(): void {
  document.getElementById("exitModal")?.classList.add("is-hidden");
}

function quitGame(): void {
  closeExitModal();
  resetGameBoard();
  showSettings();
}

function showSettings(): void {
  document.getElementById("game")?.classList.add("is-hidden");
  document.getElementById("settings")?.classList.remove("is-hidden");
}

function setupWinnerHome(): void {
  const btn = document.getElementById("winnerHomeBtn");
  if (!btn) return;
  btn.addEventListener("click", goHome);
}

function goHome(): void {
  resetGameBoard();
  document.getElementById("game")?.classList.add("is-hidden");
  document.getElementById("hero")?.classList.remove("is-hidden");
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
  document.getElementById("gameEndScreen")?.classList.add("is-hidden");
  document.getElementById("winnerScreen")?.classList.add("is-hidden");
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

function isGamingTheme(): boolean {
  return getCheckedValue("theme") === "gaming";
}

function getCheckedValue(name: string): string {
  const input = document.querySelector<HTMLInputElement>(
    `input[name="${name}"]:checked`
  );
  return input ? input.value : "";
}