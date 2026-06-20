import { STARTER_DECKS } from "../../shared/cards.js";
import { deckFromStarter } from "../../shared/rules.js";

export const SAVE_KEY = "project-k-save-v1";
export const SAVE_VERSION = 1;

export const DEFAULT_SETTINGS = {
  masterVolume: 0.65,
  sfxVolume: 0.8,
  musicVolume: 0.35,
  graphicsQuality: "balanced",
  mouseSensitivity: 0.75,
  reducedMotion: false,
  fullscreen: false,
  showFps: false,
  colorblindIcons: false
};

export function createDefaultSave() {
  return {
    version: SAVE_VERSION,
    player: null,
    selectedDeckId: STARTER_DECKS[0].id,
    activeCustomDeckId: null,
    customDecks: [],
    settings: { ...DEFAULT_SETTINGS },
    stats: {
      duelsPlayed: 0,
      wins: 0,
      losses: 0,
      botWins: 0,
      onlineWins: 0
    },
    tutorialCompleted: false,
    patchNotesSeen: false
  };
}

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return createDefaultSave();
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== SAVE_VERSION) return createDefaultSave();
    return {
      ...createDefaultSave(),
      ...parsed,
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
      stats: { ...createDefaultSave().stats, ...(parsed.stats || {}) },
      customDecks: Array.isArray(parsed.customDecks) ? parsed.customDecks : []
    };
  } catch {
    localStorage.removeItem(SAVE_KEY);
    return createDefaultSave();
  }
}

export function writeSave(save) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

export function patchSave(save, patch) {
  const next = {
    ...save,
    ...patch,
    settings: { ...save.settings, ...(patch.settings || {}) },
    stats: { ...save.stats, ...(patch.stats || {}) }
  };
  writeSave(next);
  return next;
}

export function resetSave() {
  const next = createDefaultSave();
  writeSave(next);
  return next;
}

export function getActiveDeck(save) {
  if (save.activeCustomDeckId) {
    const custom = save.customDecks.find((deck) => deck.id === save.activeCustomDeckId);
    if (custom) return custom;
  }
  return deckFromStarter(save.selectedDeckId);
}
