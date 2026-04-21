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
let currentPlayer = "";
let blueScore = 0;
let orangeScore = 0;

init();

function init(): void {
  setupHero();
  setupGameStart();
  setupCardFlip();
  setupSettings();
  setupExitGame();
  setupWinnerHome();
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
  initGameState();
  renderBoard();
  updateGameTheme();
  closeExitModal();
  hideResultScreens();
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
  setupSettingsHoverPreview();
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
  ["player", "size"].forEach(addSummaryListeners);
}

function addSummaryListeners(name: string): void {
  const radios = getRadios(name);
  radios.forEach((radio) => radio.addEventListener("change", handleSettingsChange));
}

function handleSettingsChange(): void {
  updateSummary();
  updateStartButton();
}

function setupSettingsHoverPreview(): void {
  const themeInputs = Array.from(
    document.querySelectorAll<HTMLInputElement>('input[name="theme"]')
  );

  themeInputs.forEach((input) => {
    const option = input.closest(".settings__option");
    if (!option) return;

    option.addEventListener("mouseenter", () => updatePreviewFromHover(input.value));
    option.addEventListener("mouseleave", updatePreview);
  });
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
  return Array.from(
    document.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`)
  );
}

function getCheckedValue(name: string): string {
  const checked = document.querySelector<HTMLInputElement>(
    `input[name="${name}"]:checked`
  );
  return checked ? checked.value : "";
}

function updatePreview(): void {
  updatePreviewFromState(getCheckedValue("theme"));
}

function updatePreviewFromHover(theme: string): void {
  updatePreviewFromState(theme);
}

function updatePreviewFromState(theme: string): void {
  const preview = document.getElementById("preview") as HTMLElement | null;
  if (!preview || !theme) return;

  const image = `url(${getPreviewImage(theme)})`;
  const currentImage = preview.style.getPropertyValue("--preview-current-image").trim();

  if (!currentImage) {
    setPreviewState(preview, image);
    setPreviewNext(preview, image);
    return;
  }

  const isThemeChange = hasThemeChanged(currentImage, theme);

  if (!isThemeChange) {
    setPreviewState(preview, image);
    setPreviewNext(preview, image);
    return;
  }

  setPreviewNext(preview, image);
  preview.classList.add("is-preview-switching");

  window.setTimeout(() => {
    setPreviewState(preview, image);
    preview.classList.remove("is-preview-switching");
  }, 220);
}

function setPreviewState(preview: HTMLElement, image: string): void {
  preview.style.setProperty("--preview-current-image", image);
  preview.style.setProperty("--preview-current-size", "contain");
  preview.style.setProperty("--preview-current-position", "center");
}

function setPreviewNext(preview: HTMLElement, image: string): void {
  preview.style.setProperty("--preview-next-image", image);
  preview.style.setProperty("--preview-next-size", "contain");
  preview.style.setProperty("--preview-next-position", "center");
}

function hasThemeChanged(currentImage: string, theme: string): boolean {
  const currentTheme = currentImage.includes("Theme_gaming.svg") ? "gaming" : "foods";
  return currentTheme !== theme;
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

  if (!card || lockBoard || card === firstCard || card.classList.contains("matched")) {
    return;
  }

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
  addPointToCurrentPlayer();
  resetTurn();
  checkGameEnd();
}

function unflipCards(): void {
  if (!firstCard || !secondCard) return;

  setTimeout(() => {
    firstCard?.classList.remove("is-flipped");
    secondCard?.classList.remove("is-flipped");
    switchPlayer();
    resetTurn();
  }, 900);
}

function switchPlayer(): void {
  currentPlayer = currentPlayer === "blue" ? "orange" : "blue";
  updatePlayerDisplay();
}

function checkGameEnd(): void {
  const matchedCards = document.querySelectorAll(".card.matched");
  const size = Number(getCheckedValue("size"));

  if (matchedCards.length !== size) return;
  showGameEndScreen();
}

function showGameEndScreen(): void {
  const gameEndScreen = document.getElementById("gameEndScreen");
  const gameEndBox = document.getElementById("gameEndBox");
  const blueScoreRef = document.getElementById("resultBlueScore");
  const orangeScoreRef = document.getElementById("resultOrangeScore");
  const blueIcon = document.getElementById("resultBlueIcon") as HTMLImageElement | null;
  const orangeIcon = document.getElementById("resultOrangeIcon") as HTMLImageElement | null;

  if (!gameEndScreen || !gameEndBox || !blueScoreRef || !orangeScoreRef) return;

  blueScoreRef.textContent = String(blueScore);
  orangeScoreRef.textContent = String(orangeScore);
  setResultIcons(blueIcon, orangeIcon);
  setGameEndTheme(gameEndBox);

  gameEndScreen.classList.remove("is-hidden");

  setTimeout(() => {
    gameEndScreen.classList.add("is-hidden");
    showWinnerScreen();
  }, 2200);
}

function showWinnerScreen(): void {
  const winnerScreen = document.getElementById("winnerScreen");
  const winnerBox = document.getElementById("winnerBox");
  const winnerTitle = document.getElementById("winnerTitle");
  const winnerIcon = document.getElementById("winnerIcon") as HTMLImageElement | null;

  if (!winnerScreen || !winnerBox || !winnerTitle || !winnerIcon) return;

  const winner = getWinner();

  winnerTitle.textContent = getWinnerText();
  setWinnerTheme(winnerBox);
  setWinnerStyle(winnerBox, winnerTitle, winnerIcon, winner);

  winnerScreen.classList.remove("is-hidden");
}

function getWinner(): string {
  if (blueScore > orangeScore) return "blue";
  if (orangeScore > blueScore) return "orange";
  return "draw";
}

function getWinnerText(): string {
  const winner = getWinner();

  if (winner === "blue") return "Blue Player";
  if (winner === "orange") return "Orange Player";
  return "Draw";
}

function setGameEndTheme(element: HTMLElement): void {
  const theme = getCheckedValue("theme");

  element.classList.remove("theme-foods", "theme-gaming");

  if (theme === "foods") element.classList.add("theme-foods");
  if (theme === "gaming") element.classList.add("theme-gaming");
}

function setWinnerTheme(element: HTMLElement): void {
  element.classList.remove(
    "theme-gaming",
    "theme-foods-blue",
    "theme-foods-orange",
    "theme-foods-draw"
  );

  const theme = getCheckedValue("theme");
  const winner = getWinner();

  if (theme === "gaming") {
    element.classList.add("theme-gaming");
    return;
  }

  if (theme === "foods" && winner === "blue") {
    element.classList.add("theme-foods-blue");
    return;
  }

  if (theme === "foods" && winner === "orange") {
    element.classList.add("theme-foods-orange");
    return;
  }

  element.classList.add("theme-foods-draw");
}

function setWinnerStyle(
  winnerBox: HTMLElement,
  winnerTitle: HTMLElement,
  winnerIcon: HTMLImageElement,
  winner: string
): void {
  const base = import.meta.env.BASE_URL;
  const theme = getCheckedValue("theme");

  winnerBox.classList.remove("winner-blue", "winner-orange", "winner-draw");
  winnerTitle.classList.remove(
    "winner-title-blue",
    "winner-title-orange",
    "winner-title-draw"
  );

  if (winner === "blue") {
    winnerBox.classList.add("winner-blue");
    winnerTitle.classList.add("winner-title-blue");
  }

  if (winner === "orange") {
    winnerBox.classList.add("winner-orange");
    winnerTitle.classList.add("winner-title-orange");
  }

  if (winner === "draw") {
    winnerBox.classList.add("winner-draw");
    winnerTitle.classList.add("winner-title-draw");
  }

  if (theme === "gaming") {
    winnerIcon.src = `${base}trophy.svg`;
    return;
  }

  if (theme === "foods" && winner === "blue") {
    winnerIcon.src = `${base}blue_player.svg`;
    return;
  }

  if (theme === "foods" && winner === "orange") {
    winnerIcon.src = `${base}orange_player.svg`;
    return;
  }

  winnerIcon.src = `${base}trophy.svg`;
}

function setResultIcons(
  blueIcon: HTMLImageElement | null,
  orangeIcon: HTMLImageElement | null
): void {
  const base = import.meta.env.BASE_URL;

  if (blueIcon) blueIcon.src = `${base}blue_player.svg`;
  if (orangeIcon) orangeIcon.src = `${base}orange_player.svg`;
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

function initGameState(): void {
  currentPlayer = getCheckedValue("player");
  blueScore = 0;
  orangeScore = 0;
  updateScoreIcons();
  updatePlayerDisplay();
  updateScoreDisplay();
}

function updatePlayerDisplay(): void {
  const currentPlayerIcon = document.getElementById("currentPlayerIcon") as HTMLImageElement | null;
  if (!currentPlayerIcon) return;
  currentPlayerIcon.src = getPlayerIcon(currentPlayer);
}

function updateScoreDisplay(): void {
  const blueScoreRef = document.getElementById("blueScore");
  const orangeScoreRef = document.getElementById("orangeScore");

  if (blueScoreRef) blueScoreRef.textContent = String(blueScore);
  if (orangeScoreRef) orangeScoreRef.textContent = String(orangeScore);
}

function getPlayerIcon(player: string): string {
  const base = import.meta.env.BASE_URL;
  const icons: Record<string, string> = {
    blue: `${base}blue_player.svg`,
    orange: `${base}orange_player.svg`,
  };

  return icons[player] || "";
}

function addPointToCurrentPlayer(): void {
  if (currentPlayer === "blue") blueScore++;
  if (currentPlayer === "orange") orangeScore++;
  updateScoreDisplay();
}

function setupExitGame(): void {
  const exitBtn = document.getElementById("exitGameBtn");
  const cancelBtn = document.getElementById("cancelExitBtn");
  const confirmBtn = document.getElementById("confirmExitBtn");
  const modal = document.getElementById("exitModal");
  const gameRef = document.getElementById("game");
  const settingsRef = document.getElementById("settings");

  if (!exitBtn || !cancelBtn || !confirmBtn || !modal || !gameRef || !settingsRef) return;

  exitBtn.addEventListener("click", openExitModal);
  cancelBtn.addEventListener("click", closeExitModal);

  confirmBtn.addEventListener("click", () => {
    closeExitModal();
    resetGameBoard();
    toggleView(gameRef, settingsRef);
  });
}

function openExitModal(): void {
  const modal = document.getElementById("exitModal");
  if (!modal) return;
  modal.classList.remove("is-hidden");
}

function closeExitModal(): void {
  const modal = document.getElementById("exitModal");
  if (!modal) return;
  modal.classList.add("is-hidden");
}

function setupWinnerHome(): void {
  const homeBtn = document.getElementById("winnerHomeBtn");
  const winnerScreen = document.getElementById("winnerScreen");
  const gameRef = document.getElementById("game");
  const settingsRef = document.getElementById("settings");

  if (!homeBtn || !winnerScreen || !gameRef || !settingsRef) return;

  homeBtn.addEventListener("click", () => {
    winnerScreen.classList.add("is-hidden");
    resetGameBoard();
    toggleView(gameRef, settingsRef);
  });
}

function hideResultScreens(): void {
  const gameEndScreen = document.getElementById("gameEndScreen");
  const winnerScreen = document.getElementById("winnerScreen");

  if (gameEndScreen) gameEndScreen.classList.add("is-hidden");
  if (winnerScreen) winnerScreen.classList.add("is-hidden");
}

function resetGameBoard(): void {
  const fieldRef = document.getElementById("field");
  if (fieldRef) fieldRef.innerHTML = "";

  hideResultScreens();
  resetTurn();
  blueScore = 0;
  orangeScore = 0;
  updateScoreDisplay();
}

function updateScoreIcons(): void {
  const base = import.meta.env.BASE_URL;
  const orangeIcon = document.getElementById("orangeScoreIcon") as HTMLImageElement | null;
  const blueIcon = document.getElementById("blueScoreIcon") as HTMLImageElement | null;

  if (orangeIcon) orangeIcon.src = `${base}orange_player.svg`;
  if (blueIcon) blueIcon.src = `${base}blue_player.svg`;
}

function updateGameTheme(): void {
  const gameRef = document.getElementById("game");
  const theme = getCheckedValue("theme");

  if (!gameRef) return;

  gameRef.classList.remove("theme-gaming-board", "theme-foods-board");

  if (theme === "gaming") gameRef.classList.add("theme-gaming-board");
  if (theme === "foods") gameRef.classList.add("theme-foods-board");
}