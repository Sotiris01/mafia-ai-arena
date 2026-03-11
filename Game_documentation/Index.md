---
tags:
  - MOC
  - navigation
  - index
---

# Mafia Game Documentation - Index
---

---

## 📂 [[1_Game_Design/Index|1. Game Design]]

### 🎭 Roles

**Town (The Informed Majority)**
- [[Citizen]]
- [[Sheriff]]
- [[Doctor]]
- [[Lookout]]
- [[Gossip]]
- [[Lovers]]
- [[Bodyguard]]
- [[Tracker]]
- [[Mayor]]

**Mafia (The Informed Minority)**
- [[Godfather]]
- [[Mafia Goon]]
- [[Framer]]
- [[Silencer]]
- [[Consigliere]]
- [[Janitor]]

**Neutral (The Wildcards)**
- [[Jester]]
- [[Survivor]]
- [[Executioner]]
- [[Zombie]]

### 🔄 Phases

- [[Day Phase]]
- [[Night Phase]]

### 🧠 Personalities

- [[Aggressive]]
- [[Cautious]]
- [[Paranoid]]
- [[Logical]]
- [[Shy]]
- [[Charismatic]]

### � Events

- [[Dynamic Events]] — Event System overview, Night Echo rules, Selection Engine, AI Response.
- [[Last Wish]]
- [[Full Moon]] — Balance mechanic.
- **Night Echo Events (14):**
  - [[E01 - Noise at House|E01 Noise at House]] 🌅
  - [[E02 - Shadow Spotted|E02 Shadow Spotted]] 🌅
  - [[E03 - Footsteps Heard|E03 Footsteps Heard]] 🌅
  - [[E04 - Argument Heard|E04 Argument Heard]] 🌅
  - [[E05 - Someone Seen Leaving|E05 Someone Seen Leaving]] 🌅
  - [[E06 - Commotion|E06 Commotion]] 🌅
  - [[E07 - Gun License|E07 Gun License]] 💬
  - [[E08 - Nervous Behavior|E08 Nervous Behavior]] 💬
  - [[E09 - Watchful Eyes|E09 Watchful Eyes]] 💬
  - [[E10 - Whispered Conversation|E10 Whispered Conversation]] 💬
  - [[E11 - Medical Supplies|E11 Medical Supplies]] 🌅
  - [[E12 - Guard Post|E12 Guard Post]] 🌅
  - [[E13 - Strange Illness|E13 Strange Illness]] 💬
  - [[E14 - Silenced Morning|E14 Silenced Morning]] 🌅

### 🏆 Win Conditions & Setup

- [[Win Conditions]] — Town / Mafia / Jester / Survivor / Executioner / Zombie victory conditions.
- [[Game Setup]] — Lobby, Role Distribution, Personalities, Night 1.

---

## 📂 [[2_Technical_Workflow/Data Architecture|2. Technical Workflow]]

### 📊 Data & Storage
- [[Data Architecture]] — JSON schemas (5 files): role.json (19 roles, importance tiers, zombie/mayor flags), personality.json (6 types × 17 stats), memory.json (relationships, Night Echo events, zombie state), chat_events.json (7 action types), game_state.json (phases, balance, Full Moon, zombie tracking).

### 🤖 AI Systems
- [[AI Decision Engine]] — Speak Probability (personality × role × trigger × cooldown), 3-Level Perception Depth, Vote Logic (8-step process, vote_threshold), Message Generation (6 types), Special Behaviors (19 roles), Night Echo Event Reactions (14-event weight table, personality × event matrix).
- [[Memory System]] — Weights (-1.0 to +1.0), Time Decay (r=0.85), Direct/Indirect relationships, 3-Level Perception Depth filter, Voting Decision Process (8 steps), Night Echo Event Memory (weight formula, category table), Zombie memory freeze.

### 🔁 Runtime
- [[Gameplay Loop]] — Morning Report (deaths, events, Full Moon) → Day Phase: 5-step chat loop (Analyze → Memory Update → Human Window → Speak Probability → Generate) + 💬 Mid-Day Event Interrupts → Trial & Vote (Mayor ×2, Zombie can't vote) → Night Phase: Mafia Chat → 7-phase Resolution Order (0–6) → Night Echo Selection (max 2) → Full Moon Balance Check → Win Condition Checks (6 conditions).

---

## 📂 [[3_Project_Structure/Technical Specs|3. Project Structure]]

### 🏗️ Implementation
- [[Technical Specs]] — 3-Layer Architecture (App → Engine → Data), 9 Core Components (PhaseManager, ChatAnalyzer, AIEngine, ResolutionEngine, MemoryManager, NightEchoEngine, FullMoonEngine, LastWishEngine, BalanceCalculator), Technology Stack, TypeScript Interfaces (19 roles, 17 personality stats, 15 night action types, 9 sub-phases, event/game state types).
- [[Folder Structure]] — Full project directory: `app/` (6 screens), `src/components/` (17 components in 6 folders), `src/engine/` (9 modules), `src/ai/` (14 files: 6 core + 5 providers + 3 prompts), `src/state/` (5 managers), `src/data/` (8 JSON configs), `src/types/` (7 type files), `src/hooks/` (6 hooks), `src/utils/` (4 utilities), `__tests__/` (11+ test files). Module Map diagram.

### 🤖 AI Implementation Strategy
- [[Implementation Roadmap]] — 3-Phase AI build strategy: Phase 1 (If-Else probability + template messages, offline MVP), Phase 2 (Gemma API cloud, MessageGenerator + ChatAnalyzer only), Phase 3 (Gemma on-device via MediaPipe, 100% offline). AITextProvider abstraction layer, 25-step build order, Expo considerations.
- [[AI Architecture]] — Decision Layer (always if-else, 6 modules) vs Text Layer (swappable backend). Provider implementations (TemplateProvider, GemmaAPIProvider, GemmaLocalProvider), FallbackProvider chain, prompt engineering guide, performance benchmarks.

---

## 🏷️ Graph View & Tags
- [[Graph View Setup]]

---

## 🗺️ Quick Navigation Map

```
Game Design
├── Roles (19 total — 4 importance tiers: 🟢 CORE / 🟡 IMPORTANT / 🔵 ADVANCED / 🟣 EXPANDED)
│   ├── Town (9): Citizen, Sheriff, Doctor, Lookout, Gossip, Lovers, Bodyguard, Tracker, Mayor
│   ├── Mafia (6): Godfather, Mafia Goon, Framer, Silencer, Consigliere, Janitor
│   └── Neutral (4): Jester, Survivor, Executioner, Zombie
├── Phases
│   ├── Day Phase
│   │   ├── Morning Report (deaths NO role reveal, Bodyguard sacrifice, Lovers death,
│   │   │                    zombie infection, silenced, Full Moon, 🌅 Night Echo Events)
│   │   ├── Discussion (Chat Loop Steps 1–5 + 💬 Mid-Day Event Interrupts)
│   │   └── Trial & Vote (Mayor ×2, Zombie can't vote, Lovers can't vote partner)
│   └── Night Phase
│       ├── Mafia Chat (private coordination, Godfather tiebreaker)
│       ├── Night Actions (19 roles, 15 action types)
│       └── Resolution Order (7 phases: 0-Passive → 1-Info Alt → 2-Investigate
│                              → 3-Kill/Protect → 4-Post-Kill → 5-Passive Info → 6-Cleanup)
├── Win Conditions
│   ├── Town: All Mafia dead
│   ├── Mafia: Mafia ≥ Town alive
│   ├── Jester: Get lynched (instant Game Over)
│   ├── Executioner: Target lynched (game continues)
│   ├── Survivor: Alive at game end (co-win)
│   └── Zombie: All alive non-zombie → zombie
├── Game Setup (Lobby → Roles → Lovers → Personalities → Night 1 → Scaling 7–16 players)
├── Personalities (6 types × 17 stats × 3 perception levels)
│   ├── Level 1 Superficial: Aggressive, Shy
│   ├── Level 2 Smart: Cautious, Charismatic, Logical
│   └── Level 3 Deep: Paranoid
└── Events
    ├── Dynamic Events (System overview / Night Echo rules / Selection Engine)
    ├── Last Wish (lynch trigger — 40% chance, 4 action types)
    ├── Full Moon (balance mechanic — Stage 0/1/2, max 3/game)
    └── Night Echo Events (E01–E14, max 2/night, 🌅 Morning / 💬 Mid-Day)

Technical Workflow
├── Data Architecture (5 JSON schemas — role, personality, memory, chat_events, game_state)
├── AI Decision Engine
│   ├── Speak Probability (personality × role × trigger × cooldown)
│   ├── 3-Level Perception Depth
│   ├── Vote Decision (8-step process, vote_threshold)
│   ├── Message Generation (6 types)
│   ├── Special Behaviors (19 roles in 3 faction tables)
│   └── Night Echo Event Reactions (14-event weight table)
├── Memory System
│   ├── Weight System (-1.0 to +1.0, direct/indirect)
│   ├── Time Decay (r = 0.85)
│   ├── Perception Depth Filter (3 levels)
│   ├── Voting Decision Process (8 steps + role overrides)
│   └── Night Echo Event Memory (weight formula + zombie freeze)
└── Gameplay Loop
    ├── Chat Loop: Analyze → Memory → Human Window → Speak → Generate
    ├── Phase Transitions: Morning → Day → Night → repeat
    ├── Night Resolution: 7-phase order (0–6)
    └── Balance Check: Full Moon staging

Project Structure
├── Technical Specs
│   ├── 3-Layer Architecture (App → Engine → Data)
│   ├── 9 Core Components
│   └── TypeScript Interfaces (19 roles, 17 stats, events, game state)
├── Folder Structure
│   ├── app/ (6 screens) + src/ (9 directories)
│   ├── 9 engine modules + 14 AI files (6 core + 5 providers + 3 prompts)
│   ├── 5 state managers + 8 data configs
│   └── Module Map (Engine ↔ AI ↔ Provider ↔ State wiring)
├── Implementation Roadmap
│   ├── Phase 1: If-Else + template messages (MVP, offline)
│   ├── Phase 2: Gemma API (cloud, MessageGenerator + ChatAnalyzer only)
│   ├── Phase 3: Gemma on-device (MediaPipe, 100% offline)
│   ├── AITextProvider abstraction layer
│   └── 25-step build order + Expo considerations
└── AI Architecture
    ├── Decision Layer (always if-else) vs Text Layer (swappable)
    ├── 3 Providers: Template → Gemma API → Gemma Local
    ├── FallbackProvider chain (Local → API → Template)
    ├── Prompt engineering guide (message + analysis templates)
    └── Performance: API latency, on-device inference benchmarks
```
