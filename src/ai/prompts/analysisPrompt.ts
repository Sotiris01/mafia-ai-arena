// =============================================================================
// FILE: analysisPrompt.ts
// PURPOSE: Prompt builder for chat message analysis (Phase 2/3)
// LOCATION: src/ai/prompts/analysisPrompt.ts
// =============================================================================

// TODO(APPROACH): Builds prompts for Gemma models to analyze raw chat text
// and produce structured ChatEvent objects. Used primarily for analyzing
// human player messages (AI messages already have known action types).
//
// Analysis prompt structure:
//   - System context: "You are a text analyzer for a Mafia game chat"
//   - Player list: current alive players for target identification
//   - Message text: the raw message to analyze
//   - Output format: JSON with action, target, weight, indirect_targets, claim
//
// Expected JSON output:
//   {
//     "action": "accuse" | "defend" | ...,
//     "target": "player_name",
//     "weight": 0.0–1.0,
//     "indirect_targets": [...],
//     "claim": { "role": "Sheriff" } | null
//   }
//
// Collaborating files:
// - src/ai/providers/GemmaAPIProvider.ts  — calls buildAnalysisPrompt() for API
// - src/ai/providers/GemmaLocalProvider.ts — calls for local inference
// - src/ai/prompts/promptUtils.ts         — context formatting helpers
// - src/engine/ChatAnalyzer.ts            — sends prompt to provider, parses result
// - src/types/chat.types.ts               — ChatEvent structure for output

// TODO(HIGH): Implement buildAnalysisPrompt(message, alivePlayers) — full prompt
// TODO: Implement buildCompactAnalysisPrompt(message, alivePlayers) — for 1b model
// TODO: Implement buildOutputSchema() — JSON format instructions
// TODO: Implement parseAnalysisResponse(response) — extract ChatEvent from LLM output

// TODO(REVIEW): JSON parsing reliability — LLM may not produce valid JSON
// TODO(LOW): Add confidence scoring for analysis results
