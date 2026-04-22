import { renderBoard } from "./board";
import { initGameState, switchPlayer, addPoint } from "./state";
import {
  setupExitGame,
  setupWinnerHome,
  closeExitModal,
  hideResultScreens,
  showGameEndScreen,
  updateGameTheme
} from "./gameUi";

const UNFLIP_DELAY = 900;
const END_DELAY = 1000;
const MATCHED_CLASS = "matched";
const FLIPPED_CLASS = "is-flipped";

let firstCard: HTMLButtonElement | null = null;
let secondCard: HTMLButtonElement | null = null;
let lockBoard = false;

/**
 * Initializes all game events.
 *
 * @returns {void}
 */
export function initGame(): void {
  setupCardFlip();
  setupExitGame(resetGameBoard);
  setupWinnerHome(resetGameBoard);
  window.addEventListener("start-memory-game", startGame);
}

/**
 * Starts a new game.
 *
 * @returns {void}
 */
function startGame(): void {
  resetTurn();
  initGameState();
  renderBoard();
  updateGameTheme();
  closeExitModal();
  hideResultScreens();
}

/**
 * Sets up board click handling.
 *
 * @returns {void}
 */
function setupCardFlip(): void {
  const field = document.getElementById("field");
  if (!field) return;
  field.addEventListener("click", handleCardClick);
}

/**
 * Handles card click events.
 *
 * @param {Event} e
 * @returns {void}
 */
function handleCardClick(e: Event): void {
  const target = e.target as HTMLElement;
  const card = target.closest(".card") as HTMLButtonElement | null;
  if (!card || !isCardClickable(card)) return;
  flipCard(card);
  saveCard(card);
  checkTurn();
}

/**
 * Checks whether a card can be clicked.
 *
 * @param {HTMLButtonElement} card
 * @returns {boolean}
 */
function isCardClickable(card: HTMLButtonElement): boolean {
  return !lockBoard && card !== firstCard && !card.classList.contains(MATCHED_CLASS);
}

/**
 * Flips a card visually.
 *
 * @param {HTMLButtonElement} card
 * @returns {void}
 */
function flipCard(card: HTMLButtonElement): void {
  card.classList.add(FLIPPED_CLASS);
}

/**
 * Saves the clicked card in the current turn.
 *
 * @param {HTMLButtonElement} card
 * @returns {void}
 */
function saveCard(card: HTMLButtonElement): void {
  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;
}

/**
 * Checks the current turn result.
 *
 * @returns {void}
 */
function checkTurn(): void {
  if (!firstCard || !secondCard) return;
  isMatch() ? keepMatch() : unflipCards();
}

/**
 * Checks if both selected cards match.
 *
 * @returns {boolean}
 */
function isMatch(): boolean {
  return firstCard?.dataset.card === secondCard?.dataset.card;
}

/**
 * Keeps matching cards open and updates score.
 *
 * @returns {void}
 */
function keepMatch(): void {
  firstCard?.classList.add(MATCHED_CLASS);
  secondCard?.classList.add(MATCHED_CLASS);
  addPoint();
  resetTurn();
  checkGameEnd();
}

/**
 * Flips both cards back after delay.
 *
 * @returns {void}
 */
function unflipCards(): void {
  setTimeout(() => {
    firstCard?.classList.remove(FLIPPED_CLASS);
    secondCard?.classList.remove(FLIPPED_CLASS);
    switchPlayer();
    resetTurn();
  }, UNFLIP_DELAY);
}

/**
 * Checks whether the game is finished.
 *
 * @returns {void}
 */
function checkGameEnd(): void {
  const matched = document.querySelectorAll(".card.matched");
  const size = Number(getCheckedValue("size"));
  if (matched.length !== size) return;
  lockBoard = true;
  setTimeout(showGameEndScreen, END_DELAY);
}

/**
 * Resets the game board state.
 *
 * @returns {void}
 */
function resetGameBoard(): void {
  const field = document.getElementById("field");
  if (field) field.innerHTML = "";
  resetTurn();
  hideResultScreens();
  closeExitModal();
}

/**
 * Resets the current turn state.
 *
 * @returns {void}
 */
function resetTurn(): void {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
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