// =============================================================================
// FILE: _layout.tsx
// PURPOSE: Root layout — Expo Router entry point, providers, global config
// LOCATION: app/_layout.tsx
// =============================================================================

// TODO(APPROACH): Root layout for Expo Router. Sets up:
//   - Stack navigator as top-level navigation
//   - Global providers (if any state management added later)
//   - StatusBar configuration
//   - Font loading (expo-font)
//   - Splash screen management (expo-splash-screen)
//
// Routes defined:
//   /           → index.tsx (Lobby)
//   /settings   → settings.tsx
//   /game/*     → game/_layout.tsx (nested)
//
// Collaborating files:
// - app/index.tsx                     — lobby screen (default route)
// - app/settings.tsx                  — settings screen
// - app/game/_layout.tsx              — game sub-layout

// TODO: Import expo-router Stack
// TODO: Configure screen options (headerShown, animation)
// TODO: Add font loading with expo-font
// TODO: Manage splash screen visibility
// TODO(LOW): Add global error boundary
