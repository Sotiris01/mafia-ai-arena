// =============================================================================
// FILE: promptUtils.ts
// PURPOSE: Context formatting helpers for prompt building —
//          summarize memory, format player lists, truncate context
// LOCATION: src/ai/prompts/promptUtils.ts
// =============================================================================

// TODO(APPROACH): Shared utilities used by both messagePrompt.ts and
// analysisPrompt.ts to format game data into prompt-friendly text.
// Handles context window limits by summarizing and truncating.
//
// Key utilities:
//   - formatRelationships(memory) → "Player A: trust +0.5, suspicious"
//   - formatKnownRoles(memory) → "Player B: confirmed Sheriff"
//   - formatRecentEvents(events) → "Night 2: Mysterious Whispers about Player C"
//   - formatAlivePlayersList(players) → comma-separated names
//   - truncateContext(text, maxTokens) → fit within model context window
//   - formatGameState(state) → "Day 3, 8 alive, Full Moon Stage 1"
//
// Collaborating files:
// - src/ai/prompts/messagePrompt.ts   — uses formatting helpers
// - src/ai/prompts/analysisPrompt.ts  — uses formatting helpers
// - src/types/memory.types.ts         — PlayerMemory structure
// - src/types/game.types.ts           — GameState structure
// - src/types/player.types.ts         — PlayerRole for player info

// TODO(HIGH): Implement formatRelationships(relationships) — human-readable summary
// TODO(HIGH): Implement formatKnownRoles(knownRoles) — role knowledge summary
// TODO: Implement formatRecentEvents(events, maxEvents) — event summary
// TODO: Implement formatAlivePlayersList(players) — name list
// TODO: Implement formatGameState(state) — game context one-liner
// TODO: Implement truncateContext(text, maxTokens) — fit within limit
// TODO: Implement estimateTokenCount(text) — rough token estimation

// TODO(REVIEW): Token estimation accuracy — should we use a proper tokenizer?
// TODO(LOW): Add language switching (Greek/English) for prompts
