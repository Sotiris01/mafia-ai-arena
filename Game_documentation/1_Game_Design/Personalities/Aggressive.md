---
tags:
  - personality
  - perception/superficial
  - game_design
---

# Aggressive

| Property        | Value                                 |
| --------------- | ------------------------------------- |
| **Type**        | Aggressive                            |
| **Archetype**   |  |
| **Frequency**   | ~15% AI players |
| **Best Roles**  | Godfather, Jester                     |
| **Worst Roles** | Survivor, Doctor                      |
| **Tone**        | Confrontational, loud, impulsive      |

---

## Overview

---

## Core Stats

| Stat                        | Value  | Range     | Description                                           |
| --------------------------- | ------ | --------- | ----------------------------------------------------- |
| `speak_probability_base`    | 0.80   | 0.0 – 1.0 |  |
| `perception_depth`          | 1      | 1 – 3     | Superficial|
| `aggression`                | 0.90   | 0.0 – 1.0 |  |
| `team_logic`                | 0.30   | 0.0 – 1.0 |  |
| `trust_base`                | 0.25   | 0.0 – 1.0 |  |
| `suspicion_sensitivity`     | 0.70   | 0.0 – 1.0 |  |
| `emotional_reactivity`      | 1.40   | 0.5 – 2.0 | events |
| `persuasion_power`          | 0.50   | 0.0 – 1.0 |  |
| `persuasion_resistance`     | 0.40   | 0.0 – 1.0 |  |
| `leadership`                | 0.70   | 0.0 – 1.0 |  |
| `consistency`               | 0.40   | 0.0 – 1.0 |  |
| `deception_skill`           | 0.30   | 0.0 – 1.0 |  |
| `bandwagon_tendency`        | 0.20   | 0.0 – 1.0 |  |
| `memory_weight_modifier`    | 1.20   | 0.5 – 2.0 | event weight 20% |

### Voting Config

| Parameter       | Value  | Description                                    |
| --------------- | ------ | ---------------------------------------------- |
| `voting_style`  | early  |  |
| `vote_threshold`| 0.40   | threshold |

---

## Discussion Behavior

| Trigger                    | Response Probability | Behavior                                   |
| -------------------------- | -------------------- | ------------------------------------------ |
|  | 80%                  |  |
|  | 95%                  |  |
| Town member | 85%                  |  |
|  | 90%                  |  |
|  | 70%                  |  |

```
tone: "confrontational"
vocabulary_examples:
```

---

## Voting Behavior

| Phase            |  |
| ---------------- | -------------------------------------------------------- |
| Pre-discussion   |  |
| Voting opens     |  |
| Mid-voting       |  |
| Close votes      |  |

### Vote Decision

```
if has_suspicion_target():
elif was_accused_by(someone):
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
|  |  |

### Weight Calculation Impact

```
new_weight = existing_weight + (event_weight × 1.20)

 Player A Aggressive → event_weight: -0.8
 Aggressive : 0 + (-0.8 × 1.20) = -0.96
```

---

## Role Synergy

| Role Combo                  |  |  |
| --------------------------- | ------------------ | ------------------------------------------------- |
| Aggressive + [[Godfather]]  | ⭐⭐⭐⭐⭐            |  |
| Aggressive + [[Jester]]     | ⭐⭐⭐⭐⭐            | = win condition |
| Aggressive + [[Sheriff]]    | ⭐⭐⭐               | evidence |
| Aggressive + [[Survivor]]   | ⭐                  |  |
| Aggressive + [[Doctor]]     | ⭐⭐                 |  |

---

## Calculation Examples

### Speak Probability

```

speak_chance = personality_base × role_modifier × trigger_modifier × cooldown_modifier
speak_chance = 0.80 × 0.70 × 1.0 × 1.0
speak_chance = 0.56 (56%)

```

### Suspicion Build-up

```

event_weight = -0.8 (accusation)
memory_weight_modifier = 1.20
new_weight = 0 + (-0.8 × 1.20) = -0.96

  suspicion_sensitivity: 0.70 → triggered (> -0.96)
  emotional_reactivity: 1.40 → strong reaction
```

### Trust Building

```

event_weight = +0.6 (defense)
memory_weight_modifier = 1.20
new_weight = 0 + (0.6 × 1.20) = +0.72

```

---

## personality.json

```json
{
  "type": "Aggressive",
  "speak_probability_base": 0.80,
  "perception_depth": 1,
  "aggression": 0.90,
  "team_logic": 0.30,
  "trust_base": 0.25,
  "suspicion_sensitivity": 0.70,
  "emotional_reactivity": 1.40,
  "persuasion_power": 0.50,
  "persuasion_resistance": 0.40,
  "leadership": 0.70,
  "consistency": 0.40,
  "deception_skill": 0.30,
  "bandwagon_tendency": 0.20,
  "memory_weight_modifier": 1.20,
  "voting_style": "early",
  "vote_threshold": 0.40,
  "traits": ["confrontational", "loud", "impulsive"]
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
