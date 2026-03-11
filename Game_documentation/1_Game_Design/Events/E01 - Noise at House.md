---
tags:
  - event
  - event/night_echo
  - timing/morning
  - game_design
---

# E01 — Noise at House
---

| Property         | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| **ID**           | `E01`                                                         |
| **Type**         | Night Echo Event                                              |
| **Timing**       | 🌅 Morning                                                    |
| **Probability**  | `0.30`                                                        |
| **Linked Roles** | [[Mafia Goon]], [[Godfather]], [[Doctor]], [[Sheriff]], [[Bodyguard]], [[Framer]], [[Consigliere]], [[Silencer]], [[Zombie]] |
| **Trigger**      | **** |
| **Suspicion Weight** | +0.15                                                     |

---

## Message

---

---

## Game Engine Logic

```
trigger_noise_event(visited_player):
  if random() < 0.30:
    morning_events.add({
      type: "E01_NOISE",
      target: visited_player,
    })
```

---

## Related Links

- [[Dynamic Events#Master Event Table]]
- [[E05 - Someone Seen Leaving]]
- [[Day Phase#Morning Report]]
