# Mafia Game — Copilot Instructions

## Project Overview

Single-player mobile Mafia game where one human plays alongside AI-driven virtual players. Built with **React Native + Expo (TypeScript)**. The project is currently in the **documentation/design phase** — no source code exists yet.

**Final goal:** 100% offline mobile game with on-device AI (Gemma via MediaPipe).

## Architecture

- **3-Layer Design:** App Layer (React Native UI) → Game Engine (9 logic modules) → Data Layer (JSON storage)
- **AI Architecture:** Decision Layer (always if-else, 6 modules) + Text Layer (swappable backend via AITextProvider interface)
- **3-Phase AI Migration:** Phase 1 If-Else/Templates (MVP, offline) → Phase 2 Gemma API (cloud) → Phase 3 Gemma On-Device (offline, final goal)
- **State:** JSON files via AsyncStorage/Expo FileSystem — no external database

## Tech Stack

| Layer           | Choice                                                   |
| --------------- | -------------------------------------------------------- |
| Framework       | React Native + Expo                                      |
| Language        | TypeScript (strict)                                      |
| Navigation      | Expo Router (`app/` directory)                           |
| State           | JSON files (AsyncStorage/FS)                             |
| Animations      | React Native Reanimated                                  |
| Testing         | Jest + React Native Testing Lib                          |
| AI Phase 1      | If-else probability + template messages (TemplateProvider) |
| AI Phase 2      | Google Gemma API, gemma-3-4b-it (GemmaAPIProvider)       |
| AI Phase 3      | Gemma on-device via MediaPipe, gemma-3-1b-it (GemmaLocalProvider) |

## Project Structure

```
app/                    # Expo Router screens (6 game + lobby + settings)
src/
  components/           # UI — chat/(5), voting/(4), night/(3), events/(3), shared/(5), lobby/(3)
  engine/               # Core game logic — 9 modules
  ai/                   # AI decision modules — 6 core + providers/(5) + prompts/(3)
    providers/           # AITextProvider interface + 3 implementations + factory
    prompts/             # Prompt templates for Gemma (Phase 2/3)
  state/                # JSON state managers — 5 files
  data/                 # Static config JSONs — 8 files (incl. messageTemplates.json)
  types/                # TypeScript interfaces — 7 type files
  hooks/                # Custom React hooks — 6 hooks
  utils/                # Pure helpers — 4 files
assets/                 # Icons, fonts, sounds
__tests__/              # Mirrors src/ — engine/(5+), ai/(3+), providers/(3+)
```

## Key Conventions

- **File naming:** PascalCase for components/modules (`ChatBubble.tsx`, `PhaseManager.ts`), camelCase for utils/hooks (`useGameLoop.ts`, `probability.ts`)
- **Types:** Dedicated `src/types/` directory with domain-specific `.types.ts` files
- **Game data:** 3 per-player JSONs (`role.json`, `personality.json`, `memory.json`) + 2 shared (`chat_events.json`, `game_state.json`)
- **AI Decision Layer:** Always math-based (weights, probabilities, thresholds) — never uses LLM. Pure functions, deterministic, testable
- **AI Text Layer:** Uses `AITextProvider` interface — swappable between TemplateProvider (Phase 1), GemmaAPIProvider (Phase 2), GemmaLocalProvider (Phase 3). Only `MessageGenerator` and `ChatAnalyzer` go through providers
- **Fallback chain:** GemmaLocal → GemmaAPI → Template (graceful degradation)
- **Documentation language:** Bilingual Greek/English (Greek for descriptions, English for technical terms and role names)

## AI Provider Architecture

```
Decision Layer (NEVER changes):
  SpeakProbability, VoteDecision, NightDecision,
  PerceptionFilter, EventReaction, BalanceCalculator

Text Layer (swaps per phase):
  MessageGenerator ──→ AITextProvider.generateMessage()
  ChatAnalyzer     ──→ AITextProvider.analyzeMessage()

Providers:
  TemplateProvider   → Phase 1 (template pools × personality × intensity)
  GemmaAPIProvider   → Phase 2 (gemma-3-4b-it cloud API)
  GemmaLocalProvider → Phase 3 (gemma-3-1b-it on-device, MediaPipe LLM Task)

Factory: AIProviderFactory → FallbackProvider (Local → API → Template)
```

## Game Domain

- **19 roles** across 3 alignments:
  - **Town (9):** Citizen, Sheriff, Doctor, Lookout, Gossip, Lovers, Bodyguard, Tracker, Mayor
  - **Mafia (6):** Godfather, Mafia Goon, Framer, Silencer, Consigliere, Janitor
  - **Neutral (4):** Jester, Survivor, Executioner, Zombie
- **4 importance tiers:** 🟢 CORE (7+) → 🟡 IMPORTANT (8+) → 🔵 ADVANCED (10+) → 🟣 EXPANDED (13+)
- **6 AI personalities** (17 numeric stats each): Aggressive, Cautious, Paranoid, Logical, Shy, Charismatic
- **3 perception levels:** Level 1 Superficial (Aggressive, Shy) → Level 2 Smart (Cautious, Charismatic, Logical) → Level 3 Deep (Paranoid)
- **2 phases:** Day (Morning Report → Discussion + Mid-Day Events → Trial & Vote) and Night (Mafia Chat → Night Actions → 7-phase Resolution Order)
- **Night Resolution:** Phase 0 (Passive Visits) → 1 (Info Alteration) → 2 (Investigation) → 3 (Kill & Protection) → 4 (Post-Kill) → 5 (Passive Info) → 6 (Cleanup)
- **14 Night Echo Events** (E01–E14): max 2/night, delivered at Morning 🌅 or Mid-Day 💬
- **Full Moon:** Staged balance mechanic (Stage 0/1/2), max 3/game, 15% chance/night
- **Last Wish:** 40% chance on lynch, 4 action types
- **Win conditions:** Town (all Mafia dead), Mafia (≥ Town alive), Jester (get lynched), Executioner (target lynched), Survivor (stay alive), Zombie (≥ 50% infected)
- **Key rule:** Dead players' roles are NEVER revealed publicly
- **Memory decay:** Relationship weights × r (r = 0.85) each day

## Documentation

Game design docs live in `Game_documentation/` as an **Obsidian vault** with `[[wikilinks]]`.

### Vault Structure (57 files)
```
Game_documentation/
├── Index.md                    # MOC — full navigation map
├── Graph View Setup.md         # Obsidian graph color groups & tag taxonomy
├── 1_Game_Design/
│   ├── Roles/ (19 + template)  # Town/(9), Mafia/(6), Neutral/(4), role_template.md
│   ├── Phases/ (2)             # Day Phase, Night Phase
│   ├── Personalities/ (6)      # Aggressive, Cautious, Paranoid, Logical, Shy, Charismatic
│   ├── Events/ (17)            # Dynamic Events, Last Wish, Full Moon, E01–E14
│   ├── Win Conditions.md
│   └── Game Setup.md
├── 2_Technical_Workflow/ (4)   # Data Architecture, AI Decision Engine, Memory System, Gameplay Loop
└── 3_Project_Structure/ (4)    # Technical Specs, Folder Structure, Implementation Roadmap, AI Architecture
```

### Obsidian Tags (50 unique tags)
All files use YAML frontmatter with nested tags for graph coloring:
- `#role/town`, `#role/mafia`, `#role/neutral` — by faction
- `#tier/core`, `#tier/important`, `#tier/advanced`, `#tier/expanded` — by scaling
- `#personality`, `#perception/superficial`, `#perception/smart`, `#perception/deep`
- `#event/night_echo`, `#timing/morning`, `#timing/midday`
- `#phase/day`, `#phase/night`
- `#technical`, `#project`, `#mechanic`, `#ai_strategy`

## When Implementing

- Read the relevant `Game_documentation/` file before coding any feature
- Follow the folder structure defined in `Game_documentation/3_Project_Structure/Folder Structure.md`
- Use the TypeScript interfaces from `Game_documentation/3_Project_Structure/Technical Specs.md` as starting points
- Match JSON schemas from `Game_documentation/2_Technical_Workflow/Data Architecture.md`
- Follow the 3-phase AI strategy from `Game_documentation/3_Project_Structure/Implementation Roadmap.md`
- Respect the Decision Layer vs Text Layer separation from `Game_documentation/3_Project_Structure/AI Architecture.md`
- Keep AI Decision Layer deterministic and testable — pure functions with explicit inputs/outputs
- Only `MessageGenerator` and `ChatAnalyzer` should use the `AITextProvider` interface
- Use the `project-manager` skill (`/project-manager`) to scaffold new areas with TODO-driven stubs before writing code
