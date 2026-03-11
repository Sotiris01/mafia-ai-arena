---
tags:
  - event
  - event/night_echo
  - timing/midday
  - game_design
---

# E07 — Gun License
---

| Property         | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| **ID**           | `E07`                                                         |
| **Type**         | Night Echo Event                                              |
| **Timing**       | 💬 Mid-Day                                                    |
| **Probability**  | `0.10`                                                        |
| **Linked Roles** | [[Bodyguard]], [[Sheriff]] __, [[Godfather]], [[Mafia Goon]] |
| **Trigger**      | **** |
| **Suspicion Weight** | +0.35                                                     |

---

## Message

---

---

## Weighted Selection

| event | Weight   |  |
| ----------------------------- | -------- | ----------------------------------- |
| [[Bodyguard]]                 | `0.50`   |  |
| [[Mafia Goon]] / [[Godfather]]| `0.35`  |  |
| [[Sheriff]]                   | `0.15`   |  |

---

## Game Engine Logic

```
if random() < 0.10:
  eligible_roles = alive_players.filter(role in ["Bodyguard", "Sheriff", "Godfather", "Mafia Goon"])
  if eligible_roles.length > 0:
    selected = weighted_random(eligible_roles, weights)
    midday_events.add({
      type: "E07_GUN_LICENSE",
      suspect: selected,
    })
```

---

## Related Links

- [[Dynamic Events#Master Event Table]]
- [[Day Phase#Public Discussion]]
