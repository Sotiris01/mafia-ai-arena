---
tags:
  - role
  - role/town
  - tier/core
  - game_design
  - night_action
  - investigation
---

# Sheriff (Town)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Town]]                       |
| **Night Action** | Investigate                      |
| **Appears as** | Town (to other Sheriff, if any)    |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟢 **CORE**|
| **Min Players**      | 7                                                |
| **Scaling**          | 1 Sheriff |
| **Unique?**          | ✅ |

### Why Core

### Balance Impact

- ** Sheriff:** Mafia win rate ~70%+
- ** Sheriff:** Balanced ~50/50

## Overview

## Night Action: Investigate

| Parameter       | Value                                                     |
| --------------- | --------------------------------------------------------- |
| **Target**      | 1 |
| **Result**      | "Town" "Mafia" |
| **Accuracy**    | 100%|

### Investigation Exceptions

|  |  | Reason                                      |
| -------------------------------- | -------------------- | ------------------------------------------- |
| Town | **"Town"** ✅         |  |
| Mafia | **"Mafia"** ✅        |  |
| [[Godfather]]                    | **"Town"** ❌         |  |
| Town framed by [[Framer]] | **"Mafia"** ❌        |  |
| [[Survivor]]                     | **"Town"** ✅         | Neutral Town |
| [[Jester]]                       | **"Town"** ✅         | Neutral Town |

### Result Storage

```json
{
  "night_results": [
    {"night": 1, "action": "investigate", "target": "player_4", "result": "Town"},
    {"night": 2, "action": "investigate", "target": "player_7", "result": "Mafia"}
  ],
  "known_roles": {
    "player_7": {"role": "Mafia", "source": "investigation", "confidence": 1.0}
  }
}
```

## Strategy Notes

## AI Behavior (Virtual Player)

- AI Sheriff investigation `memory.json` `known_roles` `confidence: 1.0`.

## Related Links

- [[Night Phase#Special Town Actions]]
- [[Win Conditions#Town Victory]]
- [[Godfather]] (counterpart)
- [[Framer]] (can produce false results)
- [[Doctor]] (key protector)
