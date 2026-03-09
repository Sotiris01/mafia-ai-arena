---
tags:
  - role
  - role/neutral
  - tier/core
  - game_design
  - deception
---

# Jester (Neutral)
---

| Property       | Value                                         |
| -------------- | --------------------------------------------- |
| **Alignment**  | [[Neutral]]                                    |
| **Night Action** | None                                         |
| **Appears as** | Town (to [[Sheriff]])                          |
| **Win Condition** | [[Win Conditions#Jester Victory|Get lynched during Day]] |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟢 **CORE** — Πάντα παρών                                 |
| **Min Players**      | 7 (πάντα 1)                                                |
| **Scaling**          | Πάντα ακριβώς 1 Jester — δεν κλιμακώνεται                  |
| **Unique?**          | ✅ Ναι — μόνο 1 ανά παιχνίδι                                |

### Why Core

Ο Jester είναι **απαραίτητος** για το game balance — δημιουργεί το "lynch penalty" που αποτρέπει το Town από **τυφλές ψηφοφορίες**. Χωρίς Jester, το Town θα ψήφιζε ελεύθερα όποιον φαίνεται έστω και λίγο ύποπτος. Ο Jester **αναγκάζει προσεκτική σκέψη** πριν από κάθε vote.

### Meta-Game Contribution

- **Town:** Πρέπει να είναι **σίγουρο** πριν ψηφίσει → αυξάνει τη σημασία του investigation.
- **Mafia:** Μπορεί να εκμεταλλευτεί τον Jester → υποστηρίζοντας την ψηφοφορία του.
- **Neutral check:** Ο Sheriff βλέπει τον Jester ως "Town" → δεν τον αποκαλύπτει.

## Overview

Ο Jester είναι ο πιο **χαοτικός** ρόλος στο παιχνίδι. Ο στόχος του είναι να **τον ψηφίσουν για εξόντωση** κατά τη [[Day Phase#The Trial & Vote|Trial]]. Αν το καταφέρει, **κερδίζει αμέσως** — το παιχνίδι τελειώνει και μόνο ο Jester νικάει. Κανένας άλλος — ούτε Town, ούτε Mafia.

## Strategy Notes

### As Jester (Playing the Role)

- **Acting suspicious:** Ο Jester πρέπει να φαίνεται ύποπτος χωρίς να φαίνεται "τελείως Mafia" — αν οι παίκτες υποψιαστούν Jester, δεν θα τον ψηφίσουν.
- **Subtle mistakes:** Κάνε μικρές αντιφάσεις, ψήφισε "λάθος" άτομα, κάνε ψεύτικα claims.
- **Don't overdo it:** Μια υπερβολικά ύποπτη συμπεριφορά μπορεί να δημιουργήσει αμφιβολίες ("Μήπως είναι Jester;").
- **Timing:** Η καλύτερη στιγμή είναι mid-game, όταν οι παίκτες αρχίζουν να ψάχνουν Mafia ενεργά.

### Against Jester (Other Players)

- **Πριν ψηφίσετε**, σκεφτείτε: "Μήπως αυτός **θέλει** να ψηφιστεί;"
- Αν κάποιος φαίνεται **υπερβολικά ύποπτος** χωρίς λόγο → πιθανός Jester.
- Η Mafia μπορεί να **εκμεταλλευτεί** τον Jester — αν κατηγορήσει Town μέλη, η Mafia μπορεί να τον αφήσει.

## AI Behavior (Virtual Player)

- Ο AI Jester χρησιμοποιεί **ειδική στρατηγική** αντί για κανονικό Mafia/Town behavior:
  - **[[AI Decision Engine#Speak Probability|speak probability]]** αυξημένη σε moderate levels — αρκετά για να τραβήξει προσοχή.
  - **Deliberate contradictions:** Μπορεί να κατηγορήσει κάποιον και μετά να τον υπερασπιστεί — δημιουργώντας confusion.
  - **Fake role claims:** Μπορεί να δηλώσει [[Sheriff]] με ψεύτικα αποτελέσματα.
- Η **[[Data Architecture#personality.json|personality]]** του Jester AI τείνει σε "Charismatic" ή "Aggressive" για maximum exposure.
- Στο **[[Data Architecture#memory.json|memory.json]]** κρατάει track ποιοι τον υποπτεύονται — αυτοί είναι οι στόχοι του (θέλει να τους πείσει να τον ψηφίσουν).

## Related Links

- [[Win Conditions#Jester Victory]]
- [[Day Phase#The Trial & Vote]]
- [[Dynamic Events]] (μπορεί να εκμεταλλευτεί events)
- [[Survivor]] (fellow Neutral, different goal)

## Win Condition: Get Lynched

| Condition                                     | Result                          |
| --------------------------------------------- | ------------------------------- |
| Ψηφίζεται κατά τη Day Phase                    | **JESTER WINS** — Game Over     |
| Σκοτώνεται τη νύχτα από Mafia                   | Jester **χάνει** (αποτυχία)     |
| Επιβιώνει μέχρι το τέλος                         | Jester **χάνει** (αποτυχία)     |

### Game Ending Effect

Η νίκη του Jester **τερματίζει αμέσως** το παιχνίδι:
- Το Town δεν κερδίζει, ακόμα κι αν εξόντωσαν Mafia.
- Η Mafia δεν κερδίζει, ακόμα κι αν ήταν κοντά στη πλειοψηφία.
- **Μόνο ο Jester κερδίζει.**
