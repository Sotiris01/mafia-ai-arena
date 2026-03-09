// =============================================================================
// FILE: VoteDecision.test.ts
// PURPOSE: Tests for AI vote logic — 8-step process + role overrides
// LOCATION: __tests__/ai/VoteDecision.test.ts
// =============================================================================

// TODO(APPROACH): Test VoteDecision 8-step process:
//   1. Gather known roles from memory
//   2. Check role-specific overrides (Executioner targets, Jester self-vote)
//   3. Apply personality bias (aggression, suspicion)
//   4. Weight by relationship values
//   5. Consider recent accusations
//   6. Apply perception filter
//   7. Calculate final vote weights
//   8. Select target or abstain
//
// Collaborating files:
// - src/ai/VoteDecision.ts             — module under test
// - src/types/personality.types.ts     — personality stats
// - src/types/memory.types.ts          — PlayerMemory
// - src/state/MemoryManager.ts         — mock memory data

// TODO: describe("VoteDecision")
// TODO: Test Executioner always votes for target
// TODO: Test Jester tries to get lynched (suspicious behavior)
// TODO: Test Mafia avoids voting for other Mafia
// TODO: Test high-aggression personality votes more aggressively
// TODO: Test low-suspicion personality abstains more
// TODO: Test relationship weight affects vote target
// TODO: Test Zombie cannot vote (returns abstain)
// TODO: Test Mayor ×2 vote weight applied
// TODO(LOW): Test vote decision under minimal memory
