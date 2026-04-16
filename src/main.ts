import "../scss/main.scss";

init();

function init(): void {
  setupHero();
  setupGameStart();
  setupCardFlip();
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
  startBtn.addEventListener("click", () => toggleView(settingsRef, gameRef));
}

function setupCardFlip(): void {
  const fieldRef = document.getElementById("field");
  if (!fieldRef) return;
  fieldRef.addEventListener("click", handleCardClick);
}

function handleCardClick(event: Event): void {
  const target = event.target as HTMLElement;
  const card = target.closest(".card") as HTMLButtonElement | null;
  if (!card) return;
  card.classList.toggle("is-flipped");
}

function toggleView(hideEl: HTMLElement, showEl: HTMLElement): void {
  hideEl.classList.add("is-hidden");
  showEl.classList.remove("is-hidden");
}