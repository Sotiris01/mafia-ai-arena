// =============================================================================
// FILE: GemmaAPIProvider.ts
// PURPOSE: Phase 2 AI — Google Gemma API (gemma-3-4b-it) for message
//          generation and analysis via cloud
// LOCATION: src/ai/providers/GemmaAPIProvider.ts
// =============================================================================

// TODO(APPROACH): Implements AITextProvider using Google's Gemma API.
// Model: gemma-3-4b-it (4 billion parameter instruction-tuned)
// Requires: internet connection + API key
//
// generateMessage flow:
//   1. Receive prompt with game context (role, personality, memory, action type)
//   2. Format prompt using messagePrompt.ts builder
//   3. Call Gemma API with formatted prompt
//   4. Parse response, extract generated message text
//   5. Validate response (no out-of-character content)
//   6. Return generated text
//
// analyzeMessage flow:
//   1. Receive raw message text
//   2. Format analysis prompt using analysisPrompt.ts
//   3. Call Gemma API for structured analysis
//   4. Parse response into ChatEvent object
//   5. Return ChatEvent
//
// API considerations:
//   - Rate limiting (mobile app, many AI players)
//   - Response time (must not slow gameplay)
//   - Cost management (API calls per game)
//   - Error handling → fall back to TemplateProvider
//
// Collaborating files:
// - src/ai/providers/AITextProvider.ts    — interface implemented
// - src/ai/providers/AIProviderFactory.ts — registered as Phase 2 provider
// - src/ai/prompts/messagePrompt.ts       — builds generation prompts
// - src/ai/prompts/analysisPrompt.ts      — builds analysis prompts
// - src/ai/prompts/promptUtils.ts         — context formatting helpers
// - src/types/chat.types.ts               — ChatEvent return type
// - src/data/config.json                  — API endpoint, rate limits

// TODO(HIGH): Implement AITextProvider interface
// TODO(HIGH): Implement callGemmaAPI(prompt) — HTTP request to Gemma API
// TODO: Implement generateMessage(prompt) — format + call + parse
// TODO: Implement analyzeMessage(text) — format + call + parse into ChatEvent
// TODO: Implement isAvailable() — check internet + API key configured
// TODO: Implement validateResponse(text) — ensure in-character, appropriate length
// TODO: Implement handleRateLimit() — queue or throttle API calls
// TODO: Implement handleAPIError(error) — log + signal fallback needed

// TODO(REVIEW): API key storage — use expo-secure-store for security
// TODO(REVIEW): Batch API calls — can multiple AI players share one prompt?
// TODO(LOW): Add response caching for similar game states
