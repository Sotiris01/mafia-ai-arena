// =============================================================================
// FILE: GemmaLocalProvider.ts
// PURPOSE: Phase 3 AI — on-device Gemma via MediaPipe LLM Task
//          (gemma-3-1b-it, fully offline)
// LOCATION: src/ai/providers/GemmaLocalProvider.ts
// =============================================================================

// TODO(APPROACH): Implements AITextProvider using on-device inference.
// Model: gemma-3-1b-it (1 billion parameter, instruction-tuned)
// Runtime: MediaPipe LLM Task API (cross-platform, mobile-optimized)
// Fully offline — no internet required after model download.
//
// generateMessage flow:
//   1. Receive prompt with game context
//   2. Format prompt using messagePrompt.ts (shorter than API version)
//   3. Run inference via MediaPipe LLM Task
//   4. Parse response, validate in-character
//   5. Return generated text
//
// Performance considerations:
//   - Model size: ~1.2GB (must be pre-downloaded)
//   - Inference time: target <2 seconds per message
//   - Memory usage: must coexist with game state
//   - Battery impact: minimize inference calls
//   - Prompt length: shorter prompts for smaller model
//
// Model management:
//   - Download model on first use or from settings
//   - Check model integrity before inference
//   - Handle model loading/unloading for memory
//
// Collaborating files:
// - src/ai/providers/AITextProvider.ts    — interface implemented
// - src/ai/providers/AIProviderFactory.ts — registered as Phase 3 (preferred)
// - src/ai/prompts/messagePrompt.ts       — builds generation prompts (compact mode)
// - src/ai/prompts/analysisPrompt.ts      — builds analysis prompts (compact mode)
// - src/ai/prompts/promptUtils.ts         — context formatting helpers
// - src/types/chat.types.ts               — ChatEvent return type
// - app/settings.tsx                      — model download management UI

// TODO(HIGH): Implement AITextProvider interface
// TODO(HIGH): Implement loadModel() — initialize MediaPipe LLM Task with gemma-3-1b-it
// TODO: Implement generateMessage(prompt) — run local inference
// TODO: Implement analyzeMessage(text) — run local analysis inference
// TODO: Implement isAvailable() — check model downloaded + sufficient device resources
// TODO: Implement unloadModel() — free memory when not in use
// TODO: Implement downloadModel() — fetch model file + progress tracking
// TODO: Implement checkModelIntegrity() — validate downloaded model

// TODO(REVIEW): MediaPipe LLM Task API — verify React Native compatibility
// TODO(REVIEW): Minimum device specs for on-device inference
// TODO(LOW): Add model quantization options (int8 for older devices)
