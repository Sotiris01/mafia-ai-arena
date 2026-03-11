// =============================================================================
// FILE: AIProviderFactory.ts
// PURPOSE: Factory pattern + FallbackProvider chain
//          (Local → API → Template fallback order)
// LOCATION: src/ai/providers/AIProviderFactory.ts
// =============================================================================

// The factory checks isAvailable() on each provider in order and returns
// the first available one. The FallbackProvider dynamically switches if
// a provider fails mid-game (e.g., API timeout → fall back to Template).
//
// Fallback chain (when all providers exist):
//   1. GemmaLocalProvider (Phase 7)  — best quality, offline
//   2. GemmaAPIProvider  (Phase 6)  — good quality, needs internet
//   3. TemplateProvider  (Phase 4)  — always works
//
// Collaborating files:
// - src/ai/providers/AITextProvider.ts    — interface all providers implement
// - src/ai/providers/TemplateProvider.ts  — Phase 4 (always fallback)
// - src/ai/providers/GemmaAPIProvider.ts  — Phase 6 (TODO)
// - src/ai/providers/GemmaLocalProvider.ts — Phase 7 (TODO)
// - src/ai/MessageGenerator.ts            — calls getProvider()
// - src/engine/ChatAnalyzer.ts            — calls getProvider()

import type { AITextProvider, AIProviderType, MessageContext } from "./AITextProvider";
import type { ChatEvent } from "../../types/chat.types";
import { TemplateProvider } from "./TemplateProvider";

// ---------------------------------------------------------------------------
// FallbackProvider — wraps an ordered list of providers
// ---------------------------------------------------------------------------

/**
 * Wraps multiple AITextProvider instances in a fallback chain.
 * Tries each provider in order; if generateMessage or analyzeMessage
 * throws, it falls through to the next available provider.
 */
class FallbackProvider implements AITextProvider {
  readonly type: AIProviderType;
  private readonly providers: AITextProvider[];

  constructor(providers: AITextProvider[]) {
    this.providers = providers;
    this.type = this.getActiveProvider().type;
  }

  async generateMessage(context: MessageContext): Promise<string> {
    for (const provider of this.providers) {
      if (!provider.isAvailable()) continue;
      try {
        return await provider.generateMessage(context);
      } catch {
        // provider failed — try next in chain
        // TODO(Phase 6): Log provider failure for diagnostics
      }
    }
    // Should never reach here — TemplateProvider.isAvailable() is always true
    throw new Error("All AI providers failed");
  }

  async analyzeMessage(
    text: string,
    speakerId: string,
    day: number,
  ): Promise<ChatEvent> {
    for (const provider of this.providers) {
      if (!provider.isAvailable()) continue;
      try {
        return await provider.analyzeMessage(text, speakerId, day);
      } catch {
        // provider failed — try next in chain
      }
    }
    throw new Error("All AI providers failed");
  }

  isAvailable(): boolean {
    return this.providers.some((p) => p.isAvailable());
  }

  /** Return the first available provider (for status display) */
  getActiveProvider(): AITextProvider {
    return this.providers.find((p) => p.isAvailable()) ?? this.providers[this.providers.length - 1];
  }
}

// ---------------------------------------------------------------------------
// Singleton state
// ---------------------------------------------------------------------------

let preferredType: AIProviderType = "template";
let cachedProvider: FallbackProvider | null = null;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Return the best available AITextProvider, wrapped in a FallbackProvider
 * chain so callers get automatic fallback on failure.
 */
export function getProvider(): AITextProvider {
  if (cachedProvider) return cachedProvider;

  const providers: AITextProvider[] = buildProviderChain();
  cachedProvider = new FallbackProvider(providers);
  return cachedProvider;
}

/** Set the user-preferred provider type (from settings screen) */
export function setPreferredProvider(type: AIProviderType): void {
  preferredType = type;
  cachedProvider = null; // rebuild chain on next getProvider()
}

/** Return availability status for each provider type */
export function getProviderStatus(): Record<AIProviderType, boolean> {
  const template = new TemplateProvider();
  // TODO(Phase 6): Instantiate GemmaAPIProvider and check availability
  // TODO(Phase 7): Instantiate GemmaLocalProvider and check availability
  return {
    template: template.isAvailable(),
    gemma_api: false,
    gemma_local: false,
  };
}

/** Force rebuild the provider chain (e.g., after API key changes) */
export function resetProvider(): void {
  cachedProvider = null;
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

/**
 * Build the provider chain in fallback order.
 * Preferred provider goes first, then remaining in standard order.
 */
function buildProviderChain(): AITextProvider[] {
  const template = new TemplateProvider();
  // TODO(Phase 6): const gemmaApi = new GemmaAPIProvider(apiKey);
  // TODO(Phase 7): const gemmaLocal = new GemmaLocalProvider();

  // For now, only TemplateProvider is available
  const all: AITextProvider[] = [template];

  // When more providers exist, reorder so preferred is first:
  // const ordered = [preferred, ...rest filtered by standard order]
  // Use preferredType to determine order
  void preferredType; // acknowledge usage — relevant once more providers exist

  return all;
}
