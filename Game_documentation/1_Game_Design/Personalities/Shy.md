---
tags:
  - personality
  - perception/superficial
  - game_design
---

# Shy

| Property        | Value                                 |
| --------------- | ------------------------------------- |
| **Type**        | Shy                                   |
| **Archetype**   | Ο Ντροπαλός                           |
| **Frequency**   | ~15% των AI players                   |
| **Best Roles**  | Survivor, Citizen, Mafia Goon         |
| **Worst Roles** | Jester, Godfather, Mayor              |
| **Tone**        | Reserved, follower, quiet             |

---

## Overview

Ο **Shy** AI σπάνια μιλάει και σχεδόν ποτέ δεν ξεκινάει κατηγορίες. Η βασική στρατηγική του είναι **"πάω με τους πολλούς"** — ακολουθεί τη majority ψήφο, δεν εκφράζει δικές απόψεις, και προσπαθεί να μην τραβήξει προσοχή.

Η σιωπή του τον κάνει **αόρατο** στις πρώτες μέρες, αλλά στα late-game μπορεί να γίνει στόχος ("Γιατί δε μιλάει ποτέ;"). Ως Mafia, η σιωπή μπορεί να τον σώσει ή να τον καταστρέψει — εξαρτάται αν το Town θεωρεί τη σιωπή ύποπτη.

---

## Core Stats

| Stat                        | Value  | Range     | Description                                           |
| --------------------------- | ------ | --------- | ----------------------------------------------------- |
| `speak_probability_base`    | 0.10   | 0.0 – 1.0 | Πολύ χαμηλή — σπάνια μιλάει αυθόρμητα                |
| `perception_depth`          | 1      | 1 – 3     | Superficial — βλέπει μόνο ισχυρά σήματα               |
| `aggression`                | 0.05   | 0.0 – 1.0 | Σχεδόν μηδενική — δεν κατηγορεί ποτέ                  |
| `team_logic`                | 0.50   | 0.0 – 1.0 | Μέτρια — δεν σχηματίζει συμμαχίες ενεργά              |
| `trust_base`                | 0.60   | 0.0 – 1.0 | Ψηλή — εμπιστεύεται εύκολα (αφελής)                   |
| `suspicion_sensitivity`     | 0.30   | 0.0 – 1.0 | Χαμηλή — δεν υποπτεύεται εύκολα                       |
| `emotional_reactivity`      | 0.80   | 0.5 – 2.0 | Χαμηλή-μέτρια — αντιδρά εσωτερικά, δεν εκφράζει      |
| `persuasion_power`          | 0.10   | 0.0 – 1.0 | Σχεδόν μηδενική — δεν μπορεί να πείσει κανέναν        |
| `persuasion_resistance`     | 0.20   | 0.0 – 1.0 | Πολύ χαμηλή — παρασύρεται εύκολα                      |
| `leadership`                | 0.05   | 0.0 – 1.0 | Σχεδόν μηδενική — ποτέ δεν ξεκινά συζήτηση            |
| `consistency`               | 0.70   | 0.0 – 1.0 | Μέτρια-ψηλή — ακολουθεί σταθερά τη majority           |
| `deception_skill`           | 0.25   | 0.0 – 1.0 | Χαμηλή — αλλά η σιωπή κρύβει αρκετά                   |
| `bandwagon_tendency`        | 0.90   | 0.0 – 1.0 | Εξαιρετικά ψηλή — ο bandwagon voter                   |
| `memory_weight_modifier`    | 0.80   | 0.5 – 2.0 | Ελαφρώς μειωμένη — δεν αντιδρά έντονα                |

### Voting Config

| Parameter       | Value     | Description                                    |
| --------------- | --------- | ---------------------------------------------- |
| `voting_style`  | bandwagon | Ψηφίζει τελευταίος — ό,τι ψηφίζει η πλειοψηφία |
| `vote_threshold`| 0.20      | Πολύ χαμηλό — ψηφίζει ό,τι ψηφίζουν οι άλλοι  |

---

## Discussion Behavior

### Πώς Μιλάει

| Trigger                    | Response Probability | Behavior                                   |
| -------------------------- | -------------------- | ------------------------------------------ |
| Γενική συζήτηση            | 10%                  | Σιωπά — σχεδόν ποτέ δεν μιλάει            |
| Κατηγορήθηκε ο ίδιος      | 70%                  | Νευρική άμυνα — σύντομη                    |
| Πέθανε Town member         | 20%                  | Μπορεί να πει "Κρίμα..." αλλά τίποτα ουσιαστικό |
| Σύμμαχος δέχεται επίθεση  | 25%                  | Σπάνια υπερασπίζει — φοβάται               |
| Majority κατηγορεί κάποιον | 35%                  | "Κι εγώ συμφωνώ..." (ακολουθεί)           |

### Τόνος & Λεξιλόγιο

```
tone: "hesitant"
vocabulary_examples:
  accusation: (σπάνια) "Δεν ξέρω... μήπως ο Player X;"
  defense: "Δεν είμαι εγώ! Δεν ξέρω τι να πω..."
  agreement: "Ναι, κι εγώ νομίζω ότι ο Player X..."
  bandwagon: "Αφού λέτε... ψηφίζω κι εγώ τον Player X."
```

---

## Voting Behavior

| Phase            | Πράξη                                                    |
| ---------------- | -------------------------------------------------------- |
| Pre-discussion   | Δεν σχηματίζει γνώμη — περιμένει                         |
| Voting opens     | Δεν ψηφίζει — παρακολουθεί τους υπόλοιπους              |
| Mid-voting       | Παρακολουθεί ποιος έχει τις περισσότερες ψήφους          |
| Late voting      | Ψηφίζει ό,τι ψηφίζει η πλειοψηφία (bandwagon)           |

### Vote Decision

```
majority_target = get_current_vote_leader()

if majority_target exists AND votes > 2:
    vote(majority_target)  // Bandwagon — πάντα
elif was_accused(self):
    vote(accuser)  // Μόνη ανεξάρτητη ψήφος: αυτο-άμυνα
else:
    vote(random_from_suspects)  // Τυχαίος αν δεν υπάρχει majority

// Ποτέ δεν ψηφίζει πρώτος
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
| Παρασύρεται εύκολα          | Ακολουθεί αυτόν που φωνάζει πιο πολύ         |
| Χαμηλή ανάλυση              | Δεν εντοπίζει patterns                        |

### Weight Calculation Impact

```
new_weight = existing_weight + (event_weight × 0.80)

Παράδειγμα:
  Player A κατηγορεί τον Shy → event_weight: -0.8
  Shy υπολογίζει: 0 + (-0.8 × 0.80) = -0.64
  → Κάτω από threshold (-0.70) — δεν αντιδρά ακόμα
  → Χρειάζεται δεύτερη κατηγορία για reaction

Majority effect:
  3 παίκτες ψηφίζουν Player X
  bandwagon_tendency: 0.90 → σχεδόν σίγουρα ακολουθεί
  → Δεν χρειάζονται στοιχεία — μόνο πλειοψηφία
```

---

## Role Synergy

| Role Combo                  | Αποτελεσματικότητα | Γιατί                                             |
| --------------------------- | ------------------ | ------------------------------------------------- |
| Shy + [[Survivor]]          | ⭐⭐⭐⭐⭐            | Low-profile = δεν τραβάει προσοχή = επιβιώνει     |
| Shy + [[Citizen]]           | ⭐⭐⭐               | Αόρατος πολίτης — δεν βοηθάει αλλά δεν βλάπτει    |
| Shy + [[Mafia Goon]]        | ⭐⭐⭐⭐              | Η σιωπή κρύβει το alignment — safe Mafia          |
| Shy + [[Jester]]            | ⭐                  | Δεν μπορεί να τραβήξει ψήφους — αντίθετο win      |
| Shy + [[Godfather]]         | ⭐                  | Σιωπηλός leader = αδύναμος, αντίφαση              |
| Shy + [[Mayor]]             | ⭐⭐                 | Reveal = forced attention, αντίθετο με personality |

---

## Special Interactions

### Silencer Impact

Αν ο [[Silencer]] σιγάσει έναν Shy AI:

```
Κανονικός παίκτης: "Ο Player X σιγάστηκε! Ύποπτο!"
Shy παίκτης: Η σιωπή δεν αλλάζει τίποτα — ήδη δεν μιλούσε

→ Αναποτελεσματική χρήση Silence σε Shy target
→ Smart Mafia δεν σιγάζει Shy players
```

### Crowd Influence

```
Αν 3+ παίκτες κατηγορήσουν τον ίδιο στόχο:
  Shy bandwagon_tendency: 0.90
  persuasion_resistance: 0.20
  
  → 90% × (1 - 0.20) = 72% πιθανότητα να ψηφίσει τον ίδιο
  → Ο Shy AI αξιοποιείται ως "safe vote" από manipulators
```

---

## Calculation Examples

### Speak Probability

```
Scenario: Shy Citizen σε γενική συζήτηση (χωρίς cooldown)

speak_chance = personality_base × role_modifier × trigger_modifier × cooldown_modifier
speak_chance = 0.10 × 1.0 × 1.0 × 1.0
speak_chance = 0.10 (10%)

→ 1 στις 10 — σχεδόν ποτέ δεν μιλάει αυθόρμητα
```

### Accused Response

```
Scenario: Shy AI κατηγορήθηκε άμεσα

speak_chance = 0.10 × 1.0 × 0.95 × 1.0
speak_chance = 0.095 → BUT trigger override: accused = 0.70

→ 70% πιθανότητα αντίδρασης (trigger override)
→ Μικρή, νευρική άμυνα: "Δεν είμαι εγώ!"
```

### Trust Building

```
Scenario: Player Y υπερασπίζεται τον Shy AI

event_weight = +0.6 (defense)
memory_weight_modifier = 0.80
new_weight = 0 + (0.6 × 0.80) = +0.48

trust_base: 0.60 → χρειάζεται weight > 0.40 για εμπιστοσύνη
→ Εύκολη εμπιστοσύνη! Ο Shy εμπιστεύεται γρήγορα (αφέλεια)
→ Αυτό τον κάνει εύκολο στόχο για manipulation
```

---

## personality.json

```json
{
  "type": "Shy",
  "speak_probability_base": 0.10,
  "perception_depth": 1,
  "aggression": 0.05,
  "team_logic": 0.50,
  "trust_base": 0.60,
  "suspicion_sensitivity": 0.30,
  "emotional_reactivity": 0.80,
  "persuasion_power": 0.10,
  "persuasion_resistance": 0.20,
  "leadership": 0.05,
  "consistency": 0.70,
  "deception_skill": 0.25,
  "bandwagon_tendency": 0.90,
  "memory_weight_modifier": 0.80,
  "voting_style": "bandwagon",
  "vote_threshold": 0.20,
  "traits": ["reserved", "follower", "quiet"]
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
- [[Silencer]] (σχετικό: Silence on Shy = ineffective)
