---
tags:
  - role
  - role/mafia
  - tier/expanded
  - game_design
  - night_action
  - investigation
---

# Consigliere (Mafia)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Mafia]]                      |
| **Night Action** | Investigate (Exact Role)         |
| **Appears as** | Mafia (to [[Sheriff]])             |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟣 **EXPANDED**|
| **Min Players**      | 13                                                         |
| **Scaling**          | 1 Consigliere |
| **Unique?**          | ✅ |

### Why Expanded

### Consigliere vs Sheriff

| Aspect             | Sheriff                       | Consigliere                        |
| ------------------- | ----------------------------- | ---------------------------------- |
| **Alignment**       | Town                          | Mafia                              |
| **** | Alignment (Town/Mafia)        | ** ** (Doctor, Sheriff…) |
| **Fooled by**       | Godfather, Framer             |  |
| **Uses info for**   | Lynch targets                 | Kill targets                       |

## Overview

## Night Action: Investigate (Exact Role)

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Target**      | 1 |
| **Effect**      |  |
| **Self-target** | ❌ |
| **Mafia target**| ❌ |
| **Cooldown**    |  |

### Resolution

```
Consigliere investigates Player X:
  → Player X = Doctor  → Consigliere sees "Doctor"
  → Player X = Jester  → Consigliere sees "Jester"
  → Player X = Citizen → Consigliere sees "Citizen"
```

## Strategy Notes

## AI Behavior (Virtual Player)

- **Target selection:** [[Data Architecture#memory.json|memory.json]]:
- **[[AI Decision Engine#Speak Probability|speak probability]]:** Low-Moderate Day

## Related Links

- [[Night Phase#Investigation Phase]]
- [[Sheriff]] (Town counterpart)
- [[Godfather]] (leader, receives intel)
- [[Win Conditions#Mafia Victory]]
