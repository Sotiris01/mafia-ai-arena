---
tags:
  - role
  - role/town
  - tier/core
  - game_design
  - night_action
  - protection
---

# Doctor (Town)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Town]]                       |
| **Night Action** | Protect                          |
| **Appears as** | Town (to [[Sheriff]])              |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟢 **CORE**|
| **Min Players**      | 7                                                |
| **Scaling**          | 1 Doctor |
| **Unique?**          | ✅ |

### Why Core

### Synergy

## Overview

## Night Action: Protect / Cure

| Parameter       | Value                                                     |
| --------------- | --------------------------------------------------------- |
| **Target**      | 1 |
| **Effect**      | **Protect:** Mafia kill |
|                 | **Cure:** zombie → |
| **Duration**    | 1 (protect) / (cure) |
| **Self-protect**|  |
| **Choice**      | : **Protect** **Cure** zombie |

### Protect Resolution

```
1. Mafia selects target → Kill queued
2. Doctor selects same target → Protection active
3. Resolution: Kill canceled → "Nobody died tonight"
```

### Cure Resolution (Zombie)

```
1. Doctor selects zombie victim → Cure active
2. Resolution: Victim returns to normal
   → Night action restored
   → Chat limit removed
   → Voting rights restored
   → Morning Report: "Player Y looks much better today! 💊"
```

### What Protection DOES NOT Block

- [[Day Phase#The Trial & Vote|Day phase lynch]]
- [[Dynamic Events#The Full Moon|Full Moon]] double kill

## Strategy Notes

## AI Behavior (Virtual Player)

    - Zombie victim = key role (Sheriff/Bodyguard) → **CURE**
 - zombie victims (3+) → **CURE**
 - 1 zombie + Mafia threat → **PROTECT**
- **[[Data Architecture#personality.json|personality]]** :

## Related Links

- [[Night Phase#Special Town Actions]]
- [[Win Conditions#Town Victory]]
- [[Sheriff]] (key protection target)
- [[Lookout]] (can confirm Doctor visits)
- [[Zombie]] (Doctor can cure zombie victims)
- [[Mayor]] (can protect Mayor after reveal)
