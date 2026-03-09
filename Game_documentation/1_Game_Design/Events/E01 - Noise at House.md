---
tags:
  - event
  - event/night_echo
  - timing/morning
  - game_design
---

# E01 — Noise at House (Φασαρία στο Σπίτι)
---

| Property         | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| **ID**           | `E01`                                                         |
| **Type**         | Night Echo Event                                              |
| **Timing**       | 🌅 Morning                                                    |
| **Probability**  | `0.30`                                                        |
| **Linked Roles** | [[Mafia Goon]], [[Godfather]], [[Doctor]], [[Sheriff]], [[Bodyguard]], [[Framer]], [[Consigliere]], [[Silencer]], [[Zombie]] |
| **Trigger**      | Οποιοσδήποτε ρόλος **επισκέπτεται** έναν παίκτη τη νύχτα      |
| **Suspicion Weight** | +0.15                                                     |

---

## Message

> _"Ακούστηκε φασαρία κοντά στο σπίτι του Player X τη νύχτα."_

---

## Τι Αποκαλύπτει

Ότι κάποιος **πήγε** στο σπίτι του Player X — αλλά **όχι ποιος** και **όχι γιατί**.

## Τι Κρύβει

Αν ήταν Mafia kill, Doctor protect, Sheriff investigation, Framer frame, ή οτιδήποτε άλλο.

---

## Game Engine Logic

```
trigger_noise_event(visited_player):
  if random() < 0.30:
    morning_events.add({
      type: "E01_NOISE",
      target: visited_player,
      message: f"Ακούστηκε φασαρία κοντά στο σπίτι του {visited_player} τη νύχτα."
    })
```

---

## Related Links

- [[Dynamic Events#Master Event Table]] — Πίνακας όλων των events
- [[E05 - Someone Seen Leaving]] — Συνδυάζεται για ισχυρότερο clue
- [[Day Phase#Morning Report]] — Εμφανίζεται εδώ
