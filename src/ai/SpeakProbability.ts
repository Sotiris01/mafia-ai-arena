// =============================================================================// =============================================================================




































// TODO(LOW): Add time-of-discussion modifier (more activity early, less late)// TODO(REVIEW): Should silenced players have speak_chance = 0 or handled by PhaseManager?// TODO: Implement isTriggered(playerId, recentEvents) — check if player was targeted// TODO: Implement getCooldownFactor(playerId, messagesSinceLastSpoke) — reduce if recent// TODO: Implement getTriggerModifier(playerId, recentEvents) — boost if mentioned/accused// TODO: Implement getRoleModifier(role) — Mafia roles more cautious, Town varies// TODO(HIGH): Implement calculateSpeakChance(personality, role, triggers, cooldown) — return number// TODO(HIGH): Implement shouldSpeak(playerId, context) — return boolean// - src/utils/probability.ts          — probability roll helper// - src/data/config.json              — speak_cooldown_messages (3)// - src/engine/AIEngine.ts            — calls shouldSpeak(playerId) each tick// - src/state/ChatState.ts            — recent messages for trigger detection// - src/state/MemoryManager.ts        — interaction_count for cooldown// - src/types/player.types.ts         — Role for role_modifier mapping// - src/types/personality.types.ts    — speak_probability_base, aggression, emotional_reactivity// Collaborating files://// The result is a probability [0.0–1.0] that's rolled against Math.random().////   - cooldown_factor: decreases if player spoke recently (prevent spam)//   - trigger_modifier: increased if player was recently accused or mentioned//   - role_modifier: role-specific adjustments (e.g., Godfather speaks more to deflect)//   - personality_base: from PlayerPersonality.speak_probability_base (0.10–0.80)// Components:////   speak_chance = personality_base × role_modifier × trigger_modifier × cooldown_factor// in the Discussion sub-phase. Formula:// TODO(APPROACH): Determines whether an AI player should speak this "tick"// =============================================================================// LOCATION: src/ai/SpeakProbability.ts// PURPOSE: Speak chance calculator — personality × role × trigger × cooldown// FILE: SpeakProbability.ts// FILE: SpeakProbability.ts
// PURPOSE: Speak chance calculator —
//          personality × role × trigger × cooldown
// LOCATION: src/ai/SpeakProbability.ts
// =============================================================================

// TODO(APPROACH): Determines whether an AI player should speak in the
// current discussion round. This is the DECISION LAYER (always if-else,
// never replaced by LLM). The formula:
//
//   final_chance = speak_probability_base
//                  × role_modifier
//                  × trigger_modifier
//                  × cooldown_modifier
//
// Modifiers:
//   - role_modifier: Mafia players speak more to blend in, Mayor after reveal
//   - trigger_modifier: increases if player was accused/mentioned recently
//   - cooldown_modifier: decreases if player spoke recently (prevents spam)
//
// Speak cooldown: minimum 3 messages between AI's own messages (from config)
//
// Collaborating files:
// - src/types/personality.types.ts    — speak_probability_base, aggression, emotional_reactivity
// - src/types/player.types.ts         — PlayerRole for role_modifier
// - src/state/PlayerState.ts          — reads player personality + role
// - src/state/MemoryManager.ts        — reads interaction_count for cooldown
// - src/state/ChatState.ts            — reads recent messages for trigger detection
// - src/engine/AIEngine.ts            — calls shouldSpeak() during discussion
// - src/data/config.json              — speak_cooldown_messages (3)
// - src/utils/probability.ts          — random roll against final_chance

// TODO(HIGH): Implement shouldSpeak(playerId, context) — return boolean
// TODO(HIGH): Implement calculateBaseChance(personality) — read speak_probability_base
// TODO: Implement getRoleModifier(role, alignment) — Mafia slightly higher to blend in
// TODO: Implement getTriggerModifier(playerId, recentEvents) — boost if mentioned/accused
// TODO: Implement getCooldownModifier(playerId, messagesSinceLast) — reduce if spoke recently
// TODO: Implement combineModifiers(base, role, trigger, cooldown) — multiply and clamp 0–1

// TODO(REVIEW): Should emotional_reactivity affect trigger_modifier?
// TODO(LOW): Add Day 1 boost — everyone talks more on Day 1
