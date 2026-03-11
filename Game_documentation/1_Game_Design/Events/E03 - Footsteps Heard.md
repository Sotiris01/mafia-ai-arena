---
tags:
  - event
  - event/night_echo
  - timing/midday
  - game_design
---

# E03 — Footsteps Heard
---

| Property         | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| **ID**           | `E03`                                                         |
| **Type**         | Night Echo Event                                              |
| **Timing**       | 🌅 Morning                                                    |
| **Probability**  | `0.25`                                                        |
| **Linked Roles** | [[Sheriff]], [[Consigliere]], [[Tracker]], [[Lookout]]         |
| **Trigger**      | **** (investigation/observation) |
| **Suspicion Weight** | +0.10                                                     |

---

## Message

---

---

## Game Engine Logic

```
trigger_footsteps_event(investigator, target):
  if investigator.role in ["Sheriff", "Consigliere", "Tracker", "Lookout"]:
    if random() < 0.25:
      morning_events.add({
        type: "E03_FOOTSTEPS",
        target: target,
      })
```

---

## Related Links

- [[Dynamic Events#Master Event Table]]
- [[E09 - Watchful Eyes]] — Mid-Day complement
- [[Day Phase#Morning Report]]
