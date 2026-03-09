---
tags:
  - role
  - role/mafia
  - tier/important
  - game_design
  - night_action
  - deception
---

# Framer (Mafia)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Mafia]]                      |
| **Night Action** | Frame                            |
| **Appears as** | Mafia (to [[Sheriff]])             |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟡 **IMPORTANT** — Εμφανίζεται σε 9+ παίκτες              |
| **Min Players**      | 9                                                          |
| **Scaling**          | Πάντα ακριβώς 1 Framer — δεν κλιμακώνεται                   |
| **Unique?**          | ✅ Ναι — μόνο 1 ανά παιχνίδι                                |

### Why Important

Ο Framer είναι το κύριο **counter-investigation** εργαλείο της Mafia. Μαζί με την investigation immunity του Godfather, κάνει τα αποτελέσματα του Sheriff **αναξιόπιστα** — καταστρεπτικό για το Town σε 9+ παίκτες όπου τους suspect pool είναι μεγαλύτερο.

### When NOT Present (7–8 players)

Σε μικρά παιχνίδια, ο Sheriff έχει λιγότερους στόχους → δεν χρειάζεται Framer για ισορροπία. Η investigation immunity του Godfather αρκεί.

## Overview

Ο Framer είναι μέλος της Μαφίας με μοναδική ικανότητα: μπορεί να **πλαισιώσει** (frame) έναν αθώο παίκτη, κάνοντάς τον να φαίνεται ένοχος στα μάτια του [[Sheriff]]. Αυτό τον κάνει κρίσιμο εργαλείο για τη δημιουργία χάους και ψευδών στοιχείων.

## Night Action: Frame

| Parameter       | Value                                                                  |
| --------------- | ---------------------------------------------------------------------- |
| **Target**      | 1 ζωντανός παίκτης (μη-Mafia)                                          |
| **Effect**      | Αν ο [[Sheriff]] ερευνήσει τον στόχο **αυτή τη νύχτα**, θα εμφανιστεί ως **"Mafia"** |
| **Duration**    | Μόνο τη νύχτα που γίνεται το Frame                                      |
| **Stacking**    | Δεν μπορεί να κάνει frame τον ίδιο παίκτη δύο συνεχόμενες νύχτες       |

### Resolution Priority

```
1. Framer στοχεύει Player X → Player X marked as "framed"
2. Sheriff ερευνά Player X → Result = "Mafia" (ψευδές)
3. Sheriff ερευνά Player Y (μη-framed) → Result = πραγματικό alignment
```

**Σημείωση:** Αν ο Framer δεν στοχεύσει κανέναν (ή στοχεύσει διαφορετικό παίκτη από αυτόν που ερευνά ο Sheriff), το Frame δεν έχει αποτέλεσμα.

## Strategy Notes

- **Timing is key:** Ο Framer πρέπει να μαντέψει ποιον θα ερευνήσει ο [[Sheriff]]. Η Mafia στο [[Night Phase#Mafia Chat|Mafia Chat]] μπορεί να συζητήσει πιθανούς στόχους.
- **Combo με accusation:** Αν ο Framer κάνει frame τον Player X και τη μέρα ένας Mafia συμπαίκτης κατηγορήσει τον X, αυτό πιέζει τον Sheriff να ερευνήσει τον X — πέφτοντας στην παγίδα.
- **Counter:** Ο [[Lookout]] μπορεί να δει τον Framer να επισκέπτεται τον στόχο.

## AI Behavior (Virtual Player)

- Στο [[Night Phase#Mafia Chat|Mafia Chat]], το AI Framer χρησιμοποιεί το **[[Data Architecture#memory.json|memory.json]]** για να εντοπίσει:
  - Ποιος έχει κατηγορηθεί πρόσφατα (υψηλό suspicion).
  - Ποιος είναι πιθανός στόχος του Sheriff.
- Η επιλογή στόχου βασίζεται σε **πιθανότητες**: αν κάποιος Town μέλος κατηγορήθηκε κατά τη μέρα, αυτός έχει μεγαλύτερη πιθανότητα να ερευνηθεί → καλός στόχος frame.

## Related Links

- [[Sheriff]] (counterpart)
- [[Godfather]] (leader)
- [[Night Phase#Resolution]]
