// =============================================================================
// FILE: personality.types.ts
// PURPOSE: Personality system types — 6 personality types, 17 stat fields,
//          PerceptionDepth, VotingStyle
// LOCATION: src/types/personality.types.ts
// =============================================================================

// TODO(APPROACH): Each AI player gets one of 6 personality types with 17
// numeric stats that drive behavior. PerceptionDepth (1/2/3) determines
// how deeply an AI analyzes relationships. VotingStyle controls when
// they tend to cast votes.
//
// Collaborating files:
// - src/data/personalities.json     — static definitions of all 6 types (17 stats each)
// - src/state/PlayerState.ts        — manages per-player personality.json
// - src/ai/SpeakProbability.ts      — reads speak_probability_base, aggression, emotional_reactivity
// - src/ai/VoteDecision.ts          — reads vote_threshold, voting_style, bandwagon_tendency
// - src/ai/PerceptionFilter.ts      — reads perception_depth (1/2/3) for analysis level
// - src/ai/MessageGenerator.ts      — reads persuasion_power, deception_skill for message style
// - src/ai/EventReaction.ts         — reads emotional_reactivity, suspicion_sensitivity
// - src/engine/ChatAnalyzer.ts      — reads persuasion_power for weight assignment

// TODO(HIGH): Define PersonalityType
// - "Aggressive" | "Cautious" | "Paranoid" | "Logical" | "Shy" | "Charismatic"

// TODO: Define PerceptionDepth type
// - 1 | 2 | 3
// - 1 = Superficial (Aggressive, Shy) — only direct relationships
// - 2 = Smart (Cautious, Charismatic, Logical) — indirect relationship detection
// - 3 = Deep (Paranoid) — full deduction chain analysis

// TODO: Define VotingStyle type
// - "early" | "mid" | "late" | "bandwagon"
// - Controls AI vote timing behavior during trial phase

// TODO(HIGH): Define PlayerPersonality interface (17 stats)
// Speech & Decision:
//   - speak_probability_base: number   (0.10 – 0.80)
//   - perception_depth: PerceptionDepth
//   - aggression: number               (0.0 – 1.0)
//   - team_logic: number               (0.0 – 1.0)
// Trust & Suspicion:
//   - trust_base: number               (0.0 – 1.0)
//   - suspicion_sensitivity: number    (0.0 – 1.0)
//   - emotional_reactivity: number     (0.5 – 2.0)
// Social:
//   - persuasion_power: number         (0.0 – 1.0)
//   - persuasion_resistance: number    (0.0 – 1.0)
//   - leadership: number              (0.0 – 1.0)
// Behavior:
//   - consistency: number              (0.0 – 1.0)
//   - deception_skill: number          (0.0 – 1.0)
//   - bandwagon_tendency: number       (0.0 – 1.0)
// Memory & Voting:
//   - memory_weight_modifier: number   (0.70 – 1.50)
//   - voting_style: VotingStyle
//   - vote_threshold: number           (0.20 – 0.70)
// Meta:
//   - type: PersonalityType

// TODO: Export all types
