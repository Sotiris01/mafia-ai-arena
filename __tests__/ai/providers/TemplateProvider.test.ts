// =============================================================================
// FILE: TemplateProvider.test.ts
// PURPOSE: Tests for Phase 1 template-based text generation
// LOCATION: __tests__/ai/providers/TemplateProvider.test.ts
// =============================================================================

// TODO(APPROACH): Test TemplateProvider (Phase 1 AI text):
//   - Loads templates from messageTemplates.json
//   - Selects template by: action_type × personality × intensity
//   - Variable substitution ({player_name}, {target}, {role})
//   - Returns valid message strings
//   - isAvailable() always returns true (no external deps)
//
// Collaborating files:
// - src/ai/providers/TemplateProvider.ts — module under test
// - src/data/messageTemplates.json       — template pool
// - src/ai/providers/AITextProvider.ts   — interface contract

// TODO: describe("TemplateProvider")
// TODO: Test generateMessage returns non-empty string
// TODO: Test correct template pool selection (action × personality × intensity)
// TODO: Test variable substitution ({player_name} replaced)
// TODO: Test isAvailable() returns true
// TODO: Test analyzeMessage returns structured ChatEvent
// TODO: Test all 7 action types have templates
// TODO(LOW): Test template pool exhaustion handling
