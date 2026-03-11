---
tags:
  - role
  - role/town
  - tier/advanced
  - game_design
  - night_action
  - investigation
---

# Tracker (Town)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Town]]                       |
| **Night Action** | Track                            |
| **Appears as** | Town (to [[Sheriff]])              |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🔵 **ADVANCED**|
| **Min Players**      | 12                                                         |
| **Scaling**          | 1 Tracker |
| **Unique?**          | ✅ |

### Why Advanced

### Tracker vs Lookout

| Aspect             | Lookout                               | Tracker                              |
| ------------------- | ------------------------------------- | ------------------------------------ |
| **** | " Player X;" | " Player X;" |
| **Input**           | **** | **** |
| **Output**          |  |  |
| **Best for**        | Confirming role claims                 | Catching killers red-handed          |

## Overview

## Night Action: Track

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Target**      | 1 |
| **Effect**      |  |
| **Self-target** | ❌ |

### Resolution

```
Tracker tracks Player X:
  → Player X visited Player Y? → Tracker sees "Player X → Player Y"
  → Player X stayed home?     → Tracker sees "Player X →"
```

### Lovers Visit Interaction

```
Tracker tracks Lover B:
  → If Lover B visited Lover A this night:
     Tracker sees: "Player [Lover B] → Player [Lover A]"
  → If Lover A visited Lover B instead:
     Tracker sees: "Player [Lover B] →"
```

## Strategy Notes

## AI Behavior (Virtual Player)

- **Target selection:** [[Data Architecture#memory.json|memory.json]]:
- **[[AI Decision Engine#Speak Probability|speak probability]]:** Moderate-high

## Related Links

- [[Night Phase#Investigation Phase]]
- [[Lookout]] (complementary info role)
- [[Win Conditions#Town Victory]]
- [[Lovers]] (can detect Lover visits)
