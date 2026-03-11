---
tags:
  - project
  - project/specs
  - architecture
---

# Technical Specs
---

**Platform:** React Native + Expo (TypeScript)
**Target:** iOS & Android (mobile-first)
**State Management:** JSON file-based (AsyncStorage / FileSystem)
**AI Engine:** Custom probability-based decision system → 3-phase migration (If-Else → Gemma API → Gemma On-Device)

---

## Core Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        APP LAYER                             │
│  React Native + Expo (TypeScript)                            │
│                                                              │
│  ┌────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Chat UI    │ │ Vote UI  │ │ Night UI │ │ Events UI    │   │
│  │ Components │ │ (Mayor×2)│ │ Actions  │ │ (Echo/Moon)  │   │
│  └─────┬──────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘   │
│        └─────────────┼────────────┼──────────────┘           │
│                      ▼            ▼                          │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                  GAME ENGINE (9 modules)               │   │
│  │                                                        │   │
│  │  ┌─────────────────┐  ┌──────────────────────────────┐ │   │
│  │  │ Phase Manager   │  │ Chat Semantic Analyzer       │ │   │
│  │  │ (Day/Night/AM)  │  │ (7 action types)             │ │   │
│  │  └─────────────────┘  └──────────────────────────────┘ │   │
│  │  ┌─────────────────┐  ┌──────────────────────────────┐ │   │
│  │  │ AI Decision     │  │ Resolution Engine            │ │   │
│  │  │ Engine (19 roles)│  │ (7-phase Night Order: 0–6)   │ │   │
│  │  └─────────────────┘  └──────────────────────────────┘ │   │
│  │  ┌─────────────────┐  ┌──────────────────────────────┐ │   │
│  │  │ Memory Manager  │  │ Balance Calculator           │ │   │
│  │  │ (r=0.85 decay)  │  │ (town_alive/total - ratio)   │ │   │
│  │  └─────────────────┘  └──────────────────────────────┘ │   │
│  │  ┌─────────────────┐  ┌──────────────────────────────┐ │   │
│  │  │ Win Checker     │  │ EVENT ENGINES:               │ │   │
│  │  │ (6 conditions)  │  │  NightEchoEngine (E01–E14)   │ │   │
│  │  └─────────────────┘  │  FullMoonEngine (Stage 0/1/2)│ │   │
│  │                       │  LastWishEngine (40% on lynch)│ │   │
│  │                       └──────────────────────────────┘ │   │
│  └────────────────────────────────────────────────────────┘   │
│                            ▼                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                    DATA LAYER                          │   │
│  │  JSON Storage (AsyncStorage / Expo FileSystem)         │   │
│  │                                                        │   │
│  │  Per Player: role.json (19 roles, importance tiers)    │   │
│  │              personality.json (6 types, 17 stats)      │   │
│  │              memory.json (weights, events, decay)      │   │
│  │  Shared:     chat_events.json, game_state.json         │   │
│  └────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Phase Manager

| Responsibility           | Description                                                      |
| ------------------------ | ---------------------------------------------------------------- |
| Phase transitions        | Morning Report → Day (Discussion + Mid-Day Events) → Night → ↩  |
| Sub-phase management     | Morning → Discussion → Mid-Day Events → Trial → Night Resolution |
| Timer management         | Discussion time limits, Human Window delays, Mid-Day event delay |
| Win condition checks     | After each Lynch and Night Resolution (6 conditions)             |

```typescript
type Phase = "day" | "night";
type SubPhase = 
  | "morning_report"      // Deaths, events, Full Moon announcement
  | "discussion"           // Chat loop (Steps 1–5)
  | "midday_events"        // 💬 Night Echo event interrupts
  | "trial"                // Accusation + Defense
  | "voting"               // Vote casting (Mayor ×2, Zombie can't vote)
  | "lynch_resolution"     // Lynch result + Last Wish + Jester check
  | "mafia_chat"           // Private Mafia coordination
  | "night_actions"        // All role actions submitted
  | "night_resolution";    // 7-phase resolution (0–6)

interface PhaseManager {
  currentPhase: Phase;
  subPhase: SubPhase;
  dayNumber: number;
  
  transitionToDay(): void;      // → morning_report
  transitionToNight(): void;    // → mafia_chat
  advanceSubPhase(): void;      // Next sub-phase in sequence
  checkWinConditions(): WinResult | null;
}
```

### 2. Chat Semantic Analyzer

| Responsibility           | Description                                           |
| ------------------------ | ----------------------------------------------------- |
| Message parsing          | action, target, weight raw text |
| Indirect relationship detection | (A supports B who accuses C) |
| Role claim detection     | role claims ("I'm the Sheriff") |
| Weight assignment        | intensity of statement |

```typescript
interface ChatEvent {
  message_id: number;
  speaker: string;
  action: "accuse" | "defend" | "agree" | "disagree" | "claim" | "question" | "deflect";
  target: string;
  weight: number;
  day: number;
  raw_text: string;
  indirect_targets: IndirectTarget[];
  claim?: RoleClaim;
}
```

### 3. AI Decision Engine

| Responsibility           | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| Speak probability calc   | `personality_base × role_modifier × trigger_modifier × cooldown` |
| Message generation       | 6 message types (Accusation/Defense/Agreement/Claim/Deflection/Random) |
| Vote decision            | 8-step process: memory → perception filter → role overrides → vote_threshold |
| Night action selection   | Role-specific target selection (19 roles)                      |
| Event reactions          | Night Echo event → memory weight impact × personality          |

### 4. Resolution Engine

| Responsibility           | Description                                                      |
| ------------------------ | ---------------------------------------------------------------- |
| 7-phase resolution order | Phase 0 (Passive) → 1 (Info Alt) → 2 (Investigate) → 3 (Kill & Protect) → 4 (Post-Kill) → 5 (Passive Info) → 6 (Cleanup) |
| Conflict resolution      | Doctor blocks kill, Framer alters Sheriff, Bodyguard sacrifice   |
| Death processing         | — **roles NEVER revealed publicly** |
| Zombie processing        | Zombie infect (Phase 4), Doctor cure, victim restrictions        |
| Lovers death link        | If one Lover dies → both die (Phase 4, unsavable)                |

### 5. Memory Manager

| Responsibility           | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| Relationship updates     | chat events (direct ×1.0, indirect ×0.3) |
| Time decay               | `weight × r` (r = 0.85) Day transition |
| Night result storage     | / |
| Known role tracking      | confirmed roles (confidence: 1.0, no decay) |
| Event memory             | Night Echo events → `events_witnessed[]` (weight + timing)     |
| Zombie memory freeze     | Zombie victims: memory state frozen, no updates                |

### 6. Night Echo Engine

 Night Echo Events (E01–E14). **Detailed:** [[Dynamic Events]]

| Responsibility           | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| Event selection          | Weighted random, max 2/night, filtered by alive roles          |
| Timing assignment        | 🌅 Morning (E01,E02,E05,E06,E11,E12,E14) or 💬 Mid-Day (E03,E04,E07,E08,E09,E10,E13) |
| Suspicion weight         | Per-event weight (0.10 – 0.40) → AI memory impact             |
| Delivery                 | Morning: in Morning Report / Mid-Day: interrupt during Discussion |

### 7. Full Moon Engine

 Full Moon balance mechanic. **Detailed:** [[Full Moon]]

| Responsibility           | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| Balance calculation      | `balance_score = (town_alive / total_alive) - expected_ratio`  |
| Stage determination      | Stage 0 (<0.05), Stage 1 (≥0.05 — info buff), Stage 2 (≥0.15 — full buff + Zombie cure) |
| Activation               | 15% probability per night when stage > 0, max 3 per game       |
| Buff application         | Losing faction roles get +1 action                             |

### 8. Last Wish Engine

 Last Wish event. **Detailed:** [[Last Wish]]

| Responsibility           | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| Trigger                  | 40% chance on lynch (random, not player-chosen)                |
| Action types             | Reveal Evidence, Force Public Vote, Expose Alignment, Curse    |
| Execution                | Immediate effect after lynch resolution                        |

### 9. Balance Calculator

| Responsibility           | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| Balance score            | `(town_alive / total_alive) - expected_town_ratio`             |
| Faction counting         | Neutral roles (Survivor, Jester, Executioner, Zombie) count as Town |
| Stage thresholds         | Configurable: `stage_1: 0.05`, `stage_2: 0.15`                |

---

## Technology Stack

| Layer           | Technology                              |
| --------------- | --------------------------------------- |
| **Framework**   | React Native + Expo                     |
| **Language**    | TypeScript (strict mode)                |
| **Navigation**  | Expo Router                             |
| **State**       | JSON files via AsyncStorage / FileSystem |
| **UI**          | React Native core components + custom   |
| **Animations**  | React Native Reanimated                 |
| **Testing**     | Jest + React Native Testing Library     |
| **AI Phase 1**  | If-else probability + template messages  |
| **AI Phase 2**  | Google Gemma API (gemma-3-4b-it)         |
| **AI Phase 3**  | Gemma on-device via MediaPipe (gemma-3-1b-it, offline) |

---

## Key TypeScript Interfaces

### Core Types

```typescript
type Alignment = "Town" | "Mafia" | "Neutral";

type Role = 
  // Town (9)
  | "Citizen" | "Sheriff" | "Doctor" | "Lookout" | "Gossip"
  | "Lovers" | "Bodyguard" | "Tracker" | "Mayor"
  // Mafia (6)
  | "Godfather" | "Mafia Goon" | "Framer" | "Silencer"
  | "Consigliere" | "Janitor"
  // Neutral (4)
  | "Jester" | "Survivor" | "Executioner" | "Zombie";

type NightActionType = 
  | "none" | "investigate" | "protect" | "watch" | "passive_hint"
  | "passive_visit" | "guard" | "track" | "kill_vote" | "frame"
  | "silence" | "investigate_role" | "investigate_dead"
  | "vest" | "infect";

type ImportanceTier = "core" | "important" | "advanced" | "expanded";
//                    🟢 7+    🟡 8+        🔵 10+       🟣 13+

type Phase = "day" | "night";

type PersonalityType = "Aggressive" | "Cautious" | "Paranoid" 
                     | "Logical" | "Shy" | "Charismatic";

type PerceptionDepth = 1 | 2 | 3;
// 1 = Superficial (Aggressive, Shy)
// 2 = Smart (Cautious, Charismatic, Logical)
// 3 = Deep (Paranoid)

type VotingStyle = "early" | "mid" | "late" | "bandwagon";

type EventTiming = "morning" | "midday";

type NightEchoEventId = 
  | "E01" | "E02" | "E03" | "E04" | "E05" | "E06" | "E07"
  | "E08" | "E09" | "E10" | "E11" | "E12" | "E13" | "E14";
```

### Player Interfaces

```typescript
interface PlayerRole {
  player_id: string;
  player_name: string;
  role: Role;
  alignment: Alignment;
  importance_tier: ImportanceTier;
  night_action: NightActionType;
  is_alive: boolean;
  appears_as: Alignment;
  is_zombie: boolean;           // true if infected by Zombie
  is_revealed_mayor: boolean;   // true if Mayor used reveal
  special_rules: string[];      // Role-specific constraints
}

interface PlayerPersonality {
  type: PersonalityType;
  // Speech & Decision
  speak_probability_base: number;   // 0.10 – 0.80
  perception_depth: PerceptionDepth; // 1, 2, or 3
  aggression: number;               // 0.0 – 1.0
  team_logic: number;               // 0.0 – 1.0
  // Trust & Suspicion
  trust_base: number;               // 0.0 – 1.0
  suspicion_sensitivity: number;    // 0.0 – 1.0
  emotional_reactivity: number;     // 0.5 – 2.0
  // Social
  persuasion_power: number;         // 0.0 – 1.0
  persuasion_resistance: number;    // 0.0 – 1.0
  leadership: number;              // 0.0 – 1.0
  // Behavior
  consistency: number;              // 0.0 – 1.0
  deception_skill: number;          // 0.0 – 1.0
  bandwagon_tendency: number;       // 0.0 – 1.0
  // Memory & Voting
  memory_weight_modifier: number;   // 0.70 – 1.50
  voting_style: VotingStyle;
  vote_threshold: number;           // 0.20 – 0.70
}

interface PlayerMemory {
  player_id: string;
  current_day: number;
  relationships: Record<string, Relationship>;
  known_roles: Record<string, KnownRole>;
  night_results: NightResult[];
  gossip_hints: GossipHint[];
  events_witnessed: EventWitnessed[];
  voting_history: VoteRecord[];
  is_zombie: boolean;
  zombie_since_day?: number;
  memory_state: "active" | "frozen";  // frozen = zombie victim
}
```

### AI Provider Interface

```typescript
interface AITextProvider {
  generateMessage(prompt: string): Promise<string>;
  analyzeMessage(message: string): Promise<ChatEvent>;
  isAvailable(): boolean;
}

type AIProviderType = "template" | "gemma_api" | "gemma_local";
// template   → Phase 1 (always available, offline)
// gemma_api  → Phase 2 (requires internet + API key)
// gemma_local → Phase 3 (requires downloaded model, offline)
```

### Relationship & Memory Sub-Interfaces

```typescript
interface Relationship {
  trust: number;            // -1.0 to +1.0
  suspicion: number;        // -1.0 to +1.0
  interaction_count: number;
  last_interaction_day: number;
  history: InteractionRecord[];
}

interface KnownRole {
  role: Role;
  confidence: number;       // 1.0 = confirmed, <1.0 = suspected
  source: "investigation" | "claim" | "deduction" | "consigliere" | "janitor";
}

interface EventWitnessed {
  day: number;
  type: NightEchoEventId | "last_wish" | "full_moon";
  target?: string;
  timing: EventTiming;
  suspicion_weight: number;
}
```

### Event & Game State Interfaces

```typescript
interface NightEchoEvent {
  id: NightEchoEventId;
  name: string;
  timing: EventTiming;
  probability: number;          // 0.10 – 0.40
  linked_roles: Role[];
  suspicion_weight: number;     // impact on AI memory
  description_template: string;
}

interface FullMoonState {
  is_active: boolean;
  stage: 0 | 1 | 2;
  balance_score: number;
  activations_remaining: number; // starts at 3
  buffed_faction: Alignment | null;
}

interface WinResult {
  winner: Alignment | "Jester" | "Executioner" | "Zombie";
  co_winners: string[];          // Survivor player_ids
  reason: string;
}

interface GameConfig {
  total_players: number;         // 7–16
  decay_factor: number;          // 0.85
  last_wish_probability: number; // 0.40
  night_echo_max_per_night: number; // 2
  full_moon_probability: number; // 0.15
  full_moon_max_per_game: number;   // 3
  balance_thresholds: {
    stage_1: number;             // 0.05
    stage_2: number;             // 0.15
  };
}
```

---

## Related Links

- [[Folder Structure]] (file organization — 9 engine modules, 6 AI modules, 7 data files)
- [[Implementation Roadmap]] (3-phase AI strategy — If-Else → Gemma API → Gemma On-Device)
- [[AI Architecture]] (AI provider system — Decision Layer vs Text Layer, prompt engineering)
- [[Data Architecture]] (JSON schemas — 5 files, 19 roles, 17 personality stats)
- [[AI Decision Engine]] (speak probability, vote logic, event reactions, 3-level perception)
- [[Memory System]] (weight system, time decay r=0.85, event memory, zombie freeze)
- [[Gameplay Loop]] (runtime flow — Steps 1–5, Phase transitions, Morning Report)
- [[Dynamic Events]] (Night Echo E01–E14, selection engine, timing)
- [[Night Phase]] (Resolution Order — 7 phases 0–6)
- [[Full Moon]] (balance mechanic — Stage 0/1/2)
- [[Win Conditions]] (6 win conditions — Jester/Executioner/Town/Mafia/Zombie/Survivor)
