// =============================================================================
// FILE: memory.types.ts
// PURPOSE: Memory system types — PlayerMemory, Relationship, KnownRole,
//          EventWitnessed, NightResult, VoteRecord, GossipHint
// LOCATION: src/types/memory.types.ts
// =============================================================================

// TODO(APPROACH): Each AI player has a memory.json that tracks relationships,
// known roles, night results, and witnessed events. Weights decay over time
// (r=0.85 per day). Zombie victims have frozen memory (no updates).
// Perception depth (1/2/3) determines what data the AI can access from memory.
//
// Collaborating files:
// - src/state/MemoryManager.ts      — CRUD operations on memory.json using these types
// - src/ai/VoteDecision.ts          — reads relationships + known_roles for vote logic
// - src/ai/PerceptionFilter.ts      — filters memory data by perception_depth
// - src/ai/EventReaction.ts         — writes to events_witnessed[]
// - src/ai/SpeakProbability.ts      — reads interaction_count for cooldown
// - src/engine/ChatAnalyzer.ts      — produces data that feeds into relationships
// - src/engine/ResolutionEngine.ts  — produces NightResult data
// - src/utils/weightCalculator.ts   — decay math (r=0.85), indirect weight (×0.3–0.4)
// - src/types/player.types.ts       — Role type used in KnownRole
// - src/types/event.types.ts        — NightEchoEventId used in EventWitnessed

// TODO(HIGH): Define Relationship interface
// - trust: number                   (-1.0 to +1.0)
// - suspicion: number               (-1.0 to +1.0)
// - interaction_count: number
// - last_interaction_day: number
// - history: InteractionRecord[]

// TODO: Define InteractionRecord interface
// - day: number
// - action: ActionType              — import from chat.types.ts
// - weight: number
// - source: "direct" | "indirect"

// TODO(HIGH): Define KnownRole interface
// - role: Role                      — import from player.types.ts
// - confidence: number              (1.0 = confirmed, <1.0 = suspected)
// - source: "investigation" | "claim" | "deduction" | "consigliere" | "janitor"

// TODO: Define NightResult interface
// - night: number
// - action_performed: NightActionType
// - target_id: string
// - result: string                  — e.g. "Town", "Mafia", "blocked", "no_visit"

// TODO: Define EventWitnessed interface
// - day: number
// - type: NightEchoEventId | "last_wish" | "full_moon"
// - target?: string                 — player_id if event targets someone
// - timing: EventTiming             — import from event.types.ts
// - suspicion_weight: number

// TODO: Define VoteRecord interface
// - day: number
// - voted_for: string               — player_id
// - lynch_result: string            — player_id of lynched player or "no_lynch"

// TODO: Define GossipHint interface
// - day: number
// - hint_text: string               — cryptic clue from Gossip role
// - target_id: string
// - confidence: number

// TODO(HIGH): Define PlayerMemory interface
// - player_id: string
// - current_day: number
// - relationships: Record<string, Relationship>
// - known_roles: Record<string, KnownRole>
// - night_results: NightResult[]
// - gossip_hints: GossipHint[]
// - events_witnessed: EventWitnessed[]
// - voting_history: VoteRecord[]
// - is_zombie: boolean
// - zombie_since_day?: number
// - memory_state: "active" | "frozen"   — frozen = zombie victim, no updates

// TODO: Export all types
