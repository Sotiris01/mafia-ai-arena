---
tags:
  - personality
  - perception/smart
  - game_design
---

# Charismatic

| Property        | Value                                 |
| --------------- | ------------------------------------- |
| **Type**        | Charismatic                           |
| **Archetype**   |  |
| **Frequency**   | ~22% AI players |
| **Best Roles**  | Godfather, Mayor, Executioner         |
| **Worst Roles** | Survivor, Citizen                     |
| **Tone**        | Persuasive, alliance-builder, warm    |

---

## Overview

---

## Core Stats

| Stat                        | Value  | Range     | Description                                           |
| --------------------------- | ------ | --------- | ----------------------------------------------------- |
| `speak_probability_base`    | 0.70   | 0.0 – 1.0 |  |
| `perception_depth`          | 2      | 1 – 3     | Smart|
| `aggression`                | 0.30   | 0.0 – 1.0 |  |
| `team_logic`                | 0.85   | 0.0 – 1.0 |  |
| `trust_base`                | 0.55   | 0.0 – 1.0 | - |
| `suspicion_sensitivity`     | 0.40   | 0.0 – 1.0 | - |
| `emotional_reactivity`      | 1.00   | 0.5 – 2.0 |  |
| `persuasion_power`          | 0.90   | 0.0 – 1.0 |  |
| `persuasion_resistance`     | 0.70   | 0.0 – 1.0 |  |
| `leadership`                | 0.85   | 0.0 – 1.0 |  |
| `consistency`               | 0.75   | 0.0 – 1.0 |  |
| `deception_skill`           | 0.80   | 0.0 – 1.0 |  |
| `bandwagon_tendency`        | 0.15   | 0.0 – 1.0 |  |
| `memory_weight_modifier`    | 0.90   | 0.5 – 2.0 |  |

### Voting Config

| Parameter       | Value  | Description                                    |
| --------------- | ------ | ---------------------------------------------- |
| `voting_style`  | early  |  |
| `vote_threshold`| 0.50   |  |

---

## Discussion Behavior

| Trigger                    | Response Probability | Behavior                                   |
| -------------------------- | -------------------- | ------------------------------------------ |
|  | 70%                  |  |
|  | 90%                  |  |
| Town member | 75%                  |  |
|  | 65%                  |  |
|  | 80%                  |  |

```
tone: "warm_persuasive"
vocabulary_examples:
```

---

## Voting Behavior

| Phase            |  |
| ---------------- | -------------------------------------------------------- |
| Pre-discussion   | strategy |
| Voting opens     |  |
| Mid-voting       | — diplomacy |
| Close votes      | , |

### Vote Decision

```
if has_alliance(target):
    vote(highest_suspicion_non_ally)
elif can_persuade_majority(target):
    vote(target)
elif has_evidence(target):
    vote(target)
else:
    vote(most_suspicious)
```

---

## Memory & Perception

### Perception Depth: Smart (Level 2)

```
Filter: weight > 0.2 OR weight < -0.2
Data scope: ALL days (with time decay)
```

|  |  |
| --------------------------------- | -------------------------------------------- |
|  |  |
|  | alliances + rivalries |
| Strategic memory                  | "" |
| Alliance tracking                 |  |

### Weight Calculation Impact

```
new_weight = existing_weight + (event_weight × 0.90)

 Player A Charismatic → event_weight: -0.8
 Charismatic : 0 + (-0.8 × 0.90) = -0.72

Alliance building:
  Accumulated weight: +0.54 → +1.02 → +1.45
  team_logic: 0.85 → Player B = trusted ally
```

---

## Persuasion Mechanics

```
persuasion_chance(target) = 
    charismatic.persuasion_power × (1 - target.persuasion_resistance)

  Charismatic → Shy:    0.90 × (1 - 0.20) = 0.72 (72%)
  Charismatic → Cautious: 0.90 × (1 - 0.80) = 0.18 (18%)
  Charismatic → Logical: 0.90 × (1 - 0.85) = 0.135 (13.5%)
  Charismatic → Paranoid: 0.90 × (1 - 0.60) = 0.36 (36%)
  Charismatic → Aggressive: 0.90 × (1 - 0.40) = 0.54 (54%)
```

### Alliance Formation

```
alliance_probability(target) =
    charismatic.team_logic × target.team_logic × trust_weight

 trust_weight > 0.50:

Alliance effects:
  - Information sharing
```

---

## Role Synergy

| Role Combo                      |  |  |
| ------------------------------- | ------------------ | ------------------------------------------------- |
| Charismatic + [[Godfather]]     | ⭐⭐⭐⭐⭐            | combo |
| Charismatic + [[Mayor]]         | ⭐⭐⭐⭐⭐            | Leader vote + ×2 = |
| Charismatic + [[Executioner]]   | ⭐⭐⭐⭐⭐            | Town |
| Charismatic + [[Sheriff]]       | ⭐⭐⭐⭐              | evidence |
| Charismatic + [[Survivor]]      | ⭐⭐                 |  |
| Charismatic + [[Citizen]]       | ⭐⭐⭐               | Citizen influence |

---

## Calculation Examples

### Speak Probability

```
Scenario: Charismatic Godfather Town member

speak_chance = personality_base × role_modifier × trigger_modifier × cooldown_modifier
speak_chance = 0.70 × 1.1 × 1.30 × 1.0
speak_chance = 1.001 → capped at 0.95

```

### Suspicion Build-up

```

observation: "Player X spoke 0 times in 5 rounds"
suspicion_sensitivity: 0.40
emotional_reactivity: 1.00

```

### Persuasion in Action

```

Step 2: Persuasion attempt AI:
 - Shy AI (0.72 success rate) → 72% 

```

---

## personality.json

```json
{
  "type": "Charismatic",
  "speak_probability_base": 0.70,
  "perception_depth": 2,
  "aggression": 0.30,
  "team_logic": 0.85,
  "trust_base": 0.55,
  "suspicion_sensitivity": 0.40,
  "emotional_reactivity": 1.00,
  "persuasion_power": 0.90,
  "persuasion_resistance": 0.70,
  "leadership": 0.85,
  "consistency": 0.75,
  "deception_skill": 0.80,
  "bandwagon_tendency": 0.15,
  "memory_weight_modifier": 0.90,
  "voting_style": "early",
  "vote_threshold": 0.50,
  "traits": ["persuasive", "alliance-builder", "warm"]
}
```

---

## Related Links

- [[AI Decision Engine#Speak Probability Engine]]
- [[AI Decision Engine#Perception Depth]]
- [[AI Decision Engine#Vote Decision Logic]]
- [[Memory System#Perception Depth]]
- [[Data Architecture#personality.json]]
- [[Game Setup#AI Personality Assignment]]
- [[Gameplay Loop#Weight Calculation Formula]]
