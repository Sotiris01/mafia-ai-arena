---
tags:
  - role
  - role/mafia
  - tier/core
  - game_design
  - night_action
  - killing
---

# Mafia Goon (Mafia)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Mafia]]                      |
| **Night Action** | Kill (Vote)                      |
| **Appears as** | Mafia (to [[Sheriff]])             |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟢 **CORE** — Πάντα παρών                                 |
| **Min Players**      | 7 (πάντα τουλάχιστον 1)                            |
| **Scaling**          | Γεμίζει Mafia slots — 1–2 ανάλογα τους παίκτες          |
| **Unique?**          | ❌ Όχι — μπορεί να υπάρχουν πολλαπλοί Goons               |

### Why Core

Ο Mafia Goon είναι το **"filler" role** της Mafia — αντίστοιχο του Citizen για το Town. Κάθε Mafia slot που δεν καλύπτεται από ειδικό ρόλο (Godfather/Framer/Silencer/Consigliere/Janitor) γίνεται Goon. Η αξία του είναι στον **αριθμό** — κρατάει τη Mafia σε αριθμητικό πλεονέκτημα.

### Instances by Player Count

| Total Players | Goons |
| ------------- | ----- |
| 7             | 1     |
| 10            | 1     |
| 12            | 1–2   |
| 15            | 1–2   |

## Overview

Ο Mafia Goon είναι το βασικό μέλος της Μαφίας. Δεν διαθέτει ειδικές ικανότητες πέρα από τη **συμμετοχή στη νυχτερινή ψηφοφορία** για τον στόχο εξόντωσης. Η δύναμή του βρίσκεται στην **πληροφορία**: γνωρίζει τους συμπαίκτες του και μπορεί να συντονιστεί μαζί τους μέσω του [[Night Phase#Mafia Chat|Mafia Chat]].

## Night Action: Kill Vote

| Parameter       | Value                                                    |
| --------------- | -------------------------------------------------------- |
| **Target**      | Ψήφος στο [[Night Phase#Mafia Chat|Mafia Chat]]          |
| **Resolution**  | Ο παίκτης με τις περισσότερες ψήφους Mafia εξοντώνεται   |
| **Blocked by**  | [[Doctor]] protection                                     |

### Mafia Chat Mechanics

- Όλα τα μέλη της Μαφίας ([[Godfather]], Mafia Goon, [[Framer]], [[Silencer]]) μπαίνουν σε **ιδιωτικό chat** κατά τη [[Night Phase]].
- Συζητούν στρατηγική και ψηφίζουν ποιον θα σκοτώσουν.
- Σε περίπτωση ισοψηφίας, η ψήφος του [[Godfather]] μετράει διπλά.

## Strategy Notes

- Ο Goon πρέπει να **αποφεύγει τις υποψίες** κατά τη [[Day Phase]].
- Μπορεί να κάνει **fake role claim** (π.χ. να δηλώσει [[Citizen]] ή [[Lookout]]).
- Η κύρια αξία του είναι ο **αριθμός** — κάθε ζωντανός Mafia μέλος φέρνει πιο κοντά τη [[Win Conditions#Mafia Victory|Mafia Victory]].

## AI Behavior (Virtual Player)

- Κατά τη [[Day Phase]], η **[[AI Decision Engine#Speak Probability|πιθανότητα ομιλίας]]** μπορεί να μειωθεί βάσει του `role` modifier — η Μαφία προσπαθεί να μην τραβά την προσοχή.
- Στο Mafia Chat, το AI χρησιμοποιεί το **[[Data Architecture#memory.json|memory.json]]** για να προτείνει στόχους (π.χ. παίκτες που εκδηλώνουν υποψίες εναντίον τους ή ρόλοι-απειλές όπως ο [[Sheriff]]).
- Η **[[Data Architecture#personality.json|personality]]** επηρεάζει τη στρατηγική: ένας Aggressive Goon μπορεί να κατηγορήσει τυχαίους για redirecting, ενώ ένας Cautious μπορεί να παραμείνει σιωπηλός.

## Related Links

- [[Night Phase#Mafia Chat]]
- [[Win Conditions#Mafia Victory]]
- [[Godfather]]
