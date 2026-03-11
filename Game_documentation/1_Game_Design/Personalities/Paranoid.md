---
tags:
  - personality
  - perception/deep
  - game_design
---

# Paranoid

| Property        | Value                                 |
| --------------- | ------------------------------------- |
| **Type**        | Paranoid                              |
| **Archetype**   |  |
| **Frequency**   | ~12% AI players |
| **Best Roles**  | Sheriff, Lookout, Tracker             |
| **Worst Roles** | Mafia Goon, Survivor                  |
| **Tone**        | Suspicious, reactive, unpredictable   |

---

## Overview
##### 

---

## Core Stats

| Stat                        | Value  | Range     | Description                                           |
| --------------------------- | ------ | --------- | ----------------------------------------------------- |
| `speak_probability_base`    | 0.60   | 0.0 – 1.0 |  |
| `perception_depth`          | 3      | 1 – 3     | Deep|
| `aggression`                | 0.55   | 0.0 – 1.0 | - |
| `team_logic`                | 0.20   | 0.0 – 1.0 |  |
| `trust_base`                | 0.10   | 0.0 – 1.0 |  |
| `suspicion_sensitivity`     | 0.95   | 0.0 – 1.0 |  |
| `emotional_reactivity`      | 1.60   | 0.5 – 2.0 |  |
| `persuasion_power`          | 0.40   | 0.0 – 1.0 |  |
| `persuasion_resistance`     | 0.60   | 0.0 – 1.0 |  |
| `leadership`                | 0.35   | 0.0 – 1.0 | - |
| `consistency`               | 0.30   | 0.0 – 1.0 |  |
| `deception_skill`           | 0.35   | 0.0 – 1.0 |  |
| `bandwagon_tendency`        | 0.25   | 0.0 – 1.0 |  |
| `memory_weight_modifier`    | 1.50   | 0.5 – 2.0 | events 50% |

### Voting Config

| Parameter       | Value  | Description                                    |
| --------------- | ------ | ---------------------------------------------- |
| `voting_style`  | mid    |  |
| `vote_threshold`| 0.35   |  |

---

## Discussion Behavior

| Trigger                    | Response Probability | Behavior                                   |
| -------------------------- | -------------------- | ------------------------------------------ |
|  | 60%                  |  |
|  | 95%                  |  |
| Town member | 80%                  | " !" |
|  | 70%                  | " ; ;" |
|  | 75%                  | " — Mafia alliance!" |

```
tone: "anxious"
vocabulary_examples:
```

---

## Voting Behavior

| Phase            |  |
| ---------------- | -------------------------------------------------------- |
| Pre-discussion   | 2-3 |
| Voting opens     |  |
| Mid-voting       |  |
| Close votes      | Random element|

### Vote Decision

```
 target = random_weighted(suspicion_list) // element
elif was_silent(player):
elif two_players_agree(a, b):
 vote(random(a, b)) // "! Mafia!"
else:
    vote(highest_suspicion_target)

// 15% chance: override with random alive player
if random() < 0.15:
    vote(random_alive_player)  // Paranoid wildcard
```

---

## Memory & Perception

### Perception Depth: Deep (Level 3)

```
Filter: weight > 0.2 OR weight < -0.2
Data scope: ALL days (with time decay)
Extra: Cross-references indirect relationships
```

|  |  |
| --------------------------------- | -------------------------------------------- |
|  | weak signals |
| Cross-references | vote patterns + defenses + events |
| hidden alliances | "A B 3 = " |
| Over-analysis                     | patterns |

### Weight Calculation Impact

```
new_weight = existing_weight + (event_weight × 1.50)

  Negative events: × 1.50 (full modifier)
  Positive events: × 0.90

```

---

## Role Synergy

| Role Combo                  |  |  |
| --------------------------- | ------------------ | ------------------------------------------------- |
| Paranoid + [[Sheriff]]      | ⭐⭐⭐⭐⭐            | Deep analysis + investigation = Mafia |
| Paranoid + [[Lookout]]      | ⭐⭐⭐⭐              | visits + cross-references = clues |
| Paranoid + [[Tracker]]      | ⭐⭐⭐⭐              | Tracking data + deep analysis = patterns           |
| Paranoid + [[Mafia Goon]]   | ⭐⭐                 |  |
| Paranoid + [[Survivor]]     | ⭐                  |  |

---

## Calculation Examples

### Speak Probability

```

speak_chance = personality_base × role_modifier × trigger_modifier × cooldown_modifier
speak_chance = 0.60 × 1.0 × 1.30 × 1.0
speak_chance = 0.78 (78%)

```

### Suspicion Build-up

```

event_weight = -0.5 (indirect suspicion)
memory_weight_modifier = 1.50
new_weight(X→Y) = 0 + (-0.5 × 1.50) = -0.75

suspicion_sensitivity: 0.95 → triggered!
```

### Trust Building

```

event_weight = +0.6 (defense)
memory_weight_modifier = 1.50
new_weight = 0 + (0.6 × 0.90) = +0.54

```

---

## personality.json

```json
{
  "type": "Paranoid",
  "speak_probability_base": 0.60,
  "perception_depth": 3,
  "aggression": 0.55,
  "team_logic": 0.20,
  "trust_base": 0.10,
  "suspicion_sensitivity": 0.95,
  "emotional_reactivity": 1.60,
  "persuasion_power": 0.40,
  "persuasion_resistance": 0.60,
  "leadership": 0.35,
  "consistency": 0.30,
  "deception_skill": 0.35,
  "bandwagon_tendency": 0.25,
  "memory_weight_modifier": 1.50,
  "voting_style": "mid",
  "vote_threshold": 0.35,
  "traits": ["suspicious", "reactive", "unpredictable"]
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
