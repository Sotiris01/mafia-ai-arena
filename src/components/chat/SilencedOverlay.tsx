// =============================================================================
// FILE: SilencedOverlay.tsx
// PURPOSE: Overlay when player is silenced — blocks chat input
// LOCATION: src/components/chat/SilencedOverlay.tsx
// =============================================================================

// TODO(APPROACH): Semi-transparent overlay shown over the chat when the
// human player has been silenced by the Silencer role. The player can
// still READ messages but cannot type or send. Shows a message like
// "You have been silenced and cannot speak today."
//
// Collaborating files:
// - src/state/PlayerState.ts          — check silenced status
// - src/components/chat/PublicChat.tsx — shows overlay when silenced
// - src/hooks/useChat.ts              — isSilenced() check

// TODO: Define SilencedOverlayProps (isVisible: boolean)
// TODO: Implement SilencedOverlay component (View + Text + icon)
// TODO: Semi-transparent background (read-through)
// TODO(LOW): Add silence icon animation
