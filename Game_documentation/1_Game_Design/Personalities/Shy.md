---
tags:
  - personality
  - perception/superficial
  - game_design
---

# Shy

| Property        | Value                                 |
| --------------- | ------------------------------------- |
| **Type**        | Shy                                   |
| **Archetype**   |  |
| **Frequency**   | ~15% AI players |
| **Best Roles**  | Survivor, Citizen, Mafia Goon         |
| **Worst Roles** | Jester, Godfather, Mayor              |
| **Tone**        | Reserved, follower, quiet             |

---

## Overview

---

## Core Stats

| Stat                        | Value  | Range     | Description                                           |
| --------------------------- | ------ | --------- | ----------------------------------------------------- |
| `speak_probability_base`    | 0.10   | 0.0 – 1.0 |  |
| `perception_depth`          | 1      | 1 – 3     | Superficial|
| `aggression`                | 0.05   | 0.0 – 1.0 |  |
| `team_logic`                | 0.50   | 0.0 – 1.0 |  |
| `trust_base`                | 0.60   | 0.0 – 1.0 |  |
| `suspicion_sensitivity`     | 0.30   | 0.0 – 1.0 |  |
| `emotional_reactivity`      | 0.80   | 0.5 – 2.0 | - |
| `persuasion_power`          | 0.10   | 0.0 – 1.0 |  |
| `persuasion_resistance`     | 0.20   | 0.0 – 1.0 |  |
| `leadership`                | 0.05   | 0.0 – 1.0 |  |
| `consistency`               | 0.70   | 0.0 – 1.0 | - |
| `deception_skill`           | 0.25   | 0.0 – 1.0 |  |
| `bandwagon_tendency`        | 0.90   | 0.0 – 1.0 |  |
| `memory_weight_modifier`    | 0.80   | 0.5 – 2.0 |  |

### Voting Config

| Parameter       | Value     | Description                                    |
| --------------- | --------- | ---------------------------------------------- |
| `voting_style`  | bandwagon |  |
| `vote_threshold`| 0.20      |  |

---

## Discussion Behavior

| Trigger                    | Response Probability | Behavior                                   |
| -------------------------- | -------------------- | ------------------------------------------ |
|  | 10%                  |  |
|  | 70%                  |  |
| Town member | 20%                  | "..." |
|  | 25%                  |  |
| Majority | 35%                  | " ..." |

```
tone: "hesitant"
vocabulary_examples:
```

---

## Voting Behavior

| Phase            |  |
| ---------------- | -------------------------------------------------------- |
| Pre-discussion   |  |
| Voting opens     |  |
| Mid-voting       |  |
| Late voting      | , (bandwagon) |

### Vote Decision

```
majority_target = get_current_vote_leader()

if majority_target exists AND votes > 2:
    vote(majority_target)  // Bandwagon
elif was_accused(self):
else:

```

---

## Memory & Perception

### Perception Depth: Superficial (Level 1)

```
Filter: weight > 0.7 OR weight < -0.7
Data scope: Current day ONLY
```

|  |  |
| --------------------------- | --------------------------------------------- |
|  | subtle evidence |
|  |  |
|  |  |
|  | patterns |

### Weight Calculation Impact

```
new_weight = existing_weight + (event_weight × 0.80)

Majority effect:
```

---

## Role Synergy

| Role Combo                  |  |  |
| --------------------------- | ------------------ | ------------------------------------------------- |
| Shy + [[Survivor]]          | ⭐⭐⭐⭐⭐            | Low-profile = = |
| Shy + [[Citizen]]           | ⭐⭐⭐               |  |
| Shy + [[Mafia Goon]]        | ⭐⭐⭐⭐              | alignment — safe Mafia |
| Shy + [[Jester]]            | ⭐                  |  |
| Shy + [[Godfather]]         | ⭐                  | leader = , |
| Shy + [[Mayor]]             | ⭐⭐                 | Reveal = forced attention, personality |

---

## Special Interactions

### Silencer Impact

```

```

### Crowd Influence

```
  Shy bandwagon_tendency: 0.90
  persuasion_resistance: 0.20
  
```

---

## Calculation Examples

### Speak Probability

```

speak_chance = personality_base × role_modifier × trigger_modifier × cooldown_modifier
speak_chance = 0.10 × 1.0 × 1.0 × 1.0
speak_chance = 0.10 (10%)

```

### Accused Response

```

speak_chance = 0.10 × 1.0 × 0.95 × 1.0
speak_chance = 0.095 → BUT trigger override: accused = 0.70

```

### Trust Building

```

event_weight = +0.6 (defense)
memory_weight_modifier = 0.80
new_weight = 0 + (0.6 × 0.80) = +0.48

```

---

## personality.json

```json
{
  "type": "Shy",
  "speak_probability_base": 0.10,
  "perception_depth": 1,
  "aggression": 0.05,
  "team_logic": 0.50,
  "trust_base": 0.60,
  "suspicion_sensitivity": 0.30,
  "emotional_reactivity": 0.80,
  "persuasion_power": 0.10,
  "persuasion_resistance": 0.20,
  "leadership": 0.05,
  "consistency": 0.70,
  "deception_skill": 0.25,
  "bandwagon_tendency": 0.90,
  "memory_weight_modifier": 0.80,
  "voting_style": "bandwagon",
  "vote_threshold": 0.20,
  "traits": ["reserved", "follower", "quiet"]
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
- [[Silencer]]
