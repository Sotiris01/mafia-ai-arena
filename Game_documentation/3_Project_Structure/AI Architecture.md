---
tags:
  - project
  - project/architecture
  - ai_strategy
---

# AI Architecture
---

Αρχιτεκτονική του AI system σε 3 layers: **Decision Layer** (game logic — πάντα if-else), **Text Layer** (γλώσσα — αλλάζει ανά phase), **Provider Layer** (backend — Template / API / Local).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI ARCHITECTURE                              │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │              DECISION LAYER (Always If-Else)              │   │
│  │                                                           │   │
│  │  SpeakProbability  VoteDecision     NightDecision         │   │
│  │  PerceptionFilter  EventReaction    BalanceCalculator     │   │
│  │                                                           │   │
│  │  ⚡ Pure math. No AI/LLM calls. Same in ALL phases.       │   │
│  └──────────────────────────┬────────────────────────────────┘   │
│                             │                                    │
│                             ▼                                    │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │              TEXT LAYER (Swappable Backend)                │   │
│  │                                                           │   │
│  │  MessageGenerator ──→ AITextProvider.generateMessage()    │   │
│  │  ChatAnalyzer     ──→ AITextProvider.analyzeMessage()     │   │
│  │                                                           │   │
│  │  🔄 Same interface, different implementation per phase.    │   │
│  └──────────────────────────┬────────────────────────────────┘   │
│                             │                                    │
│                    AIProviderFactory                              │
│                    ┌────────┼────────┐                            │
│                    ▼        ▼        ▼                            │
│  ┌──────────┐ ┌──────────┐ ┌───────────────┐                    │
│  │ Template │ │ Gemma    │ │ Gemma Local   │                    │
│  │ Provider │ │ API      │ │ Provider      │                    │
│  │          │ │ Provider │ │               │                    │
│  │ Phase 1  │ │ Phase 2  │ │ Phase 3       │                    │
│  │ Offline  │ │ Online   │ │ Offline       │                    │
│  └──────────┘ └──────────┘ └───────────────┘                    │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │              PROVIDER LAYER                               │   │
│  └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Decision Layer vs Text Layer

Η **κρίσιμη αρχιτεκτονική απόφαση** — ξεχωρίζουμε τι **αποφασίζει** το AI από τι **λέει**.

### Decision Layer — Πάντα If-Else

Αυτά τα modules **δεν αλλάζουν ποτέ**. Ίδιος κώδικας σε Phase 1, 2, και 3.

| Module               | Input                        | Output                  | Logic              |
| -------------------- | ---------------------------- | ----------------------- | ------------------- |
| `SpeakProbability`   | personality + role + triggers | boolean (speak or not)  | Math formula        |
| `VoteDecision`       | memory + perception filter   | player_id or null       | 8-step if-else      |
| `NightDecision`      | role + memory + alive_list   | target player_id        | Role-specific rules |
| `PerceptionFilter`   | memory + perception_depth    | filtered relationships  | Weight threshold    |
| `EventReaction`      | event + personality          | memory weight update    | Weight formula      |
| `BalanceCalculator`   | alive counts                 | balance_score + stage   | Math formula        |

**Γιατί δεν αλλάζει:** Αν η game logic εξαρτιόταν από AI API, τότε:
- Offline mode θα ήταν αδύνατος
- Αν το AI έκανε λάθος output, θα χαλούσε το παιχνίδι
- Τα αποτελέσματα δεν θα ήταν reproducible/testable

### Text Layer — Αλλάζει ανά Phase

Αυτά τα modules χρησιμοποιούν το `AITextProvider` interface.

| Module               | Phase 1                     | Phase 2                    | Phase 3                  |
| -------------------- | --------------------------- | -------------------------- | ------------------------ |
| `MessageGenerator`   | Template + fillTemplate()   | Gemma API + prompt         | Gemma Local + prompt     |
| `ChatAnalyzer`       | Pattern matching + keywords | Gemma API → structured JSON | Gemma Local → structured |

---

## The AITextProvider Interface

```typescript
// src/ai/providers/AITextProvider.ts

interface AITextProvider {
  /**
   * Generate a chat message based on the prompt.
   * Used by MessageGenerator to create AI player messages.
   */
  generateMessage(prompt: string): Promise<string>;
  
  /**
   * Analyze a chat message and extract structured data.
   * Used by ChatAnalyzer to process human/AI messages.
   */
  analyzeMessage(message: string): Promise<ChatEvent>;
  
  /**
   * Check if this provider is currently available.
   * TemplateProvider → always true
   * GemmaAPIProvider → true if online + API key valid
   * GemmaLocalProvider → true if model downloaded + loaded
   */
  isAvailable(): boolean;
}
```

---

## Provider Implementations

### 1. TemplateProvider (Phase 1)

```typescript
// src/ai/providers/TemplateProvider.ts

class TemplateProvider implements AITextProvider {
  private templates: TemplatePool;

  constructor() {
    this.templates = loadTemplates();  // From src/data/messageTemplates.json
  }

  async generateMessage(prompt: string): Promise<string> {
    // prompt contains structured data (not natural language)
    const context = parsePromptContext(prompt);
    const pool = this.templates[context.action][context.personality];
    const template = weightedRandom(pool[context.intensity]);
    return fillTemplate(template, context);
  }

  async analyzeMessage(message: string): Promise<ChatEvent> {
    // Pattern matching + keyword detection
    const action = detectAction(message);      // "suspicious" → accuse
    const target = detectTarget(message);      // "Player_3" → player_3
    const weight = detectIntensity(message);   // "DEFINITELY" → 0.9
    return { action, target, weight, ... };
  }

  isAvailable(): boolean { return true; }  // Always works
}
```

**Template Pool Structure:**

```json
{
  "accuse": {
    "Aggressive": {
      "high": [
        "{target} is 100% Mafia. Vote NOW!",
        "I KNOW {target} is lying. Lynch them!",
        "Why is nobody voting {target}?! They're obviously guilty!"
      ],
      "medium": [
        "Something's off about {target}. We should look into them.",
        "{target} has been acting weird since Day {day}."
      ],
      "low": [
        "Hmm, {target}... I don't trust them.",
        "Has anyone noticed {target}?"
      ]
    },
    "Cautious": {
      "high": [
        "Based on the evidence, I think {target} might be Mafia.",
        "I've been watching {target} — their behavior is inconsistent."
      ],
      "medium": [
        "I'm not sure about {target}. Can we discuss?",
        "Let's consider the possibility that {target} isn't Town."
      ],
      "low": [
        "Just a thought about {target}... something feels off."
      ]
    }
  }
}
```

### 2. GemmaAPIProvider (Phase 2)

```typescript
// src/ai/providers/GemmaAPIProvider.ts

class GemmaAPIProvider implements AITextProvider {
  private apiKey: string;
  private model = "gemma-3-4b-it";
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateMessage(prompt: string): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/models/${this.model}:generateContent`,
      {
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
            topP: 0.9,
            stopSequences: ["\n\n"]
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" }
          ]
        })
      }
    );
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  async analyzeMessage(message: string): Promise<ChatEvent> {
    const prompt = `Analyze this Mafia game message. Return ONLY valid JSON.
Message: "${message}"
Format: {"action":"accuse|defend|agree|disagree|claim|question|deflect","target":"player_name|null","weight":0.0-1.0}`;
    
    const result = await this.generateMessage(prompt);
    return JSON.parse(result);
  }

  isAvailable(): boolean {
    return !!this.apiKey && isNetworkAvailable();
  }
}
```

### 3. GemmaLocalProvider (Phase 3)

```typescript
// src/ai/providers/GemmaLocalProvider.ts

class GemmaLocalProvider implements AITextProvider {
  private static modelPath: string | null = null;

  static async downloadModel(
    onProgress: (percent: number) => void
  ): Promise<void> {
    // Download quantized model to app documents directory
    const downloadUrl = getModelDownloadUrl("gemma-3-1b-it-int4");
    const destPath = `${FileSystem.documentDirectory}models/gemma-3-1b-it-int4`;
    
    await FileSystem.downloadAsync(downloadUrl, destPath, {
      md5: true  // Verify integrity
    });
    
    GemmaLocalProvider.modelPath = destPath;
  }

  static isModelDownloaded(): boolean {
    return FileSystem.existsSync(
      `${FileSystem.documentDirectory}models/gemma-3-1b-it-int4`
    );
  }

  async generateMessage(prompt: string): Promise<string> {
    // Call native module (MediaPipe LLM Task)
    return await NativeModules.GemmaModule.generate({
      prompt,
      maxTokens: 100,
      temperature: 0.8,
      topP: 0.9
    });
  }

  async analyzeMessage(message: string): Promise<ChatEvent> {
    const prompt = `Analyze Mafia chat. JSON only.
"${message}"
{"action":"...","target":"...","weight":0.0-1.0}`;
    
    const result = await this.generateMessage(prompt);
    return JSON.parse(extractJSON(result));
  }

  isAvailable(): boolean {
    return GemmaLocalProvider.isModelDownloaded();
  }
}
```

---

## Provider Factory & Fallback Chain

```typescript
// src/ai/providers/AIProviderFactory.ts

class AIProviderFactory {
  static create(config: GameConfig): AITextProvider {
    const providers: AITextProvider[] = [];
    
    // Priority 1: Local (best — offline + smart)
    if (config.aiMode !== "templates_only") {
      const local = new GemmaLocalProvider();
      if (local.isAvailable()) providers.push(local);
    }
    
    // Priority 2: API (fallback — online + smart)
    if (config.aiMode !== "templates_only" && config.gemmaApiKey) {
      const api = new GemmaAPIProvider(config.gemmaApiKey);
      if (api.isAvailable()) providers.push(api);
    }
    
    // Priority 3: Templates (always available — offline + simple)
    providers.push(new TemplateProvider());
    
    // Return highest priority available provider
    return new FallbackProvider(providers);
  }
}

// Wrapper that tries providers in order
class FallbackProvider implements AITextProvider {
  constructor(private providers: AITextProvider[]) {}

  async generateMessage(prompt: string): Promise<string> {
    for (const provider of this.providers) {
      if (provider.isAvailable()) {
        try {
          return await provider.generateMessage(prompt);
        } catch {
          continue;  // Try next provider
        }
      }
    }
    throw new Error("No AI provider available");
  }

  async analyzeMessage(message: string): Promise<ChatEvent> {
    for (const provider of this.providers) {
      if (provider.isAvailable()) {
        try {
          return await provider.analyzeMessage(message);
        } catch {
          continue;
        }
      }
    }
    // Ultimate fallback: basic pattern matching
    return basicPatternMatch(message);
  }

  isAvailable(): boolean {
    return this.providers.some(p => p.isAvailable());
  }
}
```

**Fallback Priority:**

```
GemmaLocalProvider → GemmaAPIProvider → TemplateProvider
     (offline)           (online)          (always)

Αν Local αποτύξει → πέφτει σε API
Αν API αποτύξει → πέφτει σε Templates
Αν Templates → πάντα δουλεύει (Phase 1 logic)
```

---

## Prompt Engineering Guide

### Αρχές Prompting για Mafia AI

1. **Role adherence:** Το AI δεν πρέπει ποτέ να αποκαλύψει τον ρόλο του σε public chat
2. **Personality consistency:** Κάθε personality πρέπει να γράφει με μοναδικό τρόπο
3. **Short output:** 1-2 προτάσεις max — μοιάζει με real mobile chat
4. **Context window:** Δώσε μόνο τα τελευταία 5 μηνύματα — keep prompts short
5. **Structured output:** Για ChatAnalyzer, ζήτα JSON format explicitly

### Message Generation Prompt Template

```
SYSTEM: You are playing a Mafia party game. You are {player_name}.

ROLE: {role} ({alignment}) — NEVER reveal this in chat.
PERSONALITY: {personality_type}
- Speech style: {speech_description}
- Aggression level: {aggression}/10
- Trust level: {trust_base}/10

GAME STATE:
- Day {day_number}, {alive_count} players alive
- Your top suspicions: {top_3_suspects_with_scores}
- Your trusted allies: {top_2_trusted}
- Recent dead: {recent_deaths}

DECIDED ACTION: {action_type} → target: {target_name}
REASON: {reason_from_decision_layer}

RECENT CHAT (last 5 messages):
{recent_messages}

Write a SHORT chat message (1-2 sentences, casual mobile text style).
Stay in character. Do NOT mention game mechanics or your role.
```

### Chat Analysis Prompt Template

```
Analyze this message from a Mafia game chat.
Return ONLY a valid JSON object, no other text.

Message: "{raw_message}"
Speaker: "{speaker_name}"
Day: {day_number}

Output format:
{
  "action": "accuse|defend|agree|disagree|claim|question|deflect",
  "target": "player_name or null",
  "weight": float 0.0-1.0 (how strong is the statement),
  "indirect_targets": [
    {"player": "name", "relation": "positive|negative", "weight": float}
  ],
  "claim": {"role": "role_name"} or null
}
```

---

## Performance Considerations

### API Latency (Phase 2)

```
Gemma API Response Times:
├── gemma-3-1b-it:  100–200ms 
├── gemma-3-4b-it:  200–400ms  ← Recommended
└── gemma-3-12b-it: 400–800ms

Game Integration:
├── Message generation: async (player "typing..." indicator shown)
├── Chat analysis: async (background, doesn't block UI)
└── Timeout: 3s → fallback to TemplateProvider
```

### On-Device Inference (Phase 3)

```
gemma-3-1b-it (int4 quantized) on mobile:
├── Load time: 2–5s (first inference), then cached
├── Inference: 15–25 tokens/second
├── Typical message (20 tokens): ~1s
├── RAM usage: ~1.5–2 GB during inference
├── Battery: moderate (GPU-accelerated where available)
└── Thermal: manageable for short bursts (chat messages)

Optimization strategies:
├── Pre-warm model at game start (load during lobby)
├── Batch analysis: Queue messages, analyze in batch
├── Token limit: maxTokens=100 (short messages only)
└── Cooldown: 2-3s between AI messages (already in game design)
```

---

## File Structure (AI Provider Files)

```
src/ai/
├── providers/                      # AI Text Provider system
│   ├── AITextProvider.ts           # Interface definition
│   ├── AIProviderFactory.ts        # Factory + FallbackProvider
│   ├── TemplateProvider.ts         # Phase 1: template-based
│   ├── GemmaAPIProvider.ts         # Phase 2: Google AI API
│   └── GemmaLocalProvider.ts       # Phase 3: on-device Gemma
│
├── prompts/                        # Prompt templates for Phase 2/3
│   ├── messagePrompt.ts            # Message generation prompt builder
│   ├── analysisPrompt.ts           # Chat analysis prompt builder
│   └── promptUtils.ts              # Context formatting helpers
│
├── SpeakProbability.ts             # Decision Layer (never changes)
├── MessageGenerator.ts             # Text Layer → uses AITextProvider
├── VoteDecision.ts                 # Decision Layer
├── NightDecision.ts                # Decision Layer
├── PerceptionFilter.ts             # Decision Layer
└── EventReaction.ts                # Decision Layer
```

---

## Related Links

- [[Implementation Roadmap]] (3-phase strategy, build order, deliverables)
- [[Technical Specs]] (core architecture, TypeScript interfaces)
- [[Folder Structure]] (complete directory layout)
- [[AI Decision Engine]] (Decision Layer details — speak, vote, perception)
- [[Memory System]] (how memory feeds into AI decisions)
- [[Data Architecture]] (JSON schemas used by AI modules)
