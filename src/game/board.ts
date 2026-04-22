import { getCardTemplate } from "./boardTemplate";

const BASE_URL = import.meta.env.BASE_URL;
const THEMES: Record<string, string[]> = {
  foods: [
    "brezel.svg",
    "pizza.svg",
    "burger.svg",
    "sushi.svg",
    "hotdog.svg",
    "dessert.svg",
    "cupcake.svg",
    "chicken.svg",
    "wrapper.svg",
    "tartalia.svg",
    "shokolad.svg",
    "sandwich.svg",
    "salad.svg",
    "pommes.svg",
    "panna.svg",
    "macarons.svg",
    "ice.svg",
    "donut.svg"
  ],
  gaming: [
    "2.svg",
    "3.svg",
    "4.svg",
    "5.svg",
    "6.svg",
    "7.svg",
    "8.svg",
    "9.svg",
    "10.svg",
    "11.svg",
    "12.svg",
    "13.svg",
    "14.svg",
    "15.svg",
    "16.svg",
    "17.svg",
    "18.svg",
    "19.svg",
    "fronds.svg"
  ]
};

const CARD_BACKS: Record<string, string> = {
  gaming: `${BASE_URL}cards/gaming/back.svg`,
  foods: `${BASE_URL}cards/foods/back.svg`
};

/**
 * Renders the game board.
 *
 * @returns {void}
 */
export function renderBoard(): void {
  const fieldRef = document.getElementById("field");
  const theme = getCheckedValue("theme");
  const cards = createCards();

  if (!fieldRef || !theme) return;
  fieldRef.innerHTML = cards.map((card) => getCardTemplate(theme, card)).join("");
}

/**
 * Creates the shuffled card list.
 *
 * @returns {string[]}
 */
function createCards(): string[] {
  const theme = getCheckedValue("theme");
  const size = Number(getCheckedValue("size"));
  const images = THEMES[theme];

  if (!images || !size) return [];
  const pairs = size / 2;
  const selected = images.slice(0, pairs);
  return shuffleCards([...selected, ...selected]);
}

/**
 * Shuffles the cards.
 *
 * @param {string[]} cards
 * @returns {string[]}
 */
function shuffleCards(cards: string[]): string[] {
  return [...cards].sort(() => Math.random() - 0.5);
}

/**
 * Returns the card back image path for a theme.
 *
 * @param {string} theme
 * @returns {string}
 */
export function getCardBackImage(theme: string): string {
  return CARD_BACKS[theme] || "";
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