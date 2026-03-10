// =============================================================================
// FILE: formatters.ts
// PURPOSE: Display text formatters — Greek/English, player names, game info
// LOCATION: src/utils/formatters.ts
// =============================================================================

import type { Phase, LocalizedText } from "../types/game.types";
import type { Alignment, Role } from "../types/player.types";

export type Locale = "en" | "gr";

// TODO: Wire to user settings / AsyncStorage in Phase 7 (app/settings.tsx)
let currentLocale: Locale = "en";

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

/** Pick the current-locale string from a LocalizedText object */
export function localize(text: LocalizedText): string {
  return text[currentLocale];
}

export function formatPlayerName(
  name: string,
  status: { is_alive: boolean; is_zombie: boolean }
): string {
  if (!status.is_alive) return `\u{1F480} ${name}`;
  if (status.is_zombie) return `\u{1F9DF} ${name}`;
  return name;
}

export function formatPhase(phase: Phase, day: number): string {
  if (currentLocale === "gr") {
    return phase === "day" ? `\u039C\u03AD\u03C1\u03B1 ${day}` : `\u039D\u03CD\u03C7\u03C4\u03B1 ${day}`;
  }
  return phase === "day" ? `Day ${day}` : `Night ${day}`;
}

export function formatRole(role: Role): string {
  // Role names stay in English across both locales (universally recognized)
  return role;
}

const ALIGNMENT_LABELS: Record<Alignment, Record<Locale, string>> = {
  Town: { en: "Town", gr: "\u03A0\u03CC\u03BB\u03B7" },
  Mafia: { en: "Mafia", gr: "\u039C\u03B1\u03C6\u03AF\u03B1" },
  Neutral: { en: "Neutral", gr: "\u039F\u03C5\u03B4\u03AD\u03C4\u03B5\u03C1\u03BF\u03B9" },
};

export function formatAlignment(alignment: Alignment): string {
  return ALIGNMENT_LABELS[alignment][currentLocale];
}

/** mm:ss countdown display */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatDeathMessage(name: string): string {
  if (currentLocale === "gr") {
    return `\u039F ${name} \u03B2\u03C1\u03AD\u03B8\u03B7\u03BA\u03B5 \u03BD\u03B5\u03BA\u03C1\u03CC\u03C2...`;
  }
  return `${name} was found dead...`;
}

export function formatVoteResult(targetName: string, voteCount: number): string {
  if (currentLocale === "gr") {
    return `${targetName}: ${voteCount} \u03C8\u03AE\u03C6\u03BF\u03B9`;
  }
  return `${targetName}: ${voteCount} vote${voteCount !== 1 ? "s" : ""}`;
}

export function formatEventTitle(event: { name: LocalizedText }): string {
  return localize(event.name);
}

// TODO(LOW): Add pluralization helpers for Greek
