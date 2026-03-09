---
tags:
  - role
  - role/town
  - tier/advanced
  - game_design
  - night_action
  - investigation
---

# Tracker (Town)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Town]]                       |
| **Night Action** | Track                            |
| **Appears as** | Town (to [[Sheriff]])              |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🔵 **ADVANCED** — Εμφανίζεται σε 12+ παίκτες              |
| **Min Players**      | 12                                                         |
| **Scaling**          | Πάντα ακριβώς 1 Tracker — δεν κλιμακώνεται                 |
| **Unique?**          | ✅ Ναι — μόνο 1 ανά παιχνίδι                                |

### Why Advanced

Ο Tracker είναι η **αντίστροφη πλευρά του [[Lookout]]**. Ενώ ο Lookout βλέπει **ποιος πάει σε κάποιον**, ο Tracker βλέπει **πού πάει κάποιος**. Μαζί, δίνουν πλήρη εικόνα νυχτερινής κίνησης. Σε 12+ παίκτες, το πλήθος ρόλων κάνει αυτή την πληροφορία κρίσιμη.

### Tracker vs Lookout

| Aspect             | Lookout                               | Tracker                              |
| ------------------- | ------------------------------------- | ------------------------------------ |
| **Ερώτηση**         | "Ποιος επισκέφτηκε τον Player X;"     | "Πού πήγε ο Player X;"              |
| **Input**           | Επιλέγει **στόχο** (ποιον παρακολουθεί)| Επιλέγει **ύποπτο** (ποιον ακολουθεί)|
| **Output**          | Λίστα επισκεπτών                      | Ο στόχος του ύποπτου (ή "δεν πήγε πουθενά") |
| **Best for**        | Confirming role claims                 | Catching killers red-handed          |

## Overview

Ο Tracker επιλέγει κάθε νύχτα **έναν παίκτη** και μαθαίνει **ποιον επισκέφτηκε** εκείνη τη νύχτα. Αν ο παίκτης δεν έκανε κάποια νυχτερινή ενέργεια, ο Tracker λαμβάνει "Δεν πήγε πουθενά".

### Τι Αποκαλύπτει

- **Mafia member tracking:** Αν ο Tracker ακολουθήσει Mafia μέλος → βλέπει ότι πήγε στο θύμα → **αποδεικτικό στοιχείο**.
- **Framer detection:** Αν ο Tracker δει ότι ένας παίκτης πήγε σε αθώο → μπορεί να είναι Framer.
- **Role verification:** Αν κάποιος δηλώνει Doctor → Tracker τον ακολουθεί → πήγε στον σωστό παίκτη;

### Τι ΔΕΝ Αποκαλύπτει

- Δεν μαθαίνει **τι** έκανε ο στόχος — μόνο πού πήγε.
- Δεν βλέπει **Mafia Chat** — μόνο physical visits.

## Night Action: Track

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Target**      | 1 ζωντανός παίκτης                                                  |
| **Effect**      | Μαθαίνει ποιον επισκέφτηκε ο στόχος (ή "δεν πήγε πουθενά")         |
| **Self-target** | ❌ Δεν μπορεί                                                       |

### Resolution

```
Tracker tracks Player X:
  → Player X visited Player Y? → Tracker sees "Player X → Player Y"
  → Player X stayed home?     → Tracker sees "Player X → (κανένας)"
```

**Framer interaction:** Ο Tracker βλέπει ότι ο Framer **πήγε κάπου** — αλλά δεν ξέρει ότι έκανε frame. Πρέπει να συνδυάσει με άλλα στοιχεία.

### Lovers Visit Interaction

Αν ο Tracker ακολουθεί έναν [[Lovers|Lover]], μπορεί να δει ότι πήγε στο σπίτι του partner του:

```
Tracker tracks Lover B:
  → If Lover B visited Lover A this night:
     Tracker sees: "Player [Lover B] → Player [Lover A]"
  → If Lover A visited Lover B instead:
     Tracker sees: "Player [Lover B] → (κανένας)" (δεν πήγε πουθενά)
```

> **Σημείωση:** Αυτή η πληροφορία, σε συνδυασμό με τον [[Lookout]], μπορεί να αποκαλύψει τη σχέση των Lovers.

## Strategy Notes

- **Track suspects:** Αν κάποιος φαίνεται suspicious κατά τη Day Phase, ο Tracker μπορεί να τον ακολουθήσει τη νύχτα.
- **Catch the killer:** Αν ο Tracker ακολουθήσει τον killer και κάποιος πεθάνει → ο Tracker ξέρει ποιος ήταν.
- **Cross-reference with Lookout:** Lookout βλέπει ποιος πήγε στο θύμα + Tracker βλέπει πού πήγε ο ύποπτος = **double confirmation**.
- **Lovers detection:** Αν ακολουθήσει Lover → μπορεί να δει την αυτόματη επίσκεψη στον partner.

## AI Behavior (Virtual Player)

- **Target selection:** Βασίζεται στο [[Data Architecture#memory.json|memory.json]]:
  - Παίκτες με αυξημένο **suspicion score** αλλά όχι αρκετό evidence.
  - Παίκτες που δεν έχουν κάνει role claim — ο Tracker μπορεί να επαληθεύσει.
- **Information sharing:** Ο AI Tracker μοιράζεται info **μετά 1–2 νύχτες** — δεν αποκαλύπτει αμέσως (αποφεύγει να γίνει στόχος).
- **[[AI Decision Engine#Speak Probability|speak probability]]:** Moderate-high — ο Tracker έχει hard evidence.

## Related Links

- [[Night Phase#Investigation Phase]]
- [[Lookout]] (complementary info role)
- [[Win Conditions#Town Victory]]
- [[Lovers]] (can detect Lover visits)
