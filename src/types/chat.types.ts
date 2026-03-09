// =============================================================================
// FILE: chat.types.ts
// PURPOSE: Chat system types — ChatEvent, Message, ActionType,
//          IndirectTarget, RoleClaim
// LOCATION: src/types/chat.types.ts
// =============================================================================

// TODO(APPROACH): The chat system converts raw messages into structured
// ChatEvents that feed the AI memory system. ActionType classifies what
// each message does (accuse, defend, etc). IndirectTarget captures
// transitive relationships (A defends B who accused C → A indirectly
// defends C's target).
//
// Collaborating files:
// - src/engine/ChatAnalyzer.ts      — produces ChatEvent objects from raw messages
// - src/state/ChatState.ts          — stores/retrieves ChatEvent[] in chat_events.json
// - src/state/MemoryManager.ts      — reads ChatEvents to update relationship weights
// - src/ai/MessageGenerator.ts      — generates Message objects (6 types)
// - src/ai/PerceptionFilter.ts      — filters ChatEvents by perception depth
// - src/ai/VoteDecision.ts          — reads chat history for vote logic
// - src/data/messageTemplates.json  — template pools keyed by action type
// - src/hooks/useChat.ts            — manages chat interaction flow
// - src/components/chat/ChatBubble.tsx — renders individual Message

// TODO(HIGH): Define ActionType (7 types)
// - "accuse" | "defend" | "agree" | "disagree" | "claim" | "question" | "deflect"

// TODO: Define IndirectTarget interface
// - player_id: string
// - relationship: "indirect_accuse" | "indirect_defend"
// - weight_modifier: number         — 0.3 for indirect accusation, 0.4 for indirect defense

// TODO: Define RoleClaim interface
// - claimed_role: Role              — import from player.types.ts
// - day_claimed: number
// - believed_by: string[]           — player_ids who accepted the claim

// TODO(HIGH): Define ChatEvent interface
// - message_id: number
// - speaker: string                 — player_id
// - action: ActionType
// - target: string                  — player_id
// - weight: number                  — intensity of statement
// - day: number
// - raw_text: string
// - indirect_targets: IndirectTarget[]
// - claim?: RoleClaim               — only present for "claim" action

// TODO: Define Message interface (for UI rendering)
// - id: string
// - sender_id: string
// - sender_name: string
// - text: string
// - timestamp: number
// - channel: "public" | "mafia"     — which chat channel
// - is_human: boolean

// TODO: Export all types
