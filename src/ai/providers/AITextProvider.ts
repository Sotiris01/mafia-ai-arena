// =============================================================================
// FILE: AITextProvider.ts
// PURPOSE: Interface definition for the AI Text Layer — generateMessage,
//          analyzeMessage, isAvailable
// LOCATION: src/ai/providers/AITextProvider.ts
// =============================================================================

// The Decision Layer (SpeakProbability, VoteDecision, etc.) is always if-else.
// The Text Layer (this interface) is swappable between 3 implementations:
//   - TemplateProvider (Phase 4) — always available, offline
//   - GemmaAPIProvider (Phase 6) — requires internet + API key
//   - GemmaLocalProvider (Phase 7) — requires downloaded model, offline
//
// Collaborating files:
// - src/ai/providers/AIProviderFactory.ts — creates providers + fallback chain
// - src/ai/providers/TemplateProvider.ts  — Phase 4 implementation
// - src/ai/providers/GemmaAPIProvider.ts  — Phase 6 implementation (TODO)
// - src/ai/providers/GemmaLocalProvider.ts — Phase 7 implementation (TODO)
// - src/ai/MessageGenerator.ts            — calls generateMessage()
// - src/engine/ChatAnalyzer.ts            — calls analyzeMessage()

import type { ChatEvent } from "../../types/chat.types";

/** Provider backend type — determines which text generation engine to use */
export type AIProviderType = "template" | "gemma_api" | "gemma_local";

/**
 * Context object passed to generateMessage so each provider can extract
 * exactly what it needs (templates use action/personality/intensity,
 * LLM providers use the full context to build a prompt).
 */
export interface MessageContext {
  action: string;
  personality: string;
  intensity: "high" | "medium" | "low";
  targetName?: string;
  roleName?: string;
  reason?: string;
  evidence?: string;
  // TODO(Phase 6): Add memory/relationship context for LLM prompt building
}

/**
 * Swappable interface for the AI Text Layer.
 * Every provider implements these three methods.
 */
export interface AITextProvider {
  /** Unique type identifier for this provider */
  readonly type: AIProviderType;

  /** Generate a message string from structured context */
  generateMessage(context: MessageContext): Promise<string>;

  /**
   * Analyze raw message text into a structured ChatEvent.
   * Used to classify human messages into action types.
   */
  analyzeMessage(
    text: string,
    speakerId: string,
    day: number,
  ): Promise<ChatEvent>;

  /** Check if this provider is currently usable */
  isAvailable(): boolean;
}
