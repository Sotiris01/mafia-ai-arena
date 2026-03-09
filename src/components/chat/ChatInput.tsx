// =============================================================================
// FILE: ChatInput.tsx
// PURPOSE: Text input component for human player messages
// LOCATION: src/components/chat/ChatInput.tsx
// =============================================================================

// TODO(APPROACH): Text input with send button for human player during
// Discussion sub-phase. Disabled when player is silenced or when
// it's not the human window. Shows countdown timer for input deadline.
//
// Props:
//   - onSend: (text: string) => void  — callback when message sent
//   - disabled: boolean               — silenced or wrong phase
//   - timeRemaining?: number          — human window countdown
//
// Collaborating files:
// - src/hooks/useChat.ts              — provides onSend callback
// - src/components/chat/PublicChat.tsx — contains ChatInput at bottom
// - src/components/chat/SilencedOverlay.tsx — shown when disabled due to silence
// - src/components/shared/Timer.tsx    — countdown display

// TODO(HIGH): Define ChatInputProps interface
// TODO(HIGH): Implement ChatInput component (TextInput + Send button)
// TODO: Handle disabled state (silenced player, wrong phase)
// TODO: Show human window countdown timer
// TODO: Clear input after send
// TODO(LOW): Add character limit indicator
