---
tags:
  - event
  - event/night_echo
  - timing/midday
  - game_design
---

# E07 — Gun License (Άδεια Οπλοφορίας)
---

| Property         | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| **ID**           | `E07`                                                         |
| **Type**         | Night Echo Event                                              |
| **Timing**       | 💬 Mid-Day                                                    |
| **Probability**  | `0.10`                                                        |
| **Linked Roles** | [[Bodyguard]], [[Sheriff]] _(πολύ σπάνια)_, [[Godfather]], [[Mafia Goon]] |
| **Trigger**      | Ένας από τους παραπάνω ρόλους **υπάρχει** ζωντανός στο παιχνίδι |
| **Suspicion Weight** | +0.35                                                     |

---

## Message

> _"Φημολογείται ότι ο Player X απέκτησε πρόσφατα άδεια οπλοφορίας..."_

---

## Τι Αποκαλύπτει

Ο Player X **μπορεί** να είναι κάποιος "οπλισμένος" ρόλος.

## Τι Κρύβει

Αν είναι Bodyguard (Town), Sheriff (σπάνιο), ή Mafia μέλος.

---

## Weighted Selection

| Ρόλος πίσω από event          | Weight   | Σχόλιο                              |
| ----------------------------- | -------- | ----------------------------------- |
| [[Bodyguard]]                 | `0.50`   | Πιθανότερο — ο "φύλακας" έχει όπλο |
| [[Mafia Goon]] / [[Godfather]]| `0.35`  | Πιθανό — η Mafia είναι οπλισμένη   |
| [[Sheriff]]                   | `0.15`   | Πολύ σπάνιο — ο Sheriff σπάνια φαίνεται |

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
      message: f"Φημολογείται ότι ο {selected} απέκτησε πρόσφατα άδεια οπλοφορίας..."
    })
```

---

## Related Links

- [[Dynamic Events#Master Event Table]] — Πίνακας όλων των events
- [[Day Phase#Public Discussion]] — Εμφανίζεται ως mid-day interrupt
