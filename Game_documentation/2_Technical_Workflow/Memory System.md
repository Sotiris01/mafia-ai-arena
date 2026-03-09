---
tags:
  - technical
  - technical/memory
  - workflow
---

# Memory System
---

Το Memory System είναι ο πυρήνας της "νοημοσύνης" των AI παικτών. Κάθε AI Player διατηρεί ένα **`memory.json`** που καταγράφει ό,τι "γνωρίζει" — σχέσεις εμπιστοσύνης, υποψίες, αποτελέσματα νυχτερινών ενεργειών, και ιστορικό γεγονότων.

## Memory JSON Schema

```json
{
  "player_id": "player_3",
  "current_day": 3,
  "relationships": {
    "player_1": {
      "trust": 0.6,
      "suspicion": -0.2,
      "interaction_count": 5,
      "last_interaction_day": 3,
      "history": [
        {"day": 1, "action": "defended_me", "weight": 0.5},
        {"day": 2, "action": "agreed_with_me", "weight": 0.3},
        {"day": 3, "action": "accused_target", "weight": -0.2}
      ]
    },
    "player_5": {
      "trust": -0.4,
      "suspicion": 0.9,
      "interaction_count": 3,
      "last_interaction_day": 3,
      "history": [
        {"day": 2, "action": "accused_me", "weight": 0.8},
        {"day": 3, "action": "defended_suspect", "weight": 0.4}
      ]
    }
  },
  "known_roles": {
    "player_7": {"role": "Mafia", "source": "investigation", "day_discovered": 2, "confidence": 1.0},
    "player_2": {"role": "Town", "source": "claim", "day_discovered": 1, "confidence": 0.4}
  },
  "night_results": [
    {"night": 1, "action": "investigate", "target": "player_4", "result": "Town"},
    {"night": 2, "action": "investigate", "target": "player_7", "result": "Mafia"}
  ],
  "gossip_hints": [
    {"night": 1, "hint": "Someone was curious about Player C", "interpretation": null}
  ],
  "events_witnessed": [
    {"day": 1, "type": "E06_COMMOTION", "target": "player_6", "timing": "morning", "suspicion_weight": 0.25},
    {"day": 2, "type": "E07_GUN_LICENSE", "target": "player_2", "timing": "midday", "suspicion_weight": 0.35},
    {"day": 2, "type": "last_wish", "details": "player_9 revealed player_2 visited them"}
  ],
  "voting_history": [
    {"day": 1, "voted_for": "player_5", "result": "player_5 lynched"},
    {"day": 2, "voted_for": "player_7", "result": "player_2 lynched"}
  ]
}
```

---

## Weight System (Σύστημα Βαρών)

Τα βάρη (weights) είναι αριθμοί στο εύρος **-1.0 έως +1.0** που αντιπροσωπεύουν σχέσεις:

| Weight Range   | Meaning                               |
| -------------- | ------------------------------------- |
| **+0.7 ~ +1.0** | Ισχυρή εμπιστοσύνη / σύμμαχος         |
| **+0.3 ~ +0.6** | Μέτρια εμπιστοσύνη                    |
| **0.0 ~ +0.2**  | Ουδέτερος / Αδιάφορος                 |
| **-0.1 ~ -0.4** | Ελαφριά υποψία                        |
| **-0.5 ~ -0.7** | Ισχυρή υποψία                         |
| **-0.8 ~ -1.0** | Σχεδόν βέβαιος ότι είναι Mafia / εχθρό |

### Direct vs Indirect Weights

| Relationship Type      | Weight Multiplier     | Example                                   |
| ---------------------- | --------------------- | ----------------------------------------- |
| **Άμεση κατηγορία**    | ×1.0 (full weight)    | "Player A is Mafia" → A gets -0.8         |
| **Άμεση υποστήριξη**   | ×1.0 (full weight)    | "I agree with Player B" → B gets +0.6     |
| **Έμμεση κατηγορία**   | ×0.4 (reduced)        | A supports B who accused C → C gets -0.3  |
| **Έμμεση υποστήριξη**  | ×0.3 (reduced)        | A defends B → B's allies get small +       |

---

## Time Decay (Χρονική Εξασθένιση)

Τα βάρη **εξασθενούν** με τον χρόνο. Κάθε αλλαγή Day, εφαρμόζεται:

```
weight = weight × DECAY_FACTOR

DECAY_FACTOR = 0.7  (default)
```

### Decay Example

| Day | Event                  | Weight (at time) | Weight (Day 4) |
| --- | ---------------------- | ----------------- | --------------- |
| 1   | A κατηγόρησε τον B     | -0.8              | -0.274          |
| 2   | C υποστήριξε τον A     | +0.6              | +0.294          |
| 3   | B κατηγόρησε τον A     | -0.7              | -0.49           |
| 4   | (τωρινή μέρα)          | —                 | Full weight     |

### Purpose

- **Νέα γεγονότα** έχουν πάντα μεγαλύτερη σημασία.
- Μια κατηγορία της Ημέρας 1 **ξεχνιέται σχεδόν** μέχρι την Ημέρα 4.
- Αυτό αποτρέπει τα AI από το να "κολλήσουν" σε παλιές πληροφορίες.
- Δημιουργεί ρεαλιστική **εξέλιξη γνώμης**.

### Exception: Known Roles

Τα αποτελέσματα ερευνών (π.χ. Sheriff investigation results) **ΔΕΝ** εξασθενούν. Αν ο Sheriff ξέρει ότι κάποιος είναι Mafia, αυτό μένει `confidence: 1.0` για πάντα.

```json
// known_roles ΔΕΝ επηρεάζεται από time decay
"known_roles": {
  "player_7": {
    "role": "Mafia",
    "source": "investigation",
    "confidence": 1.0  // NEVER decays
  }
}
```

---

## Perception Depth (Φίλτρο Αντίληψης)

Η **[[Data Architecture#personality.json|personality]]** καθορίζει πόσο βαθιά "βλέπει" ένα AI τη μνήμη του. Υπάρχουν **3 επίπεδα** (`perception_depth`: 1/2/3):

### Level 1 — Superficial (Επιφανειακός)

**Personalities:** [[Aggressive]] (`perception_depth: 1`), [[Shy]] (`perception_depth: 1`)

```
Filter: weight > 0.7 OR weight < -0.7
Data scope: Current day ONLY
```

| Characteristic              | Effect                                      |
| --------------------------- | ------------------------------------------- |
| Βλέπει μόνο ισχυρές σχέσεις  | Αγνοεί έμμεσα στοιχεία                      |
| Μόνο τρέχουσα μέρα           | Χωρίς ιστορική ανάλυση                       |
| **Παρασύρεται εύκολα**       | Ακολουθεί τις κατηγορίες του crowd           |
| Γρήγορες αποφάσεις           | Λιγότερο ακριβείς                            |
| Night Echo Events          | Αντιδρά μόνο σε weight ≥ 0.25         |

### Level 2 — Smart (Αναλυτικός)

**Personalities:** [[Cautious]] (`perception_depth: 2`), [[Charismatic]] (`perception_depth: 2`), [[Logical]] (`perception_depth: 2`)

```
Filter: weight > 0.2 OR weight < -0.2
Data scope: ALL days (with time decay applied)
```

| Characteristic                    | Effect                                           |
| --------------------------------- | ------------------------------------------------ |
| Εξετάζει άμεσες ΚΑΙ έμμεσες σχέσεις | Βλέπει hidden alliances                          |
| Ιστορική ανάλυση                    | Εντοπίζει μοτίβα συμπεριφοράς                    |
| **Cross-referencing**               | Συνδέει Night Echo Events + vote patterns       |
| Night Echo Events                  | Αντιδρά σε όλα τα events                      |

### Level 3 — Deep (Βαθύς)

**Personalities:** [[Paranoid]] (`perception_depth: 3`)

```
Filter: weight > 0.1 OR weight < -0.1
Data scope: ALL days + indirect relationships
```

| Characteristic                        | Effect                                           |
| ------------------------------------- | ------------------------------------------------ |
| Βλέπει τα πάντα                          | Ακόμα και ασήμαντα στοιχεία εξετάζονται        |
| Έμμεσες σχέσεις 2ου/3ου επιπέδου     | "A defended B που ψήφισε C" = A suspicious     |
| **Multi-source cross-referencing**    | Events + Gossip hints + vote patterns + claims   |
| `memory_weight_modifier: 1.50`        | Τα πάντα μοιάζουν πιο σημαντικά             |
| Night Echo Events                     | Cross-references με προηγούμενα events + αποτελέσματα |

### Decision Making Difference

**Scenario:** Player A voted against Player B (Day 1), then defended Player C (Day 2), who was later revealed as Mafia.

| AI Level      | Analysis                                                   | Verdict on A       |
| ------------- | ---------------------------------------------------------- | ------------------ |
| 1 Superficial | Δεν θυμάται Day 1. Βλέπει μόνο ότι ο A μίλησε σήμερα.      | Neutral            |
| 2 Smart       | Ο A υπερασπίστηκε known-Mafia C. Indirect Mafia suspicion. | Ύποπτος (+0.5)     |
| 3 Deep        | Ο A υπερασπίστηκε C + ψήφισε εναντίον Town D + Event E02 κοντά στον A. Multi-source suspicion. | Πολύ Ύποπτος (+0.8) |

---

## Voting Decision Process

Κατά τη [[Day Phase#The Trial & Vote|Trial]], κάθε AI αποφασίζει ψήφο μέσω:

```
1. Scan memory.json → Collect all suspicion scores
2. Apply Perception Depth filter (Level 1/2/3)
3. Apply Role override:
   - Sheriff + known_role = "Mafia" → ALWAYS vote that player
   - Mafia → NEVER vote fellow Mafia (unless strategic)
   - Executioner → ALWAYS push vote on assigned target
   - Lovers → NEVER vote partner
   - Zombie victims → CANNOT vote
4. Apply vote_threshold: Only vote if suspicion > threshold
5. Apply Mayor weight: If Mayor revealed → vote counts ×2
6. Select player with highest suspicion score
7. If tie → Select most recently accused
8. Cast vote
```

### Vote Influence by Personality

| Personality   | Voting Behavior                                         | `vote_threshold` |
| ------------- | ------------------------------------------------------- | ---------------- |
| Aggressive    | Ψηφίζει γρήγορα τον πρώτο ύποπτο                        | 0.40             |
| Cautious      | Περιμένει να δει πώς ψηφίζουν οι άλλοι πρώτα             | 0.70             |
| Paranoid      | Μπορεί να ψηφίσει "random" αν υποπτεύεται τους πάντες    | 0.35             |
| Logical       | Ψηφίζει αποκλειστικά βάσει evidence                      | 0.65             |
| Shy           | Ακολουθεί τη majority — ψηφίζει ό,τι ψηφίζει ο όχλος     | 0.20             |
| Charismatic   | Πείθει άλλους πριν ψηφίσει — οδηγεί ψήφο               | 0.50             |

---

## Night Echo Event Memory (Μνήμη Night Events)

Τα [[Dynamic Events|Night Echo Events]] αποθηκεύονται στο `events_witnessed` array του `memory.json` και επηρεάζουν τα suspicion weights ανάλογα με το `perception_depth` του AI.

### Event → Memory Weight Formula

```
memory_impact = event_weight × memory_weight_modifier × time_decay
```

- `event_weight`: Από τον [[Dynamic Events#Master Event Table|Master Event Table]] (0.10 – 0.40)
- `memory_weight_modifier`: Από τη [[Data Architecture#personality.json|personality]] (0.70 – 1.50)
- `time_decay`: r = 0.85 per day (βλ. [[#Time Decay (Χρονική Εξασθένιση)]])

### Weight Reference by Event Category

| Category            | Events                            | Base Weight |
| ------------------- | --------------------------------- | ----------- |
| High Suspicion      | E02, E06, E07, E08, E10, E14     | 0.25 – 0.40 |
| Moderate Suspicion  | E01, E03, E05, E09, E11, E12     | 0.15 – 0.25 |
| Low / Atmospheric   | E04, E13                          | 0.10 – 0.15 |

### Perception Depth × Event Processing

| Level | Behaviour                                                      |
| ----- | -------------------------------------------------------------- |
| 1     | Αποθηκεύει μόνο events με weight ≥ 0.25. Δεν cross-references. |
| 2     | Αποθηκεύει όλα τα events. Cross-references με vote patterns.   |
| 3     | Αποθηκεύει όλα. Cross-references events + claims + visits + Gossip hints. Βλέπει indirect connections μεταξύ events διαφορετικών ημερών. |

### Zombie Infection Memory

Όταν ένας παίκτης γίνεται [[Zombie]], η μνήμη του ενημερώνεται:

```json
{
  "is_zombie": true,
  "zombie_since_day": 3,
  "original_faction": "Town",
  "memory_state": "frozen"
}
```

- **memory_state: "frozen"**: Τα weight scores παγώνουν — δεν ενημερώνονται πλέον
- Ο Zombie δεν ψηφίζει, δεν μιλάει, δεν αναλύει
- Η μνήμη του παραμένει για reference αν γίνει cure (Full Moon Stage 2)

---

## Related Links

- [[Data Architecture]] (JSON schemas — 17 personality stats)
- [[AI Decision Engine]] (how memory is used for decisions)
- [[AI Decision Engine#Night Echo Event Reactions]] (event → memory weight impact)
- [[Gameplay Loop#Step 2]] (when memory is updated)
- [[Dynamic Events]] (Night Echo Events E01–E14 — suspicion weight table)
- [[Day Phase#The Trial & Vote]]
