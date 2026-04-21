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
    "donut.svg",
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
    "fronds.svg",
  ],
};

export function renderBoard(): void {
  const fieldRef = document.getElementById("field");
  const theme = getCheckedValue("theme");
  const cards = createCards();

  if (!fieldRef || !theme) return;
  fieldRef.innerHTML = cards.map((card) => getCardTemplate(theme, card)).join("");
}

function createCards(): string[] {
  const theme = getCheckedValue("theme");
  const size = Number(getCheckedValue("size"));
  const images = THEMES[theme];

  if (!images || !size) return [];

  const pairs = size / 2;
  const selected = images.slice(0, pairs);
  return shuffleCards([...selected, ...selected]);
}

function shuffleCards(cards: string[]): string[] {
  return [...cards].sort(() => Math.random() - 0.5);
}

function getCardBackImage(theme: string): string {
  const base = import.meta.env.BASE_URL;
  const backs: Record<string, string> = {
    gaming: `${base}cards/gaming/back.svg`,
    foods: `${base}cards/foods/back.svg`,
  };

  return backs[theme] || "";
}

function getCardTemplate(theme: string, card: string): string {
  const base = import.meta.env.BASE_URL;
  const frontImagePath = getCardBackImage(theme);
  const backImagePath = `${base}cards/${theme}/${card}`;

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

function getCheckedValue(name: string): string {
  const checked = document.querySelector<HTMLInputElement>(
    `input[name="${name}"]:checked`
  );
  return checked ? checked.value : "";
}