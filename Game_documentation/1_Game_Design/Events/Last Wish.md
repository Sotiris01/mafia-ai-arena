---
tags:
  - event
  - event/lynch
  - game_design
  - mechanic
---

# The Last Wish
---

| Property       | Value                                                |
| -------------- | ---------------------------------------------------- |
| **Type**        | Dynamic Event                                       |
| **Trigger**    | [[Day Phase#The Trial & Vote\ | ]] |
| **Timing**     | , [[Night Phase]] |
| **Frequency**  | lynched |
| **Probability** | `0.40` (40%)                                        |

---

## Overview

---

| Action                   | Description                                                           |
| ------------------------ | --------------------------------------------------------------------- |
| **Reveal Evidence**      |  |
| **Force Public Vote**    | (visible vote) |
| **Expose Alignment**     | alignment (Town/Mafia) |
| **Curse**                |  |

---

## Game Engine Logic

```
onPlayerLynched(player):
  if random() < LAST_WISH_PROBABILITY:  // 0.40
    action = selectRandomAction(LAST_WISH_ACTIONS)
    executeLastWish(player, action)
    broadcast(action.message)
```

---

## Configuration

```json
{
  "last_wish": {
    "probability": 0.4,
    "actions": ["reveal_evidence", "force_public_vote", "expose_alignment", "curse"]
  }
}
```

---

|  |  |
| ------------------------------ | -------------------------------------------------------------- |
| **40% probability**            |  |
| **Random action selection**    | lynched |
| **Pre-Night timing**           |  |
| **Affects living players**     |  |

---

## Related Links

- [[Dynamic Events]]
- [[Day Phase#The Trial & Vote]] — Trigger point
- [[Night Phase]]
