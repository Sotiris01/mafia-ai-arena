---
tags:
  - personality
  - perception/smart
  - game_design
---

# Cautious

| Property        | Value                                 |
| --------------- | ------------------------------------- |
| **Type**        | Cautious                              |
| **Archetype**   |  |
| **Frequency**   | ~18% AI players |
| **Best Roles**  | Doctor, Survivor, Mafia Goon          |
| **Worst Roles** | Jester, Godfather                     |
| **Tone**        | Evidence-based, careful, reserved     |

---

## Overview

---

## Core Stats

| Stat                        | Value  | Range     | Description                                           |
| --------------------------- | ------ | --------- | ----------------------------------------------------- |
| `speak_probability_base`    | 0.30   | 0.0 – 1.0 |  |
| `perception_depth`          | 2      | 1 – 3     | Smart|
| `aggression`                | 0.15   | 0.0 – 1.0 |  |
| `team_logic`                | 0.65   | 0.0 – 1.0 |  |
| `trust_base`                | 0.40   | 0.0 – 1.0 |  |
| `suspicion_sensitivity`     | 0.50   | 0.0 – 1.0 |  |
| `emotional_reactivity`      | 0.60   | 0.5 – 2.0 |  |
| `persuasion_power`          | 0.55   | 0.0 – 1.0 |  |
| `persuasion_resistance`     | 0.80   | 0.0 – 1.0 |  |
| `leadership`                | 0.25   | 0.0 – 1.0 |  |
| `consistency`               | 0.90   | 0.0 – 1.0 |  |
| `deception_skill`           | 0.60   | 0.0 – 1.0 |  |
| `bandwagon_tendency`        | 0.35   | 0.0 – 1.0 |  |
| `memory_weight_modifier`    | 0.70   | 0.5 – 2.0 | event weight 30% |

### Voting Config

| Parameter       | Value  | Description                                    |
| --------------- | ------ | ---------------------------------------------- |
| `voting_style`  | late   |  |
| `vote_threshold`| 0.70   | threshold |

---

## Discussion Behavior

| Trigger                    | Response Probability | Behavior                                   |
| -------------------------- | -------------------- | ------------------------------------------ |
|  | 30%                  |  |
|  | 85%                  |  |
| Town member | 45%                  |  |
|  | 60%                  |  |
| evidence | 85%                  |  |

```
tone: "measured"
vocabulary_examples:
```

---

## Voting Behavior

| Phase            |  |
| ---------------- | -------------------------------------------------------- |
| Pre-discussion   |  |
| Voting opens     |  |
| Mid-voting       |  |
| Late voting      | evidence + observed votes |

### Vote Decision

```
if has_strong_evidence(target):  // weight > 0.70
    vote(target)
elif observed_votes_converge(player):
    if own_suspicion(player) > 0.40:
    else:
        abstain_or_delay()
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
|  |  |
| Cross-references                  | + + events |
|  | sustained deception |
|  |  |

### Weight Calculation Impact

```
new_weight = existing_weight + (event_weight × 0.70)

```

---

## Role Synergy

| Role Combo                  |  |  |
| --------------------------- | ------------------ | ------------------------------------------------- |
| Cautious + [[Doctor]]       | ⭐⭐⭐⭐⭐            | profile = kill target |
| Cautious + [[Survivor]]     | ⭐⭐⭐⭐⭐            |  |
| Cautious + [[Mafia Goon]]   | ⭐⭐⭐⭐              | alignment |
| Cautious + [[Jester]]       | ⭐                  |  |
| Cautious + [[Sheriff]]      | ⭐⭐⭐⭐              | evidence |

---

## Calculation Examples

### Speak Probability

```

speak_chance = personality_base × role_modifier × trigger_modifier × cooldown_modifier
speak_chance = 0.30 × 1.0 × 1.40 × 1.0
speak_chance = 0.42 (42%)

```

### Suspicion Build-up

```

event_weight = -0.8 (accusation)
memory_weight_modifier = 0.70
new_weight = 0 + (-0.8 × 0.70) = -0.56

  suspicion_sensitivity: 0.50 → moderate concern
  emotional_reactivity: 0.60 → calm response
```

### Trust Building

```

event_weight = +0.6 (defense)
memory_weight_modifier = 0.70
new_weight = 0 + (0.6 × 0.70) = +0.42

```

---

## personality.json

```json
{
  "type": "Cautious",
  "speak_probability_base": 0.30,
  "perception_depth": 2,
  "aggression": 0.15,
  "team_logic": 0.65,
  "trust_base": 0.40,
  "suspicion_sensitivity": 0.50,
  "emotional_reactivity": 0.60,
  "persuasion_power": 0.55,
  "persuasion_resistance": 0.80,
  "leadership": 0.25,
  "consistency": 0.90,
  "deception_skill": 0.60,
  "bandwagon_tendency": 0.35,
  "memory_weight_modifier": 0.70,
  "voting_style": "late",
  "vote_threshold": 0.70,
  "traits": ["evidence-based", "careful", "reserved"]
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
