---
tags:
  - role
  - role/mafia
  - tier/expanded
  - game_design
  - night_action
  - information
---

# Janitor (Mafia)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Mafia]]                      |
| **Night Action** | Investigate Dead (Learn Role)    |
| **Appears as** | Mafia (to [[Sheriff]])             |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟣 **EXPANDED**|
| **Min Players**      | 14                                                         |
| **Scaling**          | 1 Janitor |
| **Unique?**          | ✅ |

### Why Expanded

### Fundamental Game Mechanic: No Role Reveal on Death

## Overview

### Key Mechanics

## Night Action: Investigate Dead

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Target**      | 1 |
| **Effect**      | Janitor |
| **Uses**        |  |
| **Condition**   | 1 |
| **Information** | + Alignment |

### Resolution Logic

```
Janitor selects dead Player X:
  → Janitor learns: Player X was [Role] ([Alignment])
  → Information shared in Mafia Chat
  → Nobody else learns this information
```

### Example Night Results

**Mafia Chat update:**

**Morning Report:**
> __

## Strategy Notes

## AI Behavior (Virtual Player)

- **Investigation priority:** AI Janitor :
- **[[AI Decision Engine#Speak Probability|speak probability]]:** Low

## Related Links

- [[Night Phase#Resolution]]
- [[Day Phase#Morning Report]]
- [[Win Conditions#Mafia Victory]]
- [[Godfather]] (coordinates intelligence use)
- [[Consigliere]] (complementary info — alive vs dead players)
