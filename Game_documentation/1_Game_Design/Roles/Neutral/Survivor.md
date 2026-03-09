---
tags:
  - role
  - role/neutral
  - tier/important
  - game_design
  - night_action
  - protection
---

# Survivor (Neutral)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[Neutral]]                        |
| **Night Action** | Vest (Self-Protect)              |
| **Win Condition** | Stay alive until game ends       |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟡 **IMPORTANT** — Εμφανίζεται σε 9+ παίκτες              |
| **Min Players**      | 9                                                          |
| **Scaling**          | Πάντα ακριβώς 1 Survivor — δεν κλιμακώνεται                |
| **Unique?**          | ✅ Ναι — μόνο 1 ανά παιχνίδι                                |

### Why Important

Ο Survivor προσθέτει **αβεβαιότητα στο late-game**: είναι ο παίκτης που δεν ανήκει πουθενά και μπορεί να γίνει **swing vote** στις τελευταίες μέρες. Αυτό αναγκάζει και τις δύο ομάδες να τον **διαπραγματευτούν** (έμμεσα, μέσω συμπεριφοράς).

### When NOT Present (7–8 players)

Σε μικρά παιχνίδια, το Neutral slot καλύπτεται μόνο από τον Jester. Ο Survivor προστίθεται στους 9 ως δεύτερο Neutral που προσθέτει τον "wild card" παράγοντα.

## Overview

Ο Survivor δεν ανήκει ούτε στο [[The Town|Town]] ούτε στη [[The Mafia|Mafia]]. Ο μοναδικός του στόχος είναι να **επιβιώσει** μέχρι το τέλος του παιχνιδιού, ανεξάρτητα από ποια ομάδα κερδίζει. Διαθέτει **αλεξίσφαιρα γιλέκα** που μπορεί να χρησιμοποιήσει για να προστατεύσει τον εαυτό του.

## Night Action: Vest

| Parameter       | Value                                                     |
| --------------- | --------------------------------------------------------- |
| **Target**      | Εαυτός μόνο (Self)                                         |
| **Effect**      | Προστασία από Mafia kill για μία νύχτα                      |
| **Uses**        | Περιορισμένος αριθμός (π.χ. 2–3 γιλέκα ανά παιχνίδι)       |
| **Does NOT block** | Day phase lynch (ψηφοφορία)                            |

### Limitations

- Τα γιλέκα **δεν σώζουν** από lynch — μόνο από νυχτερινή δολοφονία.
- Ο αριθμός γιλέκων είναι **πεπερασμένος**: ο Survivor πρέπει να τα χρησιμοποιήσει στρατηγικά.
- Ο Survivor **δεν εμφανίζεται σε κάποια κατηγορία** στην έρευνα του [[Sheriff]] — εμφανίζεται ως "Town".

## Strategy Notes

- **Stay under the radar:** Ο Survivor πρέπει να αποφεύγει τόσο τις κατηγορίες (που οδηγούν σε lynch) όσο και τη στοχοποίηση τη νύχτα.
- **Role claim risk:** Αν δηλώσει Survivor, το Town μπορεί να τον ψηφίσει γιατί δεν είναι "σύμμαχός" τους, και η Mafia μπορεί να τον αγνοήσει ή να τον χρησιμοποιήσει.
- **Late game danger:** Στα τελευταία rounds, αν απομένουν λίγοι παίκτες, ο Survivor μπορεί να γίνει **swing vote** — εδώ η ταυτότητά του γίνεται κρίσιμη.

## AI Behavior (Virtual Player)

- Η AI στρατηγική εστιάζει στη **μη-έκθεση**: χαμηλό profile στο chat, αποφυγή κατηγοριών.
- Η **[[AI Decision Engine#Speak Probability|speak probability]]** τείνει να είναι χαμηλότερη — εκτός αν κατηγορηθεί (τότε αμύνεται κανονικά).
- Η χρήση γιλέκων βασίζεται σε **[[Memory System#Time Decay|memory analysis]]**: αν η Μαφία φαίνεται να στοχεύει τον Survivor, ενεργοποιεί vest.

## Related Links

- [[Win Conditions]]
- [[Night Phase]]
- [[Day Phase#The Trial & Vote]]

## Win Condition

- Ο Survivor **κερδίζει** αν είναι ζωντανός όταν τελειώσει το παιχνίδι (είτε νικήσει το Town, είτε η Mafia).
- **Δεν αντιτίθεται** σε κανέναν — μπορεί να "κερδίσει μαζί" με οποιαδήποτε ομάδα.
- **ΔΕΝ κερδίζει** αν πεθάνει κατά τη νύχτα ή αν ψηφιστεί κατά τη μέρα.
