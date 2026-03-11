---
tags:
  - role
  - role/town
  - tier/expanded
  - game_design
---

# Mayor (Town)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Town]]                       |
| **Night Action** | None (Day-focused role)          |
| **Appears as** | Town (to [[Sheriff]])              |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟣 **EXPANDED**|
| **Min Players**      | 13                                                         |
| **Scaling**          | 1 Mayor |
| **Unique?**          | ✅ |

### Why Expanded

### Balance Tradeoff

- ✅ **2x vote weight**.

### The Only Provable Role

## Overview

## Day Action: Reveal

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Trigger**     | [[Day Phase]] |
| **Effect**      | Vote weight **×2** |
| **Permanent**   | ✅ |
| **Protection**  | ✅ [[Doctor]] & [[Bodyguard]] **** |
| **Reversible**  | ❌ |

### Mechanics

```
  Mayor vote = 1
  Mayor alignment = unproven

  Mayor vote = 2
  Mayor alignment = PROVEN TOWN
  Doctor/Bodyguard CAN still heal Mayor
  Mafia → Mayor = priority target
```

### UI Implementation

## Strategy Notes

| Timing        |  | Risk     |
| ------------- | ------------------------------------------------- | -------- |
| **Early**     | Day 1–2| 🔴 |
| **Mid-game**  | proven Town leader | 🟡 |
| **Late-game** | 3–4 | 🟢 |
| **Never**     | Mayor instant death ||

### Tactical Uses

## AI Behavior (Virtual Player)

- **[[AI Decision Engine#Speak Probability|speak probability]]:** Variable

## Related Links

- [[Day Phase#The Trial & Vote]]
- [[Win Conditions#Town Victory]]
- [[Doctor]] (can heal Mayor after reveal)
- [[Bodyguard]] (can protect Mayor after reveal)
- [[Jester]] (dangerous to lynch with ×2 vote)
