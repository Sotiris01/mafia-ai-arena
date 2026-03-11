---
tags:
  - technical
  - technical/memory
  - workflow
---

# Memory System
---

## Memory JSON Schema

```json
{
  "player_id": "player_3",
  "current_day": 3,
  "relationships": {
    "player_1": {
      "trust": 0.6,
      "suspicion": -0.2,
      "interaction_count": 5,
      "last_interaction_day": 3,
      "history": [
        {"day": 1, "action": "defended_me", "weight": 0.5},
        {"day": 2, "action": "agreed_with_me", "weight": 0.3},
        {"day": 3, "action": "accused_target", "weight": -0.2}
      ]
    },
    "player_5": {
      "trust": -0.4,
      "suspicion": 0.9,
      "interaction_count": 3,
      "last_interaction_day": 3,
      "history": [
        {"day": 2, "action": "accused_me", "weight": 0.8},
        {"day": 3, "action": "defended_suspect", "weight": 0.4}
      ]
    }
  },
  "known_roles": {
    "player_7": {"role": "Mafia", "source": "investigation", "day_discovered": 2, "confidence": 1.0},
    "player_2": {"role": "Town", "source": "claim", "day_discovered": 1, "confidence": 0.4}
  },
  "night_results": [
    {"night": 1, "action": "investigate", "target": "player_4", "result": "Town"},
    {"night": 2, "action": "investigate", "target": "player_7", "result": "Mafia"}
  ],
  "gossip_hints": [
    {"night": 1, "hint": "Someone was curious about Player C", "interpretation": null}
  ],
  "events_witnessed": [
    {"day": 1, "type": "E06_COMMOTION", "target": "player_6", "timing": "morning", "suspicion_weight": 0.25},
    {"day": 2, "type": "E07_GUN_LICENSE", "target": "player_2", "timing": "midday", "suspicion_weight": 0.35},
    {"day": 2, "type": "last_wish", "details": "player_9 revealed player_2 visited them"}
  ],
  "voting_history": [
    {"day": 1, "voted_for": "player_5", "result": "player_5 lynched"},
    {"day": 2, "voted_for": "player_7", "result": "player_2 lynched"}
  ]
}
```

---

## Weight System

| Weight Range   | Meaning                               |
| -------------- | ------------------------------------- |
| **+0.7 ~ +1.0** | / |
| **+0.3 ~ +0.6** |  |
| **0.0 ~ +0.2**  | / |
| **-0.1 ~ -0.4** |  |
| **-0.5 ~ -0.7** |  |
| **-0.8 ~ -1.0** | Mafia / |

### Direct vs Indirect Weights

| Relationship Type      | Weight Multiplier     | Example                                   |
| ---------------------- | --------------------- | ----------------------------------------- |
| ** ** | ×1.0 (full weight)    | "Player A is Mafia" → A gets -0.8         |
| ** ** | ×1.0 (full weight)    | "I agree with Player B" → B gets +0.6     |
| ** ** | ×0.4 (reduced)        | A supports B who accused C → C gets -0.3  |
| ** ** | ×0.3 (reduced)        | A defends B → B's allies get small +       |

---

## Time Decay

```
weight = weight × DECAY_FACTOR

DECAY_FACTOR = 0.7  (default)
```

### Decay Example

| Day | Event                  | Weight (at time) | Weight (Day 4) |
| --- | ---------------------- | ----------------- | --------------- |
| 1   | A B | -0.8              | -0.274          |
| 2   | C A | +0.6              | +0.294          |
| 3   | B A | -0.7              | -0.49           |
| 4   |          | —                 | Full weight     |

### Purpose

### Exception: Known Roles

```json
"known_roles": {
  "player_7": {
    "role": "Mafia",
    "source": "investigation",
    "confidence": 1.0  // NEVER decays
  }
}
```

---

## Perception Depth

### Level 1 — Superficial

**Personalities:** [[Aggressive]] (`perception_depth: 1`), [[Shy]] (`perception_depth: 1`)

```
Filter: weight > 0.7 OR weight < -0.7
Data scope: Current day ONLY
```

| Characteristic              | Effect                                      |
| --------------------------- | ------------------------------------------- |
|  |  |
|  |  |
| ** ** | crowd |
|  |  |
| Night Echo Events          | weight ≥ 0.25 |

### Level 2 — Smart

**Personalities:** [[Cautious]] (`perception_depth: 2`), [[Charismatic]] (`perception_depth: 2`), [[Logical]] (`perception_depth: 2`)

```
Filter: weight > 0.2 OR weight < -0.2
Data scope: ALL days (with time decay applied)
```

| Characteristic                    | Effect                                           |
| --------------------------------- | ------------------------------------------------ |
|  | hidden alliances |
|  |  |
| **Cross-referencing**               | Night Echo Events + vote patterns |
| Night Echo Events                  | events |

### Level 3 — Deep

**Personalities:** [[Paranoid]] (`perception_depth: 3`)

```
Filter: weight > 0.1 OR weight < -0.1
Data scope: ALL days + indirect relationships
```

| Characteristic                        | Effect                                           |
| ------------------------------------- | ------------------------------------------------ |
|  |  |
| 2/3 | "A defended B C" = A suspicious |
| **Multi-source cross-referencing**    | Events + Gossip hints + vote patterns + claims   |
| `memory_weight_modifier: 1.50`        |  |
| Night Echo Events                     | Cross-references events + |

### Decision Making Difference

**Scenario:** Player A voted against Player B (Day 1), then defended Player C (Day 2), who was later revealed as Mafia.

| AI Level      | Analysis                                                   | Verdict on A       |
| ------------- | ---------------------------------------------------------- | ------------------ |
| 1 Superficial | Day 1. A . | Neutral            |
| 2 Smart       | A known-Mafia C. Indirect Mafia suspicion. | (+0.5) |
| 3 Deep        | A C + Town D + Event E02 A. Multi-source suspicion. | (+0.8) |

---

## Voting Decision Process

```
1. Scan memory.json → Collect all suspicion scores
2. Apply Perception Depth filter (Level 1/2/3)
3. Apply Role override:
   - Sheriff + known_role = "Mafia" → ALWAYS vote that player
   - Mafia → NEVER vote fellow Mafia (unless strategic)
   - Executioner → ALWAYS push vote on assigned target
   - Lovers → NEVER vote partner
   - Zombie victims → CANNOT vote
4. Apply vote_threshold: Only vote if suspicion > threshold
5. Apply Mayor weight: If Mayor revealed → vote counts ×2
6. Select player with highest suspicion score
7. If tie → Select most recently accused
8. Cast vote
```

### Vote Influence by Personality

| Personality   | Voting Behavior                                         | `vote_threshold` |
| ------------- | ------------------------------------------------------- | ---------------- |
| Aggressive    |  | 0.40             |
| Cautious      |  | 0.70             |
| Paranoid      | "random" | 0.35             |
| Logical       | evidence | 0.65             |
| Shy           | majority | 0.20             |
| Charismatic   |  | 0.50             |

---

## Night Echo Event Memory

### Event → Memory Weight Formula

```
memory_impact = event_weight × memory_weight_modifier × time_decay
```

- `event_weight`: [[Dynamic Events#Master Event Table|Master Event Table]] (0.10 – 0.40)
- `memory_weight_modifier`: [[Data Architecture#personality.json|personality]] (0.70 – 1.50)
- `time_decay`: r = 0.85 per day]])

### Weight Reference by Event Category

| Category            | Events                            | Base Weight |
| ------------------- | --------------------------------- | ----------- |
| High Suspicion      | E02, E06, E07, E08, E10, E14     | 0.25 – 0.40 |
| Moderate Suspicion  | E01, E03, E05, E09, E11, E12     | 0.15 – 0.25 |
| Low / Atmospheric   | E04, E13                          | 0.10 – 0.15 |

### Perception Depth × Event Processing

| Level | Behaviour                                                      |
| ----- | -------------------------------------------------------------- |
| 1     | events weight ≥ 0.25. cross-references. |
| 2     | events. Cross-references vote patterns. |
| 3     | . Cross-references events + claims + visits + Gossip hints. indirect connections events . |

### Zombie Infection Memory

```json
{
  "is_zombie": true,
  "zombie_since_day": 3,
  "original_faction": "Town",
  "memory_state": "frozen"
}
```

- **memory_state: "frozen"**: weight scores 

---

## Related Links

- [[Data Architecture]] (JSON schemas — 17 personality stats)
- [[AI Decision Engine]] (how memory is used for decisions)
- [[AI Decision Engine#Night Echo Event Reactions]] (event → memory weight impact)
- [[Gameplay Loop#Step 2]] (when memory is updated)
- [[Dynamic Events]] (Night Echo Events E01–E14 — suspicion weight table)
- [[Day Phase#The Trial & Vote]]
