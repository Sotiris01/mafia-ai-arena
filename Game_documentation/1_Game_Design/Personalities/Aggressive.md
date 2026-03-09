---
tags:
  - personality
  - perception/superficial
  - game_design
---

# Aggressive

| Property        | Value                                 |
| --------------- | ------------------------------------- |
| **Type**        | Aggressive                            |
| **Archetype**   | Ο Καυγατζής                           |
| **Frequency**   | ~15% των AI players                   |
| **Best Roles**  | Godfather, Jester                     |
| **Worst Roles** | Survivor, Doctor                      |
| **Tone**        | Confrontational, loud, impulsive      |

---

## Overview

Ο **Aggressive** AI μιλάει σχεδόν πάντα, κατηγορεί εύκολα και δεν φοβάται τις συγκρούσεις. Ενεργεί γρήγορα χωρίς να αναλύει βαθιά τα δεδομένα. Είναι ο πρώτος που θα κατηγορήσει και ο πρώτος που θα ψηφίσει — αλλά και ο πιο εύκολος στόχος για παραπλάνηση λόγω **superficial perception**.

Η παρουσία ενός Aggressive AI δημιουργεί **φασαρία** στη συζήτηση: πυροδοτεί αντιδράσεις, εκθέτει τον εαυτό του, αλλά μπορεί τυχαία να "χτυπήσει σωστά" κατηγορώντας πραγματική Mafia.

---

## Core Stats

| Stat                        | Value  | Range     | Description                                           |
| --------------------------- | ------ | --------- | ----------------------------------------------------- |
| `speak_probability_base`    | 0.80   | 0.0 – 1.0 | Πολύ υψηλή πιθανότητα ομιλίας σε κάθε γύρο          |
| `perception_depth`          | 1      | 1 – 3     | Superficial — βλέπει μόνο ισχυρές σχέσεις            |
| `aggression`                | 0.90   | 0.0 – 1.0 | Εξαιρετικά επιθετικός σε τόνο και ενέργειες          |
| `team_logic`                | 0.30   | 0.0 – 1.0 | Χαμηλή ομαδική σκέψη — δρα μόνος                     |
| `trust_base`                | 0.25   | 0.0 – 1.0 | Δύσκολα εμπιστεύεται κάποιον                         |
| `suspicion_sensitivity`     | 0.70   | 0.0 – 1.0 | Ψηλή — υποπτεύεται εύκολα                            |
| `emotional_reactivity`      | 1.40   | 0.5 – 2.0 | Αντιδρά πολύ έντονα σε events                        |
| `persuasion_power`          | 0.50   | 0.0 – 1.0 | Μέτρια ικανότητα πειθούς — φωνάζει αλλά δεν πείθει  |
| `persuasion_resistance`     | 0.40   | 0.0 – 1.0 | Χαμηλή αντίσταση — αλλάζει γνώμη αν κατηγορηθεί     |
| `leadership`                | 0.70   | 0.0 – 1.0 | Ψηλή — ξεκινάει κατηγορίες, οδηγεί συζήτηση         |
| `consistency`               | 0.40   | 0.0 – 1.0 | Χαμηλή — αλλάζει στόχους συχνά                       |
| `deception_skill`           | 0.30   | 0.0 – 1.0 | Κακός ψεύτης — η επιθετικότητα τον εκθέτει           |
| `bandwagon_tendency`        | 0.20   | 0.0 – 1.0 | Πολύ χαμηλή — δεν ακολουθεί, οδηγεί                 |
| `memory_weight_modifier`    | 1.20   | 0.5 – 2.0 | Εντείνει κάθε event weight κατά 20%                  |

### Voting Config

| Parameter       | Value  | Description                                    |
| --------------- | ------ | ---------------------------------------------- |
| `voting_style`  | early  | Ψηφίζει πρώτος χωρίς να περιμένει              |
| `vote_threshold`| 0.40   | Χαμηλό threshold — ψηφίζει ακόμα κι αν δεν είναι σίγουρος |

---

## Discussion Behavior

### Πώς Μιλάει

| Trigger                    | Response Probability | Behavior                                   |
| -------------------------- | -------------------- | ------------------------------------------ |
| Γενική συζήτηση            | 80%                  | Κατηγορεί τον πιο ύποπτο αμέσως            |
| Κατηγορήθηκε ο ίδιος      | 95%                  | Αντεπιτίθεται — κατηγορεί τον κατήγορο    |
| Πέθανε Town member         | 85%                  | Εκνευρίζεται — κατηγορεί κάποιον αμέσως   |
| Σύμμαχος δέχεται επίθεση  | 90%                  | Υπερασπίζεται θερμά                        |
| Σιωπηλή φάση              | 70%                  | Σπάει τη σιωπή με κατηγορία               |

### Τόνος & Λεξιλόγιο

```
tone: "confrontational"
vocabulary_examples:
  accusation: "Ξέρω ότι είσαι Mafia. Μην κρύβεσαι!"
  defense: "Αν νομίζεις ότι είμαι εγώ, πάμε vote τώρα!"
  agreement: "Σωστά! Ψήφισέ τον αμέσως!"
  deflection: "Αφήστε εμένα — κοιτάξτε εκείνον!"
```

---

## Voting Behavior

| Phase            | Πράξη                                                    |
| ---------------- | -------------------------------------------------------- |
| Pre-discussion   | Έχει ήδη ύποπτο — δεν περιμένει στοιχεία                |
| Voting opens     | Ψηφίζει αμέσως τον πρώτο ύποπτο                         |
| Mid-voting       | Σπάνια αλλάζει ψήφο — "δέσμευσε"                        |
| Close votes      | Πιέζει τους άλλους να ψηφίσουν τον ίδιο στόχο           |

### Vote Decision

```
if has_suspicion_target():
    vote(highest_suspicion_target)  // Δεν σκέφτεται πολύ
elif was_accused_by(someone):
    vote(accuser)  // Εκδίκηση
else:
    vote(most_silent_player)  // "Γιατί δε μιλάει;"
```

---

## Memory & Perception

### Perception Depth: Superficial (Level 1)

```
Filter: weight > 0.7 OR weight < -0.7
Data scope: Current day ONLY
```

| Χαρακτηριστικό              | Αποτέλεσμα                                    |
| --------------------------- | --------------------------------------------- |
| Βλέπει μόνο ισχυρές σχέσεις | Αγνοεί subtle evidence                        |
| Μόνο τρέχουσα μέρα          | Ξεχνάει τι έγινε χθες                         |
| Παρασύρεται εύκολα          | Πιστεύει ψεύτικες κατηγορίες                  |
| Γρήγορες αποφάσεις          | Λιγότερο ακριβείς αλλά πιο αποφασιστικές      |

### Weight Calculation Impact

```
new_weight = existing_weight + (event_weight × 1.20)

Παράδειγμα:
  Player A κατηγορεί Aggressive → event_weight: -0.8
  Aggressive υπολογίζει: 0 + (-0.8 × 1.20) = -0.96
  → Αμέσως ύποπτος! (threshold -0.7 crossed)
  → Κανονικό AI: 0 + (-0.8 × 1.0) = -0.80
```

---

## Role Synergy

| Role Combo                  | Αποτελεσματικότητα | Γιατί                                             |
| --------------------------- | ------------------ | ------------------------------------------------- |
| Aggressive + [[Godfather]]  | ⭐⭐⭐⭐⭐            | Κατηγορεί ελεύθερα — immune σε Sheriff            |
| Aggressive + [[Jester]]     | ⭐⭐⭐⭐⭐            | Η επιθετικότητα τραβάει ψήφους = win condition    |
| Aggressive + [[Sheriff]]    | ⭐⭐⭐               | Μπορεί να αποκαλύψει evidence αλλά κινδυνεύει    |
| Aggressive + [[Survivor]]   | ⭐                  | Τραβάει πολύ προσοχή — αντίθετο με low-profile   |
| Aggressive + [[Doctor]]     | ⭐⭐                 | Ρίσκο αποκάλυψης — αλλά δείχνει "ανθρώπινος"     |

---

## Calculation Examples

### Speak Probability

```
Scenario: Aggressive Mafia Goon σε γενική συζήτηση (χωρίς cooldown)

speak_chance = personality_base × role_modifier × trigger_modifier × cooldown_modifier
speak_chance = 0.80 × 0.70 × 1.0 × 1.0
speak_chance = 0.56 (56%)

→ Ακόμα και ως Mafia, μιλάει πάνω από τους μισούς γύρους
```

### Suspicion Build-up

```
Scenario: Player X κατηγόρησε τον Aggressive AI

event_weight = -0.8 (accusation)
memory_weight_modifier = 1.20
new_weight = 0 + (-0.8 × 1.20) = -0.96

Aggressive αντίδραση:
  suspicion_sensitivity: 0.70 → triggered (> -0.96)
  emotional_reactivity: 1.40 → strong reaction
  → Αμέσως κατηγορεί πίσω τον Player X
```

### Trust Building

```
Scenario: Player Y υπερασπίζεται τον Aggressive AI

event_weight = +0.6 (defense)
memory_weight_modifier = 1.20
new_weight = 0 + (0.6 × 1.20) = +0.72

trust_base: 0.25 → χρειάζεται weight > 0.75 για πλήρη εμπιστοσύνη
→ Σχεδόν εμπιστεύεται αλλά όχι ακόμα πλήρως
→ Χρειάζεται δεύτερη θετική ενέργεια
```

---

## personality.json

```json
{
  "type": "Aggressive",
  "speak_probability_base": 0.80,
  "perception_depth": 1,
  "aggression": 0.90,
  "team_logic": 0.30,
  "trust_base": 0.25,
  "suspicion_sensitivity": 0.70,
  "emotional_reactivity": 1.40,
  "persuasion_power": 0.50,
  "persuasion_resistance": 0.40,
  "leadership": 0.70,
  "consistency": 0.40,
  "deception_skill": 0.30,
  "bandwagon_tendency": 0.20,
  "memory_weight_modifier": 1.20,
  "voting_style": "early",
  "vote_threshold": 0.40,
  "traits": ["confrontational", "loud", "impulsive"]
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
