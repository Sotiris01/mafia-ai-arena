// =============================================================================
// FILE: PublicChat.tsx
// PURPOSE: Public chat container — renders public message list + input
// LOCATION: src/components/chat/PublicChat.tsx
// =============================================================================

// TODO(APPROACH): Container component that displays the public chat channel.
// Shows all public messages as ChatBubbles, with ChatInput at bottom.
// Auto-scrolls to latest message. Used during Discussion sub-phase.
//
// Collaborating files:
// - src/hooks/useChat.ts              — provides messages + sendMessage
// - src/components/chat/ChatBubble.tsx — renders individual messages
// - src/components/chat/ChatInput.tsx  — human input at bottom
// - src/components/chat/SilencedOverlay.tsx — overlay when silenced
// - app/game/day.tsx                  — parent screen

// TODO(HIGH): Implement PublicChat component (FlatList + ChatInput)
// TODO: Auto-scroll to bottom on new message
// TODO: Show "silenced" overlay when human player is silenced
// TODO: Handle mid-day event interruption (pause chat, show event)
// TODO(LOW): Add pull-to-scroll history for older messages
