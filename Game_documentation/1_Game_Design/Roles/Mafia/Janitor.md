---
tags:
  - role
  - role/mafia
  - tier/expanded
  - game_design
  - night_action
  - information
---

# Janitor (Mafia)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Mafia]]                      |
| **Night Action** | Investigate Dead (Learn Role)    |
| **Appears as** | Mafia (to [[Sheriff]])             |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟣 **EXPANDED** — Εμφανίζεται σε 14+ παίκτες              |
| **Min Players**      | 14                                                         |
| **Scaling**          | Πάντα ακριβώς 1 Janitor — δεν κλιμακώνεται                 |
| **Unique?**          | ✅ Ναι — μόνο 1 ανά παιχνίδι                                |

### Why Expanded

Ο Janitor εκμεταλλεύεται το γεγονός ότι **οι ρόλοι των νεκρών δεν αποκαλύπτονται ποτέ**. Σε ένα παιχνίδι όπου κανείς δεν ξέρει τι ρόλο είχε ένας νεκρός, ο Janitor είναι ο **μοναδικός** που μπορεί να ανακαλύψει αυτή την πληροφορία. Σε πολύ μεγάλα παιχνίδια (14+), αυτή η πληροφορία γίνεται **κρίσιμη** για τη στρατηγική της Mafia.

### Fundamental Game Mechanic: No Role Reveal on Death

> ⚠️ **ΚΡΙΣΙΜΟ:** Σε αυτό το παιχνίδι, ο ρόλος ενός παίκτη που πεθαίνει **ΔΕΝ αποκαλύπτεται ποτέ δημόσια** — ούτε στη νύχτα, ούτε στο lynch. Το Morning Report αναφέρει μόνο **ποιος πέθανε**, όχι τι ρόλο είχε. Αυτό ισχύει για ΟΛΟΥΣ τους θανάτους (Mafia kill, lynch, Bodyguard sacrifice, linked death).

Αυτό σημαίνει:
- **Κανένα role counting:** Κανείς δεν μπορεί να ξέρει "πόσοι Mafia έχουν μείνει" βάσει νεκρών ρόλων.
- **Κανένα deduction:** "Ο Doctor πέθανε, άρα δεν υπάρχει protection" — κανείς δεν ξέρει αν αυτό ισχύει.
- **Κανένα verification:** Δεν μπορείς να αποδείξεις ότι κάποιος ψεύτηκε βάσει νεκρού ρόλου.
- **Ο Janitor** είναι ο μόνος που μπορεί να **σπάσει** αυτό το σκοτάδι — αποκτώντας γνώση που κανείς άλλος δεν έχει.

## Overview

Ο Janitor μπορεί να **μάθει τον ρόλο** οποιουδήποτε νεκρού παίκτη. Κάθε νύχτα μπορεί να επιλέξει να ερευνήσει ένα πτώμα, και μαθαίνει τον ακριβή ρόλο του. Αυτή η πληροφορία μοιράζεται στο [[Night Phase#Mafia Chat|Mafia Chat]] — δίνοντας στη Mafia στρατηγικό πλεονέκτημα.

### Key Mechanics

- **Learns roles of the dead:** Ο Janitor μαθαίνει τον ρόλο ενός νεκρού παίκτη κάθε νύχτα.
- **Unlimited uses:** Δεν έχει περιορισμό χρήσεων — μπορεί να ερευνά κάθε νύχτα.
- **Any dead player:** Μπορεί να ερευνήσει οποιονδήποτε νεκρό — νυχτερινό θύμα, lynch θύμα, Bodyguard θυσία.
- **Exclusive information:** Κανείς άλλος δεν μπορεί να μάθει ρόλους νεκρών.

## Night Action: Investigate Dead

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Target**      | 1 νεκρός παίκτης                                                    |
| **Effect**      | Ο Janitor μαθαίνει τον ακριβή ρόλο του νεκρού                      |
| **Uses**        | Απεριόριστες                                                        |
| **Condition**   | Πρέπει να υπάρχει τουλάχιστον 1 νεκρός παίκτης                     |
| **Information** | Ρόλος + Alignment (π.χ. "Sheriff — Town")                           |

### Resolution Logic

```
Janitor selects dead Player X:
  → Janitor learns: Player X was [Role] ([Alignment])
  → Information shared in Mafia Chat
  → Nobody else learns this information
```

### Example Night Results

**Janitor αποτέλεσμα:**
> "Ερεύνησες τον νεκρό Player X. Ήταν **Sheriff (Town)**."

**Mafia Chat update:**
> "💀 Ο Janitor ανακάλυψε: Ο Player X ήταν Sheriff."

**Morning Report (τι βλέπουν ΟΛΟΙ):**
> "Ο Player X βρέθηκε νεκρός."
> _(Κανένα role reveal — μόνο ο Janitor ξέρει)_

## Strategy Notes

- **Confirm kills:** Αν η Mafia σκοτώσει κάποιον υποπτεύοντας ότι είναι Sheriff → ο Janitor μπορεί να **επιβεβαιώσει** αν σκότωσαν τον σωστό.
- **Fake claims:** Αν ο Janitor μάθει ότι ο Doctor πέθανε, ένας Mafia member μπορεί να κάνει **fake claim Doctor** — κανείς δεν μπορεί να αποδείξει ότι ο Doctor πέθανε.
- **Strategic intelligence:** "Ο Sheriff πέθανε → δεν υπάρχει πλέον investigation" — αυτό ξέρει μόνο η Mafia, χάρη στον Janitor.
- **Counter active claims:** Αν κάποιος Town member δηλώνει ρόλο που ο Janitor ξέρει ότι πέθανε → η Mafia ξέρει ότι λέει αλήθεια ή ψέματα.
- **Prioritize key roles:** Ερευνήστε πρώτα τους νεκρούς που η Mafia **υποπτεύεται** ότι ήταν key roles (Sheriff, Doctor, Bodyguard).

## AI Behavior (Virtual Player)

- **Investigation priority:** Ο AI Janitor ερευνά:
  - Νεκρούς που η Mafia στόχευσε → επιβεβαίωση kill target
  - Lynch θύματα → μαθαίνει αν ήταν Mafia ή Town
  - Παλαιότερους νεκρούς που δεν έχουν ερευνηθεί
- **Information sharing:** Στο [[Night Phase#Mafia Chat|Mafia Chat]], ο Janitor αναφέρει **αμέσως** τον ρόλο που ανακάλυψε.
- **Fake claim coordination:** Αν ο Janitor μάθει ρόλο → ενημερώνει τη Mafia ποιοι ρόλοι είναι "ελεύθεροι" για fake claims.
- **[[AI Decision Engine#Speak Probability|speak probability]]:** Low — ο Janitor κρατά χαμηλό profile στο Day Phase.
- **Deception support:** Βοηθά τη Mafia να κατασκευάσει αξιόπιστα narratives βασισμένα σε πραγματικά δεδομένα.

## Related Links

- [[Night Phase#Resolution]]
- [[Day Phase#Morning Report]]
- [[Win Conditions#Mafia Victory]]
- [[Godfather]] (coordinates intelligence use)
- [[Consigliere]] (complementary info — alive vs dead players)
