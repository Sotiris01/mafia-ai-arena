// =============================================================================
// FILE: AIProviderFactory.test.ts
// PURPOSE: Tests for factory pattern + FallbackProvider chain
// LOCATION: __tests__/ai/providers/AIProviderFactory.test.ts
// =============================================================================

// TODO(APPROACH): Test AIProviderFactory and FallbackProvider:
//   - Factory creates correct provider based on config
//   - FallbackProvider chain: GemmaLocal → GemmaAPI → Template
//   - Falls to next provider when current isAvailable() = false
//   - Falls to next provider when current generateMessage throws
//   - Template provider always works as final fallback
//
// Collaborating files:
// - src/ai/providers/AIProviderFactory.ts — module under test
// - src/ai/providers/AITextProvider.ts    — interface
// - src/ai/providers/TemplateProvider.ts  — always-available fallback
// - src/ai/providers/GemmaAPIProvider.ts  — Phase 2 provider
// - src/ai/providers/GemmaLocalProvider.ts — Phase 3 provider

// TODO: describe("AIProviderFactory")
// TODO: Test factory returns TemplateProvider in Phase 1
// TODO: Test factory returns GemmaAPIProvider in Phase 2
// TODO: Test factory returns GemmaLocalProvider in Phase 3
// TODO: describe("FallbackProvider")
// TODO: Test fallback chain order (Local → API → Template)
// TODO: Test falls to Template when API unavailable
// TODO: Test falls to Template when Local unavailable
// TODO: Test Template always resolves (never throws)
// TODO(LOW): Test provider hot-swap at runtime
