# 🎭 Mafia: Single-Player AI Edition

A mobile Mafia/Werewolf game where a single player competes against AI opponents in a psychological strategy game. Built with **React Native + Expo** (TypeScript).

> 🚧 **Status: Phase 3 Complete** — Playable shell on phone: lobby, role assignment, chat, settings, navigation. 14 test suites / 234 tests passing. Phase 4 (Template AI + Day Cycle) is next.

---

## 🎮 Game Overview

A classic social deduction game reimagined for solo play. You are assigned a role in a town infiltrated by the Mafia. During the **Day**, players discuss, accuse, and vote to eliminate suspects. During the **Night**, roles perform secret actions — kills, investigations, protections, and more. The AI players have distinct **personalities**, **memory systems**, and **perception depths** that make every game unique.

### Key Features

- **19 Roles** across 3 factions (Town, Mafia, Neutral) with 4 importance tiers
- **6 AI Personality Types** — Aggressive, Cautious, Paranoid, Logical, Shy, Charismatic — each with 17 behavioral parameters
- **14 Night Echo Events** — Dynamic environmental clues that surface during the game
- **Full Moon Balance Mechanic** — Catch-up system that buffs the losing faction
- **Last Wish System** — Dramatic lynch events with 4 possible outcomes
- **7-Phase Night Resolution** — Deterministic action ordering for fair outcomes
- **Bilingual Support** — English & Greek (EN/GR)

### Factions & Roles

| Faction | Roles |
|---------|-------|
| **Town** (9) | Citizen, Sheriff, Doctor, Lookout, Gossip, Lovers, Bodyguard, Tracker, Mayor |
| **Mafia** (6) | Godfather, Mafia Goon, Framer, Silencer, Consigliere, Janitor |
| **Neutral** (4) | Jester, Survivor, Executioner, Zombie |

### Game Flow

```
Morning Report → Day Discussion → Mid-Day Events → Trial & Vote → Night Phase
     ↑                                                              │
     └──────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React Native + Expo (SDK 54) |
| **Language** | TypeScript (strict mode) |
| **Navigation** | Expo Router (file-based) |
| **State** | JSON file-based (AsyncStorage / FileSystem) |
| **AI Engine** | Custom probability-based decision system |
| **Testing** | Jest |
| **Target** | iOS & Android |

### AI Strategy (3-Tier Migration)

| Tier | Approach | Status |
|------|----------|--------|
| Template | If-Else / Templates + Probability Engine | Phase 4 |
| API | Gemma-3-4b-it via Google AI API | Phase 6 |
| Local | Gemma-3-1b-it on-device via MediaPipe | Phase 7 |

---

## 📁 Project Structure

```
Mafia_Game/
├── app/                        # Expo Router screens
│   ├── index.tsx                #   Home / lobby
│   ├── settings.tsx             #   Game settings
│   ├── _layout.tsx              #   Root layout
│   └── game/                    #   Game screens
│       ├── day.tsx              #     Day phase (chat + discussion)
│       ├── morning.tsx          #     Morning report
│       ├── night.tsx            #     Night actions
│       ├── vote.tsx             #     Trial & voting
│       └── result.tsx           #     Game result
│
├── src/
│   ├── ai/                     # AI decision modules
│   │   ├── SpeakProbability.ts  #   When AI speaks
│   │   ├── MessageGenerator.ts  #   What AI says
│   │   ├── VoteDecision.ts      #   How AI votes
│   │   ├── NightDecision.ts     #   Night action targeting
│   │   ├── PerceptionFilter.ts  #   3-level memory filtering
│   │   ├── EventReaction.ts     #   Night Echo reactions
│   │   └── providers/           #   Phase 2/3 AI providers
│   │
│   ├── engine/                 # Core game engine (9 modules)
│   │   ├── PhaseManager.ts      #   Day/Night/Morning transitions
│   │   ├── ResolutionEngine.ts  #   7-phase night resolution
│   │   ├── AIEngine.ts          #   AI orchestrator
│   │   ├── ChatAnalyzer.ts      #   Semantic analysis (7 action types)
│   │   ├── WinChecker.ts        #   6 win conditions
│   │   ├── BalanceCalculator.ts #   Full Moon score
│   │   ├── FullMoonEngine.ts    #   Balance buff application
│   │   ├── NightEchoEngine.ts   #   Event selection (max 2/night)
│   │   └── LastWishEngine.ts    #   Lynch event system
│   │
│   ├── state/                  # State management
│   │   ├── GameState.ts         #   Core game state
│   │   ├── PlayerState.ts       #   Player data
│   │   ├── ChatState.ts         #   Chat history
│   │   ├── MemoryManager.ts     #   AI memory + trust/suspicion
│   │   └── EventState.ts        #   Event tracking
│   │
│   ├── data/                   # Game data (JSON)
│   │   ├── config.json          #   Game configuration & AI params
│   │   ├── roles.json           #   19 roles with scaling rules
│   │   ├── personalities.json   #   6 personality definitions
│   │   ├── nightEchoEvents.json #   14 Night Echo events
│   │   ├── fullMoonConfig.json  #   Balance mechanic config
│   │   ├── gossipHints.json     #   Gossip role hint templates
│   │   ├── lastWishActions.json #   Last Wish action definitions
│   │   └── messageTemplates.json #  378 bilingual AI message templates
│   │
│   ├── types/                  # TypeScript type definitions
│   ├── hooks/                  # React hooks
│   ├── components/             # UI components
│   └── utils/                  # Helper utilities
│
├── __tests__/                  # Test suites (Jest + ts-jest)
│   ├── utils/                  #   Utility tests (44 tests) ✅
│   ├── state/                  #   State manager tests (122 tests) ✅
│   ├── engine/                 #   BalanceCalculator (15 tests) ✅ + scaffolds
│   ├── hooks/                  #   useGameLoop (17) + useChat (13) ✅
│   ├── contexts/               #   GameContext (7) + SettingsContext (16) ✅
│   └── ai/                     #   AI module tests (scaffolds)
│
├── Game_documentation/         # Obsidian vault — full game design docs
│   ├── 1_Game_Design/          #   Roles, Phases, Events, Win Conditions
│   ├── 2_Technical_Workflow/   #   AI Engine, Memory System, Gameplay Loop
│   └── 3_Project_Structure/    #   Architecture, Roadmap, Specs
│
├── start.ps1                   # Dev launch script (version check + Expo start)
├── test.ps1                    # Test runner (filter, coverage, watch, type-check)
│
├── .github/
│   └── copilot-instructions.md # AI coding assistant rules
│
└── .github/
    └── skills/                 # Copilot skill definitions
```

---

## 📚 Documentation

The `Game_documentation/` folder is a complete **Obsidian vault** with 57+ interlinked markdown files covering every aspect of the game design:

- **19 Role documents** — Abilities, night actions, interaction rules, scaling tiers
- **6 Personality profiles** — 17 behavioral stats each, frequency distribution
- **14 Night Echo event specs** — Probability, timing, linked roles, triggers
- **Phase documentation** — Day (5-step chat loop), Night (7-phase resolution)
- **Technical workflow** — AI Decision Engine, Memory System, Gameplay Loop
- **Project structure** — Architecture diagrams, implementation roadmap

> Open the `Game_documentation/` folder in [Obsidian](https://obsidian.md/) for the best experience with linked notes and graph view.

---

## 🚀 Getting Started

> **Prerequisites:** Node.js 18+, npm, Expo Go app on your phone

```bash
# Clone the repository
git clone https://github.com/Sotiris01/mafia-ai-arena.git
cd mafia-ai-arena

# Install dependencies
npm install

# Start the Expo dev server (with version checks)
.\start.ps1
```

The `start.ps1` script verifies all dependency versions match Expo SDK 54, kills any stale process on port 8081, and launches the dev server with a QR code for Expo Go.

| Flag | Effect |
|------|--------|
| *(none)* | Verify versions → start Expo |
| `-Clean` | Nuke `node_modules` → reinstall → clear cache → start |
| `-CheckOnly` | Verify versions and exit (no server) |

### Running Tests

```powershell
.\test.ps1                          # Run all 234 tests
.\test.ps1 -Suite hooks             # Filter by path pattern
.\test.ps1 -TypeCheck               # tsc --noEmit before tests
.\test.ps1 -Coverage                # Generate coverage report
.\test.ps1 -Watch                   # Re-run on file changes
.\test.ps1 -Suite contexts -TypeCheck  # Combine flags
```

| Flag | Effect |
|------|--------|
| `-Suite <pattern>` | Run only tests matching the path pattern |
| `-TypeCheck` | Run `tsc --noEmit` first, abort on errors |
| `-Coverage` | Generate Jest coverage report |
| `-Watch` | Re-run tests on file changes |

> **Note:** The project has completed **Phase 3**. The app runs on phone with lobby, role assignment, chat (human only), settings, and navigation. 14 test suites / 234 unit tests pass. Engine and AI modules contain TODO scaffolds for Phases 4+. See `project_status.md` for the full phase breakdown.

---

## 🗺️ Roadmap

- [x] Game design documentation (Obsidian vault — 57+ files)
- [x] Project structure scaffolding (86 files)
- [x] Data layer implementation (8 JSON files, 378 message templates)
- [x] Data review & alignment with documentation
- [x] Prototype UI (navigable screens via Expo Router)
- [x] Dev launch script (`start.ps1` — version checks + Expo start)
- [x] **Phase 1** — Types & Utilities (7 type files + 4 utils)
- [x] **Phase 2** — State Management (5 state modules + 166 unit tests)
- [x] **Phase 3** — Playable Shell (lobby, role, chat, settings, navigation + 68 tests)
- [ ] **Phase 4** — Template AI + Day Cycle (AI talks, voting, day loop)
- [ ] **Phase 5** — Night Actions + Events + Full Game Loop
- [ ] **Phase 6** — Smart AI (Gemma API)
- [ ] **Phase 7** — Local AI (Gemma on-device via MediaPipe)

---

## 📄 License

This project is currently private. License TBD.
