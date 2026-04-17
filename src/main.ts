import "../scss/main.scss";

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
  startBtn.addEventListener("click", () => toggleView(settingsRef, gameRef));
}

function setupCardFlip(): void {
  const fieldRef = document.getElementById("field");
  if (!fieldRef) return;
  fieldRef.addEventListener("click", handleCardClick);
}

function setupSettings(): void {
  setupThemePreview();
  setupSummary();
}

function setupThemePreview(): void {
  const radios = getRadios("theme");
  radios.forEach((radio) => radio.addEventListener("change", updatePreview));
  updatePreview();
}

function setupSummary(): void {
  const names = ["theme", "player", "size"];
  names.forEach((name) => addSummaryListeners(name));
  updateSummary();
}

function addSummaryListeners(name: string): void {
  const radios = getRadios(name);
  radios.forEach((radio) => radio.addEventListener("change", updateSummary));
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