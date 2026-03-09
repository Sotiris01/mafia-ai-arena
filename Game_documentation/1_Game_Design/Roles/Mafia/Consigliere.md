---
tags:
  - role
  - role/mafia
  - tier/expanded
  - game_design
  - night_action
  - investigation
---

# Consigliere (Mafia)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Mafia]]                      |
| **Night Action** | Investigate (Exact Role)         |
| **Appears as** | Mafia (to [[Sheriff]])             |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟣 **EXPANDED** — Εμφανίζεται σε 13+ παίκτες              |
| **Min Players**      | 13                                                         |
| **Scaling**          | Πάντα ακριβώς 1 Consigliere — δεν κλιμακώνεται             |
| **Unique?**          | ✅ Ναι — μόνο 1 ανά παιχνίδι                                |

### Why Expanded

Ο Consigliere είναι ο **"Sheriff της Mafia"** — μαθαίνει τον **ακριβή ρόλο** του στόχου (όχι μόνο alignment). Σε μεγάλα παιχνίδια (13+), η Mafia χρειάζεται πληροφορία για να κάνει **targeted kills** αντί τυχαίων — ο Consigliere τους δίνει αυτή τη στρατηγική ακρίβεια.

### Consigliere vs Sheriff

| Aspect             | Sheriff                       | Consigliere                        |
| ------------------- | ----------------------------- | ---------------------------------- |
| **Alignment**       | Town                          | Mafia                              |
| **Μαθαίνει**        | Alignment (Town/Mafia)        | **Ακριβή ρόλο** (Doctor, Sheriff…) |
| **Fooled by**       | Godfather, Framer             | Τίποτα — βλέπει αληθινό ρόλο      |
| **Uses info for**   | Lynch targets                 | Kill targets                       |

## Overview

Ο Consigliere επιλέγει κάθε νύχτα **έναν παίκτη** και μαθαίνει τον **ακριβή ρόλο** του (π.χ. "Doctor", "Sheriff", "Lookout", "Jester"). Αυτή η πληροφορία μοιράζεται στο [[Night Phase#Mafia Chat|Mafia Chat]] και βοηθά τη Mafia να στοχεύσει τους πιο επικίνδυνους αντιπάλους.

### Τι Αποκαλύπτει

- Ο **ακριβής ρόλος** — όχι μόνο "Town" ή "Mafia".
- **Δεν επηρεάζεται** από Framer — αν ο Consigliere ερευνήσει framed παίκτη, βλέπει τον πραγματικό ρόλο.
- **Βλέπει Neutral ρόλους** — μπορεί να εντοπίσει [[Jester]], [[Survivor]], [[Zombie]], κλπ.

### Τι ΔΕΝ Αποκαλύπτει

- Δεν μαθαίνει **personality** ή **strategy** του στόχου.
- Δεν μαθαίνει αν ο στόχος έχει **χρησιμοποιήσει** την ικανότητά του.

## Night Action: Investigate (Exact Role)

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Target**      | 1 ζωντανός παίκτης (μη-Mafia)                                      |
| **Effect**      | Μαθαίνει τον ακριβή ρόλο του στόχου                                 |
| **Self-target** | ❌ Δεν μπορεί                                                       |
| **Mafia target**| ❌ Δεν μπορεί να ερευνήσει συμπαίκτες (γνωρίζει ήδη)               |
| **Cooldown**    | Δεν μπορεί να ερευνήσει τον ίδιο παίκτη δύο συνεχόμενες νύχτες     |

### Resolution

```
Consigliere investigates Player X:
  → Player X = Doctor  → Consigliere sees "Doctor"
  → Player X = Jester  → Consigliere sees "Jester"
  → Player X = Citizen → Consigliere sees "Citizen"
```

## Strategy Notes

- **Priority targets:** Εντοπίστε τον [[Sheriff]] και [[Doctor]] πρώτα — η εξόντωσή τους αλλάζει δραματικά το παιχνίδι.
- **Jester warning:** Αν ο Consigliere βρει τον [[Jester]], η Mafia πρέπει να τον **αποφεύγει** — μην τον σκοτώνετε πριν εκμεταλλευτείτε τη σύγχυση που δημιουργεί.
- **Info sharing:** Η πληροφορία μοιράζεται στο Mafia Chat — ο [[Godfather]] αποφασίζει τη στρατηγική.
- **Misdirection:** Η Mafia μπορεί να σκοτώνει **μη-key roles** πρώτα για ψευδή ασφάλεια, αφού ξέρει ποιοι είναι οι πραγματικοί στόχοι.

## AI Behavior (Virtual Player)

- **Target selection:** Βασίζεται στο [[Data Architecture#memory.json|memory.json]]:
  - Παίκτες που μιλάνε πολύ (πιθανοί key roles).
  - Παίκτες που δεν έχουν ερευνηθεί ακόμα.
- **Information relay:** Ο AI Consigliere μοιράζεται αμέσως τα αποτελέσματα στο Mafia Chat.
- **Mafia Chat priority:** Αν βρει τον Sheriff → "Σκοτώστε τον αμέσως". Αν βρει Doctor → "Σκοτώστε πριν τον Sheriff".
- **[[AI Decision Engine#Speak Probability|speak probability]]:** Low-Moderate κατά τη Day — αποφεύγει να τραβά προσοχή.

## Related Links

- [[Night Phase#Investigation Phase]]
- [[Sheriff]] (Town counterpart)
- [[Godfather]] (leader, receives intel)
- [[Win Conditions#Mafia Victory]]
