---
tags:
  - role
  - role/neutral
  - tier/advanced
  - game_design
---

# Executioner (Neutral)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[Neutral]]                        |
| **Night Action** | None (Day-focused role)          |
| **Appears as** | Town (to [[Sheriff]])              |
| **Win Condition** | [[Win Conditions#Executioner Victory|Get target lynched]] |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🔵 **ADVANCED**|
| **Min Players**      | 12                                                         |
| **Scaling**          | 1 Executioner |
| **Unique?**          | ✅ |

### Why Advanced

- Day Phase **false accusations**.

### Executioner vs Jester

| Aspect              | Jester                          | Executioner                        |
| -------------------- | ------------------------------- | ---------------------------------- |
| **** | ** ** | ** assigned target** |
| **Plays as**         |  |  |
| **Game End on Win?** | ✅ — instant game over | ❌ |
| **On Failure**       |  | [[Jester]] |
| **Sheriff sees**     | Town                            | Town                               |

## Overview

### Target Assignment

## Strategy Notes

### As Executioner

### Against Executioner

## AI Behavior (Virtual Player)

  - Day 3+: Direct accusation, possible fake investigation claim.
- **[[AI Decision Engine#Speak Probability|speak probability]]:** High

## Related Links

- [[Day Phase#The Trial & Vote]]
- [[Win Conditions#Executioner Victory]]
- [[Jester]] (fallback role if target dies)
- [[Sheriff]] (common fake claim)
- [[Survivor]] (fellow Neutral, different goal)

## Win Condition

| Condition                                      | Result                               |
| ---------------------------------------------- | ------------------------------------ |
| Day Phase | **EXECUTIONER WINS** |
|  | Executioner → **Jester** |
| Executioner | **** |
| lynch | **** |

## Setup & Assignment

| Rule                        | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| **** | Setup |
| **** | Executioner |
| **** | Town, -unique role |
| **On target death**         | Executioner → [[Jester]] |
