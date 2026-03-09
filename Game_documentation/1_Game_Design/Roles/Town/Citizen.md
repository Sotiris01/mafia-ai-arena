---
tags:
  - role
  - role/town
  - tier/core
  - game_design
---

# Citizen (Town)
---

| Property       | Value                        |
| -------------- | ---------------------------- |
| **Alignment**  | [[The Town]]                 |
| **Night Action** | None                       |
| **Appears as** | Town (to [[Sheriff]])        |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟢 **CORE** — Πάντα παρών                                 |
| **Min Players**      | 7 (πάντα υπάρχει τουλάχιστον 1)                            |
| **Scaling**          | Γεμίζει τα κενά Town slots — αυξάνεται με τους παίκτες     |
| **Unique?**          | ❌ Όχι — μπορεί να υπάρχουν πολλαπλοί Citizens              |

### Why Core

Ο Citizen είναι το **"filler" role** του Town. Κάθε slot που δεν καλύπτεται από ειδικό ρόλο γίνεται Citizen. Χωρίς Citizens, η ψηφοφορία χάνει τη βάση της — ο αριθμός τους κρατάει τη Mafia σε μειοψηφία.

### Instances by Player Count

| Total Players | Citizens |
| ------------- | -------- |
| 7             | 2        |
| 10            | 2        |
| 12            | 2–3      |
| 15            | 2–3      |

## Overview

Ο Citizen είναι ο βασικός ρόλος της πόλης. Δεν διαθέτει καμία ειδική νυχτερινή δύναμη. Η δύναμή του βρίσκεται αποκλειστικά στη **φωνή** του στο [[Day Phase|Public Chat]] και στην **ψήφο** του κατά τη [[Day Phase#The Trial & Vote|Trial]].

## Abilities

- **Ψήφος:** Μπορεί να ψηφίσει κατά τη διάρκεια του [[Day Phase#The Trial & Vote|Trial]] για την εξόντωση ενός παίκτη.
- **Συζήτηση:** Μπορεί να χρησιμοποιήσει το [[Day Phase#Public Discussion|Public Chat]] για να κατηγορήσει, να υπερασπιστεί ή να σχηματίσει συμμαχίες.
- **Καμία νυχτερινή ενέργεια.**

## Strategy Notes

- Ο Citizen βασίζεται στην παρατήρηση και τη λογική για να εντοπίσει τη Μαφία.
- Μπορεί να κάνει **role claim** (να δηλώσει τον ρόλο του) ως τακτική — αν και αυτό σπάνια βοηθάει, αφού δεν υπάρχει τρόπος να αποδειχθεί.
- Η κύρια αξία του είναι ο **αριθμός**: κάθε Citizen που μένει ζωντανός κρατά τη Μαφία σε μειοψηφία.

## AI Behavior (Virtual Player)

Η συμπεριφορά ενός AI Citizen εξαρτάται αποκλειστικά από:
- **[[Data Architecture#personality.json|personality.json]]** → Καθορίζει πόσο μιλάει, πόσο παρασύρεται, πόσο λογικός είναι.
- **[[Memory System#Perception Depth|Perception Depth]]** → Ένας "Superficial" Citizen παρασύρεται εύκολα. Ένας "Smart" μπορεί να εντοπίσει μοτίβα.

## Related Links

- [[Win Conditions#Town Victory]]
- [[Day Phase]]
- [[AI Decision Engine#Speak Probability]]
