// =============================================================================
// FILE: ChatAnalyzer.ts
// PURPOSE: Semantic message analysis — converts raw chat text into
//          structured ChatEvent objects for chat_events.json
// LOCATION: src/engine/ChatAnalyzer.ts
// =============================================================================

// TODO(APPROACH): Parses raw message text and produces ChatEvent objects.
// For Phase 1 (template-based), this is pattern matching on known templates.
// For Phase 2/3 (Gemma), this uses the AI provider's analyzeMessage().
//
// Analysis steps:
//   1. Receive raw message text + speaker_id
//   2. Classify action type (accuse/defend/agree/disagree/claim/question/deflect)
//   3. Identify target player_id
//   4. Assign weight based on statement intensity
//   5. Detect indirect targets (A defends B who accused C)
//   6. Detect role claims ("I'm the Sheriff")
//   7. Produce ChatEvent → send to ChatState
//
// For AI-generated messages (Phase 1), the action type is already known
// from MessageGenerator. For human messages, need actual text analysis.
//
// Collaborating files:
// - src/types/chat.types.ts           — ChatEvent, ActionType, IndirectTarget, RoleClaim
// - src/state/ChatState.ts            — stores produced ChatEvents
// - src/state/MemoryManager.ts        — reads ChatEvents to update relationships
// - src/ai/providers/AITextProvider.ts — analyzeMessage() for Phase 2/3
// - src/ai/providers/AIProviderFactory.ts — get current provider for analysis
// - src/ai/MessageGenerator.ts        — provides pre-classified action types for AI messages
// - src/engine/PhaseManager.ts        — triggers analysis during discussion sub-phase
// - src/engine/AIEngine.ts            — orchestrates AI message generation → analysis flow

// TODO(HIGH): Implement analyzeMessage(text, speakerId, day) — produce ChatEvent
// TODO(HIGH): Implement classifyAction(text) — return ActionType
// TODO: Implement identifyTarget(text, alivePlayers) — find target player_id in text
// TODO: Implement assignWeight(text, actionType) — intensity scoring (0.0–1.0)
// TODO: Implement detectIndirectTargets(event, recentEvents) — transitive relationships
// TODO: Implement detectRoleClaim(text) — extract claimed role if present
// TODO: Implement analyzeHumanMessage(text) — full analysis for human player input
// TODO: Implement analyzeAIMessage(text, preClassified) — simplified for AI messages

// TODO(REVIEW): Human message analysis accuracy — may need Gemma API for reliable parsing
// TODO(LOW): Add sentiment analysis for more nuanced weight assignment
