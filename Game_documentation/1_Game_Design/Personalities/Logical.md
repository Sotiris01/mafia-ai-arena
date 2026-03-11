---
tags:
  - personality
  - perception/smart
  - game_design
---

# Logical

| Property        | Value                                 |
| --------------- | ------------------------------------- |
| **Type**        | Logical                               |
| **Archetype**   |  |
| **Frequency**   | ~18% AI players |
| **Best Roles**  | Sheriff, Consigliere, Lookout         |
| **Worst Roles** | Jester, Zombie                        |
| **Tone**        | Methodical, evidence-based, calm      |

---

## Overview

---

## Core Stats

| Stat                        | Value  | Range     | Description                                           |
| --------------------------- | ------ | --------- | ----------------------------------------------------- |
| `speak_probability_base`    | 0.50   | 0.0 – 1.0 |  |
| `perception_depth`          | 2      | 1 – 3     | Smart|
| `aggression`                | 0.20   | 0.0 – 1.0 |  |
| `team_logic`                | 0.70   | 0.0 – 1.0 |  |
| `trust_base`                | 0.50   | 0.0 – 1.0 |  |
| `suspicion_sensitivity`     | 0.50   | 0.0 – 1.0 |  |
| `emotional_reactivity`      | 0.50   | 0.5 – 2.0 |  |
| `persuasion_power`          | 0.65   | 0.0 – 1.0 | - |
| `persuasion_resistance`     | 0.85   | 0.0 – 1.0 |  |
| `leadership`                | 0.45   | 0.0 – 1.0 |  |
| `consistency`               | 0.95   | 0.0 – 1.0 |  |
| `deception_skill`           | 0.55   | 0.0 – 1.0 |  |
| `bandwagon_tendency`        | 0.10   | 0.0 – 1.0 |  |
| `memory_weight_modifier`    | 1.00   | 0.5 – 2.0 |  |

### Voting Config

| Parameter       | Value  | Description                                    |
| --------------- | ------ | ---------------------------------------------- |
| `voting_style`  | mid    |  |
| `vote_threshold`| 0.65   |  |

---

## Discussion Behavior

| Trigger                    | Response Probability | Behavior                                   |
| -------------------------- | -------------------- | ------------------------------------------ |
|  | 50%                  |  |
|  | 80%                  |  |
| Town member | 65%                  |  |
| claim | 70%                  |  |
|  | 45%                  | " |

```
tone: "analytical"
vocabulary_examples:
```

---

## Voting Behavior

| Phase            |  |
| ---------------- | -------------------------------------------------------- |
| Pre-discussion   | memory data |
| Voting opens     |  |
| Mid-voting       |  |
| Close votes      | — consistency |

### Vote Decision

```
suspicions = analyze_memory(perception_depth=2)
top_suspect = max(suspicions, key=lambda x: x.weight)

if top_suspect.weight > vote_threshold:  // > 0.65
    vote(top_suspect)
elif evidence_from_investigation:  // Sheriff/Lookout data
    vote(evidence_target)
else:
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
|  | data |
| Pattern recognition               | voting inconsistencies |
| Time-weighted analysis            | events |
| emotional manipulation | "" bluffing acting |

### Weight Calculation Impact

```
new_weight = existing_weight + (event_weight × 1.00)

```

---

## Role Synergy

| Role Combo                  |  |  |
| --------------------------- | ------------------ | ------------------------------------------------- |
| Logical + [[Sheriff]]       | ⭐⭐⭐⭐⭐            | Evidence-based + investigation = combo |
| Logical + [[Consigliere]]   | ⭐⭐⭐⭐⭐            | role info + = Mafia weapon |
| Logical + [[Lookout]]       | ⭐⭐⭐⭐              | visits vote patterns |
| Logical + [[Jester]]        | ⭐                  |  |
| Logical + [[Godfather]]     | ⭐⭐⭐⭐              | + immunity = cover |

---

## Calculation Examples

### Speak Probability

```
Scenario: Logical Sheriff investigation

speak_chance = personality_base × role_modifier × trigger_modifier × cooldown_modifier
speak_chance = 0.50 × 1.0 × 1.85 × 1.0
speak_chance = 0.925 (92.5%)

```

### Suspicion Build-up

```

event_weight = -0.5 (voted against Town)
memory_weight_modifier = 1.00
new_weight = 0 + (-0.5 × 1.00) = -0.50

new_weight = -0.50 + (-0.5 × 1.00) = -1.00

```

### Trust Building

```

event_weight = +0.6 (defense)
memory_weight_modifier = 1.00
new_weight = 0 + (0.6 × 1.00) = +0.60

```

---

## personality.json

```json
{
  "type": "Logical",
  "speak_probability_base": 0.50,
  "perception_depth": 2,
  "aggression": 0.20,
  "team_logic": 0.70,
  "trust_base": 0.50,
  "suspicion_sensitivity": 0.50,
  "emotional_reactivity": 0.50,
  "persuasion_power": 0.65,
  "persuasion_resistance": 0.85,
  "leadership": 0.45,
  "consistency": 0.95,
  "deception_skill": 0.55,
  "bandwagon_tendency": 0.10,
  "memory_weight_modifier": 1.00,
  "voting_style": "mid",
  "vote_threshold": 0.65,
  "traits": ["methodical", "evidence-based", "calm"]
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
