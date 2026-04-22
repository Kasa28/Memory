type PreviewLayout = {
  size: string;
  position: string;
};

type PreviewConfig = {
  image: string;
  size: string;
  position: string;
  theme: string;
};

const PREVIEW_SWITCH_MS = 320;
let previewSwitchTimeout = 0;
let activePreviewTheme = "";

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
  startBtn.addEventListener("click", () => startGame(settingsRef, gameRef));
}

function startGame(settingsRef: HTMLElement, gameRef: HTMLElement): void {
  window.dispatchEvent(new CustomEvent("start-memory-game"));
  toggleView(settingsRef, gameRef);
}

function setupThemePreview(): void {
  getRadios("theme").forEach(addThemeChangeListener);
}

function addThemeChangeListener(radio: HTMLInputElement): void {
  radio.addEventListener("change", handleThemeChange);
}

function handleThemeChange(): void {
  const theme = getCheckedValue("theme");
  if (theme && theme !== activePreviewTheme) updatePreviewFromState(theme);
  updateSummary();
  updateStartButton();
}

function setupSummary(): void {
  ["player", "size"].forEach(addSummaryListeners);
}

function addSummaryListeners(name: string): void {
  getRadios(name).forEach(addSettingsChangeListener);
}

function addSettingsChangeListener(radio: HTMLInputElement): void {
  radio.addEventListener("change", handleSettingsChange);
}

function handleSettingsChange(): void {
  updateSummary();
  updateStartButton();
}

function setupSettingsHoverPreview(): void {
  getRadios("theme").forEach(addHoverPreviewListeners);
}

function addHoverPreviewListeners(input: HTMLInputElement): void {
  const option = input.closest(".settings__option");
  if (!option) return;
  option.addEventListener("mouseenter", () => handlePreviewEnter(input.value));
  option.addEventListener("mouseleave", handlePreviewLeave);
}

function handlePreviewEnter(theme: string): void {
  if (!theme || theme === activePreviewTheme) return;
  updatePreviewFromState(theme);
}

function handlePreviewLeave(): void {
  const theme = getCheckedValue("theme");
  if (!theme || theme === activePreviewTheme) return;
  updatePreviewFromState(theme);
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
  const theme = getCheckedValue("theme");
  if (!theme) return;
  updatePreviewFromState(theme);
}

function updatePreviewFromState(theme: string): void {
  const preview = getPreviewElement();
  const currentImage = getCurrentPreviewImage(preview);
  if (!preview || !theme) return;
  if (!currentImage) return setInitialPreview(preview, theme);
  if (theme === activePreviewTheme) return syncPreview(preview, theme);
  switchPreview(preview, theme);
}

function getPreviewElement(): HTMLElement | null {
  return document.getElementById("preview") as HTMLElement | null;
}

function getCurrentPreviewImage(preview: HTMLElement | null): string {
  if (!preview) return "";
  return preview.style.getPropertyValue("--preview-current-image").trim();
}

function setInitialPreview(preview: HTMLElement, theme: string): void {
  activePreviewTheme = theme;
  setPreviewState(preview, theme);
  setPreviewNext(preview, theme);
}

function syncPreview(preview: HTMLElement, theme: string): void {
  activePreviewTheme = theme;
  preview.classList.add("is-preview-syncing");
  setPreviewState(preview, theme);
  setPreviewNext(preview, theme);
  requestAnimationFrame(() => removePreviewSync(preview));
}

function switchPreview(preview: HTMLElement, theme: string): void {
  activePreviewTheme = theme;
  window.clearTimeout(previewSwitchTimeout);
  setPreviewNext(preview, theme);
  preview.classList.add("is-preview-switching");
  previewSwitchTimeout = window.setTimeout(() => {
    finishPreviewSwitch(preview, theme);
  }, PREVIEW_SWITCH_MS);
}

function finishPreviewSwitch(preview: HTMLElement, theme: string): void {
  preview.classList.add("is-preview-syncing");
  setPreviewState(preview, theme);
  setPreviewNext(preview, theme);
  preview.classList.remove("is-preview-switching");
  requestAnimationFrame(() => removePreviewSync(preview));
}

function removePreviewSync(preview: HTMLElement): void {
  preview.classList.remove("is-preview-syncing");
}

function setPreviewState(preview: HTMLElement, theme: string): void {
  applyPreviewVars(preview, "current", getPreviewConfig(theme));
}

function setPreviewNext(preview: HTMLElement, theme: string): void {
  applyPreviewVars(preview, "next", getPreviewConfig(theme));
}

function applyPreviewVars(
  preview: HTMLElement,
  type: "current" | "next",
  config: PreviewConfig
): void {
  preview.style.setProperty(`--preview-${type}-image`, `url(${config.image})`);
  preview.style.setProperty(`--preview-${type}-size`, config.size);
  preview.style.setProperty(`--preview-${type}-position`, config.position);
  preview.style.setProperty(`--preview-${type}-theme`, config.theme);
}

function getPreviewConfig(theme: string): PreviewConfig {
  const image = getPreviewImage(theme);
  const settings = getPreviewLayout(theme);
  return { image, size: settings.size, position: settings.position, theme };
}

function getPreviewLayout(theme: string): PreviewLayout {
  const layouts: Record<string, PreviewLayout> = {
    gaming: { size: "90%", position: "right center" },
    foods: { size: "90%", position: "right center" }
  };
  return layouts[theme] || { size: "contain", position: "center" };
}

function getPreviewImage(theme: string): string {
  const base = import.meta.env.BASE_URL;
  const images: Record<string, string> = {
    gaming: `${base}Theme_gaming.svg`,
    foods: `${base}Theme_food.svg`
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
  updateText("summaryTheme", getThemeLabels()[theme] || "Game theme");
}

function getThemeLabels(): Record<string, string> {
  return {
    gaming: "Gaming Theme",
    foods: "Foods Theme"
  };
}

function updatePlayerSummary(): void {
  const player = getCheckedValue("player");
  updateText("summaryPlayer", getPlayerLabels()[player] || "Player");
}

function getPlayerLabels(): Record<string, string> {
  return {
    blue: "Blue Player",
    orange: "Orange Player"
  };
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