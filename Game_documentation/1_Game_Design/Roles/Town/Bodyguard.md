---
tags:
  - role
  - role/town
  - tier/advanced
  - game_design
  - night_action
  - protection
---

# Bodyguard (Town)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Town]]                       |
| **Night Action** | Protect (Sacrifice)              |
| **Appears as** | Town (to [[Sheriff]])              |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟡 **IMPORTANT** — Εμφανίζεται σε 10+ παίκτες              |
| **Min Players**      | 10                                                         |
| **Scaling**          | Πάντα ακριβώς 1 Bodyguard — δεν κλιμακώνεται               |
| **Unique?**          | ✅ Ναι — μόνο 1 ανά παιχνίδι                                |

### Why Important

Ο Bodyguard συμπληρώνει τον [[Doctor]] ως **δεύτερο defensive role**. Η κρίσιμη διαφορά: ο Doctor σώζει **χωρίς κόστος**, ο Bodyguard σώζει **θυσιάζοντας τον εαυτό του** αλλά **σκοτώνει κι έναν επιτιθέμενο**. Αυτό κάνει τον Bodyguard ιδανικό σε 10+ παίκτες όπου η Mafia έχει περισσότερα μέλη.

### vs Doctor Comparison

| Aspect           | Doctor                        | Bodyguard                         |
| ---------------- | ----------------------------- | --------------------------------- |
| **Σώζει στόχο**   | ✅ Ναι                        | ✅ Ναι                             |
| **Κόστος**        | Κανένα                        | Bodyguard πεθαίνει                 |
| **Counter-attack**| Όχι                          | ✅ Σκοτώνει 1 επιτιθέμενο          |
| **Αυτοθεραπεία** | ❌ Δεν κάνει self-heal         | ❌ Δεν κάνει self-protect          |
| **Επαναχρήσιμος**| ✅ Κάθε νύχτα                  | ❌ Μία φορά (πεθαίνει)             |

## Overview

Ο Bodyguard επιλέγει κάθε νύχτα **έναν παίκτη να προστατεύσει**. Αν εκείνος ο παίκτης στοχοποιηθεί από τη Mafia:
1. Το **kill ακυρώνεται** — ο στόχος σώζεται.
2. Ο **Bodyguard πεθαίνει** αντί του στόχου.
3. **Ένα μέλος της Mafia** (τυχαίο από τα ψηφίσαντα) πεθαίνει επίσης.

Αν ο στόχος **δεν** επιτεθεί, τίποτα δεν συμβαίνει.

## Night Action: Protect (Sacrifice)

| Parameter       | Value                                                                  |
| --------------- | ---------------------------------------------------------------------- |
| **Target**      | 1 ζωντανός παίκτης (όχι εαυτός)                                        |
| **Effect**      | Αν ο στόχος δεχτεί Mafia kill → kill ακυρώνεται, Bodyguard + 1 Mafia πεθαίνουν |
| **Self-target** | ❌ Δεν μπορεί                                                           |
| **Stacking**    | Αν Doctor + Bodyguard στον ίδιο στόχο → Doctor save εφαρμόζεται πρώτα, Bodyguard δεν ενεργοποιείται |
| **Blocked by**  | Τίποτα — η θυσία δεν αποτρέπεται                                       |

### Resolution Logic

```
1. Mafia Kill → Target X
2. Doctor check: Doctor healing X? → Kill canceled (Bodyguard NOT triggered)
3. Bodyguard check: Bodyguard guarding X? → Kill canceled, Bodyguard dies, 1 random Mafia voter dies
4. Neither → Target X dies
```

**Σημαντικό:** Αν **και** Doctor **και** Bodyguard προστατεύουν τον ίδιο, ο Doctor save έχει προτεραιότητα — ο Bodyguard δεν θυσιάζεται.

## Strategy Notes

- **Protect confirmed roles:** Αν ο Sheriff ή Doctor αποκαλυφθεί, ο Bodyguard πρέπει να τον φρουρήσει — η θυσία αξίζει.
- **One-time use:** Μετά την πρώτη θυσία, ο Bodyguard φεύγει. Πρέπει να χρησιμοποιηθεί στη **σωστή στιγμή**.
- **Mind games:** Αν η Mafia ξέρει ότι υπάρχει Bodyguard, μπορεί να αποφεύγει τους πιο φανερούς στόχους.
- **Bluff value:** Ένας Citizen ή Mafia μπορεί να δηλώσει Bodyguard — δύσκολο να το επαληθεύσεις χωρίς επίθεση.

## AI Behavior (Virtual Player)

- **Target selection:** Βασίζεται στο [[Data Architecture#memory.json|memory.json]]:
  - Παίκτες που θεωρούνται **key Town roles** (investigation results, behavioral analysis).
  - Παίκτες που κατηγόρησαν Mafia πρόσφατα (υψηλός κίνδυνος αντίποινων).
- **[[AI Decision Engine#Speak Probability|speak probability]]:** Moderate — ο Bodyguard δεν χρειάζεται να μιλάει πολύ, αλλά δεν κρύβεται σαν Mafia.
- **Role claim strategy:** Ο AI μπορεί να δηλώσει Bodyguard mid-game αν ζητηθεί role claim — αλλά ποτέ proactively (αποφεύγει να γίνει στόχος πριν χρησιμοποιηθεί).

## Related Links

- [[Night Phase#Protection Resolution]]
- [[Doctor]] (complementary protector)
- [[Win Conditions#Town Victory]]
- [[Mafia Goon]] (potential counter-kill target)
