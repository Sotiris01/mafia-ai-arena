---
tags:
  - technical
  - technical/ai
  - workflow
---

# AI Decision Engine
---

Το AI Decision Engine αποτελεί τον "εγκέφαλο" κάθε Virtual Player. Αποφασίζει **πότε** θα μιλήσουν, **τι** θα πουν, και **πώς** θα ψηφίσουν. Βασίζεται σε τρεις πυλώνες: **Speak Probability**, **Perception Depth**, και **Vote Logic**.

---

## 1. Speak Probability Engine

Αντί να μιλάνε τα AI με τη σειρά (round-robin), το σύστημα υπολογίζει **πιθανότητα** για κάθε AI να αντιδράσει σε κάθε μήνυμα.

### Formula

```
speak_chance(player) =
    personality_base
  × role_modifier
  × trigger_modifier
  × cooldown_modifier
```

### Factor 1: Personality Base

Η βάση πιθανότητας βάσει **[[Data Architecture#personality.json|personality.json]]**:

| Personality   | Base Probability | Behavior                               |
| ------------- | ---------------- | -------------------------------------- |
| **Shy**       | 0.10 (10%)       | Σπάνια μιλάει, παρατηρεί               |
| **Cautious**  | 0.30 (30%)       | Μιλάει μόνο όταν έχει κάτι σημαντικό   |
| **Logical**   | 0.50 (50%)       | Μιλάει moderate, evidence-based        |
| **Paranoid**  | 0.60 (60%)       | Μιλάει συχνά, εκφράζει ανησυχίες       |
| **Charismatic**| 0.70 (70%)      | Μιλάει πολύ, πείθει, δημιουργεί αφήγηση|
| **Aggressive**| 0.80 (80%)       | Μιλάει σχεδόν πάντα, κατηγορεί         |

### Factor 2: Role Modifier

Ο ρόλος τροποποιεί τη βασική πιθανότητα:

| Role                          | Modifier | Reason                                                |
| ----------------------------- | -------- | ----------------------------------------------------- |
| Town general ([[Citizen]], [[Doctor]], [[Lookout]], [[Tracker]], [[Gossip]]) | ×1.0 | Κανένα modifier |
| [[Sheriff]]                   | ×1.1     | Έχει evidence να μοιραστεί                          |
| [[Bodyguard]]                 | ×1.0     | Κανονική συμπεριφορά — δεν πρέπει να αποκαλυφθεί       |
| [[Lovers]]                    | ×1.0     | Συμπεριφέρονται ως Citizens                          |
| [[Mayor]] (pre-reveal)        | ×0.9     | Χαμηλό profile πριν το reveal                         |
| [[Mayor]] (post-reveal)       | ×1.3     | Οδηγεί συζήτηση με ×2 ψήφο                           |
| Mafia general ([[Mafia Goon]], [[Framer]], [[Silencer]]) | ×0.7 | Η Mafia δεν θέλει να τραβάει προσοχή |
| [[Godfather]]                 | ×1.1     | Μπορεί να μιλήσει ελεύθερα (investigation immune)  |
| [[Consigliere]]               | ×0.8     | Έχει πληροφορίες αλλά πρέπει να τις διαχειριστεί προσεκτικά |
| [[Janitor]]                   | ×0.7     | Μυστική γνώση — δεν αποκαλύπτει την πηγή          |
| [[Jester]]                    | ×1.2     | Θέλει προσοχή — σκόπιμα προκλητικός               |
| [[Executioner]]               | ×1.0     | Κανονικός — στοχεύει συγκεκριμένο παίκτη              |
| [[Survivor]]                  | ×0.6     | Χαμηλό profile — δεν θέλει προσοχή                  |
| [[Zombie]]                    | ×0.8     | Παίζει σαν Town — δεν αποκαλύπτεται                 |

### Factor 3: Trigger Modifiers (Κρίσιμο)

| Trigger                                | New Probability | Priority  |
| -------------------------------------- | --------------- | --------- |
| **DIRECTLY ACCUSED** by another player | **0.95**        | Highest   |
| **Has evidence** (Sheriff knows Mafia + Mafia accused) | **0.85** | High |
| **Ally defended/attacked**             | **+0.40**       | Medium    |
| **Saw something** (Lookout/Tracker witness) | **+0.30**  | Medium    |
| **Night Echo Event** mentions self/ally | **+0.25**      | Medium    |
| **Mayor revealed** (post-reveal boost) | **+0.20**      | Medium    |
| **Lover partner accused**              | **+0.50**       | High      |
| **General discussion**                 | Base value      | Low       |

### Factor 4: Cooldown Modifier

Αποτρέπει τα AI από το να "spammάρουν":

```
if player spoke in last 2 messages:
  cooldown_modifier = 0.2  // Dramatic reduction
elif player spoke in last 5 messages:
  cooldown_modifier = 0.6
else:
  cooldown_modifier = 1.0  // No penalty
```

### Selection Process

```
for each alive AI player:
  chance = personality_base × role_mod × trigger_mod × cooldown_mod
  roll = random(0, 1)
  if roll < chance:
    add to speakers_queue

sort speakers_queue by:
  1. Directly accused (highest priority)
  2. Has critical evidence
  3. Strong emotional trigger
  4. Normal reaction

execute first speaker → generate message → restart loop
```

---

## 2. Perception Depth

Η "βαθιά" ανάλυση μνήμης κάθε AI εξαρτάται από το **`perception_depth`** στο [[Data Architecture#personality.json|personality.json]] (1/2/3).

**Detailed:** [[Memory System#Perception Depth]]

### Quick Reference (3 επίπεδα)

| Level | Type            | Filter                     | Data Scope  | Personalities            | Behavior                                |
| ----- | --------------- | -------------------------- | ----------- | ------------------------ | --------------------------------------- |
| **1** | **Superficial** | `weight > 0.7` or `< -0.7`| Current day | [[Aggressive]], [[Shy]]  | Βλέπει μόνο ισχυρές σχέσεις, παρασύρεται |
| **2** | **Smart**       | `weight > 0.2` or `< -0.2`| All days    | [[Cautious]], [[Charismatic]], [[Logical]] | Εντοπίζει patterns, cross-references |
| **3** | **Deep**        | `weight > 0.1` or `< -0.1`| All days + indirect | [[Paranoid]]      | Βλέπει τα πάντα — ακόμα και ασήμαντα στοιχεία |

### Practical Example

**Scenario:** Player A defended Player B (Day 1, weight +0.4), Player B later revealed as Mafia (Day 3).

| AI Level      | Analysis                                                   |
| ------------- | ---------------------------------------------------------- |
| 1 Superficial | Δεν θυμάται Day 1 data. Αγνοεί τη σύνδεση A↔B.             |
| 2 Smart       | Βλέπει historical data: A defended known-Mafia B → A ύποπτος |
| 3 Deep        | Cross-references: A defended B + A ψήφισε εναντίον Town C + Night Echo event E02 κοντά στον A → A πολύ ύποπτος |

---

## 3. Vote Decision Logic

Κατά τη [[Day Phase#The Trial & Vote|Trial]], κάθε AI αποφασίζει ψήφο μέσω:

### Step-by-Step

```
1. LOAD memory.json
2. APPLY Perception Depth filter
3. COLLECT all suspicion scores for alive players
4. APPLY Time Decay to historical data
5. CHECK Role overrides:
   - Sheriff + known_role = "Mafia" → FORCE vote that player
   - Mafia → NEVER vote fellow Mafia
   - Jester → Vote strategically to provoke accusations
6. SELECT player with highest aggregated suspicion
7. IF tie → Prefer most recently accused
8. CAST vote
```

### Personality Impact on Voting

| Personality    | Voting Behavior                                         | Wait Time    |
| -------------- | ------------------------------------------------------- | ------------ |
| **Aggressive** | Ψηφίζει γρήγορα, πρώτος                                 | Early voter  |
| **Cautious**   | Περιμένει να δει ψήφους άλλων                            | Late voter   |
| **Paranoid**   | Random element — μπορεί να ψηφίσει απρόβλεπτα            | Mid voter    |
| **Logical**    | Βασίζεται 100% σε evidence                               | Mid voter    |
| **Shy**        | Ακολουθεί τη majority — "bandwagon" voter                | Latest voter |
| **Charismatic**| Πείθει άλλους πριν ψηφίσει                               | Early voter  |

---

## 4. Message Generation

Όταν ένα AI αποφασίσει να μιλήσει, δημιουργεί μήνυμα βάσει:

### Inputs

| Source                  | What it provides                                  |
| ----------------------- | ------------------------------------------------- |
| **role.json**           | Alignment, role-specific knowledge                |
| **personality.json**    | Tone, vocabulary, aggression level                |
| **memory.json**         | Who to accuse/defend, what evidence to share      |
| **chat_events.json**    | Context of current discussion                     |

### Message Types

| Type              | When                                     | Example                                          |
| ----------------- | ---------------------------------------- | ------------------------------------------------ |
| **Accusation**    | High suspicion target                    | "I've been watching Player D — very suspicious."  |
| **Defense**       | Self or ally accused                     | "I'm not Mafia! I voted Town yesterday."          |
| **Agreement**     | Ally makes accusation                    | "I agree with Player A. Player D is suspicious."  |
| **Role Claim**    | Critical moment (life-or-death)          | "I'm the Sheriff. Player D is Mafia."             |
| **Deflection**    | Mafia trying to divert attention         | "Let's focus on Player F instead."                |
| **Random Chat**   | Low-trigger, Paranoid personality        | "I don't trust anyone here."                      |

---

## 5. Special AI Behaviors by Role (19 ρόλοι)

### Town (9)

| Role              | Special Behavior                                                                    |
| ----------------- | ----------------------------------------------------------------------------------- |
| **Citizen AI**    | Κανονική συμπεριφορά. Ψηφίζει βάσει suspicion + personality.                       |
| **Sheriff AI**    | Reveals investigation results σε υπολογισμένη "optimal" στιγμή. Κρατάει results αν δεν απειλείται. |
| **Doctor AI**     | Ποτέ δεν αποκαλύπτει ρόλο εκτός αν κινδυνεύει. Επιλέγει protect ή cure βάσει zombie threat. |
| **Lookout AI**    | Αποκαλύπτει ποιος επισκέφτηκε τον στόχο — επιβεβαιώνει ή αντικρούει claims.           |
| **Tracker AI**    | Αποκαλύπτει πού πήγε ο στόχος. Ιδανικό για να εντοπίσει Mafia killers.                     |
| **Gossip AI**     | Αναφέρει hints χωρίς να αποκαλύπτει πηγή. Cross-references με δημόσια events.             |
| **Lovers AI**     | Υπερασπίζει τον partner. Ποτέ δεν ψηφίζει εναντίον του partner. Ειδικό trust bonus.     |
| **Bodyguard AI**  | Προστατεύει τον πιο αξιόπιστο Town player. Δεν αποκαλύπτει ρόλο.                       |
| **Mayor AI**      | Pre-reveal: χαμηλό profile. Post-reveal: οδηγεί συζήτηση με ×2 ψήφο. Επιλέγει στρατηγικά πότε να αποκαλυφθεί. |

### Mafia (6)

| Role              | Special Behavior                                                                    |
| ----------------- | ----------------------------------------------------------------------------------- |
| **Godfather AI**  | Κατηγορεί Town members επιθετικά (investigation immune). Οδηγεί Mafia Chat.          |
| **Mafia Goon AI** | Ακολουθεί Godfather strategy. Fake accusations. Αποφεύγει προφανή υπεράσπιση teammates. |
| **Framer AI**     | Συντονίζει frame target με Mafia kill target για max confusion.                 |
| **Silencer AI**   | Σιγάζει τον πιο επικίνδυνο Town player (π.χ. Sheriff που ξέρει πολλά).                  |
| **Consigliere AI**| Χρησιμοποιεί role info στο Mafia Chat. Κατευθύνει kill target βάσει ακριβούς ρόλου.  |
| **Janitor AI**    | Μοιράζεται ρόλους νεκρών στο Mafia Chat. Exploits "no role reveal" mechanic.           |

### Neutral (4)

| Role              | Special Behavior                                                                    |
| ----------------- | ----------------------------------------------------------------------------------- |
| **Jester AI**     | Κάνει σκόπιμα ύποπτες δηλώσεις. Δημιουργεί confusion. Στόχος: να ψηφιστεί.          |
| **Executioner AI**| Στοχεύει 100% τον assigned target. Κατηγορεί συστηματικά — αλλά όχι προφανώς. Αν target πεθάνει νύχτα → γίνεται Jester. |
| **Survivor AI**   | Μένει neutral. Χαμηλό profile. Αμύνεται μόνο αν κατηγορηθεί. Vest στρατηγικά (2–3 φορές). |
| **Zombie AI**     | Παίζει σαν αθώο Town. Στοχεύει στρατηγικά ποιον θα μολύνει (key roles πρώτα).            |

---

## 6. Night Echo Event Reactions

Οι AI Players αντιδρούν στα [[Dynamic Events#Night Echo Events|Night Echo Events]] (E01–E14) βάσει `perception_depth` + `emotional_reactivity` + `suspicion_sensitivity`.

### Event Weight → Memory Impact

Μετά από κάθε event, το AI ενημερώνει το memory.json:

```
new_suspicion = existing_suspicion + (event_weight × emotional_reactivity × memory_weight_modifier)
```

| Event              | Base Weight | Σχόλιο                              |
| ------------------ | ----------- | ----------------------------------- |
| E01 Noise, E05 Seen | +0.15      | Ήπιο — κάποιος πήγε εκεί           |
| E02 Shadow         | +0.30       | Πιο ύποπτο — Mafia/Zombie linked   |
| E03 Footsteps      | +0.10       | Neutral — μπορεί να ήταν Sheriff    |
| E04 Argument       | +0.20       | Αξιοσημείωτο — σύγκρουση           |
| E06 Commotion      | +0.25       | Πολλαπλή δραστηριότητα              |
| E07 Gun            | +0.35       | "Οπλισμένος" = επικίνδυνος              |
| E08 Nervous        | +0.30       | Νευρικός = πιθανός ένοχος           |
| E09 Watchful       | +0.15       | Ήπιο — παρατήρηση                  |
| E10 Whispers       | +0.40       | Μυστική σχέση — πολύ ύποπτο        |
| E11 Medical        | -0.10       | Μειώνει suspicion (πιθανός Doctor ally) |
| E12 Guard Post     | -0.15       | Μειώνει suspicion (πιθανός Town)      |
| E13 Illness        | +0.20       | Zombie concern                      |
| E14 Silenced       | +0.10       | Ήπιο hint                          |

### Personality × Event Reactions

| `perception_depth` | Event Reaction                                                      |
| ------------------ | ------------------------------------------------------------------- |
| 1 (Superficial)    | Αντιδρά μόνο σε events με weight ≥ 0.25. Αγνοεί ήπια events.          |
| 2 (Smart)          | Αντιδρά σε όλα τα events. Cross-references 1–2 πηγές.                |
| 3 (Deep)           | Cross-references events + vote patterns + night results + προηγούμενα events. Βλέπει μοτίβα. |

| Personality     | `emotional_reactivity` | `memory_weight_modifier` | Behavior                               |
| --------------- | ---------------------- | ------------------------ | -------------------------------------- |
| [[Aggressive]]  | 1.40                   | 1.20                     | Αντιδρά έντονα — αμέση κατηγορία          |
| [[Cautious]]    | 0.60                   | 0.70                     | Ηρεμή αντίδραση — σημειώνει χωρίς κατηγορία |
| [[Charismatic]] | 1.00                   | 0.90                     | Χρησιμοποιεί events για να οδηγήσει συζήτηση  |
| [[Logical]]     | 0.50                   | 1.00                     | Αναλύει ουδέτερα — ζητάει περισσότερα στοιχεία |
| [[Paranoid]]    | 1.60                   | 1.50                     | Εντείνει τα πάντα — βλέπει απειλές παντού       |
| [[Shy]]         | 0.80                   | 0.80                     | Αγνοεί τα περισσότερα events                 |

---

## Related Links

- [[Gameplay Loop]] (where the engine runs)
- [[Memory System]] (data source for decisions)
- [[Data Architecture]] (JSON storage — 17 personality stats)
- [[Day Phase]] (where speaking + voting happens)
- [[Night Phase]] (where night decisions + Resolution Order happens)
- [[Dynamic Events]] (Night Echo Events E01–E14, Last Wish, Full Moon)
