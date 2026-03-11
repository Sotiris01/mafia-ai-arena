// =============================================================================
// FILE: TemplateProvider.ts
// PURPOSE: Phase 4 AI — template-based message generation using
//          messageTemplates.json pools
// LOCATION: src/ai/providers/TemplateProvider.ts
// =============================================================================

// Implements AITextProvider using pre-written templates.
// This is the Phase 4 provider and the ultimate fallback — always available,
// works offline, no model needed.
//
// Collaborating files:
// - src/ai/providers/AITextProvider.ts    — interface implemented
// - src/ai/providers/AIProviderFactory.ts — registered as fallback provider
// - src/data/messageTemplates.json        — template pools (7 actions × 6 personalities × 3 intensities)
// - src/types/chat.types.ts               — ChatEvent, ActionType
// - src/ai/MessageGenerator.ts            — provides action_type + personality context

import type { ActionType, ChatEvent } from "../../types/chat.types";
import type { PersonalityType } from "../../types/personality.types";
import type { AITextProvider, MessageContext } from "./AITextProvider";
import { randomElement } from "../../utils/probability";
import messageTemplates from "../../data/messageTemplates.json";

// ---------------------------------------------------------------------------
// Types for the JSON structure
// ---------------------------------------------------------------------------

type Intensity = "high" | "medium" | "low";

type TemplatePool = Record<
  string, // ActionType
  Record<
    string, // PersonalityType
    Record<Intensity, string[]>
  >
>;

// ---------------------------------------------------------------------------
// Keyword map for analyzeMessage — maps keywords to ActionType
// ---------------------------------------------------------------------------

const ACTION_KEYWORDS: Record<ActionType, string[]> = {
  accuse: [
    "sus", "suspicious", "mafia", "guilty", "vote", "lynch",
    "kill", "eliminate",
  ],
  defend: [
    "innocent", "trust", "town", "clear", "safe", "vouch",
  ],
  agree: [
    "agree", "right", "exactly", "yes", "correct", "true",
  ],
  disagree: [
    "disagree", "wrong", "no", "incorrect", "nonsense",
  ],
  claim: [
    "i am", "i'm", "role", "claim", "reveal",
  ],
  question: [
    "why", "who", "what", "how", "explain", "?",
  ],
  deflect: [
    "instead", "what about", "focus on", "redirect", "look at",
  ],
};

// TODO(LOW): Add template weighting — recently used templates get lower
//            priority to avoid repetition within a game session.

// ---------------------------------------------------------------------------
// TemplateProvider
// ---------------------------------------------------------------------------

export class TemplateProvider implements AITextProvider {
  readonly type = "template" as const;

  private readonly templates: TemplatePool = messageTemplates as TemplatePool;

  // ── generateMessage ───────────────────────────────────────────────────

  async generateMessage(context: MessageContext): Promise<string> {
    const template = this.selectTemplate(
      context.action,
      context.personality,
      context.intensity,
    );

    return this.fillTemplate(template, context);
  }

  // ── analyzeMessage ────────────────────────────────────────────────────

  async analyzeMessage(
    text: string,
    speakerId: string,
    day: number,
  ): Promise<ChatEvent> {
    const action = this.classifyAction(text);
    const target = this.extractTarget(text);

    return {
      message_id: 0, // caller assigns the real id
      speaker: speakerId,
      action,
      target,
      weight: this.actionWeight(action),
      day,
      raw_text: text,
      indirect_targets: [],
      // TODO(Phase 4 Step 3): ChatAnalyzer will enrich with indirect_targets and claim
    };
  }

  // ── isAvailable ───────────────────────────────────────────────────────

  isAvailable(): boolean {
    return true; // templates are bundled, always available
  }

  // ── Private helpers ───────────────────────────────────────────────────

  /**
   * Look up a random template from the pool for action × personality × intensity.
   * Falls back through personality → intensity → action if a key is missing.
   */
  private selectTemplate(
    action: string,
    personality: string,
    intensity: Intensity,
  ): string {
    // Try exact match first
    const pool = this.templates[action]?.[personality]?.[intensity];
    if (pool && pool.length > 0) {
      return randomElement(pool);
    }

    // Fallback: try medium intensity for same action × personality
    const mediumPool = this.templates[action]?.[personality]?.["medium"];
    if (mediumPool && mediumPool.length > 0) {
      return randomElement(mediumPool);
    }

    // Fallback: try Logical personality (neutral baseline) for same action
    const logicalPool = this.templates[action]?.["Logical"]?.[intensity];
    if (logicalPool && logicalPool.length > 0) {
      return randomElement(logicalPool);
    }

    // Ultimate fallback — generic accusation template
    return "I have something to say about {player}.";
  }

  /** Replace {player}, {role}, {reason}, {evidence} placeholders.
   *  Unresolved placeholders are replaced with sensible fallbacks
   *  so raw `{player}` never appears in chat. */
  private fillTemplate(template: string, context: MessageContext): string {
    let result = template;
    result = result.replace(
      /\{player\}/g,
      context.targetName || "someone",
    );
    result = result.replace(
      /\{role\}/g,
      context.roleName || "a role",
    );
    result = result.replace(
      /\{reason\}/g,
      context.reason || "something feels off",
    );
    result = result.replace(
      /\{evidence\}/g,
      context.evidence || "what I've noticed",
    );
    return result;
  }

  /** Classify raw text into an ActionType via keyword matching */
  private classifyAction(text: string): ActionType {
    const lower = text.toLowerCase();

    let bestAction: ActionType = "question"; // default for unclassified
    let bestCount = 0;

    for (const [action, keywords] of Object.entries(ACTION_KEYWORDS)) {
      const count = keywords.filter((kw) => lower.includes(kw)).length;
      if (count > bestCount) {
        bestCount = count;
        bestAction = action as ActionType;
      }
    }

    return bestAction;
  }

  /**
   * Naive target extraction — returns empty string when no target found.
   * TODO(Phase 4 Step 3): ChatAnalyzer will provide real target extraction
   * using player name list from PlayerState.
   */
  private extractTarget(_text: string): string {
    return "";
  }

  /** Map action type to a base weight for the ChatEvent */
  private actionWeight(action: ActionType): number {
    const weights: Record<ActionType, number> = {
      accuse: 1.0,
      defend: 0.8,
      agree: 0.4,
      disagree: 0.5,
      claim: 0.9,
      question: 0.3,
      deflect: 0.6,
    };
    return weights[action];
  }
}
