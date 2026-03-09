---
tags:
  - role
  - role/mafia
  - tier/advanced
  - game_design
  - night_action
---

# Silencer (Mafia)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Mafia]]                      |
| **Night Action** | Silence                          |
| **Appears as** | Mafia (to [[Sheriff]])             |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🔵 **ADVANCED** — Εμφανίζεται σε 11+ παίκτες              |
| **Min Players**      | 11                                                         |
| **Scaling**          | Πάντα ακριβώς 1 Silencer — δεν κλιμακώνεται                |
| **Unique?**          | ✅ Ναι — μόνο 1 ανά παιχνίδι                                |

### Why Advanced

Ο Silencer είναι **luxury role** της Mafia — ισχυρός αλλά όχι απαραίτητος. Σε μικρά παιχνίδια (7–10), η Mafia έχει ήδη τον Godfather + Framer για counter-investigation. Ο Silencer προστίθεται σε 11+ όπου το chat volume αυξάνεται και η αφαίρεση φωνής γίνεται στρατηγικά σημαντική.

### Impact by Game Size

| Game Size | Silence Impact              |
| --------- | --------------------------- |
| 11–12     | Δυνατό — μειώνει info flow   |
| 13–15     | Κρίσιμο — σιγάζει key roles |

## Overview

Ο Silencer μπορεί να **αποτρέψει** έναν παίκτη από το να μιλήσει στο [[Day Phase#Public Discussion|Public Chat]] κατά τη διάρκεια της επόμενης μέρας. Αυτός ο ρόλος είναι εξαιρετικά ισχυρός γιατί μπορεί να **αφαιρέσει τη φωνή** σε κρίσιμες στιγμές — ειδικά αν στοχεύσει τον [[Sheriff]] ή κάποιον που είναι έτοιμος να αποκαλύψει πληροφορίες.

## Night Action: Silence

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Target**      | 1 ζωντανός παίκτης                                                  |
| **Effect**      | Ο στόχος **δεν μπορεί να γράψει** στο Public Chat την **επόμενη μέρα** |
| **Duration**    | 1 Day Phase μόνο                                                    |
| **Cooldown**    | Δεν μπορεί να σιγάσει τον ίδιο παίκτη δύο συνεχόμενες νύχτες       |

### Notification

Ο σιγασμένος παίκτης **γνωρίζει** ότι σιγάστηκε (βλέπει "You have been silenced" στο UI) αλλά **δεν γνωρίζει** ποιος τον σίγασε.

### Voting

Ο σιγασμένος παίκτης **μπορεί ακόμα να ψηφίσει** κατά τη [[Day Phase#The Trial & Vote|Trial]]. Μόνο η ικανότητα "μιλίας" στο chat αφαιρείται.

## Strategy Notes

- **Silence key roles:** Αν η Mafia υποπτεύεται ποιος είναι ο [[Sheriff]], μπορεί να τον σιγάσει αντί να τον σκοτώσει — αυτό αποτρέπει κακές πληροφορίες χωρίς να αποκαλύπτει ότι ο Sheriff "χτυπήθηκε".
- **Psychological pressure:** Ένας σιγασμένος παίκτης φαίνεται ύποπτος στους υπόλοιπους ("γιατί δεν μιλάει; κρύβει κάτι;").
- **Combo timing:** Σιγάστε κάποιον που μόλις κατηγόρησε Mafia μέλος — δεν θα μπορέσει να συνεχίσει τις κατηγορίες του.
- **Counter:** Αν ο σιγασμένος παίκτης ήταν ήδη "ήσυχος" (Shy personality), τότε η σίγαση μπορεί να μη γίνει αντιληπτή.

## AI Behavior (Virtual Player)

- Η επιλογή στόχου βασίζεται στο **[[Data Architecture#memory.json|memory.json]]** του Silencer:
  - Παίκτες που κατηγορούν τη Μαφία (υψηλό `accusation weight` εναντίον Mafia μελών).
  - Παίκτες με υψηλή [[AI Decision Engine#Speak Probability|speak probability]] — σιγάζοντάς τους αποτρέπεται η μεγαλύτερη ζημιά.
- Στο [[Night Phase#Mafia Chat|Mafia Chat]], ο Silencer συντονίζεται με τον [[Godfather]] για τον καλύτερο στόχο.

## Related Links

- [[Night Phase#Special Town Actions]]
- [[Day Phase#Public Discussion]]
- [[Godfather]]

## UI/UX Impact

- Ο σιγασμένος παίκτης βλέπει ένα **muted icon** δίπλα στο username του.
- Αν ο **ανθρώπινος παίκτης** σιγαστεί, το chat input **disables** για ολόκληρη τη Day Phase — μπορεί μόνο να διαβάζει και να ψηφίζει.
