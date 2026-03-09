---
tags:
  - project
  - project/roadmap
  - ai_strategy
---

# Implementation Roadmap
---

Αυτό το αρχείο περιγράφει τη **στρατηγική υλοποίησης σε 3 φάσεις** — από απλή if-else λογική μέχρι on-device AI με Gemma.
Κάθε φάση χτίζεται πάνω στην προηγούμενη. Ο κώδικας σχεδιάζεται αρχιτεκτονικά ώστε η αλλαγή AI backend να μην απαιτεί rewrite.

---

## Overview: 3 Φάσεις

```
┌─────────────────────────────────────────────────────────────────┐
│                   IMPLEMENTATION PHASES                          │
│                                                                 │
│  Phase 1                Phase 2                Phase 3           │
│  ┌─────────────┐        ┌─────────────┐        ┌─────────────┐ │
│  │ IF-ELSE     │  ───→  │ GEMMA API   │  ───→  │ GEMMA       │ │
│  │ LOGIC       │        │ (Cloud)     │        │ ON-DEVICE   │ │
│  │             │        │             │        │ (Offline)   │ │
│  │ MVP         │        │ Smart AI    │        │ Final Goal  │ │
│  └─────────────┘        └─────────────┘        └─────────────┘ │
│                                                                 │
│  🎯 Goal: Game works    🎯 Goal: Natural     🎯 Goal: 100%    │
│  Rules validated        AI conversations      offline mobile    │
│  Gameplay tested        Dynamic behavior       No internet      │
│  UI complete            Personality depth       Low latency      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: If-Else Logic (MVP)

### Στόχος
Πλήρως λειτουργικό παιχνίδι με **deterministic AI** βασισμένο σε κανόνες. Κανένα εξωτερικό dependency — καθαρό TypeScript. Αυτή η φάση **ολοκληρώνει ΟΛΗ τη game logic** και τα UI.

### Τι περιλαμβάνει

| Component                | Description                                               |
| ------------------------ | --------------------------------------------------------- |
| **Game Engine** (9 modules) | PhaseManager, ResolutionEngine, WinChecker, 3 Event Engines, ChatAnalyzer, AIEngine, BalanceCalculator — **ΟΛΑ ολοκληρωμένα** |
| **AI Decision System**    | If-else + probability weights: SpeakProbability, VoteDecision, NightDecision, PerceptionFilter, EventReaction |
| **Message Generation**    | Template-based. Predefined message pools ανά action type × personality × role |
| **Chat Analysis**         | Pattern matching + keyword detection (δεν χρειάζεται NLP) |
| **Full UI**               | Όλα τα screens, components, animations — **τελειωμένα** |
| **State Management**      | Όλα τα JSON schemas functional                             |
| **Testing**               | Unit + integration tests για κάθε engine module             |

### AI Logic Architecture (Phase 1)

```typescript
// SpeakProbability.ts — Phase 1: Pure math
function shouldSpeak(player: PlayerState): boolean {
  const chance = player.personality.speak_probability_base
    * getRoleModifier(player.role)
    * getTriggerModifier(player, chatHistory)
    * getCooldownModifier(player, recentMessages);
  
  return Math.random() < chance;
}

// MessageGenerator.ts — Phase 1: Template pool
function generateMessage(player: PlayerState, context: ChatContext): string {
  const templates = getTemplates(player.personality.type, decideAction(player));
  const template = weightedRandom(templates);
  return fillTemplate(template, context);
  // "I think {target} is suspicious" → "I think Player_3 is suspicious"
}

// VoteDecision.ts — Phase 1: 8-step if-else
function decideVote(player: PlayerState): string | null {
  // 1. Load memory → 2. Apply perception filter → 3. Collect suspicion
  // 4. Time decay → 5. Role overrides → 6. vote_threshold check
  // 7. Select highest → 8. Cast vote
  const suspicions = getFilteredSuspicions(player);
  
  if (player.role === "Sheriff" && hasKnownMafia(player))
    return getKnownMafia(player);       // ALWAYS vote known Mafia
  if (player.role === "Executioner")
    return player.specialRules.target;   // Push target lynch
  if (player.is_zombie) return null;     // Cannot vote
  
  const highest = getHighestSuspicion(suspicions);
  if (highest.score >= player.personality.vote_threshold)
    return highest.playerId;
  
  return null; // Abstain
}
```

### Message Template Strategy

```
Templates organized by:
├── action_type (accuse / defend / agree / disagree / claim / question / deflect)
│   ├── personality (Aggressive / Cautious / Paranoid / Logical / Shy / Charismatic)
│   │   ├── intensity_high[]   — "Player {target} is DEFINITELY Mafia!"
│   │   ├── intensity_medium[] — "I have a feeling about {target}..."
│   │   └── intensity_low[]    — "Hmm, {target} seems a bit off."
│   └── role_specific (optional)
│       ├── sheriff_evidence[] — "I investigated {target} last night..."
│       └── mafia_deflect[]    — "Why are we ignoring {other}?"
└── event_reaction
    ├── night_echo[]           — "Did anyone else hear that noise?"
    └── full_moon[]            — "The Full Moon... something is coming."
```

### Phase 1 Deliverables

- ✅ Πλήρως παίξιμο παιχνίδι
- ✅ Όλοι οι 19 ρόλοι functional
- ✅ Όλα τα 6 personalities με distinct behavior
- ✅ Night Echo Events (E01–E14) + Full Moon + Last Wish
- ✅ 7-phase Night Resolution
- ✅ 6 win conditions
- ✅ Complete UI
- ✅ Offline ready (δεν χρειάζεται internet)

### Περιορισμοί Phase 1

- Τα μηνύματα AI είναι templated → μπορεί να γίνουν repetitive
- Δεν κατανοεί real text input — pattern matching μόνο
- Δεν μπορεί να κάνει σύνθετους συλλογισμούς (multi-step deduction)
- Η "προσωπικότητα" εκφράζεται μέσω template selection, όχι μέσω γλώσσας

---

## Phase 2: Gemma API (Cloud AI)

### Στόχος
Αντικατάσταση template-based messages και pattern-matching chat analysis με **Google Gemma API calls** — φυσικό AI conversation. Η game logic (votes, night actions, perception) **παραμένει if-else** — μόνο τα text-related modules αλλάζουν.

### Τι αλλάζει

| Module                 | Phase 1                    | Phase 2                          |
| ---------------------- | -------------------------- | -------------------------------- |
| `MessageGenerator.ts`  | Template pool + fillTemplate | Gemma API prompt → natural text  |
| `ChatAnalyzer.ts`      | Keyword/pattern matching    | Gemma API → structured analysis  |
| `SpeakProbability.ts`  | ❌ Δεν αλλάζει             | ❌ Δεν αλλάζει                   |
| `VoteDecision.ts`      | ❌ Δεν αλλάζει             | ❌ Δεν αλλάζει                   |
| `NightDecision.ts`     | ❌ Δεν αλλάζει             | ❌ Δεν αλλάζει                   |
| `PerceptionFilter.ts`  | ❌ Δεν αλλάζει             | ❌ Δεν αλλάζει                   |

> **Κανόνας:** Η **game logic** (ψηφοφορία, night actions, win conditions, events) δεν εξαρτάται ποτέ από AI API. Μόνο η **γλώσσα** αλλάζει.

### API Integration

```typescript
// src/ai/providers/GemmaAPIProvider.ts
class GemmaAPIProvider implements AITextProvider {
  private apiKey: string;
  private endpoint = "https://generativelanguage.googleapis.com/v1beta";
  private model = "gemma-3-4b-it";  // Lightweight, fast

  async generateMessage(prompt: string): Promise<string> {
    const response = await fetch(`${this.endpoint}/models/${this.model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": this.apiKey
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.8,
          topP: 0.9
        }
      })
    });
    return parseResponse(response);
  }

  async analyzeMessage(message: string): Promise<ChatEvent> {
    const prompt = buildAnalysisPrompt(message);
    const result = await this.generateMessage(prompt);
    return parseStructuredOutput(result);
  }
}
```

### Prompt Engineering

```typescript
// Prompt template for message generation
function buildMessagePrompt(player: PlayerState, context: ChatContext): string {
  return `You are ${player.player_name} in a Mafia game.
Role: ${player.role.role} (${player.role.alignment}) — KEEP SECRET.
Personality: ${player.personality.type}
  - Aggression: ${player.personality.aggression}
  - Trust: ${player.personality.trust_base}
  - Speak style: ${getPersonalityDescription(player.personality.type)}

Current situation:
- Day ${context.day}, ${context.alive_count} players alive
- Your suspicions: ${formatSuspicions(player.memory)}
- Recent chat: ${formatRecentMessages(context.recent, 5)}

Action decided: ${context.decided_action} (target: ${context.target})

Generate a SHORT in-character chat message (1-2 sentences, casual tone).
Do NOT reveal your role. Stay in personality.`;
}

// Prompt template for chat analysis
function buildAnalysisPrompt(message: string): string {
  return `Analyze this Mafia game chat message and return JSON:
Message: "${message}"

Return EXACTLY this JSON format:
{
  "action": "accuse|defend|agree|disagree|claim|question|deflect",
  "target": "player_name or null",
  "weight": 0.0-1.0,
  "indirect_targets": [{"player": "name", "relation": "type", "weight": 0.0-1.0}],
  "claim": {"role": "role_name"} or null
}`;
}
```

### Phase 2 Requirements

- **Google AI Studio API Key** (free tier: 60 requests/minute)
- **Internet connection** (required for API calls)
- **Fallback:** Αν δεν υπάρχει internet → automatic fallback σε Phase 1 templates
- **Cost:** Free tier αρκεί για normal gameplay (~10-20 messages/minute)

### Phase 2 Deliverables

- ✅ Natural language AI messages (not templated)
- ✅ AI κατανοεί human text input (real NLP)
- ✅ Κάθε personality γράφει με μοναδικό στυλ
- ✅ AI μπορεί να κάνει σύνθετους συλλογισμούς στα μηνύματα
- ✅ Automatic fallback σε offline templates αν χαθεί connection

### Περιορισμοί Phase 2

- Απαιτεί internet → δεν είναι offline
- API latency (200–500ms per request)
- Free tier rate limits (60 req/min)
- Δεδομένα αποστέλλονται σε Google servers

---

## Phase 3: Gemma On-Device (Offline AI)

### Στόχος
**Τελικός στόχος.** Κατέβασμα Gemma model στη συσκευή. Πλήρως offline gameplay με natural language AI. Κανένα internet — κανένα API — κανένα κόστος.

### Model Selection

| Model              | Size    | RAM    | Speed       | Quality  | Mobile Fit |
| ------------------ | ------- | ------ | ----------- | -------- | ---------- |
| gemma-3-1b-it      | ~1.2 GB | ~2 GB  | 15-25 tok/s | Basic    | ✅ Best     |
| gemma-3-4b-it      | ~4.0 GB | ~5 GB  | 8-15 tok/s  | Good     | ⚠️ High-end |
| gemma-3-12b-it     | ~12 GB  | ~14 GB | 2-5 tok/s   | Excellent | ❌ Desktop  |

**Επιλογή:** `gemma-3-1b-it` — Χωράει σε κινητά με 4+ GB RAM. Αρκετά good quality για short Mafia chat messages (1-2 sentences).

### On-Device Integration

```
React Native (JS Thread)
         │
         ▼
┌─────────────────────────────┐
│  Native Module Bridge       │
│  (React Native Module)      │
├─────────────────────────────┤
│  iOS: MediaPipe LLM Task    │
│  Android: MediaPipe LLM Task│
├─────────────────────────────┤
│  Gemma 3 1B (Quantized)     │
│  Format: int4 / int8        │
│  Size: ~600MB–1.2GB         │
│  Storage: App Documents Dir │
└─────────────────────────────┘
```

### Implementation Approach

```typescript
// src/ai/providers/GemmaLocalProvider.ts
class GemmaLocalProvider implements AITextProvider {
  private modelLoaded: boolean = false;

  async initialize(): Promise<void> {
    // Called once at app startup or first game
    await NativeModules.GemmaModule.loadModel("gemma-3-1b-it-int4");
    this.modelLoaded = true;
  }

  async generateMessage(prompt: string): Promise<string> {
    if (!this.modelLoaded) throw new Error("Model not loaded");
    
    return await NativeModules.GemmaModule.generate({
      prompt,
      maxTokens: 100,       // Short messages only
      temperature: 0.8,
      topP: 0.9
    });
  }

  async analyzeMessage(message: string): Promise<ChatEvent> {
    const prompt = buildAnalysisPrompt(message);
    const result = await this.generateMessage(prompt);
    return parseStructuredOutput(result);
  }

  isAvailable(): boolean {
    return this.modelLoaded;
  }
}
```

### Native Module (Platform-Specific)

```
ios/
├── GemmaModule.swift              # React Native bridge
├── GemmaInference.swift           # MediaPipe LLM Task wrapper
└── Podfile additions              # mediapipe dependency

android/
├── GemmaModule.kt                 # React Native bridge
├── GemmaInference.kt              # MediaPipe LLM Task wrapper
└── build.gradle additions         # mediapipe dependency
```

### Model Download Strategy

```
First Launch:
1. Game works in Phase 1 mode (templates) — immediately playable
2. Background: Download model (~600MB–1.2GB)
3. Store in app's Documents directory
4. On completion → switch to on-device AI
5. Subsequent launches → model already available

Settings screen:
├── AI Mode: [Templates] / [On-Device AI]
├── Model Status: Downloaded ✅ / Downloading 45% / Not Downloaded
├── Model Size: ~800MB
└── Delete Model (free storage)
```

### Phase 3 Requirements

- **One-time download:** ~600MB–1.2GB (int4 quantized model)
- **Storage:** ~1GB permanent storage on device
- **RAM:** 2+ GB available at runtime
- **CPU:** Modern ARM processor (A12+ iOS / Snapdragon 700+ Android)
- **No Expo Go:** Requires custom dev client (native modules)

### Phase 3 Deliverables

- ✅ Πλήρως offline gameplay
- ✅ Natural language AI — no internet required
- ✅ Zero latency (on-device inference)
- ✅ Zero cost (no API calls)
- ✅ Privacy (δεδομένα δεν φεύγουν από τη συσκευή)

### Περιορισμοί Phase 3

- Model download size (~600MB+)
- Permanent storage usage (~1GB)
- Battery consumption during inference
- Lower quality than large cloud models (1B vs 4B+)
- Requires native module development (no Expo Go)
- Device compatibility (2020+ devices with 4+ GB RAM)

---

## Abstraction Layer: AITextProvider

**Κρίσιμο:** Η αλλαγή μεταξύ φάσεων γίνεται μέσω ενός **interface** — κανένα module δεν ξέρει ποιο backend τρέχει.

```typescript
// src/ai/providers/AITextProvider.ts — THE INTERFACE
interface AITextProvider {
  generateMessage(prompt: string): Promise<string>;
  analyzeMessage(message: string): Promise<ChatEvent>;
  isAvailable(): boolean;
}

// src/ai/providers/AIProviderFactory.ts — FACTORY
function createProvider(config: GameConfig): AITextProvider {
  // Phase 3: On-device Gemma (preferred)
  if (config.aiMode === "local" && GemmaLocalProvider.isModelDownloaded()) {
    return new GemmaLocalProvider();
  }
  
  // Phase 2: Gemma API (cloud fallback)
  if (config.aiMode === "api" && config.apiKey && isOnline()) {
    return new GemmaAPIProvider(config.apiKey);
  }
  
  // Phase 1: Template-based (always available)
  return new TemplateProvider();
}
```

```
┌─────────────────────────────────────────────────────┐
│                 AIEngine.ts                          │
│  (Orchestrator — doesn't know which provider)       │
│                                                     │
│  Uses: AITextProvider interface                      │
│                    │                                 │
│         ┌──────────┼──────────┐                      │
│         ▼          ▼          ▼                      │
│  ┌────────────┐┌────────────┐┌────────────────┐      │
│  │ Template   ││ Gemma API  ││ Gemma Local    │      │
│  │ Provider   ││ Provider   ││ Provider       │      │
│  │ (Phase 1)  ││ (Phase 2)  ││ (Phase 3)     │      │
│  │            ││            ││               │      │
│  │ Templates  ││ HTTP API   ││ Native Module │      │
│  │ fillTemplate││ Google AI  ││ MediaPipe LLM │      │
│  │ Offline ✅  ││ Online ⚡  ││ Offline ✅     │      │
│  └────────────┘└────────────┘└────────────────┘      │
└─────────────────────────────────────────────────────┘
```

---

## Build Order Strategy

### Βήμα-προς-βήμα σειρά ανάπτυξης:

```
Phase 1 Build Order:
──────────────────
1.  src/types/          — ALL TypeScript interfaces first
2.  src/data/           — Static JSON configs (roles, personalities, events)
3.  src/state/          — State managers (GameState, PlayerState, MemoryManager, ChatState, EventState)
4.  src/utils/          — Pure utility functions
5.  src/engine/         — Core game logic:
    5a. BalanceCalculator.ts
    5b. WinChecker.ts
    5c. ResolutionEngine.ts
    5d. PhaseManager.ts
    5e. NightEchoEngine.ts + FullMoonEngine.ts + LastWishEngine.ts
6.  src/ai/             — AI decision modules:
    6a. PerceptionFilter.ts
    6b. VoteDecision.ts + NightDecision.ts
    6c. SpeakProbability.ts + EventReaction.ts
    6d. MessageGenerator.ts (TEMPLATE-based first)
    6e. AITextProvider interface + TemplateProvider
7.  src/engine/ChatAnalyzer.ts — Pattern-matching analyzer
8.  src/engine/AIEngine.ts     — Orchestrator (connects ai/ modules)
9.  __tests__/          — Unit tests for all engine + ai modules
10. src/hooks/          — React hooks (useGameLoop, useChat, useVoting, etc.)
11. src/components/     — UI components
12. app/                — Screens + routing
→ Phase 1 = COMPLETE GAME ✅

Phase 2 Addition:
────────────────
13. src/ai/providers/GemmaAPIProvider.ts  — API integration
14. src/ai/providers/AIProviderFactory.ts — Provider selection
15. Update MessageGenerator → use AITextProvider
16. Update ChatAnalyzer → use AITextProvider for analysis
17. Settings screen: API key input + AI mode selector
18. Fallback logic: API fail → Template fallback
→ Phase 2 = SMART AI (online) ✅

Phase 3 Addition:
────────────────
19. ios/ + android/ native module setup
20. MediaPipe LLM Task integration
21. src/ai/providers/GemmaLocalProvider.ts — On-device inference
22. Model download manager (background download + storage)
23. Update AIProviderFactory → prefer local over API
24. Settings: Model download UI + storage management
25. Expo dev client configuration (no more Expo Go)
→ Phase 3 = OFFLINE AI (final goal) ✅
```

---

## Expo Considerations

| Phase | Expo Go | Custom Dev Client | EAS Build |
| ----- | ------- | ----------------- | --------- |
| 1     | ✅ Works | Not needed         | Optional  |
| 2     | ✅ Works | Not needed         | Optional  |
| 3     | ❌ Fails | ✅ Required        | ✅ Required |

Phase 3 απαιτεί **native modules** (MediaPipe) → δεν τρέχει σε Expo Go.
Χρειάζεται `expo-dev-client` + `eas build` για development + production builds.

```bash
# Phase 3 setup
npx expo install expo-dev-client
eas build --profile development --platform ios
eas build --profile development --platform android
```

---

## Related Links

- [[AI Architecture]] (detailed provider architecture + prompt engineering)
- [[Technical Specs]] (core components + TypeScript interfaces)
- [[Folder Structure]] (directory layout with AI providers)
- [[AI Decision Engine]] (what the AI decides — speak, vote, night)
- [[Gameplay Loop]] (when AI modules are called)
