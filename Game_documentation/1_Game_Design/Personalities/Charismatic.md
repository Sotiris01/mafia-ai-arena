---
tags:
  - personality
  - perception/smart
  - game_design
---

# Charismatic

| Property        | Value                                 |
| --------------- | ------------------------------------- |
| **Type**        | Charismatic                           |
| **Archetype**   | Ο Χαρισματικός                        |
| **Frequency**   | ~22% των AI players                   |
| **Best Roles**  | Godfather, Mayor, Executioner         |
| **Worst Roles** | Survivor, Citizen                     |
| **Tone**        | Persuasive, alliance-builder, warm    |

---

## Overview

Ο **Charismatic** AI είναι ο πιο **κοινωνικός** τύπος. Μιλάει συχνά, πείθει εύκολα, και δημιουργεί συμμαχίες. Είναι ο φυσικός **leader** κάθε ομάδας — ξεκινάει αφηγήσεις, κατευθύνει τη συζήτηση, και πολλοί AI τείνουν να τον ακολουθήσουν.

Η δύναμή του είναι η **persuasion** — μπορεί να πείσει τους άλλους να ψηφίσουν τον στόχο του, να δημιουργήσει trust, ή να κατευθύνει τη συζήτηση μακριά από τον εαυτό του. Ως Mafia, είναι **εξαιρετικά επικίνδυνος** γιατί μπορεί να χειραγωγεί τη συζήτηση ολόκληρη. Η αδυναμία: η ψηλή ορατότητα τον κάνει στόχο investigation.

---

## Core Stats

| Stat                        | Value  | Range     | Description                                           |
| --------------------------- | ------ | --------- | ----------------------------------------------------- |
| `speak_probability_base`    | 0.70   | 0.0 – 1.0 | Ψηλή — μιλάει πολύ, πάντα με σκοπό                   |
| `perception_depth`          | 2      | 1 – 3     | Smart — αναλύει κοινωνικά patterns                    |
| `aggression`                | 0.30   | 0.0 – 1.0 | Χαμηλή — δεν επιτίθεται, πείθει                      |
| `team_logic`                | 0.85   | 0.0 – 1.0 | Πολύ ψηλή — δημιουργεί ομάδες, alliances             |
| `trust_base`                | 0.55   | 0.0 – 1.0 | Μέτρια-ψηλή — δίνει αρχική εμπιστοσύνη               |
| `suspicion_sensitivity`     | 0.40   | 0.0 – 1.0 | Χαμηλή-μέτρια — δεν κατηγορεί εύκολα                 |
| `emotional_reactivity`      | 1.00   | 0.5 – 2.0 | Ουδέτερη — αντιδρά ψύχραιμα σε events                |
| `persuasion_power`          | 0.90   | 0.0 – 1.0 | Εξαιρετικά ψηλή — ο πιο πειστικός τύπος              |
| `persuasion_resistance`     | 0.70   | 0.0 – 1.0 | Ψηλή — δεν πείθεται εύκολα, αλλά ακούει              |
| `leadership`                | 0.85   | 0.0 – 1.0 | Εξαιρετικά ψηλή — φυσικός ηγέτης                     |
| `consistency`               | 0.75   | 0.0 – 1.0 | Ψηλή — σταθερός στις θέσεις αλλά ευέλικτος           |
| `deception_skill`           | 0.80   | 0.0 – 1.0 | Πολύ ψηλή — ο καλύτερος ψεύτης στο παιχνίδι          |
| `bandwagon_tendency`        | 0.15   | 0.0 – 1.0 | Πολύ χαμηλή — δημιουργεί bandwagon, δεν ακολουθεί    |
| `memory_weight_modifier`    | 0.90   | 0.5 – 2.0 | Ελαφρώς μειωμένη — ψύχραιμη αποτίμηση events         |

### Voting Config

| Parameter       | Value  | Description                                    |
| --------------- | ------ | ---------------------------------------------- |
| `voting_style`  | early  | Ψηφίζει νωρίς — θέλει να οδηγήσει τους άλλους |
| `vote_threshold`| 0.50   | Μέτριο — ψηφίζει νωρίς αλλά με κάποια βάση    |

---

## Discussion Behavior

### Πώς Μιλάει

| Trigger                    | Response Probability | Behavior                                   |
| -------------------------- | -------------------- | ------------------------------------------ |
| Γενική συζήτηση            | 70%                  | Ξεκινάει αφήγηση — κατευθύνει τη συζήτηση |
| Κατηγορήθηκε ο ίδιος      | 90%                  | Πείθει ότι είναι αθώος με χαρίσμα          |
| Πέθανε Town member         | 75%                  | Ηγείται αντίδρασης — "Πρέπει να βρούμε τον δράστη!" |
| Κάποιος δέχεται επίθεση   | 65%                  | Υπερασπίζεται αν είναι σύμμαχος            |
| Σιωπηλή φάση              | 80%                  | Σπάει τη σιωπή — ξεκινά νέο θέμα          |

### Τόνος & Λεξιλόγιο

```
tone: "warm_persuasive"
vocabulary_examples:
  accusation: "Ακούστε με — παρατήρησα κάτι για τον Player X. Νομίζω πρέπει να το εξετάσουμε."
  defense: "Θα σας δείξω γιατί δεν είμαι Mafia. Κοιτάξτε τις ψήφους μου."
  rallying: "Πρέπει να ενωθούμε. Αν χωριστούμε, η Mafia κερδίζει!"
  alliance: "Player Y, εμπιστεύομαι την κρίση σου. Τι πιστεύεις;"
```

---

## Voting Behavior

| Phase            | Πράξη                                                    |
| ---------------- | -------------------------------------------------------- |
| Pre-discussion   | Σχηματίζει strategy — ξέρει ποιον θέλει να ψηφίσει      |
| Voting opens     | Ψηφίζει νωρίς — θέλει οι άλλοι να τον ακολουθήσουν     |
| Mid-voting       | Πείθει αλλά δεν πιέζει — diplomacy                       |
| Close votes      | Αν η ψήφος είναι κοντά, κάνει τελική αφήγηση            |

### Vote Decision

```
if has_alliance(target):
    // Ποτέ δεν ψηφίζει σύμμαχο
    vote(highest_suspicion_non_ally)
elif can_persuade_majority(target):
    vote(target)
    broadcast_persuasion(target)  // "Νομίζω πρέπει να ψηφίσουμε τον ${target}"
elif has_evidence(target):
    vote(target)
    share_evidence()  // Στρατηγική αποκάλυψη
else:
    vote(most_suspicious)
    build_narrative()  // Δημιουργεί αφήγηση γύρω από την ψήφο
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
| Ιστορική ανάλυση                  | Θυμάται ποιος υποστήριξε ποιον               |
| Κοινωνική αντίληψη               | Εντοπίζει alliances + rivalries              |
| Strategic memory                  | Θυμάται ποιους "κέρδισε" και ποιους δεν πείθει |
| Alliance tracking                 | Ξέρει ποιος τον ακολουθεί σταθερά            |

### Weight Calculation Impact

```
new_weight = existing_weight + (event_weight × 0.90)

Παράδειγμα:
  Player A κατηγορεί τον Charismatic → event_weight: -0.8
  Charismatic υπολογίζει: 0 + (-0.8 × 0.90) = -0.72
  → Ψύχραιμη αντίδραση — δεν εκνευρίζεται
  → Σχεδιάζει strategic απάντηση αντί emotional

Alliance building:
  Player B υπερασπίζεται τον Charismatic 3 φορές:
  Accumulated weight: +0.54 → +1.02 → +1.45
  team_logic: 0.85 → Player B = trusted ally
  → Κατευθύνει μελλοντικές ψήφους μαζί
```

---

## Persuasion Mechanics

### Πώς Πείθει

Ο Charismatic είναι ο μοναδικός τύπος που μπορεί **ενεργά** να αλλάξει τη γνώμη άλλων AI:

```
persuasion_chance(target) = 
    charismatic.persuasion_power × (1 - target.persuasion_resistance)

Παραδείγματα:
  Charismatic → Shy:    0.90 × (1 - 0.20) = 0.72 (72%)
  Charismatic → Cautious: 0.90 × (1 - 0.80) = 0.18 (18%)
  Charismatic → Logical: 0.90 × (1 - 0.85) = 0.135 (13.5%)
  Charismatic → Paranoid: 0.90 × (1 - 0.60) = 0.36 (36%)
  Charismatic → Aggressive: 0.90 × (1 - 0.40) = 0.54 (54%)
```

### Alliance Formation

```
alliance_probability(target) =
    charismatic.team_logic × target.team_logic × trust_weight

Αν trust_weight > 0.50:
  → Πρόταση alliance — κοινή ψήφος στο μέλλον
  → O Charismatic "θυμάται" ποιος τον ακολούθησε

Alliance effects:
  - Συντονισμένη ψήφος (±1 γύρο)
  - Κοινή υπεράσπιση αν κατηγορηθεί σύμμαχος
  - Information sharing (αν Town)
```

---

## Role Synergy

| Role Combo                      | Αποτελεσματικότητα | Γιατί                                             |
| ------------------------------- | ------------------ | ------------------------------------------------- |
| Charismatic + [[Godfather]]     | ⭐⭐⭐⭐⭐            | Πιο επικίνδυνος combo — πείθει + αόρατος          |
| Charismatic + [[Mayor]]         | ⭐⭐⭐⭐⭐            | Leader vote + ×2 = κυριαρχεί τη ψηφοφορία         |
| Charismatic + [[Executioner]]   | ⭐⭐⭐⭐⭐            | Πείθει Town να ψηφίσει τον στόχο του              |
| Charismatic + [[Sheriff]]       | ⭐⭐⭐⭐              | Μοιράζεται evidence πειστικά                       |
| Charismatic + [[Survivor]]      | ⭐⭐                 | Πολύ ορατός — τραβάει kill target                  |
| Charismatic + [[Citizen]]       | ⭐⭐⭐               | Αξιοποιεί τον Citizen στο έπακρο μέσω influence   |

---

## Calculation Examples

### Speak Probability

```
Scenario: Charismatic Godfather μετά από θάνατο Town member (χωρίς cooldown)

speak_chance = personality_base × role_modifier × trigger_modifier × cooldown_modifier
speak_chance = 0.70 × 1.1 × 1.30 × 1.0
speak_chance = 1.001 → capped at 0.95

→ Σχεδόν σίγουρα — ηγείται της αντίδρασης
→ "Πρέπει να βρούμε τον δράστη!" — ενώ είναι ο ίδιος Mafia
```

### Suspicion Build-up

```
Scenario: Charismatic AI παρατηρεί Player X να σιωπά

observation: "Player X spoke 0 times in 5 rounds"
suspicion_sensitivity: 0.40
emotional_reactivity: 1.00

→ Δεν κατηγορεί αμέσως — σχεδιάζει narrative:
  "Παρατήρησα ότι ο Player X δεν μίλησε καθόλου. 
   Συνήθως αυτοί που κρύβονται είναι ύποπτοι. Τι λέτε;"
→ Δημιουργεί consensus αντί κατηγορίας
```

### Persuasion in Action

```
Scenario: Charismatic θέλει να ψηφιστεί ο Player Z

Step 1: Ψηφίζει πρώτος τον Z (early voter)
Step 2: Persuasion attempt σε κάθε AI:
  - Shy AI (0.72 success rate) → 72% ακολουθεί
  - Aggressive AI (0.54) → 54% ακολουθεί
  - Paranoid AI (0.36) → 36% ακολουθεί
  - Cautious AI (0.18) → 18% ακολουθεί
  - Logical AI (0.135) → 13.5% ακολουθεί

Expected allies: ~2-3 ψήφοι ακολουθούν τον Charismatic
→ Μπορεί να κρίνει ψηφοφορία μόνος του
```

---

## personality.json

```json
{
  "type": "Charismatic",
  "speak_probability_base": 0.70,
  "perception_depth": 2,
  "aggression": 0.30,
  "team_logic": 0.85,
  "trust_base": 0.55,
  "suspicion_sensitivity": 0.40,
  "emotional_reactivity": 1.00,
  "persuasion_power": 0.90,
  "persuasion_resistance": 0.70,
  "leadership": 0.85,
  "consistency": 0.75,
  "deception_skill": 0.80,
  "bandwagon_tendency": 0.15,
  "memory_weight_modifier": 0.90,
  "voting_style": "early",
  "vote_threshold": 0.50,
  "traits": ["persuasive", "alliance-builder", "warm"]
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
