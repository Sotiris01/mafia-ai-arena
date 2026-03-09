---
tags:
  - event
  - event/night_echo
  - timing/midday
  - game_design
---

# E03 — Footsteps Heard (Βήματα Ακούστηκαν)
---

| Property         | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| **ID**           | `E03`                                                         |
| **Type**         | Night Echo Event                                              |
| **Timing**       | 🌅 Morning                                                    |
| **Probability**  | `0.25`                                                        |
| **Linked Roles** | [[Sheriff]], [[Consigliere]], [[Tracker]], [[Lookout]]         |
| **Trigger**      | Ρόλος **πληροφοριών** (investigation/observation) επισκέπτεται παίκτη |
| **Suspicion Weight** | +0.10                                                     |

---

## Message

> _"Βήματα ακούστηκαν έξω από το σπίτι του Player X."_

---

## Τι Αποκαλύπτει

Ότι κάποιος **ερεύνησε** ή **παρακολούθησε** τον Player X.

## Τι Κρύβει

Ποιος ήταν (Town investigator ή Mafia investigator;) και τι έμαθε.

---

## Game Engine Logic

```
trigger_footsteps_event(investigator, target):
  if investigator.role in ["Sheriff", "Consigliere", "Tracker", "Lookout"]:
    if random() < 0.25:
      morning_events.add({
        type: "E03_FOOTSTEPS",
        target: target,
        message: f"Βήματα ακούστηκαν έξω από το σπίτι του {target}."
      })
```

---

## Related Links

- [[Dynamic Events#Master Event Table]] — Πίνακας όλων των events
- [[E09 - Watchful Eyes]] — Mid-Day complement (παρατήρηση)
- [[Day Phase#Morning Report]] — Εμφανίζεται εδώ
