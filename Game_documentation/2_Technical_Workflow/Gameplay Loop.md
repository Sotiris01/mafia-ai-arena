---
tags:
  - technical
  - technical/loop
  - workflow
---

# Gameplay Loop — Technical Workflow
---

## Overview

```
┌─────────────────────────────────────────────────────────┐
│                    GAMEPLAY LOOP                         │
│                                                         │
│  ┌─ MORNING REPORT ────────────────────────────────┐    │
│  │  Deaths (no role reveal) + Events 🌅 + Full Moon │    │
│  └──────────────────────────┬───────────────────────┘    │
│                             ▼                            │
│  ┌─ DAY PHASE ─────────────────────────────────────┐    │
│  │  New Message → Step 1: Analyze Message           │    │
│  │            → Step 2: Update Memory (all AI)      │    │
│  │            → Step 3: Human Window (pause)        │    │
│  │            → Step 4: Speak Probability Engine     │    │
│  │            → Step 5: Generate Response → ↩ Step 1│    │
│  │  💬 Mid-Day Event Interrupts (30s–120s delay)     │    │
│  └──────────────────────────┬───────────────────────┘    │
│                             ▼                            │
│  Trial & Vote → Lynch Resolution → Win Check            │
│                             ▼                            │
│  ┌─ NIGHT PHASE ───────────────────────────────────┐    │
│  │  Mafia Chat → Night Actions → Resolution (0-6)  │    │
│  │  Night Echo Selection → Full Moon Balance Check  │    │
│  │  Win Check → Morning Report ↩                    │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## Step 1: Message Analysis

### Input

### Processing
 **Chat Semantic Analyzer** :

### Output → `chat_events.json`

```json
{
  "message_id": 42,
  "speaker": "player_1",
  "action": "accuse",
  "target": "player_3",
  "weight": 0.8,
  "day": 2,
  "raw_text": "I think Player B is suspicious...",
  "indirect_targets": [
    {
      "player": "player_7",
      "relation": "negative_reference",
      "weight": 0.3
    }
  ]
}
```

### Action Types

| Action     | Description                          | Default Weight |
| ---------- | ------------------------------------ | -------------- |
| `accuse`   | Mafia | 0.8 – 1.0      |
| `defend`   |  | 0.6 – 0.8      |
| `agree`    |  | 0.4 – 0.6      |
| `disagree` |  | 0.4 – 0.6      |
| `claim`    |  | 0.7 – 1.0      |
| `question` | / | 0.3 – 0.5      |
| `deflect`  | / | 0.2 – 0.4      |

---

## Step 2: Memory Update

### Direct vs Indirect Relationships

|  |  |
| ------------------------------------------- | -------------------------------------------------------------- |
| A B | A→B: **suspicion +0.8**                                |
| C A | C→A: **trust +0.6**, C→B: **suspicion +0.3** |
| D B | D→B: **trust +0.6**, D→A: **suspicion -0.3** |

### Weight Calculation Formula

```
new_weight = existing_weight + (event_weight × personality_modifier)
```

| Personality | `personality_modifier` | Effect                          |
| ----------- | ---------------------- | ------------------------------- |
| Aggressive  | 1.20                  |  |
| Cautious    | 0.70                  |  |
| Paranoid    | 1.50                  |  |
| Logical     | 1.00                  |  |
| Shy         | 0.80                  | , crowd |
| Charismatic | 1.10                  | social signals |

### Memory Update Example

```json
// memory.json — player_5 (after processing event #42)
{
  "relationships": {
    "player_1": {
      "trust": 0.0,
      "suspicion": 0.0,
      "notes": []
    },
    "player_3": {
      "trust": -0.3,
      "suspicion": 0.8,
      "notes": ["accused by player_1 on day 2"]
    }
  }
}
```

**Detailed:** [[Memory System]]

---

## Step 3: Human Window

### Implementation

```
humanWindowDelay:
  base: 2000ms
  variance: ±1000ms (random)
  
  if human_is_typing:
    extend_window(additional: 3000ms)
  
  if last_message_was_from_human:
```

---

## Step 4: Speak Probability Engine

**Detailed:** [[AI Decision Engine#Speak Probability]]

### Quick Summary

```
speak_chance(player) =
    personality_base
  × role_modifier
  × trigger_modifier
  × recent_activity_modifier
```

| Factor                  | Effect                                     |
| ----------------------- | ------------------------------------------ |
| `personality_base`      | Shy=0.1, Aggressive=0.8                    |
| `role_modifier`         | Mafia=0.7×              |
| `trigger: accused`      | → 0.95            |
| `trigger: has_evidence` | Sheriff + → +0.8 |
| `recent_activity`       | → 0.3× (cooldown) |

### Selection Process

```
   a. Directly accused (highest)
   b. Has evidence (high)
   c. Normal (medium)
   d. Random reaction (low)
5. Delay messages (simulate natural typing)
```

---

## Step 5: Message Generation & Loop Reset

### Input
1. **[[Data Architecture#role.json|role.json]]** → 
2. **[[Data Architecture#personality.json|personality.json]]** → 

### Output

### Loop Reset

---

## Phase Transition Logic

```
┌──────────────────────────────────────────────────────────────────┐
│                      PHASE CYCLE                                 │
│                                                                  │
│  ┌───────────┐    ┌─────────────┐    ┌──────────────────┐        │
│  │ MORNING   │───→│ DAY PHASE   │───→│ TRIAL & VOTE     │        │
│  │ REPORT    │    │ Discussion  │    │ Lynch Resolution │        │
│  └───────────┘    │ Mid-Day     │    └────────┬─────────┘        │
│       ↑           │ Events      │             │                  │
│       │           └─────────────┘    ┌────────▼─────────┐        │
│       │                              │ WIN CONDITION    │        │
│       │                              │ CHECK            │        │
│  ┌────┴──────────┐                   └────────┬─────────┘        │
│  │ NIGHT PHASE   │←───────────────────────────┘                  │
│  │ Resolution    │                                               │
│  │ Order (0-6)   │                                               │
│  └───────────────┘                                               │
└──────────────────────────────────────────────────────────────────┘
```

---

## Day Phase Flow

### Morning Report

```
Morning Report Sequence:
1. Death Announcements
2. Bodyguard Sacrifice
3. Lovers Death Link
4. Zombie Infection ("Player X looks different..." — NO role reveal)
5. Silenced Notification ("Player Y cannot speak today")
6. Full Moon Announcement
7. 🌅 Morning Night Echo Events (E01, E02, E06, E07, E08, E10, E13, E14)
```

### Discussion Phase

### 💬 Mid-Day Event Interrupts

```
Mid-Day Event Delivery:
  timing: "midday"
  delay: random(30s – 120s) after discussion starts
  events: E03, E04, E05, E09, E11, E12
  max_per_day: 1 mid-day event
  
  Delivery:
    → System message appears in chat
    → All AI process event (Step 2: Memory Update)
    → AI react based on personality × perception_depth
    → Discussion continues
```

### Trial & Vote

```
1. Accusation Phase → Players nominate suspects
2. Defense Phase → Accused player speaks
3. Vote Phase:
   - Mayor: vote weight = 2
   - AI vote logic → [[AI Decision Engine#Vote Decision Logic]]
4. Lynch Resolution:
   - Majority → Lynch (role NOT revealed)
   - Tie → No lynch
5. Win Condition Check → [[Win Conditions]]
```

---

## Night Phase Flow

### Mafia Private Chat

- Godfather decides final target (overrides)

### Night Resolution Order (7 Phases)

```
┌─────────────────────────────────────────────────────────────┐
│              NIGHT RESOLUTION ORDER                          │
├─────────┬───────────────────────────────────────────────────┤
│ Phase 0 │ PASSIVE VISITS                                   │
│         │  → Lovers: Visit partner (establishes link)      │
├─────────┼───────────────────────────────────────────────────┤
│ Phase 1 │ INFO ALTERATION                                  │
│         │  → Framer: Frame target (Sheriff sees "Mafia")   │
├─────────┼───────────────────────────────────────────────────┤
│ Phase 2 │ INVESTIGATION                                    │
│         │  → Consigliere: Learn exact role                 │
│         │  → Sheriff: Check alignment (affected by Framer) │
│         │  → Tracker: See who target visited               │
│         │  → Lookout: See who visited target               │
├─────────┼───────────────────────────────────────────────────┤
│ Phase 3 │ KILL & PROTECTION                                │
│         │  → Mafia Kill: Execute Godfather's target        │
│         │  → Doctor: Protect target (blocks kill)          │
│         │  → Bodyguard: Protect + die if target attacked   │
│         │  → Survivor: Vest (self-protection, 3 uses)      │
├─────────┼───────────────────────────────────────────────────┤
│ Phase 4 │ POST-KILL PROCESSING                             │
│         │  → Janitor: Clean body (blocks role discovery)   │
│         │  → Silencer: Silence target (muted Day N+1)     │
│         │  → Zombie: Infect killed player                  │
│         │  → Lovers Death Link: If 1 Lover dies → both die │
├─────────┼───────────────────────────────────────────────────┤
│ Phase 5 │ PASSIVE INFO                                     │
│         │  → Gossip: Receive hint about random player     │
├─────────┼───────────────────────────────────────────────────┤
│ Phase 6 │ CLEANUP & CHECKS                                 │
│         │  → Night Echo Event Selection (max 2/night)      │
│         │  → Full Moon Balance Check                       │
│         │  → Update all memory.json files                  │
│         │  → Win Condition Check                           │
└─────────┴───────────────────────────────────────────────────┘
```

**Detailed roles:** [[Night Phase#Resolution Order]]

### Full Moon Balance Check (Phase 6)

```
balance_score = (town_alive / total_alive) - expected_town_ratio

Stage Determination:
  |balance_score| < 0.05  → Stage 0 (Balanced — no Full Moon)
  |balance_score| ≥ 0.05  → Stage 1 (Light boost — info roles buffed)
  |balance_score| ≥ 0.15  → Stage 2 (Full boost — all roles + Zombie cure)

Full Moon Activation:
  - probability: 0.15 per night (when stage > 0)
  - max_per_game: 3
  - Announced in Morning Report
```

**Detailed:** [[Full Moon]]

### Night Echo Event Selection (Phase 6)

```
Event Selection Engine:
1. Pool: E01–E14 (filtered by alive roles)
2. max_per_night: 2
3. Selection: Weighted random (events tied to alive roles preferred)
4. Timing assignment: Morning 🌅 or Mid-Day 💬
5. Store in game_state.json → pending_events[]
6. Deliver during appropriate Day phase moment
```

**Detailed:** [[Dynamic Events#Selection Engine]]

---

## Win Condition Checks

| Condition                                      | Winner          |
| ---------------------------------------------- | --------------- |
| Mafia | 🏘 Town          |
| Mafia ≥ Town                        | 🔪 Mafia         |
| Jester Lynch | 🃏 Jester        |
| Executioner lynch target | ⚖ Executioner   |
| Survivor | 🛡 Survivor (co-win) |
| Zombie: zombie_victims ≥ 50% alive players | 🧟 Zombie        |

**Detailed:** [[Win Conditions]]

---

## Related Links

- [[AI Decision Engine]] (speak probability, vote logic, event reactions)
- [[Memory System]] (weight system, perception depth, time decay)
- [[Data Architecture]] (JSON schemas — role, personality, memory, game_state)
- [[Day Phase]] (rules, timer, voting)
- [[Night Phase]] (resolution order, role actions)
- [[Dynamic Events]] (Night Echo Events E01–E14, selection engine)
- [[Full Moon]] (balance mechanic, stage system)
- [[Win Conditions]] (victory checks)
