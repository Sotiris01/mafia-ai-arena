// =============================================================================
// FILE: AIEngine.ts
// PURPOSE: AI Decision Engine orchestrator — coordinates all AI modules
//          for each AI player's turn
// LOCATION: src/engine/AIEngine.ts
// =============================================================================

// TODO(APPROACH): The "brain" orchestrator that runs for each AI player.
// During Discussion, it decides: Should this AI speak? What should they say?
// During Voting, it decides: Who to vote for?
// During Night, it decides: Who to target with night action?
//
// Orchestration flow per AI player:
//   1. SpeakProbability → should this player speak now?
//   2. If yes → PerceptionFilter → what does this player know/see?
//   3. MessageGenerator → generate appropriate message
//   4. ChatAnalyzer → analyze the generated message
//   5. VoteDecision → during voting sub-phase
//   6. NightDecision → during night_actions sub-phase
//   7. EventReaction → when Night Echo events are delivered
//
// Supports 19 roles × 6 personalities × 3 perception levels.
//
// Collaborating files:
// - src/ai/SpeakProbability.ts        — speak chance calculation
// - src/ai/MessageGenerator.ts        — message creation (uses AITextProvider)
// - src/ai/VoteDecision.ts            — 8-step vote logic
// - src/ai/NightDecision.ts           — role-specific target selection
// - src/ai/PerceptionFilter.ts        — memory filtering by perception depth
// - src/ai/EventReaction.ts           — Night Echo event reactions
// - src/state/PlayerState.ts          — reads player role + personality
// - src/state/MemoryManager.ts        — reads/updates player memory
// - src/state/ChatState.ts            — reads chat history for context
// - src/engine/PhaseManager.ts        — triggers AI actions per sub-phase
// - src/engine/ChatAnalyzer.ts        — processes AI-generated messages

// TODO(HIGH): Implement runDiscussionTurn(playerId) — speak probability → message generation
// TODO(HIGH): Implement runVoteTurn(playerId) — vote decision for trial phase
// TODO(HIGH): Implement runNightAction(playerId) — night target selection
// TODO: Implement runEventReaction(playerId, event) — process Night Echo event
// TODO: Implement getAIContext(playerId) — gather personality + memory + chat history
// TODO: Implement runAllAIPlayers(subPhase) — iterate all alive AI players
// TODO: Implement getAIPlayerOrder() — randomize AI action order for fairness

// TODO(REVIEW): Should AI players act simultaneously or sequentially with delays?
// TODO(LOW): Add personality-based delays (Shy players respond slower)
