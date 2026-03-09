---
tags:
  - event
  - event/night_echo
  - timing/morning
  - game_design
---

# E11 — Medical Supplies (Ιατρικά Εφόδια)
---

| Property         | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| **ID**           | `E11`                                                         |
| **Type**         | Night Echo Event                                              |
| **Timing**       | 🌅 Morning                                                    |
| **Probability**  | `0.20`                                                        |
| **Linked Roles** | [[Doctor]]                                                     |
| **Trigger**      | Ο Doctor **επισκέφτηκε** κάποιον παίκτη (protect/cure)         |
| **Suspicion Weight** | -0.10 _(μειώνει suspicion)_                               |

---

## Message

> _"Ιατρικά εφόδια βρέθηκαν κοντά στο σπίτι του Player X."_

---

## Τι Αποκαλύπτει

Ο Player X μπορεί να **προστατεύτηκε** ή να **θεραπεύτηκε**.

## Τι Κρύβει

Αν πρόκειται για Doctor visit ή κάτι άλλο. Ο Doctor δεν αποκαλύπτεται.

---

## Related Links

- [[Dynamic Events#Master Event Table]] — Πίνακας όλων των events
- [[Doctor]] — Μοναδικό linked role
- [[E06 - Commotion]] — Εμφανίζεται αν Doctor + Mafia visit same target
- [[Day Phase#Morning Report]] — Εμφανίζεται εδώ
