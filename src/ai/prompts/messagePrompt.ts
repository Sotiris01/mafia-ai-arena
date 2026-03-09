// =============================================================================
// FILE: messagePrompt.ts
// PURPOSE: Prompt builder for AI message generation (Phase 2/3)
// LOCATION: src/ai/prompts/messagePrompt.ts
// =============================================================================

// TODO(APPROACH): Builds structured prompts for Gemma models to generate
// in-character messages. The prompt includes:
//   - System context (you are an AI player in a Mafia game)
//   - Role context (your role, alignment, abilities)
//   - Personality context (behavior stats, speak style)
//   - Memory context (relationships, known roles, recent events)
//   - Action instruction (accuse/defend/claim/etc + target)
//   - Output format constraints (stay in character, message length)
//
// Two prompt modes:
//   - Full mode: for GemmaAPIProvider (gemma-3-4b-it, longer context)
//   - Compact mode: for GemmaLocalProvider (gemma-3-1b-it, shorter context)
//
// Collaborating files:
// - src/ai/providers/GemmaAPIProvider.ts  — calls buildPrompt() for API
// - src/ai/providers/GemmaLocalProvider.ts — calls buildCompactPrompt() for local
// - src/ai/prompts/promptUtils.ts         — context formatting helpers
// - src/types/player.types.ts             — PlayerRole for role context
// - src/types/personality.types.ts        — PlayerPersonality for style context
// - src/types/memory.types.ts             — PlayerMemory for relationship context
// - src/types/chat.types.ts               — ActionType for instruction

// TODO(HIGH): Implement buildMessagePrompt(role, personality, memory, action, target) — full
// TODO(HIGH): Implement buildCompactPrompt(role, personality, action, target) — for 1b model
// TODO: Implement buildSystemContext() — static system message about game rules
// TODO: Implement buildRoleContext(role) — role description + abilities
// TODO: Implement buildPersonalityContext(personality) — behavior style instructions
// TODO: Implement buildMemoryContext(memory) — summarized relationships + known info
// TODO: Implement buildActionInstruction(action, target) — what to say

// TODO(REVIEW): Prompt length budget — gemma-3-1b-it has shorter context window
// TODO(LOW): Add few-shot examples for better output quality
