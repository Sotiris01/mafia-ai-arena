// =============================================================================
// FILE: PerceptionFilter.ts
// PURPOSE: 3-level perception filter — Superficial/Smart/Deep
//          Controls what information an AI can access from memory
// LOCATION: src/ai/PerceptionFilter.ts
// =============================================================================

// TODO(APPROACH): Filters memory data based on PerceptionDepth (1/2/3).
// Not all AI players "see" the same things — smarter personalities
// detect more complex relationship patterns.
//
// Level 1 — Superficial (Aggressive, Shy):
//   - Direct relationships only (trust, suspicion from direct interactions)
//   - No indirect relationship detection
//   - Takes claims at face value
//   - Simple memory: who accused whom, who defended whom
//
// Level 2 — Smart (Cautious, Charismatic, Logical):
//   - Direct + indirect relationships (A defends B who accused C)
//   - Detects contradictions in claims
//   - Tracks voting patterns for consistency
//   - Can identify suspicious behavior patterns
//
// Level 3 — Deep (Paranoid):
//   - Full deduction chain analysis
//   - Cross-references claims with night results
//   - Detects orchestrated voting (Mafia coordination)
//   - Connects Night Echo events to player behavior
//   - Higher false-positive rate (sees patterns that don't exist)
//
// Collaborating files:
// - src/types/personality.types.ts    — PerceptionDepth (1/2/3)
// - src/types/memory.types.ts         — PlayerMemory, Relationship
// - src/types/chat.types.ts           — ChatEvent, IndirectTarget
// - src/state/MemoryManager.ts        — source memory data to filter
// - src/state/ChatState.ts            — chat history for pattern detection
// - src/ai/VoteDecision.ts            — calls getFilteredMemory(playerId)
// - src/ai/MessageGenerator.ts        — calls to determine AI awareness
// - src/ai/SpeakProbability.ts        — trigger detection depends on perception
// - src/engine/AIEngine.ts            — applies filter before any AI decision

// TODO(HIGH): Implement getFilteredMemory(playerId) — return filtered PlayerMemory
// TODO(HIGH): Implement filterLevel1(memory) — direct relationships only
// TODO(HIGH): Implement filterLevel2(memory, chatHistory) — + indirect + contradictions
// TODO: Implement filterLevel3(memory, chatHistory, nightResults) — + deduction chains
// TODO: Implement detectContradictions(claims, votingHistory) — for Level 2+
// TODO: Implement detectCoordination(votingHistory) — for Level 3 (Mafia voting patterns)
// TODO: Implement connectEvents(events, playerBehavior) — for Level 3

// TODO(REVIEW): Level 3 false positives — how often should Paranoid see wrong patterns?
// TODO(LOW): Consider dynamic perception level changes based on game events
