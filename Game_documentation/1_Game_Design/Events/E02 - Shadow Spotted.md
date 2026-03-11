---
tags:
  - event
  - event/night_echo
  - timing/morning
  - game_design
---

# E02 — Shadow Spotted
---

| Property         | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| **ID**           | `E02`                                                         |
| **Type**         | Night Echo Event                                              |
| **Timing**       | 🌅 Morning                                                    |
| **Probability**  | `0.20`                                                        |
| **Linked Roles** | [[Mafia Goon]], [[Godfather]], [[Framer]], [[Silencer]], [[Consigliere]], [[Zombie]] |
| **Trigger**      | **Mafia Neutral threat** |
| **Suspicion Weight** | +0.30                                                     |

---

## Message

---

---

## Game Engine Logic

```
trigger_shadow_event(visitor, visited_player):
  if visitor.alignment == "Mafia" OR visitor.role == "Zombie":
    if random() < 0.20:
      morning_events.add({
        type: "E02_SHADOW",
        target: visited_player,
      })
```

---

## Related Links

- [[Dynamic Events#Master Event Table]]
- [[E01 - Noise at House]]
- [[Day Phase#Morning Report]]
