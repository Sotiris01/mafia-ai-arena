// =============================================================================
// FILE: AIProviderFactory.ts
// PURPOSE: Factory pattern + FallbackProvider chain
//          (Local → API → Template fallback order)
// LOCATION: src/ai/providers/AIProviderFactory.ts
// =============================================================================

// TODO(APPROACH): Factory creates the appropriate AITextProvider based on
// availability. The FallbackProvider wraps all three in a chain:
//   1. Try GemmaLocalProvider (Phase 3) — best quality, offline
//   2. Try GemmaAPIProvider (Phase 2) — good quality, needs internet
//   3. Fall back to TemplateProvider (Phase 1) — always works
//
// The factory checks isAvailable() on each provider in order and returns
// the first available one. The FallbackProvider dynamically switches if
// a provider fails mid-game (e.g., API timeout → fall back to Template).
//
// Configuration:
//   - Preferred provider can be set in settings
//   - API key stored securely for GemmaAPI
//   - Model download status checked for GemmaLocal
//
// Collaborating files:
// - src/ai/providers/AITextProvider.ts    — interface all providers implement
// - src/ai/providers/TemplateProvider.ts  — Phase 1 (always fallback)
// - src/ai/providers/GemmaAPIProvider.ts  — Phase 2 (API-based)
// - src/ai/providers/GemmaLocalProvider.ts — Phase 3 (on-device)
// - src/ai/MessageGenerator.ts            — calls getProvider() for text generation
// - src/engine/ChatAnalyzer.ts            — calls getProvider() for text analysis
// - src/data/config.json                  — may store preferred provider setting
// - app/settings.tsx                      — UI for selecting preferred provider

// TODO(HIGH): Implement getProvider() — return best available AITextProvider
// TODO(HIGH): Implement FallbackProvider class — wraps providers with auto-fallback
// TODO: Implement checkAvailability() — test all providers, return status map
// TODO: Implement setPreferredProvider(type) — user preference from settings
// TODO: Implement handleProviderFailure(provider) — switch to fallback
// TODO: Implement getProviderStatus() — return { template: bool, api: bool, local: bool }

// TODO(REVIEW): Should FallbackProvider retry failed provider after cooldown?
// TODO(LOW): Add provider performance metrics (response time, quality rating)
