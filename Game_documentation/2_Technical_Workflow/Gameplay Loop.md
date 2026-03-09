---
tags:
  - technical
  - technical/loop
  - workflow
---

# Gameplay Loop — Technical Workflow
---

Αυτό το αρχείο περιγράφει τη **βήμα-προς-βήμα τεχνική ροή** που εκτελείται κάθε φορά που ένα μήνυμα εμφανίζεται στο chat ή κάθε φορά που αλλάζει φάση. Αποτελεί τον πυρήνα λειτουργίας του παιχνιδιού.

## Overview

```
┌─────────────────────────────────────────────────────────┐
│                    GAMEPLAY LOOP                         │
│                                                         │
│  ┌─ MORNING REPORT ────────────────────────────────┐    │
│  │  Deaths (no role reveal) + Events 🌅 + Full Moon │    │
│  └──────────────────────────┬───────────────────────┘    │
│                             ▼                            │
│  ┌─ DAY PHASE ─────────────────────────────────────┐    │
│  │  New Message → Step 1: Analyze Message           │    │
│  │            → Step 2: Update Memory (all AI)      │    │
│  │            → Step 3: Human Window (pause)        │    │
│  │            → Step 4: Speak Probability Engine     │    │
│  │            → Step 5: Generate Response → ↩ Step 1│    │
│  │  💬 Mid-Day Event Interrupts (30s–120s delay)     │    │
│  └──────────────────────────┬───────────────────────┘    │
│                             ▼                            │
│  Trial & Vote → Lynch Resolution → Win Check            │
│                             ▼                            │
│  ┌─ NIGHT PHASE ───────────────────────────────────┐    │
│  │  Mafia Chat → Night Actions → Resolution (0-6)  │    │
│  │  Night Echo Selection → Full Moon Balance Check  │    │
│  │  Win Check → Morning Report ↩                    │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## Step 1: Message Analysis (Ανάλυση Μηνύματος)

Κάθε νέο μήνυμα στο chat (από άνθρωπο ή AI) αναλύεται σημασιολογικά.

### Input
Το raw text μήνυμα (π.χ. "I think Player B is suspicious, they voted weird yesterday")

### Processing
Ο **Chat Semantic Analyzer** εξάγει:
- **Speaker:** Ποιος μίλησε
- **Action:** Τι είδους ενέργεια κάνει (Accuse, Defend, Claim, Question, Agree, Disagree)
- **Target:** Ποιον αφορά
- **Weight:** Πόσο ισχυρή ήταν η δήλωση (0.0 – 1.0)

### Output → `chat_events.json`

```json
{
  "message_id": 42,
  "speaker": "player_1",
  "action": "accuse",
  "target": "player_3",
  "weight": 0.8,
  "day": 2,
  "raw_text": "I think Player B is suspicious...",
  "indirect_targets": [
    {
      "player": "player_7",
      "relation": "negative_reference",
      "weight": 0.3
    }
  ]
}
```

### Action Types

| Action     | Description                          | Default Weight |
| ---------- | ------------------------------------ | -------------- |
| `accuse`   | Κατηγορεί κάποιον ως Mafia           | 0.8 – 1.0      |
| `defend`   | Υπερασπίζεται κάποιον                | 0.6 – 0.8      |
| `agree`    | Συμφωνεί με προηγούμενη δήλωση       | 0.4 – 0.6      |
| `disagree` | Διαφωνεί με προηγούμενη δήλωση       | 0.4 – 0.6      |
| `claim`    | Δηλώνει ρόλο ή πληροφορία            | 0.7 – 1.0      |
| `question` | Ρωτάει / ζητάει εξηγήσεις            | 0.3 – 0.5      |
| `deflect`  | Αλλάζει θέμα / αποφεύγει             | 0.2 – 0.4      |

---

## Step 2: Memory Update (Ενημέρωση Μνήμης)

**Κάθε** AI Player διαβάζει το νέο event από `chat_events.json` και ενημερώνει το δικό του `memory.json`.

### Direct vs Indirect Relationships

| Γεγονός                                     | Αποτέλεσμα στη μνήμη                                           |
| ------------------------------------------- | -------------------------------------------------------------- |
| Ο A κατηγορεί τον B                         | A→B: **suspicion +0.8** (άμεση)                                |
| Ο C υποστηρίζει τον A (που κατηγόρησε τον B) | C→A: **trust +0.6** (άμεση), C→B: **suspicion +0.3** (έμμεση) |
| Ο D υπερασπίζεται τον B                     | D→B: **trust +0.6** (άμεση), D→A: **suspicion -0.3** (έμμεση) |

### Weight Calculation Formula

```
new_weight = existing_weight + (event_weight × personality_modifier)
```

| Personality | `personality_modifier` | Effect                          |
| ----------- | ---------------------- | ------------------------------- |
| Aggressive  | 1.20                  | Αντιδρά εντονότερα              |
| Cautious    | 0.70                  | Αντιδρά πιο ήπια               |
| Paranoid    | 1.50                  | Εντείνει αρνητικά βάρη          |
| Logical     | 1.00                  | Ουδέτερος — βασίζεται σε data   |
| Shy         | 0.80                  | Χαμηλή αντίδραση, ακολουθεί crowd |
| Charismatic | 1.10                  | Βαρύνει τα social signals       |

### Memory Update Example

```json
// memory.json — player_5 (after processing event #42)
{
  "relationships": {
    "player_1": {
      "trust": 0.0,
      "suspicion": 0.0,
      "notes": []
    },
    "player_3": {
      "trust": -0.3,
      "suspicion": 0.8,
      "notes": ["accused by player_1 on day 2"]
    }
  }
}
```

**Detailed:** [[Memory System]]

---

## Step 3: Human Window (Χρονικό Περιθώριο)

Μετά την ενημέρωση μνήμης, το σύστημα **παύει** για 2–3 δευτερόλεπτα.

### Σκοπός
- Δίνει στον **ανθρώπινο παίκτη** χρόνο να διαβάσει και να αντιδράσει.
- Αποτρέπει τα AI από το να "πλημμυρίσουν" το chat.
- Κάνει τη συζήτηση να φαίνεται **φυσική**.

### Implementation

```
humanWindowDelay:
  base: 2000ms
  variance: ±1000ms (random)
  
  if human_is_typing:
    extend_window(additional: 3000ms)
  
  if last_message_was_from_human:
    reduce_window(multiplier: 0.5)  // Τα AI αντιδρούν πιο γρήγορα
```

---

## Step 4: Speak Probability Engine

Αντί να μιλάνε τα AI με σειρά, το σύστημα υπολογίζει **πιθανότητα** για κάθε AI.

**Detailed:** [[AI Decision Engine#Speak Probability]]

### Quick Summary

```
speak_chance(player) =
    personality_base
  × role_modifier
  × trigger_modifier
  × recent_activity_modifier
```

| Factor                  | Effect                                     |
| ----------------------- | ------------------------------------------ |
| `personality_base`      | Shy=0.1, Aggressive=0.8                    |
| `role_modifier`         | Mafia=0.7× (μιλάνε λιγότερο)              |
| `trigger: accused`      | → 0.95 (σχεδόν πάντα αμύνεται)            |
| `trigger: has_evidence` | Sheriff ξέρει ένοχο + ένοχος κατηγορείται → +0.8 |
| `recent_activity`       | Μόλις μίλησε → 0.3× (cooldown)            |

### Selection Process

```
1. Υπολογισμός speak_chance για κάθε alive AI
2. Roll random(0, 1) για κάθε AI
3. Αν random < speak_chance → AI θα μιλήσει
4. Αν πολλαπλά AI θέλουν να μιλήσουν → queue by priority:
   a. Directly accused (highest)
   b. Has evidence (high)
   c. Normal (medium)
   d. Random reaction (low)
5. Delay μεταξύ messages (simulate natural typing)
```

---

## Step 5: Message Generation & Loop Reset

Αν ένα AI αποφασίσει να μιλήσει:

### Input
1. **[[Data Architecture#role.json|role.json]]** → Τι ρόλο έχει
2. **[[Data Architecture#personality.json|personality.json]]** → Πώς μιλάει
3. **[[Data Architecture#memory.json|memory.json]]** → Τι θυμάται, ποιον εμπιστεύεται

### Output
Ένα μήνυμα στο chat (π.χ. "I agree with Player A. Player B has been acting weird all game.")

### Loop Reset
Το νέο μήνυμα μπαίνει στο chat → ξεκινάει πάλι από το **Step 1**.

---

## Phase Transition Logic

Το παιχνίδι ακολουθεί κυκλική ροή φάσεων. Κάθε μετάβαση περιλαμβάνει Win Condition check.

```
┌──────────────────────────────────────────────────────────────────┐
│                      PHASE CYCLE                                 │
│                                                                  │
│  ┌───────────┐    ┌─────────────┐    ┌──────────────────┐        │
│  │ MORNING   │───→│ DAY PHASE   │───→│ TRIAL & VOTE     │        │
│  │ REPORT    │    │ Discussion  │    │ Lynch Resolution │        │
│  └───────────┘    │ Mid-Day     │    └────────┬─────────┘        │
│       ↑           │ Events      │             │                  │
│       │           └─────────────┘    ┌────────▼─────────┐        │
│       │                              │ WIN CONDITION    │        │
│       │                              │ CHECK            │        │
│  ┌────┴──────────┐                   └────────┬─────────┘        │
│  │ NIGHT PHASE   │←───────────────────────────┘                  │
│  │ Resolution    │                                               │
│  │ Order (0-6)   │                                               │
│  └───────────────┘                                               │
└──────────────────────────────────────────────────────────────────┘
```

---

## Day Phase Flow (Ροή Ημέρας)

### Morning Report (Πρωινή Αναφορά)

Ξεκινάει κάθε νέα μέρα. Ανακοινώνει τα αποτελέσματα της νύχτας **χωρίς αποκάλυψη ρόλων**.

```
Morning Report Sequence:
1. Death Announcements (θάνατοι νύχτας — NO role reveal)
2. Bodyguard Sacrifice (αν Bodyguard πέθανε προστατεύοντας)
3. Lovers Death Link (αν ένας Lover πέθανε → και ο δεύτερος πεθαίνει)
4. Zombie Infection ("Player X looks different..." — NO role reveal)
5. Silenced Notification ("Player Y cannot speak today")
6. Full Moon Announcement (αν ενεργό → "Η σελήνη ήταν γεμάτη...")
7. 🌅 Morning Night Echo Events (E01, E02, E06, E07, E08, E10, E13, E14)
```

> **Κανόνας:** Οι ρόλοι των νεκρών δεν αποκαλύπτονται **ποτέ** δημόσια.

### Discussion Phase (Συζήτηση)

Το κύριο σώμα της ημέρας. Τρέχει η **Chat Loop** (Steps 1–5).

- AI players αναλύουν τα Morning Report events
- Η συζήτηση ξεκινάει βάσει Night Echo Events suspicion weights
- **Mayor ×2 Vote:** Αν ο Mayor έχει αποκαλυφθεί, η ψήφος του μετράει διπλά

### 💬 Mid-Day Event Interrupts

Κατά τη συζήτηση, μπορεί να εμφανιστούν **Mid-Day Night Echo Events** ως interrupts:

```
Mid-Day Event Delivery:
  timing: "midday"
  delay: random(30s – 120s) after discussion starts
  events: E03, E04, E05, E09, E11, E12
  max_per_day: 1 mid-day event
  
  Delivery:
    → System message appears in chat
    → All AI process event (Step 2: Memory Update)
    → AI react based on personality × perception_depth
    → Discussion continues
```

### Trial & Vote (Δίκη & Ψηφοφορία)

```
1. Accusation Phase → Players nominate suspects
2. Defense Phase → Accused player speaks
3. Vote Phase:
   - Κάθε ζωντανός παίκτης ψηφίζει
   - Mayor: vote weight = 2 (αν revealed)
   - Lovers: δεν μπορούν να ψηφίσουν ο ένας τον άλλον
   - Zombie victims: ΔΕΝ ψηφίζουν
   - AI vote logic → [[AI Decision Engine#Vote Decision Logic]]
4. Lynch Resolution:
   - Majority → Lynch (role NOT revealed)
   - Tie → No lynch
   - Jester Win Check: Αν ο Jester εκτελέστηκε → Jester wins
   - Last Wish Event: 50% πιθανότητα να ενεργοποιηθεί
5. Win Condition Check → [[Win Conditions]]
```

---

## Night Phase Flow (Ροή Νύχτας)

### Mafia Private Chat

Οι Mafia παίκτες μπορούν να συζητήσουν σε private channel.
- Chat Loop (Steps 1–5) τρέχει **μόνο για Mafia**
- Αποφασίζουν στόχο kill
- Godfather decides final target (overrides)

### Night Resolution Order (7 Phases)

Όλες οι νυχτερινές ενέργειες εκτελούνται **ταυτόχρονα** αλλά επιλύονται σε **σειρά προτεραιότητας**:

```
┌─────────────────────────────────────────────────────────────┐
│              NIGHT RESOLUTION ORDER                          │
├─────────┬───────────────────────────────────────────────────┤
│ Phase 0 │ PASSIVE VISITS                                   │
│         │  → Lovers: Visit partner (establishes link)      │
├─────────┼───────────────────────────────────────────────────┤
│ Phase 1 │ INFO ALTERATION                                  │
│         │  → Framer: Frame target (Sheriff sees "Mafia")   │
├─────────┼───────────────────────────────────────────────────┤
│ Phase 2 │ INVESTIGATION                                    │
│         │  → Consigliere: Learn exact role                 │
│         │  → Sheriff: Check alignment (affected by Framer) │
│         │  → Tracker: See who target visited               │
│         │  → Lookout: See who visited target               │
├─────────┼───────────────────────────────────────────────────┤
│ Phase 3 │ KILL & PROTECTION                                │
│         │  → Mafia Kill: Execute Godfather's target        │
│         │  → Doctor: Protect target (blocks kill)          │
│         │  → Bodyguard: Protect + die if target attacked   │
│         │  → Survivor: Vest (self-protection, 3 uses)      │
├─────────┼───────────────────────────────────────────────────┤
│ Phase 4 │ POST-KILL PROCESSING                             │
│         │  → Janitor: Clean body (blocks role discovery)   │
│         │  → Silencer: Silence target (muted Day N+1)     │
│         │  → Zombie: Infect killed player                  │
│         │  → Lovers Death Link: If 1 Lover dies → both die │
├─────────┼───────────────────────────────────────────────────┤
│ Phase 5 │ PASSIVE INFO                                     │
│         │  → Gossip: Receive hint about random player     │
├─────────┼───────────────────────────────────────────────────┤
│ Phase 6 │ CLEANUP & CHECKS                                 │
│         │  → Night Echo Event Selection (max 2/night)      │
│         │  → Full Moon Balance Check                       │
│         │  → Update all memory.json files                  │
│         │  → Win Condition Check                           │
└─────────┴───────────────────────────────────────────────────┘
```

**Detailed roles:** [[Night Phase#Resolution Order]]

### Full Moon Balance Check (Phase 6)

Στο τέλος κάθε νύχτας, ελέγχεται το ισοζύγιο:

```
balance_score = (town_alive / total_alive) - expected_town_ratio

Stage Determination:
  |balance_score| < 0.05  → Stage 0 (Balanced — no Full Moon)
  |balance_score| ≥ 0.05  → Stage 1 (Light boost — info roles buffed)
  |balance_score| ≥ 0.15  → Stage 2 (Full boost — all roles + Zombie cure)

Full Moon Activation:
  - probability: 0.15 per night (when stage > 0)
  - max_per_game: 3
  - Announced in Morning Report
```

**Detailed:** [[Full Moon]]

### Night Echo Event Selection (Phase 6)

```
Event Selection Engine:
1. Pool: E01–E14 (filtered by alive roles)
2. max_per_night: 2
3. Selection: Weighted random (events tied to alive roles preferred)
4. Timing assignment: Morning 🌅 or Mid-Day 💬
5. Store in game_state.json → pending_events[]
6. Deliver during appropriate Day phase moment
```

**Detailed:** [[Dynamic Events#Selection Engine]]

---

## Win Condition Checks

Ελέγχονται μετά από **κάθε** θάνατο (Lynch ή Night kill):

| Condition                                      | Winner          |
| ---------------------------------------------- | --------------- |
| Κανένας Mafia δεν ζει                           | 🏘 Town          |
| Mafia ≥ Town (ζωντανοί)                        | 🔪 Mafia         |
| Jester εκτελέστηκε με Lynch                     | 🃏 Jester        |
| Executioner πέτυχε lynch του target             | ⚖ Executioner   |
| Survivor ζει στο τέλος (με οποιονδήποτε νικητή) | 🛡 Survivor (co-win) |
| Zombie: αν zombie_victims ≥ 50% alive players   | 🧟 Zombie        |

**Detailed:** [[Win Conditions]]

---

## Related Links

- [[AI Decision Engine]] (speak probability, vote logic, event reactions)
- [[Memory System]] (weight system, perception depth, time decay)
- [[Data Architecture]] (JSON schemas — role, personality, memory, game_state)
- [[Day Phase]] (rules, timer, voting)
- [[Night Phase]] (resolution order, role actions)
- [[Dynamic Events]] (Night Echo Events E01–E14, selection engine)
- [[Full Moon]] (balance mechanic, stage system)
- [[Win Conditions]] (victory checks)
