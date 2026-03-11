---
tags:
  - role
  - role/town
  - tier/advanced
  - game_design
  - information
---

# Gossip (Town)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Town]]                       |
| **Night Action** | Receive Clue (Passive)           |
| **Appears as** | Town (to [[Sheriff]])              |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🔵 **ADVANCED**|
| **Min Players**      | 10                                                         |
| **Scaling**          | 1 Gossip |
| **Unique?**          | ✅ |

### Why Advanced

### Synergy Matrix

| Role Combo            | Effect                                                   |
| --------------------- | -------------------------------------------------------- |
| Gossip + Sheriff      | Gossip hint → Sheriff confirms/denies |
| Gossip + Lookout      | Cross-reference visit data + hint → strong conclusion    |
| Gossip + Tracker      | Tracker tracks suspect → Gossip validates direction       |

## Overview

## Night Action: Receive Clue

| Parameter       | Value                                                            |
| --------------- | ---------------------------------------------------------------- |
| **Target**      |  |
| **Result**      |  |
| **** | , |

|  | Clue Gossip |
| ------------------------------------------ | ---------------------------------------------- |
| Sheriff Player C | _"Someone was curious about Player C tonight"_ |
| Mafia Player D | _"Player D had an unwelcome visitor"_          |
| Doctor Player B | _"Someone watched over Player B"_              |
| Framer Player A | _"Player A was touched by shadow"_             |

## Strategy Notes

## AI Behavior (Virtual Player)

- clues **[[Data Architecture#memory.json|memory.json]]** `gossip_hints`.

## Related Links

- [[Night Phase#Special Town Actions]]
- [[Dynamic Events]]
- [[AI Decision Engine#Perception Depth]]
