---
tags:
  - personality
  - perception/smart
  - game_design
---

# Logical

| Property        | Value                                 |
| --------------- | ------------------------------------- |
| **Type**        | Logical                               |
| **Archetype**   | Ο Αναλυτικός                          |
| **Frequency**   | ~18% των AI players                   |
| **Best Roles**  | Sheriff, Consigliere, Lookout         |
| **Worst Roles** | Jester, Zombie                        |
| **Tone**        | Methodical, evidence-based, calm      |

---

## Overview

Ο **Logical** AI είναι η "μηχανή λογικής" του παιχνιδιού. Αποφασίζει **αποκλειστικά** βάσει στοιχείων — δεν επηρεάζεται από συναισθήματα, κατηγορίες χωρίς βάση, ή πίεση πλήθους. Μιλάει moderate, πάντα με νόημα, και ψηφίζει μόνο αν τα δεδομένα δείχνουν σαφή κατεύθυνση.

Είναι ο πιο **consistent** τύπος — η θέση του δεν αλλάζει εύκολα, κάτι που τον κάνει αξιόπιστο σύμμαχο αλλά και **προβλέψιμο** στόχο. Η αδυναμία του: δεν καταλαβαίνει **bluffing** ή emotional manipulation.

---

## Core Stats

| Stat                        | Value  | Range     | Description                                           |
| --------------------------- | ------ | --------- | ----------------------------------------------------- |
| `speak_probability_base`    | 0.50   | 0.0 – 1.0 | Μέτρια — μιλάει όταν έχει κάτι ουσιαστικό            |
| `perception_depth`          | 2      | 1 – 3     | Smart — αναλύει ιστορικά + τρέχοντα δεδομένα          |
| `aggression`                | 0.20   | 0.0 – 1.0 | Χαμηλή — ποτέ δεν επιτίθεται χωρίς στοιχεία          |
| `team_logic`                | 0.70   | 0.0 – 1.0 | Ψηλή — πιστεύει στη συνεργασία αν τα στοιχεία δείχνουν |
| `trust_base`                | 0.50   | 0.0 – 1.0 | Ουδέτερη βάση — εμπιστεύεται μόνο με αποδείξεις       |
| `suspicion_sensitivity`     | 0.50   | 0.0 – 1.0 | Ισορροπημένη — ακριβής, χωρίς υπερβολές               |
| `emotional_reactivity`      | 0.50   | 0.5 – 2.0 | Ελάχιστη — σχεδόν αδιάφορος σε emotional events       |
| `persuasion_power`          | 0.65   | 0.0 – 1.0 | Μέτρια-ψηλή — πείθει με facts, όχι με χαρίσμα        |
| `persuasion_resistance`     | 0.85   | 0.0 – 1.0 | Πολύ ψηλή — αλλάζει γνώμη μόνο με νέα στοιχεία       |
| `leadership`                | 0.45   | 0.0 – 1.0 | Μέτρια — δεν οδηγεί ενεργά, αλλά γίνεται σημείο αναφοράς |
| `consistency`               | 0.95   | 0.0 – 1.0 | Εξαιρετικά ψηλή — ο πιο σταθερός τύπος               |
| `deception_skill`           | 0.55   | 0.0 – 1.0 | Μέτρια — μπορεί να ψέξει λογικά, αλλά χωρίς χαρίσμα  |
| `bandwagon_tendency`        | 0.10   | 0.0 – 1.0 | Σχεδόν μηδενική — δεν ακολουθεί ποτέ χωρίς λόγο      |
| `memory_weight_modifier`    | 1.00   | 0.5 – 2.0 | Ουδέτερος — ακριβής αποτίμηση χωρίς τροποποίηση      |

### Voting Config

| Parameter       | Value  | Description                                    |
| --------------- | ------ | ---------------------------------------------- |
| `voting_style`  | mid    | Ψηφίζει στη μέση — αφού αξιολογήσει δεδομένα   |
| `vote_threshold`| 0.65   | Ψηλό — χρειάζεται σοβαρά evidence              |

---

## Discussion Behavior

### Πώς Μιλάει

| Trigger                    | Response Probability | Behavior                                   |
| -------------------------- | -------------------- | ------------------------------------------ |
| Γενική συζήτηση            | 50%                  | Μοιράζεται αναλύσεις αν έχει              |
| Κατηγορήθηκε ο ίδιος      | 80%                  | Ζητάει στοιχεία — "Πού βασίζεσαι;"        |
| Πέθανε Town member         | 65%                  | Αναλύει πιθανούς υπόπτους βάσει ιστορικού  |
| Κάποιος κάνει λογικό claim | 70%                  | Αξιολογεί και σχολιάζει                    |
| Κατηγορία χωρίς στοιχεία   | 45%                  | "Δεν αρκεί η υποψία — δώσε αποδείξεις."   |

### Τόνος & Λεξιλόγιο

```
tone: "analytical"
vocabulary_examples:
  accusation: "Βάσει δεδομένων: ο Player X ψήφισε Town 2 φορές και υπερασπίστηκε known-Mafia."
  defense: "Ελέγξτε τις ψήφους μου — πάντα ψήφισα Town-aligned."
  agreement: "Τα στοιχεία συμφωνούν. Ο Player X είναι πιθανή Mafia."
  challenge: "Ποιο στοιχείο δικαιολογεί αυτή την κατηγορία; Δεν βλέπω basis."
```

---

## Voting Behavior

| Phase            | Πράξη                                                    |
| ---------------- | -------------------------------------------------------- |
| Pre-discussion   | Αναλύει memory data — σχηματίζει ύποπτους βάσει ιστορικού |
| Voting opens     | Δεν ψηφίζει αμέσως — περιμένει τελευταία δεδομένα       |
| Mid-voting       | Ψηφίζει βάσει αθροιστικής ανάλυσης                       |
| Close votes      | Δεν αλλάζει ψήφο — consistency                           |

### Vote Decision

```
suspicions = analyze_memory(perception_depth=2)
top_suspect = max(suspicions, key=lambda x: x.weight)

if top_suspect.weight > vote_threshold:  // > 0.65
    vote(top_suspect)
elif evidence_from_investigation:  // Sheriff/Lookout data
    vote(evidence_target)
else:
    abstain()  // Δεν ψηφίζει χωρίς λόγο — σπάνιο behavior
```

---

## Memory & Perception

### Perception Depth: Smart (Level 2)

```
Filter: weight > 0.2 OR weight < -0.2
Data scope: ALL days (with time decay)
```

| Χαρακτηριστικό                    | Αποτέλεσμα                                   |
| --------------------------------- | -------------------------------------------- |
| Ιστορική ανάλυση                  | Θυμάται και αξιολογεί παλιά data              |
| Pattern recognition               | Εντοπίζει voting inconsistencies              |
| Time-weighted analysis            | Πρόσφατα events μετράνε περισσότερο           |
| Αδυναμία σε emotional manipulation | Δεν "πιάνει" bluffing ή acting               |

### Weight Calculation Impact

```
new_weight = existing_weight + (event_weight × 1.00)

Παράδειγμα:
  Player A κατηγορεί τον Logical → event_weight: -0.8
  Logical υπολογίζει: 0 + (-0.8 × 1.00) = -0.80
  → Ακριβής αποτίμηση χωρίς ενίσχυση ή μείωση
  → Κρατάει τα δεδομένα "καθαρά" για cross-reference
```

---

## Role Synergy

| Role Combo                  | Αποτελεσματικότητα | Γιατί                                             |
| --------------------------- | ------------------ | ------------------------------------------------- |
| Logical + [[Sheriff]]       | ⭐⭐⭐⭐⭐            | Evidence-based + investigation = τέλειο combo     |
| Logical + [[Consigliere]]   | ⭐⭐⭐⭐⭐            | Ακριβή role info + λογική ανάλυση = Mafia weapon  |
| Logical + [[Lookout]]       | ⭐⭐⭐⭐              | Σταυρώνει visits με vote patterns                 |
| Logical + [[Jester]]        | ⭐                  | Η λογική δεν τραβάει ψήφους — αντίθετο win cond   |
| Logical + [[Godfather]]     | ⭐⭐⭐⭐              | Η σταθερότητα + immunity = αξιόπιστο cover        |

---

## Calculation Examples

### Speak Probability

```
Scenario: Logical Sheriff μετά από investigation (χωρίς cooldown)

speak_chance = personality_base × role_modifier × trigger_modifier × cooldown_modifier
speak_chance = 0.50 × 1.0 × 1.85 × 1.0
speak_chance = 0.925 (92.5%)

→ Σχεδόν σίγουρα θα μοιραστεί evidence — αλλά στρατηγικά
```

### Suspicion Build-up

```
Scenario: Logical παρατηρεί Player X να ψηφίζει Town member

event_weight = -0.5 (voted against Town)
memory_weight_modifier = 1.00
new_weight = 0 + (-0.5 × 1.00) = -0.50

Day 3: Player X ξαναψηφίζει Town member
new_weight = -0.50 + (-0.5 × 1.00) = -1.00

→ Αθροιστική ανάλυση: "Player X ψήφισε Town 2 φορές = highly suspicious"
→ Ο Logical είναι ο μόνος τύπος που χτίζει case μεθοδικά
```

### Trust Building

```
Scenario: Player Y υπερασπίζεται τον Logical AI

event_weight = +0.6 (defense)
memory_weight_modifier = 1.00
new_weight = 0 + (0.6 × 1.00) = +0.60

trust_base: 0.50 → χρειάζεται weight > 0.50 για εμπιστοσύνη
→ Ακριβώς στο threshold — "θετικός αλλά χρειάζεται confirmation"
→ Μία ψήφος Town-aligned = πλήρης εμπιστοσύνη
```

---

## personality.json

```json
{
  "type": "Logical",
  "speak_probability_base": 0.50,
  "perception_depth": 2,
  "aggression": 0.20,
  "team_logic": 0.70,
  "trust_base": 0.50,
  "suspicion_sensitivity": 0.50,
  "emotional_reactivity": 0.50,
  "persuasion_power": 0.65,
  "persuasion_resistance": 0.85,
  "leadership": 0.45,
  "consistency": 0.95,
  "deception_skill": 0.55,
  "bandwagon_tendency": 0.10,
  "memory_weight_modifier": 1.00,
  "voting_style": "mid",
  "vote_threshold": 0.65,
  "traits": ["methodical", "evidence-based", "calm"]
}
```

---

## Related Links

- [[AI Decision Engine#Speak Probability Engine]]
- [[AI Decision Engine#Perception Depth]]
- [[AI Decision Engine#Vote Decision Logic]]
- [[Memory System#Perception Depth]]
- [[Data Architecture#personality.json]]
- [[Game Setup#AI Personality Assignment]]
- [[Gameplay Loop#Weight Calculation Formula]]
