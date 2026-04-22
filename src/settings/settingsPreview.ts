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

const BASE_URL = import.meta.env.BASE_URL;
const PREVIEW_SWITCH_MS = 320;
const PREVIEW_LAYOUTS: Record<string, PreviewLayout> = {
  gaming: { size: "90%", position: "right center" },
  foods: { size: "90%", position: "right center" }
};

const PREVIEW_IMAGES: Record<string, string> = {
  gaming: `${BASE_URL}Theme_gaming.svg`,
  foods: `${BASE_URL}Theme_food.svg`
};

let previewSwitchTimeout = 0;
let activePreviewTheme = "";

/**
 * Initializes all preview listeners.
 *
 * @returns {void}
 */
export function initPreview(): void {
  setupThemePreview();
  setupSettingsHoverPreview();
}

/**
 * Updates the current preview.
 *
 * @returns {void}
 */
export function updatePreview(): void {
  const theme = getCheckedValue("theme");
  if (!theme) return;
  updatePreviewFromState(theme);
}

/**
 * Sets up theme change listeners.
 *
 * @returns {void}
 */
function setupThemePreview(): void {
  getRadios("theme").forEach(addThemeChangeListener);
}

/**
 * Adds a theme change listener.
 *
 * @param {HTMLInputElement} radio
 * @returns {void}
 */
function addThemeChangeListener(radio: HTMLInputElement): void {
  radio.addEventListener("change", handleThemeChange);
}

/**
 * Handles theme change.
 *
 * @returns {void}
 */
function handleThemeChange(): void {
  const theme = getCheckedValue("theme");
  if (!theme || theme === activePreviewTheme) return;
  updatePreviewFromState(theme);
}

/**
 * Sets up hover preview listeners.
 *
 * @returns {void}
 */
function setupSettingsHoverPreview(): void {
  getRadios("theme").forEach(addHoverPreviewListeners);
}

/**
 * Adds preview hover listeners to an option.
 *
 * @param {HTMLInputElement} input
 * @returns {void}
 */
function addHoverPreviewListeners(input: HTMLInputElement): void {
  const option = input.closest(".settings__option");
  if (!option) return;
  option.addEventListener("mouseenter", () => handlePreviewEnter(input.value));
  option.addEventListener("mouseleave", handlePreviewLeave);
}

/**
 * Handles preview enter state.
 *
 * @param {string} theme
 * @returns {void}
 */
function handlePreviewEnter(theme: string): void {
  if (!theme || theme === activePreviewTheme) return;
  updatePreviewFromState(theme);
}

/**
 * Handles preview leave state.
 *
 * @returns {void}
 */
function handlePreviewLeave(): void {
  const theme = getCheckedValue("theme");
  if (!theme || theme === activePreviewTheme) return;
  updatePreviewFromState(theme);
}

/**
 * Updates preview from the given theme.
 *
 * @param {string} theme
 * @returns {void}
 */
function updatePreviewFromState(theme: string): void {
  const preview = getPreviewElement();
  const currentImage = getCurrentPreviewImage(preview);

  if (!preview || !theme) return;
  if (!currentImage) return setInitialPreview(preview, theme);
  if (theme === activePreviewTheme) return syncPreview(preview, theme);
  switchPreview(preview, theme);
}

/**
 * Returns the preview element.
 *
 * @returns {HTMLElement | null}
 */
function getPreviewElement(): HTMLElement | null {
  return document.getElementById("preview") as HTMLElement | null;
}

/**
 * Returns the current preview image variable.
 *
 * @param {HTMLElement | null} preview
 * @returns {string}
 */
function getCurrentPreviewImage(preview: HTMLElement | null): string {
  if (!preview) return "";
  return preview.style.getPropertyValue("--preview-current-image").trim();
}

/**
 * Sets the first preview state.
 *
 * @param {HTMLElement} preview
 * @param {string} theme
 * @returns {void}
 */
function setInitialPreview(preview: HTMLElement, theme: string): void {
  activePreviewTheme = theme;
  setPreviewState(preview, theme);
  setPreviewNext(preview, theme);
}

/**
 * Syncs the preview without transition.
 *
 * @param {HTMLElement} preview
 * @param {string} theme
 * @returns {void}
 */
function syncPreview(preview: HTMLElement, theme: string): void {
  activePreviewTheme = theme;
  preview.classList.add("is-preview-syncing");
  setPreviewState(preview, theme);
  setPreviewNext(preview, theme);
  requestAnimationFrame(() => removePreviewSync(preview));
}

/**
 * Switches the preview with animation.
 *
 * @param {HTMLElement} preview
 * @param {string} theme
 * @returns {void}
 */
function switchPreview(preview: HTMLElement, theme: string): void {
  activePreviewTheme = theme;
  window.clearTimeout(previewSwitchTimeout);
  setPreviewNext(preview, theme);
  preview.classList.add("is-preview-switching");
  previewSwitchTimeout = window.setTimeout(
    () => finishPreviewSwitch(preview, theme),
    PREVIEW_SWITCH_MS
  );
}

/**
 * Finishes the preview switch.
 *
 * @param {HTMLElement} preview
 * @param {string} theme
 * @returns {void}
 */
function finishPreviewSwitch(preview: HTMLElement, theme: string): void {
  preview.classList.add("is-preview-syncing");
  setPreviewState(preview, theme);
  setPreviewNext(preview, theme);
  preview.classList.remove("is-preview-switching");
  requestAnimationFrame(() => removePreviewSync(preview));
}

/**
 * Removes preview sync class.
 *
 * @param {HTMLElement} preview
 * @returns {void}
 */
function removePreviewSync(preview: HTMLElement): void {
  preview.classList.remove("is-preview-syncing");
}

/**
 * Sets current preview state.
 *
 * @param {HTMLElement} preview
 * @param {string} theme
 * @returns {void}
 */
function setPreviewState(preview: HTMLElement, theme: string): void {
  applyPreviewVars(preview, "current", getPreviewConfig(theme));
}

/**
 * Sets next preview state.
 *
 * @param {HTMLElement} preview
 * @param {string} theme
 * @returns {void}
 */
function setPreviewNext(preview: HTMLElement, theme: string): void {
  applyPreviewVars(preview, "next", getPreviewConfig(theme));
}

/**
 * Applies preview CSS variables.
 *
 * @param {HTMLElement} preview
 * @param {"current" | "next"} type
 * @param {PreviewConfig} config
 * @returns {void}
 */
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

/**
 * Returns the full preview config for a theme.
 *
 * @param {string} theme
 * @returns {PreviewConfig}
 */
function getPreviewConfig(theme: string): PreviewConfig {
  const image = getPreviewImage(theme);
  const settings = getPreviewLayout(theme);
  return { image, size: settings.size, position: settings.position, theme };
}

/**
 * Returns the preview layout config for a theme.
 *
 * @param {string} theme
 * @returns {PreviewLayout}
 */
function getPreviewLayout(theme: string): PreviewLayout {
  return PREVIEW_LAYOUTS[theme] || { size: "contain", position: "center" };
}

/**
 * Returns the preview image path for a theme.
 *
 * @param {string} theme
 * @returns {string}
 */
function getPreviewImage(theme: string): string {
  return PREVIEW_IMAGES[theme] || "";
}

/**
 * Returns all radios for a group.
 *
 * @param {string} name
 * @returns {HTMLInputElement[]}
 */
function getRadios(name: string): HTMLInputElement[] {
  return Array.from(
    document.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`)
  );
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