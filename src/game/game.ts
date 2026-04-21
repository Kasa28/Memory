import { renderBoard } from "./board";
import {
  initGameState,
  switchPlayer,
  addPoint,
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

  if (!card || lockBoard || card === firstCard || card.classList.contains("matched")) return;

  flipCard(card);
  saveCard(card);
  checkTurn();
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
  showEnd();
}

function showEnd(): void {
  const screen = document.getElementById("gameEndScreen");
  const blue = document.getElementById("resultBlueScore");
  const orange = document.getElementById("resultOrangeScore");

  if (!screen || !blue || !orange) return;

  const s = getScores();
  blue.textContent = String(s.blue);
  orange.textContent = String(s.orange);
  screen.classList.remove("is-hidden");

  setTimeout(() => {
    screen.classList.add("is-hidden");
    showWinner();
  }, 2200);
}

function showWinner(): void {
  const screen = document.getElementById("winnerScreen");
  const title = document.getElementById("winnerTitle");

  if (!screen || !title) return;

  title.textContent = getWinnerText();
  screen.classList.remove("is-hidden");
}

function setupExitGame(): void {
  const exit = document.getElementById("exitGameBtn");
  const cancel = document.getElementById("cancelExitBtn");
  const confirm = document.getElementById("confirmExitBtn");
  const modal = document.getElementById("exitModal");

  if (!exit || !cancel || !confirm || !modal) return;

  exit.addEventListener("click", () => {
    modal.classList.remove("is-hidden");
  });

  cancel.addEventListener("click", () => {
    modal.classList.add("is-hidden");
  });

  confirm.addEventListener("click", () => {
    modal.classList.add("is-hidden");
    resetGameBoard();
  });
}

function setupWinnerHome(): void {
  const btn = document.getElementById("winnerHomeBtn");
  const screen = document.getElementById("winnerScreen");

  if (!btn || !screen) return;

  btn.addEventListener("click", () => {
    screen.classList.add("is-hidden");
    resetGameBoard();
  });
}

function resetGameBoard(): void {
  const field = document.getElementById("field");
  if (field) field.innerHTML = "";
  resetTurn();
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

function closeExitModal(): void {
  document.getElementById("exitModal")?.classList.add("is-hidden");
}

function updateGameTheme(): void {
  const game = document.getElementById("game");
  const theme = getCheckedValue("theme");

  if (!game) return;

  game.classList.remove("theme-gaming-board", "theme-foods-board");

  if (theme === "gaming") game.classList.add("theme-gaming-board");
  if (theme === "foods") game.classList.add("theme-foods-board");
}

function getCheckedValue(name: string): string {
  const el = document.querySelector<HTMLInputElement>(
    `input[name="${name}"]:checked`
  );

  return el ? el.value : "";
}