// =============================================================================
// FILE: SpeakProbability.test.ts
// PURPOSE: Tests for speak_chance formula + all modifiers
// LOCATION: __tests__/ai/SpeakProbability.test.ts
// =============================================================================

// TODO(APPROACH): Test speak_chance = base × role × trigger × cooldown
//   - base: personality.extroversion
//   - role: role-specific modifier (Godfather speaks more, Citizen less)
//   - trigger: event reactions increase chance (Night Echo, death, accusation)
//   - cooldown: diminishing returns if spoke recently
//
// Collaborating files:
// - src/ai/SpeakProbability.ts         — module under test
// - src/types/personality.types.ts     — extroversion stat
// - src/types/role.types.ts            — role modifiers
// - src/ai/EventReaction.ts            — trigger weights

// TODO: describe("SpeakProbability")
// TODO: Test high extroversion → high speak chance
// TODO: Test low extroversion → low speak chance
// TODO: Test role modifier (Godfather boost, Citizen penalty)
// TODO: Test trigger boost after Night Echo event
// TODO: Test cooldown reduces chance after consecutive speaks
// TODO: Test Silenced player → speak_chance = 0
// TODO: Test Dead player → speak_chance = 0
// TODO(LOW): Test combined formula edge cases (all max, all min)
