---
tags:
  - role
  - role/town
  - tier/important
  - game_design
  - night_action
  - investigation
---

# Lookout (Town)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Town]]                       |
| **Night Action** | Watch                            |
| **Appears as** | Town (to [[Sheriff]])              |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟡 **IMPORTANT** — Εμφανίζεται σε 8+ παίκτες              |
| **Min Players**      | 8                                                          |
| **Scaling**          | Πάντα ακριβώς 1 Lookout — δεν κλιμακώνεται                  |
| **Unique?**          | ✅ Ναι — μόνο 1 ανά παιχνίδι                                |

### Why Important

Ο Lookout παρέχει **μοναδική πληροφορία**: ποιος επισκέφτηκε ποιον. Αυτό:
- Επιβεβαιώνει ή διαψεύδει **role claims** (π.χ. "Είμαι ο Doctor" → Lookout τον είδε;).
- Αποκαλύπτει τον **killer** αν παρακολουθεί θύμα.
- Συνεργεί με [[Tracker]] (αν υπάρχει) για πλήρη εικόνα νυχτερινής κίνησης.

### When NOT Present (7 players)

Σε 7 παίκτες, η πληροφορία βασίζεται μόνο στον Sheriff + Gossip. Ο Lookout προστίθεται στους 8 για να δώσει δεύτερη πηγή hard evidence.

## Overview

Ο Lookout παρακολουθεί το σπίτι ενός παίκτη κατά τη διάρκεια της [[Night Phase]]. Βλέπει **ποιος επισκέφτηκε** τον στόχο, αλλά **δεν γνωρίζει τι έκαναν** εκεί. Αυτό τον κάνει ισχυρό εργαλείο επιβεβαίωσης — μπορεί να αποδείξει ότι κάποιος ήταν παρών σε ένα "σκηνικό εγκλήματος".

## Night Action: Watch

| Parameter       | Value                                                      |
| --------------- | ---------------------------------------------------------- |
| **Target**      | 1 ζωντανός παίκτης (εκτός εαυτού)                          |
| **Result**      | Λίστα παικτών που επισκέφτηκαν τον στόχο τη νύχτα          |
| **Information** | Ονόματα μόνο. Δεν αποκαλύπτεται η ενέργεια ούτε ο ρόλος.  |

### Τι "βλέπει" ο Lookout

- Αν η Μαφία επιτεθεί στον στόχο → Βλέπει τον Mafia killer να επισκέπτεται.
- Αν ο [[Doctor]] προστατεύσει τον στόχο → Βλέπει τον Doctor να επισκέπτεται.
- Αν ο [[Sheriff]] ερευνήσει τον στόχο → Βλέπει τον Sheriff να επισκέπτεται.
- Αν ο [[Framer]] στοχεύσει τον στόχο → Βλέπει τον Framer να επισκέπτεται.

### Τι ΔΕΝ βλέπει

- Δεν γνωρίζει ποιος ρόλος έκανε τι.
- Δεν γνωρίζει αν η επίσκεψη ήταν "καλή" ή "κακή".

## Strategy Notes

- **Confirmation tool:** Αν κάποιος σκοτωθεί τη νύχτα, ο Lookout μπορεί να αποκαλύψει ποιος επισκέφτηκε — πιθανός ύποπτος.
- **Bait strategy:** Αν υποπτεύεται ότι κάποιος θα στοχοποιηθεί, μπορεί να τον παρακολουθήσει για αποδείξεις.
- **Counter-claim:** Μπορεί να επιβεβαιώσει ή να διαψεύσει role claims (π.χ. αν κάποιος δηλώσει Doctor, ο Lookout μπορεί να ελέγξει αν τον είδε πραγματικά σε κάποιο σπίτι).

## AI Behavior (Virtual Player)

- Το AI αποθηκεύει τα αποτελέσματα Watch στο **[[Data Architecture#memory.json|memory.json]]** ως `night_visits`.
- Κατά τη [[Day Phase]], αν ένα trigger ενεργοποιηθεί (π.χ. κάποιος κατηγορεί τον παίκτη που ο Lookout είδε να επισκέπτεται θύμα), η **[[AI Decision Engine#Speak Probability|πιθανότητα ομιλίας]]** αυξάνεται σημαντικά.

## Related Links

- [[Night Phase#Special Town Actions]]
- [[Win Conditions#Town Victory]]
- [[Data Architecture#memory.json]]
- [[Lovers]] (can see Lover visits)
- [[Tracker]] (complementary info role)
