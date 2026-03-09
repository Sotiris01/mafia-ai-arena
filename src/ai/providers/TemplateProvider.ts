// =============================================================================
// FILE: TemplateProvider.ts
// PURPOSE: Phase 1 AI — template-based message generation using
//          messageTemplates.json pools
// LOCATION: src/ai/providers/TemplateProvider.ts
// =============================================================================

// TODO(APPROACH): Implements AITextProvider using pre-written templates.
// This is the Phase 1 provider and the ultimate fallback — always available,
// works offline, no model needed.
//
// generateMessage flow:
//   1. Parse prompt to extract: action_type, personality, intensity, target
//   2. Look up template pool: messageTemplates[action][personality][intensity]
//   3. Select random template from pool
//   4. Fill placeholders: {player}, {role}, {reason}, {evidence}
//   5. Return filled template string
//
// analyzeMessage flow:
//   For AI-generated messages: action type is already known (pre-classified)
//   For human messages: basic keyword matching for action classification
//
// Collaborating files:
// - src/ai/providers/AITextProvider.ts    — interface implemented
// - src/ai/providers/AIProviderFactory.ts — registered as fallback provider
// - src/data/messageTemplates.json        — template pools (7 × 6 × 3)
// - src/types/chat.types.ts               — ChatEvent, ActionType
// - src/ai/MessageGenerator.ts            — provides action_type + personality context

// TODO(HIGH): Implement AITextProvider interface (generateMessage, analyzeMessage, isAvailable)
// TODO(HIGH): Implement loadTemplates() — read messageTemplates.json
// TODO(HIGH): Implement selectTemplate(action, personality, intensity) — random from pool
// TODO: Implement fillTemplate(template, context) — replace {player}, {role}, etc.
// TODO: Implement parsePrompt(prompt) — extract action/personality/intensity from prompt string
// TODO: Implement isAvailable() — always returns true (templates are bundled)
// TODO: Implement analyzeMessage(text) — basic keyword matching for human messages

// TODO(LOW): Add template weighting — recently used templates get lower priority
// TODO(LOW): Support Greek language templates
