---
tags:
  - role
  - role/town
  - tier/advanced
  - game_design
  - information
---

# Gossip (Town)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Town]]                       |
| **Night Action** | Receive Clue (Passive)           |
| **Appears as** | Town (to [[Sheriff]])              |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🔵 **ADVANCED** — Εμφανίζεται σε 10+ παίκτες              |
| **Min Players**      | 10                                                         |
| **Scaling**          | Πάντα ακριβώς 1 Gossip — δεν κλιμακώνεται                   |
| **Unique?**          | ✅ Ναι — μόνο 1 ανά παιχνίδι                                |

### Why Advanced

Ο Gossip παρέχει **ασαφή** αλλά **αληθή** πληροφορία. Σε μικρά παιχνίδια (7–9) δεν χρειάζεται — ο Sheriff και ο Lookout αρκούν. Σε μεγαλύτερα παιχνίδια (10+), η πρόσθετη info layer βοηθάει το Town να μην χαθεί στο πλήθος παικτών.

### Synergy Matrix

| Role Combo            | Effect                                                   |
| --------------------- | -------------------------------------------------------- |
| Gossip + Sheriff      | Gossip hint → Sheriff confirms/denies στοχευμένα          |
| Gossip + Lookout      | Cross-reference visit data + hint → strong conclusion    |
| Gossip + Tracker      | Tracker tracks suspect → Gossip validates direction       |

## Overview

Ο Gossip λαμβάνει ένα **κρυπτογραφημένο / κρυπτικό hint** κάθε νύχτα σχετικά με τη νυχτερινή δραστηριότητα ενός παίκτη. Αυτό γίνεται αυτόματα (passive action) — δεν επιλέγει στόχο. Ο Gossip πρέπει να ερμηνεύσει σωστά τα hints για να βοηθήσει το Town.

## Night Action: Receive Clue

| Parameter       | Value                                                            |
| --------------- | ---------------------------------------------------------------- |
| **Target**      | Αυτόματο — τυχαία επιλογή από τον Game Engine                    |
| **Result**      | Ένα κρυπτικό μήνυμα σχετικά με τη νυχτερινή ενέργεια ενός παίκτη |
| **Ακρίβεια**    | Πάντα αληθές, αλλά ασαφές                                        |

### Παραδείγματα Clues

| Πραγματικό γεγονός                        | Clue που λαμβάνει ο Gossip                     |
| ------------------------------------------ | ---------------------------------------------- |
| Ο Sheriff ερεύνησε τον Player C            | _"Someone was curious about Player C tonight"_ |
| Η Mafia σκότωσε τον Player D              | _"Player D had an unwelcome visitor"_          |
| Ο Doctor προστάτεψε τον Player B           | _"Someone watched over Player B"_              |
| Ο Framer στόχευσε τον Player A             | _"Player A was touched by shadow"_             |

## Strategy Notes

- Τα hints δεν αποδεικνύουν κάτι μόνα τους, αλλά σε **συνδυασμό** με πληροφορίες από [[Lookout]] ή [[Sheriff]] μπορούν να δώσουν ισχυρά συμπεράσματα.
- Ο Gossip πρέπει να είναι προσεκτικός στο πότε μοιράζεται πληροφορίες — η Μαφία μπορεί να τον στοχοποιήσει.
- **Unreliable narrator risk:** Ο ρόλος μπορεί να χρησιμοποιηθεί ως **fake claim** από τη Μαφία, αφού τα hints είναι ασαφή.

## AI Behavior (Virtual Player)

- Τα clues αποθηκεύονται στο **[[Data Architecture#memory.json|memory.json]]** ως `gossip_hints`.
- Ένα "Smart/Deep" AI θα προσπαθήσει να **cross-reference** τα hints με άλλα events στο μέλλον (π.χ. αν ο Player C πεθάνει και υπήρχε hint γι' αυτόν).
- Ένα "Superficial" AI μπορεί να αγνοήσει asaph hints ή να κάνει λανθασμένα συμπεράσματα.

## Related Links

- [[Night Phase#Special Town Actions]]
- [[Dynamic Events]]
- [[AI Decision Engine#Perception Depth]]
