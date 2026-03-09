---
tags:
  - role
  - role/mafia
  - tier/core
  - game_design
  - night_action
  - killing
  - deception
---

# Godfather (Mafia)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Mafia]]                      |
| **Night Action** | Kill Vote (Leader)               |
| **Appears as** | **Town** (to [[Sheriff]]) ⚠️       |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟢 **CORE** — Πάντα παρών                                 |
| **Min Players**      | 7 (πάντα 1)                                                |
| **Scaling**          | Πάντα ακριβώς 1 Godfather — δεν κλιμακώνεται                |
| **Unique?**          | ✅ Ναι — μόνο 1 ανά παιχνίδι                                |

### Why Core

Ο Godfather είναι ο **θεμέλιος λίθος** της Mafia. Η investigation immunity του είναι το κύριο counter στον Sheriff — χωρίς αυτόν, το Town θα investigation-swept τη Mafia σε λίγες νύχτες. Η ηγετική του θέση (διπλή ψήφος σε ισοψηφία) εξασφαλίζει συντονισμό.

### Death Impact

| Godfather Status | Mafia Win Rate |
| ---------------- | -------------- |
| Ζωντανός          | ~50%           |
| Νεκρός            | ~25–30%        |

## Overview

Ο Godfather είναι ο **ηγέτης της Μαφίας**. Έχει δύο μοναδικές ιδιότητες:
1. **Investigation Immunity:** Αν ερευνηθεί από τον [[Sheriff]], εμφανίζεται ψευδώς ως **"Town"** αντί για "Mafia".
2. **Tiebreaker Vote:** Σε ισοψηφία στο [[Night Phase#Mafia Chat|Mafia Chat]], η ψήφος του Godfather μετράει **διπλά**.

## Night Action: Kill Vote (Leader)

| Parameter       | Value                                                    |
| --------------- | -------------------------------------------------------- |
| **Target**      | Ψήφος στο [[Night Phase#Mafia Chat|Mafia Chat]]          |
| **Authority**   | Ψήφος μετράει διπλά σε ισοψηφία                          |
| **Blocked by**  | [[Doctor]] protection                                     |

### Mafia Leadership

- O Godfather **βλέπει** όλα τα μέλη της Μαφίας ([[Mafia Goon]], [[Framer]], [[Silencer]]).
- Στο [[Night Phase#Mafia Chat|Mafia Chat]], ο Godfather μπορεί να **κατευθύνει** τη στρατηγική — ποιον να σκοτώσουν, ποιον να frame, ποιον να σιγάσουν.
- Αν ο Godfather πεθάνει, η Mafia **δεν χάνει** — αλλά χάνει τον **investigation immunity** και τη leadership.

### Investigation Immunity

```
Sheriff investigates Godfather:
  → Normal check: alignment = "Mafia"
  → Godfather override: result = "Town"
  → Sheriff sees: "Town" (false)
```

**Σημασία:** Αυτό κάνει τον Godfather τον **πιο επικίνδυνο** παίκτη, γιατί:
- Μπορεί να κατηγορήσει αθώους χωρίς φόβο αποκάλυψης.
- Μπορεί να κάνει **role claim** ως Town role και ο Sheriff δεν μπορεί να τον διαψεύσει.
- Ο Sheriff μπορεί ακόμα και να τον **υπερασπιστεί** θεωρώντας τον αθώο.

## Strategy Notes

- **Aggressive play:** Ο Godfather μπορεί να κατηγορεί ελεύθερα γιατί δεν κινδυνεύει από investigation.
- **Fake claim:** Μπορεί να δηλώσει [[Sheriff]] ή [[Doctor]] — δύσκολο να αποδειχθεί ψέμα.
- **Protect the Godfather:** Η Mafia πρέπει να κρατά τον Godfather ζωντανό — η investigation immunity είναι κρίσιμη.
- **Late game powerhouse:** Στα τελευταία rounds, ένας ζωντανός Godfather είναι σχεδόν αδύνατο να εκτεθεί.

## AI Behavior (Virtual Player)

- Η **[[AI Decision Engine#Speak Probability|speak probability]]** του Godfather μπορεί να είναι **υψηλότερη** από τα υπόλοιπα Mafia μέλη — ο ρόλος ευνοεί aggressive play.
- Στο Mafia Chat, ο AI Godfather **συντονίζει** τους συμπαίκτες:
  - Προτείνει στόχους βάσει [[Data Architecture#memory.json|memory analysis]].
  - Κατευθύνει τον [[Framer]] να κάνει frame τον πλέον ύποπτο Town member.
  - Συντονίζει τον [[Silencer]] για να σιγάσει απειλές.
- Κατά τη [[Day Phase]], ο Godfather **δεν φοβάται** να μιλήσει ή να κατηγορήσει — αυτό εξυπηρετεί τη στρατηγική.

## Related Links

- [[Night Phase#Mafia Chat]]
- [[Win Conditions#Mafia Victory]]
- [[Sheriff]] (counterpart — can't detect Godfather)
- [[Mafia Goon]], [[Framer]], [[Silencer]] (teammates)
