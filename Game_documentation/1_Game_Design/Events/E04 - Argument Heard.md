---
tags:
  - event
  - event/night_echo
  - timing/midday
  - game_design
---

# E04 — Argument Heard
---

| Property         | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| **ID**           | `E04`                                                         |
| **Type**         | Night Echo Event                                              |
| **Timing**       | 🌅 Morning                                                    |
| **Probability**  | `0.15` (Lovers fight) / `1.00` (Bodyguard sacrifice)          |
| **Linked Roles** | [[Lovers]], [[Bodyguard]]                                      |
| **Trigger**      | Lovers Bodyguard |
| **Suspicion Weight** | +0.20                                                     |

---

## Messages

**Lovers fight:**

**Bodyguard sacrifice:**

---

---

## Game Engine Logic

```
// Lovers fight
if lovers_exist AND random() < 0.15:
  trigger_argument_event(random_lover)

// Bodyguard sacrifice
if bodyguard_died_saving_target:
  trigger_argument_event(saved_target)  // probability = 1.00
```

---

## Related Links

- [[Dynamic Events#Master Event Table]]
- [[Lovers]] — Fight trigger
- [[Bodyguard]] — Sacrifice trigger
- [[Day Phase#Morning Report]]
