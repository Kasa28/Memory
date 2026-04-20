import "../scss/main.scss";

const THEMES: Record<string, string[]> = {
  foods: [
    "brezel.svg",
    "pizza.svg",
    "burger.svg",
    "sushi.svg",
    "hotdog.svg",
    "dessert.svg",
    "cupcake.svg",
    "cake.svg",
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

let firstCard: HTMLButtonElement | null = null;
let secondCard: HTMLButtonElement | null = null;
let lockBoard = false;

init();

function init(): void {
  setupHero();
  setupGameStart();
  setupCardFlip();
  setupSettings();
}

function setupHero(): void {
  const playBtn = document.getElementById("playBtn");
  const heroRef = document.getElementById("hero");
  const settingsRef = document.getElementById("settings");
  if (!playBtn || !heroRef || !settingsRef) return;
  playBtn.addEventListener("click", () => toggleView(heroRef, settingsRef));
}

function setupGameStart(): void {
  const startBtn = document.getElementById("startBtn");
  const settingsRef = document.getElementById("settings");
  const gameRef = document.getElementById("game");
  if (!startBtn || !settingsRef || !gameRef) return;
  startBtn.addEventListener("click", () => startGame(settingsRef, gameRef));
}

function startGame(settingsRef: HTMLElement, gameRef: HTMLElement): void {
  resetTurn();
  renderBoard();
  toggleView(settingsRef, gameRef);
}

function setupCardFlip(): void {
  const fieldRef = document.getElementById("field");
  if (!fieldRef) return;
  fieldRef.addEventListener("click", handleCardClick);
}

function setupSettings(): void {
  setupThemePreview();
  setupSummary();
  updatePreview();
  updateSummary();
  updateStartButton();
}

function setupThemePreview(): void {
  const radios = getRadios("theme");
  radios.forEach((radio) => radio.addEventListener("change", handleThemeChange));
}

function handleThemeChange(): void {
  updatePreview();
  updateSummary();
  updateStartButton();
}

function setupSummary(): void {
  ["player", "size"].forEach((name) => addSummaryListeners(name));
}

function addSummaryListeners(name: string): void {
  const radios = getRadios(name);
  radios.forEach((radio) => radio.addEventListener("change", handleSettingsChange));
}

function handleSettingsChange(): void {
  updateSummary();
  updateStartButton();
}

function updateStartButton(): void {
  const startBtn = document.getElementById("startBtn") as HTMLButtonElement | null;
  if (!startBtn) return;
  startBtn.disabled = !isGameReady();
}

function isGameReady(): boolean {
  const theme = getCheckedValue("theme");
  const player = getCheckedValue("player");
  const size = getCheckedValue("size");
  return Boolean(theme && player && size);
}

function getRadios(name: string): HTMLInputElement[] {
  return Array.from(document.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`));
}

function getCheckedValue(name: string): string {
  const checked = document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
  return checked ? checked.value : "";
}

function updatePreview(): void {
  const preview = document.getElementById("preview");
  const theme = getCheckedValue("theme");
  if (!preview || !theme) return;
  preview.style.backgroundImage = `url(${getPreviewImage(theme)})`;
  preview.style.backgroundSize = "contain";
  preview.style.backgroundPosition = "center";
  preview.style.backgroundRepeat = "no-repeat";
}

function getPreviewImage(theme: string): string {
  const base = import.meta.env.BASE_URL;
  const images: Record<string, string> = {
    gaming: `${base}Theme_gaming.svg`,
    foods: `${base}Theme_food.svg`,
  };
  return images[theme] || "";
}

function updateSummary(): void {
  updateThemeSummary();
  updatePlayerSummary();
  updateSizeSummary();
}

function updateThemeSummary(): void {
  const theme = getCheckedValue("theme");
  const labels: Record<string, string> = {
    gaming: "Gaming Theme",
    foods: "Foods Theme",
  };
  updateText("summaryTheme", labels[theme] || "Game theme");
}

function updatePlayerSummary(): void {
  const player = getCheckedValue("player");
  const labels: Record<string, string> = {
    blue: "Blue Player",
    orange: "Orange Player",
  };
  updateText("summaryPlayer", labels[player] || "Player");
}

function updateSizeSummary(): void {
  const size = getCheckedValue("size");
  const text = size ? `Board-${size} Cards` : "Board size";
  updateText("summarySize", text);
}

function updateText(id: string, text: string): void {
  const element = document.getElementById(id);
  if (!element) return;
  element.textContent = text;
}

function renderBoard(): void {
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

function handleCardClick(event: Event): void {
  const target = event.target as HTMLElement;
  const card = target.closest(".card") as HTMLButtonElement | null;

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

  if (isMatch()) {
    keepMatchedCards();
    return;
  }

  unflipCards();
}

function isMatch(): boolean {
  if (!firstCard || !secondCard) return false;
  return firstCard.dataset.card === secondCard.dataset.card;
}

function keepMatchedCards(): void {
  if (!firstCard || !secondCard) return;

  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  resetTurn();
}

function unflipCards(): void {
  if (!firstCard || !secondCard) return;

  setTimeout(() => {
    firstCard?.classList.remove("is-flipped");
    secondCard?.classList.remove("is-flipped");
    resetTurn();
  }, 900);
}

function resetTurn(): void {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function toggleView(hideEl: HTMLElement, showEl: HTMLElement): void {
  hideEl.classList.add("is-hidden");
  showEl.classList.remove("is-hidden");
}