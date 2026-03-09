---
tags:
  - role
  - role/town
  - tier/expanded
  - game_design
---

# Mayor (Town)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Town]]                       |
| **Night Action** | None (Day-focused role)          |
| **Appears as** | Town (to [[Sheriff]])              |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟣 **EXPANDED** — Εμφανίζεται σε 13+ παίκτες              |
| **Min Players**      | 13                                                         |
| **Scaling**          | Πάντα ακριβώς 1 Mayor — δεν κλιμακώνεται                   |
| **Unique?**          | ✅ Ναι — μόνο 1 ανά παιχνίδι                                |

### Why Expanded

Ο Mayor προσθέτει **πολιτική δυναμική** στη Day Phase. Σε μεγάλα παιχνίδια (13+), οι ψηφοφορίες γίνονται πιο πολύπλοκες και η διπλή ψήφος του Mayor μπορεί να **ανατρέψει** αποτελέσματα. Σε μικρά παιχνίδια, η διπλή ψήφος θα ήταν **υπερβολικά ισχυρή**.

### Balance Tradeoff

Η αποκάλυψη του Mayor δίνει **δύναμη αλλά με ρίσκο**:
- ✅ Αποκτά **2x vote weight** (αντί 1x).
- ✅ Ο [[Doctor]] και ο [[Bodyguard]] **μπορούν** ακόμα να τον προστατεύσουν.
- ❌ Η Mafia ξέρει πλέον ποιος είναι → γίνεται **κύριος στόχος**.
- ⭐ Ο Mayor είναι ο **μόνος ρόλος** που μπορεί να **αποδείξει** ότι ανήκει στο Town.

### The Only Provable Role

Ο Mayor είναι ο **μοναδικός ρόλος** στο παιχνίδι που μπορεί πραγματικά να **αποδείξει** ότι είναι Town. Όλοι οι άλλοι ρόλοι μπορούν μόνο να **δηλώσουν** (role claim) τι είναι — αλλά μπορεί να ψεύδονται. Ο Mayor, μέσω του Reveal mechanic, αποδεικνύεται **αδιαμφισβήτητα** ως Town. Αυτό τον κάνει:
- **Anchor of trust:** Ο μόνος που μπορεί να εμπιστευτεί αληθινά η ομάδα.
- **Rallying point:** Μπορεί να ηγηθεί ψηφοφοριών χωρίς αμφιβολία.
- **High-value target:** Η Mafia θέλει να τον εξοντώσει πριν αποκτήσει πολιτική ισχύ.

## Overview

Ο Mayor είναι ρόλος **εστιασμένος στη Day Phase**. Δεν έχει νυχτερινή ενέργεια. Η δύναμή του βρίσκεται στην **αποκάλυψη**: μπορεί οποτεδήποτε κατά τη Day Phase να δηλώσει "**Reveal as Mayor**", αποκτώντας διπλάσια ψήφο. Είναι ο **μόνος ρόλος** που μπορεί να αποδείξει ότι είναι Town — κάτι που κανείς άλλος δεν μπορεί.

## Day Action: Reveal

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Trigger**     | Εθελοντική αποκάλυψη κατά τη [[Day Phase]]                          |
| **Effect**      | Vote weight γίνεται **×2** (αντί ×1)                                |
| **Permanent**   | ✅ Δεν αναιρείται — ισχύει μέχρι το τέλος                           |
| **Protection**  | ✅ [[Doctor]] & [[Bodyguard]] **μπορούν** ακόμα να τον προστατεύσουν  |
| **Reversible**  | ❌ Μη αναστρέψιμο                                                    |

### Mechanics

```
Πριν Reveal:
  Mayor vote = 1 (κανονικό)
  Mayor alignment = unproven (όπως όλοι)

Μετά Reveal:
  Mayor vote = 2
  Mayor alignment = PROVEN TOWN (μοναδικό)
  Doctor/Bodyguard CAN still heal Mayor
  Mafia → Mayor = priority target
```

### UI Implementation

- **Before reveal:** Ο Mayor εμφανίζεται κανονικά — κανείς δεν ξέρει.
- **After reveal:** 👑 Badge δίπλα στο username + visual indicator ότι η ψήφος μετράει διπλά.
- **Voting display:** Στην ψηφοφορία, η ψήφος του Mayor εμφανίζεται ως "×2".

## Strategy Notes

### Πότε να Reveal

| Timing        | Πότε                                              | Risk     |
| ------------- | ------------------------------------------------- | -------- |
| **Early**     | Day 1–2 — μέγιστο vote control + trust anchor     | 🔴 Υψηλό |
| **Mid-game**  | Όταν χρειάζεται proven Town leader                 | 🟡 Μέτριο |
| **Late-game** | 3–4 παίκτες — η ψήφος κρίνει                      | 🟢 Χαμηλό |
| **Never**     | Αν ο Mayor φοβάται instant death                   | — Σπατάλη |

### Tactical Uses

- **Forced lynch:** Σε 5 ζωντανούς, ο Mayor (2 votes) + 2 σύμμαχοι = 4/5 ψήφους → αυτόματο lynch.
- **Jester check:** Αν ο Mayor ηγείται ψηφοφορίας, πρέπει να σκεφτεί: "Μήπως αυτός είναι Jester;"
- **Trust anchor:** Ο Mayor αποδεικνύει ότι είναι Town → μπορεί να συντονίσει αξιόπιστα.
- **Information war:** Η αποκάλυψη πιέζει τη Mafia να σκοτώσει τον Mayor αντί key roles → χρόνος για Town.

## AI Behavior (Virtual Player)

- **Reveal timing:** Ο AI Mayor χρησιμοποιεί logic tree:
  - Town χρειάζεται proven leader ΚΑΙ 5 ή λιγότεροι ζωντανοί → **Reveal**
  - Mafia μέλος εντοπισμένο αλλά αρκετές ψήφοι δεν υπάρχουν → **Reveal** για εξασφάλιση lynch
  - Αλλιώς → **Wait**
- **[[AI Decision Engine#Speak Probability|speak probability]]:** Variable — πριν αποκαλυφθεί moderate, μετά αποκαλυφθεί **υψηλή** (ηγείται discussion).
- **Voting behavior:** Μετά reveal, ο AI Mayor ψηφίζει **μόνο αν είναι σίγουρος** — διπλή ψήφος σε Jester = μεγάλο ρίσκο.

## Related Links

- [[Day Phase#The Trial & Vote]]
- [[Win Conditions#Town Victory]]
- [[Doctor]] (can heal Mayor after reveal)
- [[Bodyguard]] (can protect Mayor after reveal)
- [[Jester]] (dangerous to lynch with ×2 vote)
