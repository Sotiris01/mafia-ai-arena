// =============================================================================
// FILE: MessageGenerator.ts
// PURPOSE: AI message creation — 6 message types, uses AITextProvider
//          for actual text generation (template or LLM)
// LOCATION: src/ai/MessageGenerator.ts
// =============================================================================

// TODO(APPROACH): Decision Layer module that decides WHAT to say, then
// delegates to the Text Layer (AITextProvider) for HOW to say it.
//
// 6 message types:
//   1. Accusation — target player with suspicion
//   2. Defense — defend self or another player
//   3. Agreement — support another player's statement
//   4. Claim — claim a role ("I'm the Sheriff")
//   5. Deflection — redirect attention away from self
//   6. Random — neutral/filler conversation
//
// Decision process:
//   1. Get player's memory (relationships, known_roles, recent events)
//   2. Filter through PerceptionFilter (depth 1/2/3)
//   3. Select message type based on personality + situation
//   4. Choose target based on memory weights
//   5. Build prompt context for AITextProvider
//   6. Generate text via provider (template/Gemma API/Gemma local)
//
// Collaborating files:
// - src/types/chat.types.ts           — Message, ActionType
// - src/types/personality.types.ts    — persuasion_power, deception_skill
// - src/ai/PerceptionFilter.ts        — filters memory before message selection
// - src/ai/providers/AIProviderFactory.ts — get current AITextProvider
// - src/ai/providers/AITextProvider.ts — generateMessage() interface
// - src/ai/prompts/messagePrompt.ts   — prompt builder for Phase 2/3
// - src/state/MemoryManager.ts        — read player memory for context
// - src/state/ChatState.ts            — stores generated messages
// - src/engine/AIEngine.ts            — calls generateMessage() after shouldSpeak()
// - src/engine/ChatAnalyzer.ts        — analyzes the generated message

// TODO(HIGH): Implement selectMessageType(playerId, context) — choose 1 of 6 types
// TODO(HIGH): Implement selectTarget(playerId, messageType, memory) — pick target player
// TODO(HIGH): Implement generateMessage(playerId, type, target) — produce Message
// TODO: Implement buildPromptContext(player, memory, type, target) — for AITextProvider
// TODO: Implement shouldClaimRole(playerId) — when should AI claim a role?
// TODO: Implement shouldDefendSelf(playerId, accusations) — react to being accused
// TODO: Implement getIntensity(personality, situation) — low/medium/high for templates

// TODO(REVIEW): Mafia players need special logic — avoid accusing Mafia allies
// TODO(LOW): Add message memory — avoid repeating similar messages
