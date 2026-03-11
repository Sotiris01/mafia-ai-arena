// =============================================================================
// FILE: formatters.ts
// PURPOSE: Display text formatters — player names, game info
// LOCATION: src/utils/formatters.ts
// =============================================================================

import type { Phase } from "../types/game.types";
import type { Alignment, Role } from "../types/player.types";

export function formatPlayerName(
  name: string,
  status: { is_alive: boolean; is_zombie: boolean }
): string {
  if (!status.is_alive) return `\u{1F480} ${name}`;
  if (status.is_zombie) return `\u{1F9DF} ${name}`;
  return name;
}

export function formatPhase(phase: Phase, day: number): string {
  return phase === "day" ? `Day ${day}` : `Night ${day}`;
}

export function formatRole(role: Role): string {
  return role;
}

const ALIGNMENT_LABELS: Record<Alignment, string> = {
  Town: "Town",
  Mafia: "Mafia",
  Neutral: "Neutral",
};

export function formatAlignment(alignment: Alignment): string {
  return ALIGNMENT_LABELS[alignment];
}

/** mm:ss countdown display */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatDeathMessage(name: string): string {
  return `${name} was found dead...`;
}

export function formatVoteResult(targetName: string, voteCount: number): string {
  return `${targetName}: ${voteCount} vote${voteCount !== 1 ? "s" : ""}`;
}

export function formatEventTitle(event: { name: string }): string {
  return event.name;
}
