export function initSettings(): void {
  setupHero();
  setupGameStart();
  setupThemePreview();
  setupSummary();
  setupSettingsHoverPreview();
  updatePreview();
  updateSummary();
  updateStartButton();
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

  startBtn.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("start-memory-game"));
    toggleView(settingsRef, gameRef);
  });
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

function toggleView(hideEl: HTMLElement, showEl: HTMLElement): void {
  hideEl.classList.add("is-hidden");
  showEl.classList.remove("is-hidden");
}