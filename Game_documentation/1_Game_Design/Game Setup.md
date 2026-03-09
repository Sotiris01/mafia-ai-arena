---
tags:
  - game_design
  - mechanic
  - setup
---

# Game Setup & Start
---

Αυτό το αρχείο περιγράφει τη ροή εκκίνησης ενός παιχνιδιού, από το Lobby μέχρι την πρώτη νύχτα.

## 1. Lobby

| Step | Action                                                         |
| ---- | -------------------------------------------------------------- |
| 1    | Ο ανθρώπινος παίκτης ανοίγει το παιχνίδι                        |
| 2    | Επιλέγει **αριθμό AI αντιπάλων** (π.χ. 7–15 παίκτες)            |
| 3    | Προαιρετικά: ρύθμιση δυσκολίας (αριθμός Smart AI, Neutral ρόλοι) |
| 4    | Πατάει "Start Game"                                             |

### Player Count Scaling

| Total Players | Town | Mafia | Neutral | Town Roles                                    | Mafia Roles                          | Neutral Roles                |
| ------------- | ---- | ----- | ------- | --------------------------------------------- | ------------------------------------ | -----------------------------|
| 7             | 4    | 2     | 1       | Sheriff, Doctor, Citizen ×2                   | Godfather, Mafia Goon                | Jester                       |
| 8             | 5    | 2     | 1       | +Lookout                                      | =                                    | =                            |
| 9             | 5    | 3     | 1       | =                                             | +Framer                              | =                            |
| 10            | 6    | 3     | 1       | +Gossip, +Lovers (2 Citizens → Lovers)        | =                                    | =                            |
| 11            | 6    | 3     | 2       | =                                             | =                                    | +Survivor                    |
| 12            | 7    | 3     | 2       | +Bodyguard                                    | =                                    | =                            |
| 13            | 7    | 4     | 2       | =                                             | +Silencer                            | =                            |
| 14            | 8    | 4     | 2       | +Tracker ή Mayor                              | =                                    | =                            |
| 15            | 8    | 4     | 3       | =                                             | =                                    | +Executioner ή Zombie         |
| 16            | 9    | 5     | 2       | +Mayor ή Tracker (ό,τι δεν μπήκε στους 14)   | +Consigliere ή Janitor               | =                            |

> **Σημείωση:** Σε κάθε row, το `+` σημαίνει νέος ρόλος που προστίθεται. Το `=` σημαίνει ίδιοι ρόλοι με πριν. Η "ή" επιλογή γίνεται **τυχαία** κατά το setup.

### Role Importance Tiers

| Tier | Σύμβολο | Εμφάνιση    | Ρόλοι                                                    |
| ---- | ------- | ----------- | -------------------------------------------------------- |
| 🟢 **CORE**     | Πάντα  | 7+ παίκτες  | Sheriff, Doctor, Citizen, Godfather, Mafia Goon, Jester  |
| 🟡 **IMPORTANT** | Νωρίς | 8–9 παίκτες | Lookout, Framer, Survivor                                |
| 🔵 **ADVANCED** | Μέσα  | 10–12 παίκτες| Gossip, Bodyguard, Executioner, Tracker                  |
| 🟣 **EXPANDED** | Αργά  | 13–16 παίκτες| Silencer, Mayor, Consigliere, Janitor, Zombie            |

### Faction Balance Ratios

| Total Players | Town %  | Mafia % | Neutral % | Balance Note                          |
| ------------- | ------- | ------- | --------- | ------------------------------------- |
| 7             | 57%     | 29%     | 14%       | Tight — 1 bad lynch = Mafia edge      |
| 10            | 60%     | 30%     | 10%       | Balanced — standard experience        |
| 12            | 58%     | 25%     | 17%       | Town advantage → Mafia gets more tools|
| 15            | 53%     | 27%     | 20%       | Complex — Neutrals influence heavily  |

---

## 2. Role Distribution

Ο Game Engine εκτελεί τον αλγόριθμο κατανομής ρόλων:

```
1. Δημιουργία player pool (Human + AI players)
2. Shuffle randomly
3. Determine available roles based on Player Count Scaling table
4. Ανάθεση Mafia ρόλων:
   - 1x Godfather (πάντα)
   - 1x Mafia Goon (πάντα)
   - Framer (αν 9+ παίκτες)
   - Silencer (αν 13+ παίκτες)
   - Consigliere ή Janitor (αν 16+ παίκτες, τυχαία επιλογή)
   - Extra Mafia Goon (αν slots > assigned special Mafia)
5. Ανάθεση Neutral ρόλων:
   - 1x Jester (πάντα)
   - 1x Survivor (αν 11+ παίκτες)
   - 1x Executioner ή Zombie (αν 15+ παίκτες, τυχαία)
6. Ανάθεση Town ρόλων:
   - 1x Sheriff (πάντα)
   - 1x Doctor (πάντα)
   - 1x Lookout (αν 8+ παίκτες)
   - 1x Gossip (αν 10+ παίκτες)
   - 1x Bodyguard (αν 12+ παίκτες)
   - 1x Tracker ή Mayor (αν 14+ παίκτες, τυχαία)
   - Citizens (υπόλοιπα Town slots)
7. Lovers assignment:
   - Αν 10+ παίκτες → 2 Citizens μετατρέπονται σε Lovers
   - Κάθε Lover μαθαίνει τον partner του
   - Μόνο Citizens μπορούν να γίνουν Lovers
8. Executioner target assignment:
   - Αν Executioner υπάρχει → assign τυχαίο Town non-unique target
   - Eligible targets: Citizen, Lookout, Gossip (ποτέ Sheriff/Doctor)
8. Ο ανθρώπινος παίκτης μπορεί να πάρει ΟΠΟΙΟΝΔΗΠΟΤΕ ρόλο
```

### Restrictions

- Ο ανθρώπινος παίκτης **δεν μπορεί να επιλέξει** ρόλο — η ανάθεση είναι τυχαία.
- **Unique ρόλοι** (μόνο 1 ανά παιχνίδι): Sheriff, Doctor, Lookout, Gossip, Bodyguard, Tracker, Mayor, Godfather, Framer, Silencer, Consigliere, Janitor, Jester, Survivor, Executioner, Zombie.
- **Πολλαπλοί**: [[Citizen]] και [[Mafia Goon]] μπορούν να είναι πολλαπλοί.
- **Lovers**: Ακριβώς 1 ζευγάρι (2 παίκτες) — προέρχονται από Citizens.

---

## 3. AI Personality Assignment

Μετά τους ρόλους, κάθε AI λαμβάνει μια **[[Data Architecture#personality.json|personality]]**:

| Personality Type | speak_probability_base | perception_depth | Behavior                           |
| ---------------- | ---------------------- | ---------------- | ---------------------------------- |
| **Aggressive**   | 0.8                    | superficial      | Μιλάει πολύ, κατηγορεί εύκολα       |
| **Cautious**     | 0.3                    | smart            | Μιλάει λίγο, αναλύει πριν μιλήσει   |
| **Paranoid**     | 0.6                    | deep             | Υποπτεύεται τους πάντες              |
| **Logical**      | 0.5                    | smart            | Βασίζεται σε στοιχεία               |
| **Shy**          | 0.1                    | superficial      | Σπάνια μιλάει, ακολουθεί τον όχλο   |
| **Charismatic**  | 0.7                    | smart            | Πείθει εύκολα, δημιουργεί συμμαχίες |

---

## 4. Role Reveal

| Παίκτης        | Βλέπει                                                     |
| -------------- | ---------------------------------------------------------- |
| **Town μέλος** | Ρόλο + Win Condition μόνο για τον εαυτό                      |
| **Mafia μέλος**| Ρόλο + Win Condition + **ονόματα συμπαικτών Mafia**          |
| **Neutral**    | Ρόλο + Win Condition ειδικό (π.χ. "Get lynched" για Jester) |

### Role Card UI

```
┌─────────────────────────────────┐
│  🃏 YOUR ROLE: Sheriff          │
│                                 │
│  Alignment: TOWN                │
│                                 │
│  Night Action: Investigate      │
│  Choose a player to discover    │
│  their alignment                │
│                                 │
│  Win Condition:                 │
│  Eliminate all Mafia members    │
│                                 │
│  ⚠️ The Godfather appears       │
│  innocent to your investigation │
└─────────────────────────────────┘
```

---

## 5. Game Begins — Night 1

| Rule                                           | Reason                                               |
| ---------------------------------------------- | ---------------------------------------------------- |
| Το παιχνίδι ξεκινάει στη **Night 1**, όχι Day 1 | Η πρώτη μέρα χωρίς στοιχεία θα ήταν τυχαία ψηφοφορία |
| **Δεν γίνεται ψηφοφορία** την πρώτη μέρα        | Δίνεται χρόνος για αρχική συζήτηση                    |
| Night actions δημιουργούν αρχικά στοιχεία        | Morning Report Day 1 θα έχει νόημα                    |

### Night 1 Flow

```
Night 1:
  Phase 0: Lovers visit (αν υπάρχουν) → αυτόματη επίσκεψη
  Phase 1: Framer frame (αν υπάρχει) → marks target
  Phase 2: Investigations
    → Consigliere: Ερευνά ρόλο (αν υπάρχει)
    → Sheriff: Ερευνά πρώτο ύποπτο
    → Tracker: Ακολουθεί ύποπτο (αν υπάρχει)
    → Lookout: Παρακολουθεί ένα σπίτι (αν υπάρχει)
  Phase 3: Kill & Protection
    → Mafia chat: Ψηφίζουν τον πρώτο στόχο
    → Doctor: Προστατεύει (χωρίς πληροφορίες, τυχαία)
    → Bodyguard: Φυλάει κάποιον (αν υπάρχει)
    → Survivor: Vest decision
  Phase 4: Post-kill
    → Janitor: Ερευνά νεκρό (αν υπάρχει)
    → Silencer: Σιγάζει παίκτη (αν υπάρχει)
    → Zombie: Μολύνει στόχο (αν υπάρχει)
    → Lovers: Death link check (αν πέθανε Lover)
  Phase 5: Gossip: Λαμβάνει πρώτο clue (αν υπάρχει)
  Phase 6: Resolution + Win Check
  
Day 1:
  → Morning Report: Ανακοίνωση θανάτου + Events
  → Η πραγματική συζήτηση ξεκινάει
```

---

## JSON Initialization

Κατά το Setup, ο Game Engine δημιουργεί τα εξής αρχεία:

### Per Player

```json
// role.json
{
  "player_id": "player_3",
  "role": "Sheriff",
  "alignment": "Town",
  "night_action": "investigate",
  "is_alive": true
}
```

```json
// personality.json
{
  "type": "Logical",
  "speak_probability_base": 0.5,
  "perception_depth": "smart",
  "traits": ["evidence-based", "calm", "methodical"]
}
```

```json
// memory.json (αρχικό — κενό)
{
  "player_id": "player_3",
  "day": 0,
  "relationships": {},
  "known_roles": {},
  "suspicions": {},
  "night_results": [],
  "gossip_hints": [],
  "events_witnessed": []
}
```

### Global

```json
// game_state.json
{
  "game_id": "game_001",
  "phase": "night",
  "day_number": 1,
  "players_alive": [...],
  "players_dead": [],
  "events_active": [],
  "mafia_members": ["player_2", "player_5", "player_8"]
}
```

## Related Links

- [[Win Conditions]]
- [[Night Phase]]
- [[Day Phase]]
- [[Data Architecture]]
- [[Dynamic Events]]
