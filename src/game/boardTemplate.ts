import { getCardBackImage } from "./board";

const BASE_URL = import.meta.env.BASE_URL;

/**
 * Returns the card template markup.
 *
 * @param {string} theme
 * @param {string} card
 * @returns {string}
 */
export function getCardTemplate(theme: string, card: string): string {
  const frontImagePath = getCardBackImage(theme);
  const backImagePath = `${BASE_URL}cards/${theme}/${card}`;

  return `
    <button class="card" data-card="${card}">
      <div class="card__inner">
        <div class="card__face card__face--front">
          <img src="${frontImagePath}" alt="card back">
        </div>
        <div class="card__face card__face--back">
          <img src="${backImagePath}" alt="${card}">
        </div>
      </div>
    </button>
  `;
}