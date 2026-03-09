// =============================================================================
// FILE: ChatBubble.tsx
// PURPOSE: Single message bubble component — renders one chat message
//          with sender name, text, and timestamp
// LOCATION: src/components/chat/ChatBubble.tsx
// =============================================================================

// TODO(APPROACH): Renders a single chat message as a styled bubble.
// Human messages align right, AI messages align left.
// Styling varies by sender personality (color/font weight).
//
// Props:
//   - message: Message              — from chat.types.ts
//   - isHumanPlayer: boolean        — right-align if true
//   - personalityType?: PersonalityType — color styling per personality
//
// Collaborating files:
// - src/types/chat.types.ts           — Message interface
// - src/types/personality.types.ts    — PersonalityType for color coding
// - src/components/chat/PublicChat.tsx — parent container, renders list of bubbles
// - src/components/chat/MafiaChat.tsx — parent for Mafia channel
// - src/components/shared/PlayerAvatar.tsx — sender avatar next to bubble

// TODO(HIGH): Define ChatBubbleProps interface
// TODO(HIGH): Implement ChatBubble component (View + Text)
// TODO: Style bubble with alignment (left for AI, right for human)
// TODO: Add personality-based color coding
// TODO: Display sender name + timestamp
// TODO(LOW): Add message appear animation (fade-in or slide)
