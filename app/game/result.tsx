// =============================================================================
// FILE: result.tsx
// PURPOSE: Game Over screen — winning faction, stats, replay option
// LOCATION: app/game/result.tsx
// =============================================================================

// TODO(APPROACH): Game Over screen shown when WinChecker detects a winner.
// Displays:
//   1. Winning faction/role (via FactionBanner)
//   2. Win condition that was met
//   3. All player roles revealed
//   4. Game stats (days survived, kills, votes cast)
//   5. "Play Again" → back to lobby (/)
//
// Win conditions checked in order:
//   1. Jester (lynched → wins alone)
//   2. Executioner (target lynched → wins alone)
//   3. Town (all Mafia dead, no Zombie majority)
//   4. Mafia (Mafia ≥ Town alive)
//   5. Zombie (Zombies ≥ remaining alive)
//   6. Survivor (survived to end → wins with any faction)
//
// Collaborating files:
// - src/engine/WinChecker.ts              — WinResult data
// - src/types/game.types.ts               — WinResult type
// - src/components/shared/FactionBanner.tsx — winning faction display
// - src/components/shared/PlayerAvatar.tsx — all player avatars revealed
// - src/components/shared/RoleCard.tsx     — role reveals
// - src/state/GameState.ts                — final game state
// - src/state/PlayerState.ts              — all player roles
// - app/_layout.tsx                       — navigation back to lobby

// TODO: Receive WinResult from WinChecker
// TODO: Display winning faction with FactionBanner
// TODO: Show all player roles (full reveal)
// TODO: Display game stats summary
// TODO: "Play Again" button → router.replace("/")
// TODO(LOW): Add confetti/celebration animation for winner
