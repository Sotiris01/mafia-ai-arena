---
tags:
  - role
  - role/town
  - tier/core
  - game_design
  - night_action
  - protection
---

# Doctor (Town)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Town]]                       |
| **Night Action** | Protect                          |
| **Appears as** | Town (to [[Sheriff]])              |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟢 **CORE** — Πάντα παρών                                 |
| **Min Players**      | 7 (πάντα 1)                                                |
| **Scaling**          | Πάντα ακριβώς 1 Doctor — δεν κλιμακώνεται                  |
| **Unique?**          | ✅ Ναι — μόνο 1 ανά παιχνίδι                                |

### Why Core

Ο Doctor είναι ο **μοναδικός τρόπος** που το Town μπορεί να αποτρέψει νυχτερινούς θανάτους. Χωρίς Doctor, η Mafia σκοτώνει 1 παίκτη κάθε νύχτα χωρίς αντίμετρο — το παιχνίδι τελειώνει πολύ γρήγορα.

### Synergy

- **Sheriff + Doctor:** Αν ο Sheriff αποκαλυφθεί, ο Doctor πρέπει να τον προστατεύει → η Mafia πρέπει να σκοτώσει τον Doctor πρώτα.
- **Bodyguard vs Doctor:** Ο [[Bodyguard]] (αν υπάρχει) συμπληρώνει τον Doctor — αλλά θυσιάζεται.

## Overview

Ο Doctor είναι ο κύριος **αμυντικός ρόλος** του Town. Κάθε νύχτα επιλέγει έναν παίκτη για να τον προστατεύσει. Αν η [[The Mafia]] επιτεθεί στον προστατευμένο παίκτη, αυτός **επιβιώνει** και δεν ανακοινώνεται θάνατος στο [[Day Phase#Morning Report|Morning Report]].

## Night Action: Protect / Cure

| Parameter       | Value                                                     |
| --------------- | --------------------------------------------------------- |
| **Target**      | 1 ζωντανός παίκτης (συμπεριλαμβανομένου εαυτού)            |
| **Effect**      | **Protect:** Αποτρέπει θάνατο από Mafia kill               |
|                 | **Cure:** Θεραπεύει zombie θύμα → επαναφορά σε κανονική κατάσταση |
| **Duration**    | 1 νύχτα μόνο (protect) / Μόνιμο (cure)                     |
| **Self-protect**| Επιτρέπεται (αλλά μόνο 1 φορά ανά παιχνίδι)               |
| **Choice**      | Κάθε νύχτα: **Protect** κάποιον ΄Η **Cure** zombie (δεν γίνεται και τα δύο) |

### Protect Resolution

```
1. Mafia selects target → Kill queued
2. Doctor selects same target → Protection active
3. Resolution: Kill canceled → "Nobody died tonight"
```

### Cure Resolution (Zombie)

```
1. Doctor selects zombie victim → Cure active
2. Resolution: Victim returns to normal
   → Night action restored
   → Chat limit removed
   → Voting rights restored
   → Morning Report: "Player Y looks much better today! 💊"
```

> ⚠️ **Στρατηγικό δίλημμα:** Αν ο Doctor cure-άρει zombie, **δεν προστατεύει** κανέναν από Mafia kill εκείνη τη νύχτα. Αυτό δημιουργεί tension μεταξύ immediate survival (protect) και long-term threat (zombie spreading).

### What Protection DOES NOT Block

- [[Day Phase#The Trial & Vote|Day phase lynch]] (ψηφοφορία)
- [[Dynamic Events#The Full Moon|Full Moon]] double kill (μπορεί να σωθεί μόνο 1 στόχος, εκτός αν Full Moon — τότε 2)

## Strategy Notes

- **Protect high-value targets:** Αν ο [[Sheriff]] αποκαλυφθεί, ο Doctor πρέπει να τον προστατεύει κάθε νύχτα.
- **Self-protect timing:** Χρησιμοποίησε self-protect μόνο αν υποπτεύεσαι ότι η Mafia θα σε στοχεύσει.
- **Don't reveal:** Ο Doctor δεν πρέπει να αποκαλύψει τον ρόλο του — αν η Mafia μάθει, θα τον εξοντώσει για να αφαιρέσει τη δυνατότητα protection.
- **Counter [[Lookout]]:** Ο Lookout μπορεί να δει τον Doctor να επισκέπτεται κάποιον — μπορεί να χρησιμοποιηθεί ως επιβεβαίωση role claim.

## AI Behavior (Virtual Player)

- Ο AI Doctor χρησιμοποιεί το **[[Data Architecture#memory.json|memory.json]]** για επιλογή στόχου:
  - Υψηλό trust score → πιο πιθανό να προστατεύσει.
  - Παίκτες που κατηγορούν τη Mafia → πιθανοί στόχοι νυχτερινής δολοφονίας → protect.
  - Known Sheriff (αν υπάρχει claim) → **υψηλή προτεραιότητα protection**.
  - **Zombie cure priority:** Αν υπάρχουν zombie θύματα → cure αξιολογείται ανάλογα:
    - Zombie victim = key role (Sheriff/Bodyguard) → **CURE** (υψηλή)
    - Πολλά zombie victims (3+) → **CURE** (zombie threat αυξημένη)
    - Μόνο 1 zombie + Mafia threat ενεργή → **PROTECT** (Mafia kill πιο επείγον)
- Η **[[Data Architecture#personality.json|personality]]** επηρεάζει:
  - Cautious Doctor → Εναλλάσσει στόχους, δεν προστατεύει τον ίδιο 2 φορές.
  - Logical Doctor → Αναλύει ποιος μπορεί να στοχοποιηθεί βάσει Mafia patterns.
  - Paranoid Doctor → Μπορεί να self-protect πιο συχνά.
  - Compassionate Doctor → Προτιμά cure πάνω από protect.

## Related Links

- [[Night Phase#Special Town Actions]]
- [[Win Conditions#Town Victory]]
- [[Sheriff]] (key protection target)
- [[Lookout]] (can confirm Doctor visits)
- [[Zombie]] (Doctor can cure zombie victims)
- [[Mayor]] (can protect Mayor after reveal)
