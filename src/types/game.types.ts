// =============================================================================
// FILE: game.types.ts
// PURPOSE: Game state types — Phase, SubPhase, GameState, Vote, BalanceScore,
//          WinResult, GameConfig
// LOCATION: src/types/game.types.ts
// =============================================================================

// TODO(APPROACH): Central game-level types that control phase transitions,
// voting, balance scoring, and win conditions. GameConfig holds all
// tunable constants. These types are used by nearly every engine module.
//
// Collaborating files:
// - src/state/GameState.ts          — manages game_state.json using these types
// - src/engine/PhaseManager.ts      — uses Phase, SubPhase for transitions
// - src/engine/WinChecker.ts        — produces WinResult
// - src/engine/BalanceCalculator.ts — produces BalanceScore for Full Moon
// - src/engine/FullMoonEngine.ts    — reads FullMoonState from GameState
// - src/data/config.json            — static values matching GameConfig interface
// - src/hooks/useGameLoop.ts        — orchestrates transitions using Phase/SubPhase
// - src/hooks/useVoting.ts          — uses Vote type
// - app/game/vote.tsx               — displays voting UI based on Vote type

// TODO(HIGH): Define Phase type
// - "day" | "night"

// TODO(HIGH): Define SubPhase type (9 sub-phases)
// - "morning_report"   — Deaths, events, Full Moon announcement
// - "discussion"        — Chat loop (Steps 1–5 in Gameplay Loop)
// - "midday_events"     — 💬 Night Echo event interrupts
// - "trial"             — Accusation + Defense
// - "voting"            — Vote casting (Mayor ×2, Zombie can't vote)
// - "lynch_resolution"  — Lynch result + Last Wish + Jester check
// - "mafia_chat"        — Private Mafia coordination
// - "night_actions"     — All role actions submitted
// - "night_resolution"  — 7-phase resolution (0–6)

// TODO: Define Vote interface
// - voter_id: string
// - target_id: string
// - weight: number         — 1 normally, 2 for Mayor
// - day: number

// TODO: Define BalanceScore interface
// - score: number           — (town_alive / total_alive) - expected_ratio
// - town_alive: number
// - mafia_alive: number
// - neutral_alive: number
// - total_alive: number
// - expected_ratio: number

// TODO(HIGH): Define FullMoonState interface
// - is_active: boolean
// - stage: 0 | 1 | 2
// - balance_score: number
// - activations_remaining: number    — starts at 3
// - buffed_faction: Alignment | null

// TODO(HIGH): Define WinResult interface
// - winner: Alignment | "Jester" | "Executioner" | "Zombie"
// - co_winners: string[]             — Survivor player_ids that co-win
// - reason: string

// TODO: Define GameConfig interface
// - total_players: number            (7–16)
// - decay_factor: number             (0.85)
// - last_wish_probability: number    (0.40)
// - night_echo_max_per_night: number (2)
// - full_moon_probability: number    (0.15)
// - full_moon_max_per_game: number   (3)
// - balance_thresholds: { stage_1: number, stage_2: number }

// TODO: Export all types
