---
tags:
  - event
  - event/night_echo
  - timing/midday
  - game_design
---

# E04 — Argument Heard (Καυγάς Ακούστηκε)
---

| Property         | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| **ID**           | `E04`                                                         |
| **Type**         | Night Echo Event                                              |
| **Timing**       | 🌅 Morning                                                    |
| **Probability**  | `0.15` (Lovers fight) / `1.00` (Bodyguard sacrifice)          |
| **Linked Roles** | [[Lovers]], [[Bodyguard]]                                      |
| **Trigger**      | Lovers μαλώνουν (~15% ανά νύχτα) Ή Bodyguard σκοτώνεται σώζοντας στόχο |
| **Suspicion Weight** | +0.20                                                     |

---

## Messages

**Lovers fight:**
> _"Ακούστηκε έντονος καυγάς κοντά στο σπίτι του Player X τη νύχτα."_

**Bodyguard sacrifice:**
> _"Ένας βίαιος καυγάς ακούστηκε κοντά στο σπίτι του Player X."_

---

## Τι Αποκαλύπτει

Σύγκρουση στο σπίτι — μπορεί να είναι Lovers fight ή Bodyguard sacrifice.

## Τι Κρύβει

Αν πρόκειται για ζευγάρι που μαλώνει ή μάχη ζωής-θανάτου.

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

- [[Dynamic Events#Master Event Table]] — Πίνακας όλων των events
- [[Lovers]] — Fight trigger
- [[Bodyguard]] — Sacrifice trigger
- [[Day Phase#Morning Report]] — Εμφανίζεται εδώ
