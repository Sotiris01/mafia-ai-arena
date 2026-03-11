---
tags:
  - role
  - role/town
  - tier/advanced
  - game_design
  - night_action
  - protection
---

# Bodyguard (Town)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Town]]                       |
| **Night Action** | Protect (Sacrifice)              |
| **Appears as** | Town (to [[Sheriff]])              |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟡 **IMPORTANT**|
| **Min Players**      | 10                                                         |
| **Scaling**          | 1 Bodyguard |
| **Unique?**          | ✅ |

### Why Important

### vs Doctor Comparison

| Aspect           | Doctor                        | Bodyguard                         |
| ---------------- | ----------------------------- | --------------------------------- |
| ** ** | ✅ | ✅ |
| **** |  | Bodyguard |
| **Counter-attack**|  | ✅ 1 |
| **** | ❌ self-heal | ❌ self-protect |
| **** | ✅ | ❌ |

## Overview

## Night Action: Protect (Sacrifice)

| Parameter       | Value                                                                  |
| --------------- | ---------------------------------------------------------------------- |
| **Target**      | 1 |
| **Effect**      | Mafia kill → kill , Bodyguard + 1 Mafia |
| **Self-target** | ❌ |
| **Stacking**    | Doctor + Bodyguard → Doctor save , Bodyguard |
| **Blocked by**  |  |

### Resolution Logic

```
1. Mafia Kill → Target X
2. Doctor check: Doctor healing X? → Kill canceled (Bodyguard NOT triggered)
3. Bodyguard check: Bodyguard guarding X? → Kill canceled, Bodyguard dies, 1 random Mafia voter dies
4. Neither → Target X dies
```

## Strategy Notes

## AI Behavior (Virtual Player)

- **Target selection:** [[Data Architecture#memory.json|memory.json]]:
- **[[AI Decision Engine#Speak Probability|speak probability]]:** Moderate

## Related Links

- [[Night Phase#Protection Resolution]]
- [[Doctor]] (complementary protector)
- [[Win Conditions#Town Victory]]
- [[Mafia Goon]] (potential counter-kill target)
