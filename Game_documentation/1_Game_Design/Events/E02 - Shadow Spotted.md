---
tags:
  - event
  - event/night_echo
  - timing/morning
  - game_design
---

# E02 — Shadow Spotted (Σκιά Εντοπίστηκε)
---

| Property         | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| **ID**           | `E02`                                                         |
| **Type**         | Night Echo Event                                              |
| **Timing**       | 🌅 Morning                                                    |
| **Probability**  | `0.20`                                                        |
| **Linked Roles** | [[Mafia Goon]], [[Godfather]], [[Framer]], [[Silencer]], [[Consigliere]], [[Zombie]] |
| **Trigger**      | Μέλος **Mafia ή Neutral threat** επισκέπτεται παίκτη           |
| **Suspicion Weight** | +0.30                                                     |

---

## Message

> _"Κάποιος είδε μια σκιά να κατευθύνεται προς το σπίτι του Player X."_

---

## Τι Αποκαλύπτει

Ότι κάτι **ύποπτο** συνέβη κοντά στο Player X.

## Τι Κρύβει

Ποιος ήταν — δεν αποκαλύπτεται ο επισκέπτης. Θα μπορούσε να ήταν kill, frame, silence, ή investigate.

---

## Game Engine Logic

```
trigger_shadow_event(visitor, visited_player):
  if visitor.alignment == "Mafia" OR visitor.role == "Zombie":
    if random() < 0.20:
      morning_events.add({
        type: "E02_SHADOW",
        target: visited_player,
        message: f"Κάποιος είδε μια σκιά να κατευθύνεται προς το σπίτι του {visited_player}."
      })
```

---

## Related Links

- [[Dynamic Events#Master Event Table]] — Πίνακας όλων των events
- [[E01 - Noise at House]] — Πιο generic version (ALL visiting roles)
- [[Day Phase#Morning Report]] — Εμφανίζεται εδώ
