// =============================================================================
// FILE: AITextProvider.ts
// PURPOSE: Interface definition for the AI Text Layer — generateMessage,
//          analyzeMessage, isAvailable
// LOCATION: src/ai/providers/AITextProvider.ts
// =============================================================================

// TODO(APPROACH): This is the swappable interface for text generation.
// The Decision Layer (SpeakProbability, VoteDecision, etc.) is always if-else.
// The Text Layer (this interface) is swappable between 3 implementations:
//   - TemplateProvider (Phase 1) — always available, offline
//   - GemmaAPIProvider (Phase 2) — requires internet + API key
//   - GemmaLocalProvider (Phase 3) — requires downloaded model, offline
//
// The AIProviderFactory creates the appropriate provider and wraps them
// in a FallbackProvider chain: Local → API → Template.
//
// Interface methods:
//   generateMessage(prompt: string): Promise<string>
//     — Generate message text from a prompt/context
//   analyzeMessage(message: string): Promise<ChatEvent>
//     — Analyze raw message text into structured ChatEvent
//   isAvailable(): boolean
//     — Check if this provider is currently usable
//
// Collaborating files:
// - src/ai/providers/AIProviderFactory.ts — creates providers + fallback chain
// - src/ai/providers/TemplateProvider.ts  — Phase 1 implementation
// - src/ai/providers/GemmaAPIProvider.ts  — Phase 2 implementation
// - src/ai/providers/GemmaLocalProvider.ts — Phase 3 implementation
// - src/ai/MessageGenerator.ts            — calls generateMessage()
// - src/engine/ChatAnalyzer.ts            — calls analyzeMessage()
// - src/types/chat.types.ts               — ChatEvent return type

// TODO(HIGH): Define AITextProvider interface with 3 methods
// TODO(HIGH): Define AIProviderType type: "template" | "gemma_api" | "gemma_local"
// TODO: Export interface and type for use by all providers
