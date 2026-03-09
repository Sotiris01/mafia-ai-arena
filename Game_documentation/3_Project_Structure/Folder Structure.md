---
tags:
  - project
  - project/structure
  - architecture
---

# Folder Structure (React Native & Expo)
---

Το project είναι γραμμένο σε **TypeScript** με **React Native + Expo**.
19 ρόλοι (Town 9, Mafia 6, Neutral 4), 6 personalities (17 stats), Night Echo Events (E01–E14), Full Moon balance mechanic, 7-phase Night Resolution.

## Project Root

```text
/
├── app.json                    # Expo configuration
├── App.tsx                     # Entry point
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
│
├── app/                        # Expo Router pages
│   ├── _layout.tsx             # Root layout
│   ├── index.tsx               # Home / Lobby screen
│   ├── game/
│   │   ├── _layout.tsx         # Game layout
│   │   ├── day.tsx             # Day Phase screen (Discussion + Mid-Day Events)
│   │   ├── night.tsx           # Night Phase screen (actions + Mafia Chat)
│   │   ├── vote.tsx            # Trial & Vote screen (Mayor ×2, Zombie can't vote)
│   │   ├── morning.tsx         # Morning Report screen (deaths, events, Full Moon)
│   │   └── result.tsx          # Game Over screen (win condition display)
│   └── settings.tsx            # Game settings
│
├── src/
│   ├── components/             # Reusable UI Components
│   │   ├── chat/
│   │   │   ├── ChatBubble.tsx      # Single message bubble
│   │   │   ├── ChatInput.tsx       # Text input for human player
│   │   │   ├── PublicChat.tsx      # Public chat container
│   │   │   ├── MafiaChat.tsx       # Private Mafia chat
│   │   │   └── SilencedOverlay.tsx # Overlay when player is silenced
│   │   ├── voting/
│   │   │   ├── VoteCard.tsx        # Individual vote display
│   │   │   ├── VotePanel.tsx       # Voting UI container (Mayor ×2 indicator)
│   │   │   ├── VoteResult.tsx      # Lynch result display (NO role reveal)
│   │   │   └── LastWishBanner.tsx  # Last Wish event display after lynch
│   │   ├── night/
│   │   │   ├── NightAction.tsx     # Night action selector (role-specific)
│   │   │   ├── MorningReport.tsx   # Morning announcement composer
│   │   │   └── ResolutionLog.tsx   # Night resolution summary (private to player)
│   │   ├── events/
│   │   │   ├── NightEchoBanner.tsx # Night Echo event display (🌅 Morning / 💬 Mid-Day)
│   │   │   ├── FullMoonOverlay.tsx # Full Moon visual effect + announcement
│   │   │   └── ZombieIndicator.tsx # Zombie infection visual indicator
│   │   ├── shared/
│   │   │   ├── PlayerAvatar.tsx    # Player icon with status (alive/dead/zombie/silenced)
│   │   │   ├── RoleCard.tsx        # Role card (shown only to owner, never public)
│   │   │   ├── Timer.tsx           # Phase timer
│   │   │   ├── MayorBadge.tsx      # Mayor revealed indicator (×2 vote)
│   │   │   └── FactionBanner.tsx   # Faction display (Town/Mafia/Neutral)
│   │   └── lobby/
│   │       ├── PlayerCount.tsx     # Player count selector (7–16)
│   │       ├── RolePreview.tsx     # Role distribution preview by tier
│   │       └── StartButton.tsx     # Game start
│   │
│   ├── engine/                 # Game Logic Engine
│   │   ├── PhaseManager.ts         # Day/Night/Morning transitions + sub-phases
│   │   ├── ResolutionEngine.ts     # Night action resolver (7-phase order: 0–6)
│   │   ├── WinChecker.ts           # Win condition checks (Jester → Executioner → Town/Mafia → Zombie → Survivor co-win)
│   │   ├── NightEchoEngine.ts      # Night Echo event selection (E01–E14, max 2/night)
│   │   ├── FullMoonEngine.ts       # Full Moon balance check (Stage 0/1/2) + buff application
│   │   ├── LastWishEngine.ts       # Last Wish trigger on lynch (40% chance, 4 action types)
│   │   ├── ChatAnalyzer.ts         # Semantic message analysis → chat_events.json
│   │   ├── AIEngine.ts             # AI Decision Engine orchestrator
│   │   └── BalanceCalculator.ts    # balance_score = (town_alive/total_alive) - expected_ratio
│   │
│   ├── ai/                     # AI-Specific Logic
│   │   ├── providers/                  # AI Text Provider system (3-phase)
│   │   │   ├── AITextProvider.ts       # Interface: generateMessage, analyzeMessage, isAvailable
│   │   │   ├── AIProviderFactory.ts    # Factory + FallbackProvider (Local → API → Template)
│   │   │   ├── TemplateProvider.ts     # Phase 1: template-based message generation
│   │   │   ├── GemmaAPIProvider.ts     # Phase 2: Google Gemma API (gemma-3-4b-it)
│   │   │   └── GemmaLocalProvider.ts   # Phase 3: on-device Gemma (gemma-3-1b-it, MediaPipe)
│   │   ├── prompts/                    # Prompt templates for Phase 2/3
│   │   │   ├── messagePrompt.ts        # Message generation prompt builder
│   │   │   ├── analysisPrompt.ts       # Chat analysis prompt builder
│   │   │   └── promptUtils.ts          # Context formatting helpers
│   │   ├── SpeakProbability.ts     # Speak chance calculator (personality × role × trigger × cooldown)
│   │   ├── MessageGenerator.ts     # AI message creation (6 message types) → uses AITextProvider
│   │   ├── VoteDecision.ts         # AI voting logic (8-step process, vote_threshold)
│   │   ├── NightDecision.ts        # AI night action target selection (19 roles)
│   │   ├── PerceptionFilter.ts     # 3-level perception filter (Superficial/Smart/Deep)
│   │   └── EventReaction.ts        # AI reaction to Night Echo events (weight → memory)
│   │
│   ├── state/                  # State Management
│   │   ├── GameState.ts            # game_state.json manager (phase, balance, Full Moon, zombie tracking)
│   │   ├── PlayerState.ts          # Per-player JSON manager (role.json + personality.json)
│   │   ├── MemoryManager.ts        # memory.json CRUD + Time Decay (r=0.85) + event memory
│   │   ├── ChatState.ts            # chat_events.json manager
│   │   └── EventState.ts           # Night Echo pending events + Full Moon state
│   │
│   ├── data/                   # Static Data & Config
│   │   ├── roles.json              # All 19 role definitions (actions, tiers, scaling)
│   │   ├── personalities.json      # All 6 personality types (17 stats each)
│   │   ├── messageTemplates.json   # Phase 1 template pools (action × personality × intensity)
│   │   ├── nightEchoEvents.json    # E01–E14 event configs (probability, timing, linked roles, weight)
│   │   ├── lastWishActions.json    # Last Wish action types + probabilities
│   │   ├── fullMoonConfig.json     # Full Moon stage thresholds + buff definitions
│   │   ├── gossipHints.json        # Gossip hint templates (cryptic clue pool)
│   │   └── config.json             # Game balance constants (decay, timers, max events, scaling)
│   │
│   ├── types/                  # TypeScript Type Definitions
│   │   ├── player.types.ts         # Player, Role (19), Alignment, ImportanceTier
│   │   ├── personality.types.ts    # PersonalityType (6), 17 stat fields, PerceptionDepth (1/2/3)
│   │   ├── game.types.ts           # GameState, Phase, SubPhase, Vote, BalanceScore
│   │   ├── chat.types.ts           # ChatEvent, Message, ActionType (7 types)
│   │   ├── memory.types.ts         # Memory, Relationship, KnownRole, EventWitnessed
│   │   ├── event.types.ts          # NightEchoEvent (E01–E14), LastWish, FullMoon, EventTiming
│   │   └── role.types.ts           # RoleDefinition, NightAction, SpecialRules, ZombieState
│   │
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useGameLoop.ts          # Main gameplay loop hook (Steps 1–5)
│   │   ├── useChat.ts              # Chat interaction hook (public + Mafia)
│   │   ├── useVoting.ts            # Voting phase hook (Mayor ×2, Zombie restriction)
│   │   ├── useNightActions.ts      # Night action hook (role-specific)
│   │   ├── useMorningReport.ts     # Morning report assembly + delivery
│   │   └── useEvents.ts            # Night Echo + Full Moon + Last Wish event hook
│   │
│   └── utils/                  # Utility Functions
│       ├── probability.ts          # Random + probability helpers (weighted selection)
│       ├── weightCalculator.ts     # Weight math (decay r=0.85, indirect ×0.3–0.4)
│       ├── balanceScore.ts         # Balance score calculation for Full Moon staging
│       └── formatters.ts           # Display text formatters (Greek/English)
│
├── assets/                     # Static Assets
│   ├── icons/                  # Role & UI icons (19 roles + factions)
│   ├── fonts/                  # Custom typography
│   └── sounds/                 # UI sound effects (events, Full Moon, death, vote)
│
└── __tests__/                  # Test Files
    ├── engine/                 # Engine unit tests
    │   ├── ResolutionEngine.test.ts    # 7-phase resolution order tests
    │   ├── NightEchoEngine.test.ts     # Event selection + probability tests
    │   ├── FullMoonEngine.test.ts      # Balance calculation + stage tests
    │   ├── WinChecker.test.ts          # All 6 win conditions
    │   └── PhaseManager.test.ts        # Phase transition tests
    ├── ai/                     # AI logic tests
    │   ├── VoteDecision.test.ts        # 8-step vote logic + role overrides
    │   ├── PerceptionFilter.test.ts    # 3-level filter tests
    │   ├── SpeakProbability.test.ts    # Speak chance formula tests
    │   └── providers/
    │       ├── TemplateProvider.test.ts     # Template pool + fillTemplate tests
    │       ├── GemmaAPIProvider.test.ts     # API mock + response parsing tests
    │       └── AIProviderFactory.test.ts    # Fallback chain tests
    └── components/             # Component tests
```

---

## Module Map (Engine ↔ AI ↔ State)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ENGINE LAYER                                │
│                                                                     │
│  PhaseManager ──→ ResolutionEngine (7-phase order)                  │
│       │                    │                                        │
│       ├──→ WinChecker      ├──→ BalanceCalculator                   │
│       │                    │         │                              │
│       ├──→ ChatAnalyzer    ├──→ FullMoonEngine ──→ EventState       │
│       │         │          │                                        │
│       │         ▼          ├──→ NightEchoEngine ──→ EventState      │
│       │    AIEngine        │                                        │
│       │    ┌───┴───┐       └──→ LastWishEngine                      │
│       │    │  AI   │                                                │
│       │    │ Layer  │                                               │
│       │    └───┬───┘                                                │
│       │        │                                                    │
│       │        ▼                                                    │
│       │  ┌──────────────────────────────────────┐                   │
│       │  │ SpeakProbability  MessageGenerator   │                   │
│       │  │ VoteDecision      NightDecision      │                   │
│       │  │ PerceptionFilter  EventReaction       │                   │
│       │  └──────────┬───────────────────────────┘                   │
│       │             │                                               │
│       │             ▼                                               │
│       │  ┌──────────────────────────────────────────────┐           │
│       │  │         AI PROVIDER LAYER (Text Layer)        │           │
│       │  │  AIProviderFactory → FallbackProvider         │           │
│       │  │  ┌────────────┬────────────┬────────────────┐ │           │
│       │  │  │ Template   │ Gemma API  │ Gemma Local    │ │           │
│       │  │  │ Provider   │ Provider   │ Provider       │ │           │
│       │  │  │ (Phase 1)  │ (Phase 2)  │ (Phase 3)      │ │           │
│       │  │  └────────────┴────────────┴────────────────┘ │           │
│       │  └──────────────────────────────────────────────┘           │
│       │                                                             │
│       ▼                                                             │
│  ┌──────────────────────────────────────────────┐                   │
│  │              STATE LAYER                      │                   │
│  │  GameState   PlayerState   MemoryManager      │                   │
│  │  ChatState   EventState                       │                   │
│  └──────────────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Directory Responsibility Map

| Directory          | Responsibility                                           | Links to                                              |
| ------------------ | -------------------------------------------------------- | ----------------------------------------------------- |
| `app/`             | Screen routing (Expo Router) — 5 game screens + lobby    | —                                                     |
| `src/components/`  | Visual UI elements (chat, voting, night, events, shared) | [[Day Phase]], [[Night Phase]]                        |
| `src/engine/`      | Core game logic & rules (9 modules)                      | [[Technical Specs]], [[Night Phase#Resolution Order]]  |
| `src/ai/`          | AI decision-making (6 modules, 3-level perception)       | [[AI Decision Engine]], [[Memory System]]              |
| `src/state/`       | JSON data read/write (5 managers)                        | [[Data Architecture]]                                  |
| `src/data/`        | Static configuration (7 JSON files)                      | [[Game Setup]], [[Dynamic Events]]                     |
| `src/types/`       | TypeScript interfaces (7 type files, 19 roles)           | All modules                                            |
| `src/hooks/`       | React state bridges (6 hooks)                            | [[Gameplay Loop]]                                      |
| `src/utils/`       | Pure utility functions (4 files)                         | [[Memory System]], [[Full Moon]]                       |
| `__tests__/`       | Unit tests (engine, AI, components)                      | [[Technical Specs]]                                    |

---

## File Count Summary

| Directory         | Files | Notes                                    |
| ----------------- | ----- | ---------------------------------------- |
| `app/`            | 8     | 5 game screens + lobby + settings + layouts |
| `src/components/` | 17    | 6 folders: chat(5), voting(4), night(3), events(3), shared(5), lobby(3) |
| `src/engine/`     | 9     | PhaseManager, Resolution, WinChecker, 3 event engines, ChatAnalyzer, AIEngine, BalanceCalculator |
| `src/ai/`          | 14    | 6 core + 5 providers + 3 prompts             |
| `src/state/`       | 5     | GameState, PlayerState, MemoryManager, ChatState, EventState |
| `src/data/`        | 8     | roles, personalities, messageTemplates, nightEcho, lastWish, fullMoon, gossipHints, config |
| `src/types/`      | 7     | player, personality, game, chat, memory, event, role |
| `src/hooks/`      | 6     | gameLoop, chat, voting, nightActions, morningReport, events |
| `src/utils/`      | 4     | probability, weightCalculator, balanceScore, formatters |
| `__tests__/`      | 11+   | engine(5+), ai(3+), providers(3+), components  |

---

## Related Links

- [[Technical Specs]] (TypeScript interfaces & architecture)
- [[Implementation Roadmap]] (3-phase AI strategy — If-Else → Gemma API → Gemma On-Device)
- [[AI Architecture]] (AI provider system — Decision Layer vs Text Layer, prompt engineering)
- [[Data Architecture]] (JSON schemas — 5 files, 19 roles, 17 personality stats)
- [[AI Decision Engine]] (AI modules — speak, vote, perception, event reactions)
- [[Gameplay Loop]] (runtime flow — Steps 1–5, Phase transitions)
- [[Dynamic Events]] (Night Echo E01–E14, selection engine, timing)
- [[Night Phase]] (Resolution Order — 7 phases)
- [[Full Moon]] (balance mechanic — Stage 0/1/2)
- [[Win Conditions]] (6 win conditions)
