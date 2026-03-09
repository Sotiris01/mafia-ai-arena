// =============================================================================
// FILE: settings.tsx
// PURPOSE: Game settings screen — tunable game parameters
// LOCATION: app/settings.tsx
// =============================================================================

// TODO(APPROACH): Settings screen accessible from lobby. Allows tuning:
//   - Timer durations (discussion, trial, voting, night)
//   - AI provider selection (Template / Gemma API / Gemma Local)
//   - Language (Greek / English)
//   - Night Echo frequency
//   - Full Moon threshold adjustment
//   - Game speed (affects all timers proportionally)
//
// Settings are saved to AsyncStorage and loaded on app start.
//
// Collaborating files:
// - src/data/config.json              — default values for all settings
// - src/ai/providers/AIProviderFactory.ts — AI provider selection
// - src/utils/formatters.ts           — language setting
// - app/_layout.tsx                   — parent layout

// TODO: Define settings state from config.json defaults
// TODO: Timer section (discussion, trial, vote, night durations)
// TODO: AI provider dropdown (Template, Gemma API, Gemma Local)
// TODO: Language toggle (Greek / English)
// TODO: Advanced section (Night Echo freq, Full Moon threshold)
// TODO: Save settings to AsyncStorage
// TODO: Load settings on mount
// TODO(LOW): Add reset to defaults button
