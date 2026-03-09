// =============================================================================
// FILE: ResolutionLog.tsx
// PURPOSE: Night resolution summary — private to player, shows their results
// LOCATION: src/components/night/ResolutionLog.tsx
// =============================================================================

// TODO(APPROACH): Shows the human player the result of their night action
// (private — only they see it). Examples:
//   - Sheriff: "Your investigation reveals PlayerB is Town"
//   - Doctor: "You protected PlayerC"
//   - Lookout: "You saw PlayerD visit PlayerE"
//   - Mafia: "Your faction killed PlayerF" or "Your kill was blocked"
//
// Collaborating files:
// - src/types/memory.types.ts         — NightResult
// - src/state/MemoryManager.ts        — stores night results
// - src/hooks/useNightActions.ts      — provides resolution results
// - src/utils/formatters.ts           — format result messages
// - app/game/night.tsx                — shown after night resolution

// TODO: Define ResolutionLogProps (results: NightResult[])
// TODO: Implement ResolutionLog component (list of result items)
// TODO: Format result per action type (investigate/protect/kill/etc)
// TODO: Handle "blocked" or "no result" cases
// TODO(LOW): Add result icons per action type
