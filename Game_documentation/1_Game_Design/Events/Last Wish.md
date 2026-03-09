---
tags:
  - event
  - event/lynch
  - game_design
  - mechanic
---

# The Last Wish
---

| Property       | Value                                                |
| -------------- | ---------------------------------------------------- |
| **Type**        | Dynamic Event                                       |
| **Trigger**    | Παίκτης εξοντώνεται κατά τη [[Day Phase#The Trial & Vote\|ψηφοφορία]] |
| **Timing**     | Αμέσως μετά την εξόντωση, πριν ξεκινήσει η [[Night Phase]] |
| **Frequency**  | Κάθε φορά που κάποιος lynched (δεν ενεργοποιείται πάντα) |
| **Probability** | `0.40` (40%)                                        |

---

## Overview

Όταν ένας παίκτης ψηφίζεται και εξοντώνεται (lynch), υπάρχει 40% πιθανότητα να ενεργοποιηθεί ένα Last Wish event. Ο lynched παίκτης "αφήνει πίσω" μια τελευταία ενέργεια που επηρεάζει το παιχνίδι — δίνοντας στοιχεία, αναγκάζοντας ψήφο, αποκαλύπτοντας alignment, ή καταρώντας κάποιον.

---

## Πιθανές Last Wish Actions

| Action                   | Description                                                           |
| ------------------------ | --------------------------------------------------------------------- |
| **Reveal Evidence**      | Αποκαλύπτει ένα στοιχείο — π.χ. "Ο Player X με επισκέφτηκε τη Νύχτα 2" |
| **Force Public Vote**    | Αναγκάζει έναν παίκτη να ψηφίσει δημόσια (visible vote) την επόμενη μέρα |
| **Expose Alignment**     | Αποκαλύπτει το alignment (Town/Mafia) ενός τυχαίου παίκτη              |
| **Curse**                | Ένας παίκτης θα λάβει μειωμένη πληροφορία τη νύχτα (π.χ. Sheriff lost result) |

---

## Game Engine Logic

```
onPlayerLynched(player):
  if random() < LAST_WISH_PROBABILITY:  // 0.40
    action = selectRandomAction(LAST_WISH_ACTIONS)
    executeLastWish(player, action)
    broadcast(action.message)
```

---

## Configuration

```json
{
  "last_wish": {
    "probability": 0.4,
    "actions": ["reveal_evidence", "force_public_vote", "expose_alignment", "curse"]
  }
}
```

---

## Σχεδιαστικές Σημειώσεις

| Αρχή                          | Γιατί                                                          |
| ------------------------------ | -------------------------------------------------------------- |
| **40% probability**            | Δεν πρέπει να εμφανίζεται πάντα — αβεβαιότητα                 |
| **Random action selection**    | Ο lynched δεν επιλέγει — αποτρέπει meta-gaming                |
| **Pre-Night timing**           | Εμφανίζεται πριν τη νύχτα — δίνει χρόνο αντίδρασης            |
| **Affects living players**     | Ο νεκρός αφήνει αντίκτυπο — ακόμα κι αν πεθαίνει, "μιλάει"   |

---

## Related Links

- [[Dynamic Events]] — Κεντρικό σύστημα events
- [[Day Phase#The Trial & Vote]] — Trigger point
- [[Night Phase]] — Last Wish εκτελείται πριν από αυτή
