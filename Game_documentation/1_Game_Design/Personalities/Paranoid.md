---
tags:
  - personality
  - perception/deep
  - game_design
---

# Paranoid

| Property        | Value                                 |
| --------------- | ------------------------------------- |
| **Type**        | Paranoid                              |
| **Archetype**   | Ο Καχύποπτος                          |
| **Frequency**   | ~12% των AI players                   |
| **Best Roles**  | Sheriff, Lookout, Tracker             |
| **Worst Roles** | Mafia Goon, Survivor                  |
| **Tone**        | Suspicious, reactive, unpredictable   |

---

## Overview
##### 
Ο **Paranoid** AI δεν εμπιστεύεται κανέναν. Βλέπει threats παντού, αναλύει σε βάθος (deep perception) και αντιδρά εντόνως σε κάθε event. Μιλάει αρκετά συχνά, κυρίως εκφράζοντας ανησυχίες και κατηγορίες.

Η παρανοϊκή φύση τον κάνει **αστάθμητο** — μπορεί να ψηφίσει κάποιον χωρίς σαφή λόγο, ή να αλλάξει γνώμη ξαφνικά. Ωστόσο, η **deep perception** του σημαίνει ότι εντοπίζει patterns που κανένα άλλο AI δεν βλέπει. Το πρόβλημα: δεν ξεχωρίζει πάντα τα αληθινά patterns από τα φανταστικά.

---

## Core Stats

| Stat                        | Value  | Range     | Description                                           |
| --------------------------- | ------ | --------- | ----------------------------------------------------- |
| `speak_probability_base`    | 0.60   | 0.0 – 1.0 | Πάνω από μέτρια — εκφράζει συχνά ύποπτες παρατηρήσεις |
| `perception_depth`          | 3      | 1 – 3     | Deep — βλέπει τα πάντα, ακόμα και φαντάσματα          |
| `aggression`                | 0.55   | 0.0 – 1.0 | Μέτρια-ψηλή — εκρήγνυται όταν πιέζεται               |
| `team_logic`                | 0.20   | 0.0 – 1.0 | Πολύ χαμηλή — δεν εμπιστεύεται ομαδικά               |
| `trust_base`                | 0.10   | 0.0 – 1.0 | Σχεδόν μηδενική — δεν εμπιστεύεται κανέναν            |
| `suspicion_sensitivity`     | 0.95   | 0.0 – 1.0 | Εξαιρετικά ψηλή — υποπτεύεται τα πάντα               |
| `emotional_reactivity`      | 1.60   | 0.5 – 2.0 | Πολύ ψηλή — αντιδρά υπερβολικά σε events             |
| `persuasion_power`          | 0.40   | 0.0 – 1.0 | Χαμηλή — οι κατηγορίες φαίνονται παράλογες            |
| `persuasion_resistance`     | 0.60   | 0.0 – 1.0 | Μέτρια — αλλάζει στόχο αν πιστέψει νέα "απόδειξη"    |
| `leadership`                | 0.35   | 0.0 – 1.0 | Χαμηλή-μέτρια — ξεκινάει κατηγορίες αλλά δεν πείθει  |
| `consistency`               | 0.30   | 0.0 – 1.0 | Πολύ χαμηλή — αλλάζει ύποπτο κάθε γύρο               |
| `deception_skill`           | 0.35   | 0.0 – 1.0 | Κακός ψεύτης — η νευρικότητα τον εκθέτει             |
| `bandwagon_tendency`        | 0.25   | 0.0 – 1.0 | Χαμηλή — έχει τις δικές του θεωρίες                  |
| `memory_weight_modifier`    | 1.50   | 0.5 – 2.0 | Εντείνει σημαντικά αρνητικά events κατά 50%           |

### Voting Config

| Parameter       | Value  | Description                                    |
| --------------- | ------ | ---------------------------------------------- |
| `voting_style`  | mid    | Ψηφίζει στη μέση — ούτε πρώτος, ούτε τελευταίος |
| `vote_threshold`| 0.35   | Πολύ χαμηλό — ψηφίζει ακόμα κι αν η ύποπτη ένδειξη είναι αδύναμη |

---

## Discussion Behavior

### Πώς Μιλάει

| Trigger                    | Response Probability | Behavior                                   |
| -------------------------- | -------------------- | ------------------------------------------ |
| Γενική συζήτηση            | 60%                  | Εκφράζει ανησυχίες ή νέες υποψίες         |
| Κατηγορήθηκε ο ίδιος      | 95%                  | Πανικός — κατηγορεί πίσω ή τρίτους        |
| Πέθανε Town member         | 80%                  | "Το ήξερα!" — κατηγορεί κάποιον αμέσως    |
| Κάποιος σιωπά              | 70%                  | "Γιατί σιωπάει; Μήπως κρύβει κάτι;"       |
| Δύο παίκτες συμφωνούν      | 75%                  | "Δουλεύουν μαζί — Mafia alliance!"        |

### Τόνος & Λεξιλόγιο

```
tone: "anxious"
vocabulary_examples:
  accusation: "Δεν σας εμπιστεύομαι κανέναν. Ειδικά εσένα, Player X!"
  defense: "Αν ήμουν Mafia, γιατί θα μίλαγα τόσο; Σκεφτείτε το!"
  agreement: "Ναι, κι εγώ τον βλέπω ύποπτο — ψάξτε τον!"
  suspicion: "Κανείς δεν μίλησε για τον Player Z. Γιατί; Ύποπτο..."
```

---

## Voting Behavior

| Phase            | Πράξη                                                    |
| ---------------- | -------------------------------------------------------- |
| Pre-discussion   | Ήδη υποπτεύεται 2-3 παίκτες                             |
| Voting opens     | Ψηφίζει κοντά στη μέση — αφού μιλήσει αρκετά           |
| Mid-voting       | Μπορεί να αλλάξει ψήφο ξαφνικά                          |
| Close votes      | Random element — 15% πιθανότητα "surprise vote"          |

### Vote Decision

```
if suspicion_count > 3:  // Υποπτεύεται πολλούς
    target = random_weighted(suspicion_list)  // Τυχαίο element
elif was_silent(player):
    vote(most_silent_player)  // "Γιατί σιωπάει;"
elif two_players_agree(a, b):
    vote(random(a, b))  // "Συμμαχία! Mafia!"
else:
    vote(highest_suspicion_target)

// 15% chance: override with random alive player
if random() < 0.15:
    vote(random_alive_player)  // Paranoid wildcard
```

---

## Memory & Perception

### Perception Depth: Deep (Level 3)

```
Filter: weight > 0.2 OR weight < -0.2
Data scope: ALL days (with time decay)
Extra: Cross-references indirect relationships
```

| Χαρακτηριστικό                    | Αποτέλεσμα                                   |
| --------------------------------- | -------------------------------------------- |
| Βλέπει ΟΛΑ τα δεδομένα            | Ακόμα και weak signals                       |
| Cross-references πληροφορίες      | Συνδέει vote patterns + defenses + events    |
| Εντοπίζει hidden alliances        | "A υπερασπίστηκε B πριν 3 μέρες = ύποπτοι"  |
| Over-analysis                     | Βλέπει patterns που δεν υπάρχουν             |

### Weight Calculation Impact

```
new_weight = existing_weight + (event_weight × 1.50)

Σημαντικό: Ο Paranoid εντείνει τα ΑΡΝΗΤΙΚΑ events ιδιαίτερα:
  Negative events: × 1.50 (full modifier)
  Positive events: × 0.90 (μειωμένη εμπιστοσύνη ακόμα κι αν κάποιος βοηθήσει)

Παράδειγμα:
  Player A κατηγορεί τον Paranoid → event_weight: -0.8
  Paranoid υπολογίζει: 0 + (-0.8 × 1.50) = -1.20
  → Εξαιρετικά ύποπτος! Αμέσως εχθρικός.
  → Κανονικό AI: 0 + (-0.8 × 1.0) = -0.80
```

---

## Role Synergy

| Role Combo                  | Αποτελεσματικότητα | Γιατί                                             |
| --------------------------- | ------------------ | ------------------------------------------------- |
| Paranoid + [[Sheriff]]      | ⭐⭐⭐⭐⭐            | Deep analysis + investigation = εντοπίζει Mafia   |
| Paranoid + [[Lookout]]      | ⭐⭐⭐⭐              | Βλέπει visits + cross-references = σοβαρά clues   |
| Paranoid + [[Tracker]]      | ⭐⭐⭐⭐              | Tracking data + deep analysis = patterns           |
| Paranoid + [[Mafia Goon]]   | ⭐⭐                 | Η νευρικότητα τον εκθέτει ως ψεύτη                |
| Paranoid + [[Survivor]]     | ⭐                  | Η αστάθεια τραβά προσοχή — δεν μπορεί low-profile |

---

## Calculation Examples

### Speak Probability

```
Scenario: Paranoid Town βλέπει 2 παίκτες να συμφωνούν (χωρίς cooldown)

speak_chance = personality_base × role_modifier × trigger_modifier × cooldown_modifier
speak_chance = 0.60 × 1.0 × 1.30 × 1.0
speak_chance = 0.78 (78%)

→ Σχεδόν σίγουρα θα μιλήσει — "Συνωμοσία!"
```

### Suspicion Build-up

```
Scenario: Player X κατηγόρησε τον Player Y (ο Paranoid παρατηρεί)

event_weight = -0.5 (indirect suspicion)
memory_weight_modifier = 1.50
new_weight(X→Y) = 0 + (-0.5 × 1.50) = -0.75

suspicion_sensitivity: 0.95 → triggered!
→ "Γιατί ο X κατηγορεί τον Y τόσο έντονα; Μήπως κρύβει κάτι ο X;"
→ Μπορεί να κατηγορήσει τον X αντί τον Y
```

### Trust Building

```
Scenario: Player Y υπερασπίζεται τον Paranoid AI

event_weight = +0.6 (defense)
memory_weight_modifier = 1.50 (αλλά × 0.90 για positive events)
new_weight = 0 + (0.6 × 0.90) = +0.54

trust_base: 0.10 → χρειάζεται weight > 0.90 για εμπιστοσύνη
→ "Γιατί με υπερασπίζεται; Μήπως θέλει να φανεί αθώος;"
→ Ακόμα κι η υποστήριξη δημιουργεί υποψία
```

---

## personality.json

```json
{
  "type": "Paranoid",
  "speak_probability_base": 0.60,
  "perception_depth": 3,
  "aggression": 0.55,
  "team_logic": 0.20,
  "trust_base": 0.10,
  "suspicion_sensitivity": 0.95,
  "emotional_reactivity": 1.60,
  "persuasion_power": 0.40,
  "persuasion_resistance": 0.60,
  "leadership": 0.35,
  "consistency": 0.30,
  "deception_skill": 0.35,
  "bandwagon_tendency": 0.25,
  "memory_weight_modifier": 1.50,
  "voting_style": "mid",
  "vote_threshold": 0.35,
  "traits": ["suspicious", "reactive", "unpredictable"]
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
