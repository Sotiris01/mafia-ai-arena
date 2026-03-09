// =============================================================================
// FILE: formatters.ts
// PURPOSE: Display text formatters — Greek/English, player names, game info
// LOCATION: src/utils/formatters.ts
// =============================================================================

// TODO(APPROACH): Pure formatting functions for UI display. Handles
// language switching (Greek/English) and consistent text formatting
// across all components.
//
// Key formatters:
//   - formatPlayerName(name, isAlive, isZombie) → styled name string
//   - formatPhase(phase, dayNumber) → "Day 3" or "Night 3"
//   - formatRole(role) → localized role name
//   - formatAlignment(alignment) → "Town" / "Πόλη"
//   - formatTime(seconds) → "2:30" countdown display
//   - formatEventTitle(event) → localized event name
//   - formatDeathMessage(playerName) → "PlayerX was found dead..."
//   - formatVoteResult(target, voteCount) → vote tally display
//
// Collaborating files:
// - src/components/shared/PlayerAvatar.tsx — formatPlayerName for name display
// - src/components/shared/Timer.tsx        — formatTime for countdown
// - src/components/shared/RoleCard.tsx     — formatRole for role display
// - src/components/shared/FactionBanner.tsx — formatAlignment
// - src/components/night/MorningReport.tsx — formatDeathMessage
// - src/components/voting/VoteResult.tsx   — formatVoteResult
// - src/components/events/NightEchoBanner.tsx — formatEventTitle
// - app/game/day.tsx                      — formatPhase for header

// TODO(HIGH): Implement formatPlayerName(name, status) — with alive/dead/zombie indicator
// TODO: Implement formatPhase(phase, day) — "Day 3" / "Νύχτα 3"
// TODO: Implement formatRole(role) — role name in current language
// TODO: Implement formatAlignment(alignment) — faction name in current language
// TODO: Implement formatTime(seconds) — mm:ss countdown
// TODO: Implement formatDeathMessage(name) — death announcement text
// TODO: Implement formatVoteResult(target, count) — vote tally text
// TODO: Implement formatEventTitle(event) — event name in current language

// TODO(REVIEW): Language detection — device locale or user setting?
// TODO(LOW): Add pluralization helpers for Greek
