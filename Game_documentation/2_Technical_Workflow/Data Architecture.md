---
tags:
  - technical
  - technical/data
  - workflow
---

# Data Architecture
---

Η κατάσταση του παιχνιδιού βασίζεται σε **δομημένα αρχεία JSON** που λειτουργούν ως βάση δεδομένων. Κάθε παίκτης έχει τα δικά του αρχεία, και υπάρχουν shared αρχεία για τη γενική κατάσταση.

---

## 1. Player Data (Per Virtual Player)

Κάθε Virtual Player διαθέτει **3 αρχεία**:

### role.json (Στατικό — Δεν αλλάζει)

Περιέχει τα δεδομένα του ρόλου. Δημιουργείται κατά το [[Game Setup]] και δεν τροποποιείται.

```json
{
  "player_id": "player_3",
  "player_name": "Alex",
  "role": "Sheriff",
  "alignment": "Town",
  "importance_tier": "CORE",
  "night_action": "investigate",
  "is_alive": true,
  "appears_as": "Town",
  "is_zombie": false,
  "is_revealed_mayor": false,
  "special_rules": {
    "investigation_immune": false,
    "can_be_framed": true
  }
}
```

| Field              | Type     | Description                                       |
| ------------------ | -------- | ------------------------------------------------- |
| `player_id`        | string   | Μοναδικό αναγνωριστικό                             |
| `player_name`      | string   | Display name στο chat                              |
| `role`             | string   | Ένα από 19 roles (βλ. παρακάτω)                    |
| `alignment`        | string   | `"Town"` / `"Mafia"` / `"Neutral"`               |
| `importance_tier`  | string   | `"CORE"` / `"IMPORTANT"` / `"ADVANCED"` / `"EXPANDED"` |
| `night_action`     | string   | Night action type (βλ. πίνακα)                     |
| `is_alive`         | boolean  | Ζωντανός ή νεκρός                                 |
| `appears_as`       | string   | Τι εμφανίζεται στον Sheriff (`"Town"`/`"Mafia"`)  |
| `is_zombie`        | boolean  | Αν έχει μολυνθεί από [[Zombie]]                   |
| `is_revealed_mayor`| boolean  | Αν ο [[Mayor]] έχει αποκαλυφθεί (×2 ψήφος)        |
| `special_rules`    | object   | Role-specific κανόνες                              |

#### Night Action Types — Πλήρης Λίστα (19 ρόλοι)

| Role             | `night_action`     | `alignment` | `appears_as` | Σημειώσεις                              |
| ---------------- | ------------------ | ----------- | ------------ | --------------------------------------- |
| [[Citizen]]      | `"none"`          | Town        | Town         | Χωρίς νυχτερινή ενέργεια               |
| [[Sheriff]]      | `"investigate"`   | Town        | Town         | Μαθαίνει alignment στόχου               |
| [[Doctor]]       | `"protect"`       | Town        | Town         | Protect ή Cure (mutually exclusive)     |
| [[Lookout]]      | `"watch"`         | Town        | Town         | Βλέπει ποιος επισκέφτηκε τον στόχο      |
| [[Tracker]]      | `"track"`         | Town        | Town         | Βλέπει πού πήγε ο στόχος               |
| [[Bodyguard]]    | `"guard"`         | Town        | Town         | One-time sacrifice: saves + kills Mafia |
| [[Gossip]]       | `"passive_hint"`  | Town        | Town         | Auto-receives κρυπτικό hint             |
| [[Lovers]]       | `"passive_visit"` | Town        | Town         | Auto-visit partner κάθε νύχτα           |
| [[Mayor]]        | `"none"`          | Town        | Town         | Day-focused: Reveal = ×2 ψήφος         |
| [[Godfather]]    | `"kill_vote"`     | Mafia       | **Town** ⚠️  | Investigation immune                    |
| [[Mafia Goon]]   | `"kill_vote"`     | Mafia       | Mafia        | Βασικό μέλος Mafia                      |
| [[Framer]]       | `"frame"`         | Mafia       | Mafia        | Victim φαίνεται "Mafia" στον Sheriff   |
| [[Silencer]]     | `"silence"`       | Mafia       | Mafia        | Target δεν μιλάει επόμενη μέρα          |
| [[Consigliere]]  | `"investigate_role"` | Mafia    | Mafia        | Μαθαίνει **ακριβή ρόλο** (όχι alignment)|
| [[Janitor]]      | `"investigate_dead"` | Mafia   | Mafia        | Μαθαίνει ρόλο νεκρού παίκτη            |
| [[Jester]]       | `"none"`          | Neutral     | Town         | Win = get lynched                       |
| [[Survivor]]     | `"vest"`          | Neutral     | Town         | Optional vest: αποτρέπει kill           |
| [[Executioner]]  | `"none"`          | Neutral     | Town         | Win = target lynched. Αν target πεθάνει νύχτα → γίνεται Jester |
| [[Zombie]]       | `"infect"`        | Neutral     | Town         | Μολύνει στόχο: 30-char chat, no vote, no action |

---

### personality.json (Στατικό — Δεν αλλάζει)

Καθορίζει τον τρόπο συμπεριφοράς του AI.

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
  "vote_threshold": 0.40
}
```

| Field                    | Type   | Range     | Description                                                    |
| ------------------------ | ------ | --------- | -------------------------------------------------------------- |
| `type`                   | string | —         | [[Aggressive]], [[Cautious]], [[Charismatic]], [[Logical]], [[Paranoid]], [[Shy]] |
| `speak_probability_base` | float  | 0.0–1.0   | Βάση πιθανότητας ομιλίας                                        |
| `perception_depth`       | int    | 1 / 2 / 3 | 1=Superficial, 2=Smart, 3=Deep (βλ. [[Memory System#Perception Depth]]) |
| `aggression`             | float  | 0.0–1.0   | Πόσο έντονα κατηγορεί / αντιδρά                                 |
| `team_logic`             | float  | 0.0–1.0   | Ικανότητα ομαδικής στρατηγικής (Mafia coordination)              |
| `trust_base`             | float  | 0.0–1.0   | Αρχική εμπιστοσύνη προς αγνώστους                               |
| `suspicion_sensitivity`  | float  | 0.0–1.0   | Πόσο εύκολα γίνεται ύποπτος (higher = πιο ευαίσθητος)           |
| `emotional_reactivity`   | float  | 0.0–2.0   | Πολλαπλασιαστής αντίδρασης σε events/accusations                 |
| `persuasion_power`       | float  | 0.0–1.0   | Ικανότητα να πείσει άλλους                                      |
| `persuasion_resistance`  | float  | 0.0–1.0   | Αντίσταση σε πειθώ (higher = δυσκολότερο να πεισθεί)            |
| `leadership`             | float  | 0.0–1.0   | Τάση να οδηγεί συζήτηση / μαζεύει ψήφους                       |
| `consistency`            | float  | 0.0–1.0   | Σταθερότητα αποφάσεων (low = αλλάζει γνώμη εύκολα)              |
| `deception_skill`        | float  | 0.0–1.0   | Ικανότητα ψέματος / bluffing (Mafia + Jester benefit)           |
| `bandwagon_tendency`     | float  | 0.0–1.0   | Τάση να ακολουθεί majority (high = sheep voter)                 |
| `memory_weight_modifier` | float  | 0.5–2.0   | Πολλαπλασιαστής βαρών στη μνήμη (Paranoid=1.50 εντείνει)        |
| `voting_style`           | string | —         | `"early"` / `"mid"` / `"late"` / `"bandwagon"`             |
| `vote_threshold`         | float  | 0.0–1.0   | Ελάχιστο suspicion score για ψήφο (high = χρειάζεται περισσότερα στοιχεία) |

#### Personality Quick Reference (6 τύποι)

| Stat                     | [[Aggressive]] | [[Cautious]] | [[Charismatic]] | [[Logical]] | [[Paranoid]] | [[Shy]] |
| ------------------------ | -------------- | ------------ | --------------- | ----------- | ------------ | ------- |
| `speak_probability_base` | 0.80           | 0.30         | 0.70            | 0.50        | 0.60         | 0.10    |
| `perception_depth`       | 1              | 2            | 2               | 2           | 3            | 1       |
| `aggression`             | 0.90           | 0.15         | 0.30            | 0.20        | 0.55         | 0.05    |
| `team_logic`             | 0.30           | 0.65         | 0.85            | 0.70        | 0.20         | 0.50    |
| `trust_base`             | 0.25           | 0.40         | 0.55            | 0.50        | 0.10         | 0.60    |
| `suspicion_sensitivity`  | 0.70           | 0.50         | 0.40            | 0.50        | 0.95         | 0.30    |
| `emotional_reactivity`   | 1.40           | 0.60         | 1.00            | 0.50        | 1.60         | 0.80    |
| `persuasion_power`       | 0.50           | 0.55         | 0.90            | 0.65        | 0.40         | 0.10    |
| `persuasion_resistance`  | 0.40           | 0.80         | 0.70            | 0.85        | 0.60         | 0.20    |
| `leadership`             | 0.70           | 0.25         | 0.85            | 0.45        | 0.35         | 0.05    |
| `consistency`            | 0.40           | 0.90         | 0.75            | 0.95        | 0.30         | 0.70    |
| `deception_skill`        | 0.30           | 0.60         | 0.80            | 0.55        | 0.35         | 0.25    |
| `bandwagon_tendency`     | 0.20           | 0.35         | 0.15            | 0.10        | 0.25         | 0.90    |
| `memory_weight_modifier` | 1.20           | 0.70         | 0.90            | 1.00        | 1.50         | 0.80    |
| `voting_style`           | early          | late         | early           | mid         | mid          | bandwagon |
| `vote_threshold`         | 0.40           | 0.70         | 0.50            | 0.65        | 0.35         | 0.20    |

**Used by:** [[AI Decision Engine#Speak Probability Engine]], [[Memory System#Perception Depth]], [[AI Decision Engine#Vote Decision Logic]]

---

### memory.json (Δυναμικό — Ανανεώνεται συνεχώς)

Το πιο σημαντικό αρχείο. Περιέχει **ό,τι γνωρίζει** ο παίκτης.

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
        {"day": 2, "action": "agreed_with_me", "weight": 0.3}
      ]
    },
    "player_5": {
      "trust": -0.4,
      "suspicion": 0.9,
      "interaction_count": 3,
      "last_interaction_day": 3,
      "history": [
        {"day": 2, "action": "accused_me", "weight": 0.8}
      ]
    }
  },
  "known_roles": {
    "player_7": {
      "role": "Mafia",
      "source": "investigation",
      "day_discovered": 2,
      "confidence": 1.0
    }
  },
  "night_results": [
    {"night": 1, "action": "investigate", "target": "player_4", "result": "Town"},
    {"night": 2, "action": "investigate", "target": "player_7", "result": "Mafia"}
  ],
  "gossip_hints": [],
  "events_witnessed": [
    {"day": 1, "type": "E06_COMMOTION", "target": "player_6", "timing": "morning", "suspicion_weight": 0.25},
    {"day": 2, "type": "E07_GUN_LICENSE", "target": "player_2", "timing": "midday", "suspicion_weight": 0.35}
  ],
  "voting_history": [
    {"day": 1, "voted_for": "player_5", "result": "player_5 lynched", "role_revealed": "Citizen"}
  ]
}
```

**Detailed:** [[Memory System]]

| Section            | Updated When                     | Decays? |
| ------------------ | -------------------------------- | ------- |
| `relationships`    | Every chat message               | ✅ Yes  |
| `known_roles`      | Night results / role claims      | ❌ No   |
| `night_results`    | After night resolution           | ❌ No   |
| `gossip_hints`     | After night (Gossip only)        | ❌ No   |
| `events_witnessed` | Night Echo Events (E01–E14)      | ✅ Yes  |
| `voting_history`   | After each Trial                 | ❌ No   |

---

## 2. Chat Data (Shared)

### chat_events.json

Ένα **shared** αρχείο που περιέχει τη σημασιολογική ανάλυση κάθε μηνύματος στο Public Chat.

```json
{
  "events": [
    {
      "message_id": 1,
      "speaker": "player_1",
      "action": "accuse",
      "target": "player_3",
      "weight": 0.8,
      "day": 1,
      "raw_text": "I think Player 3 is suspicious",
      "indirect_targets": []
    },
    {
      "message_id": 2,
      "speaker": "player_5",
      "action": "agree",
      "target": "player_1",
      "weight": 0.5,
      "day": 1,
      "raw_text": "Yeah I agree, Player 3 voted weird",
      "indirect_targets": [
        {"player": "player_3", "relation": "indirect_accuse", "weight": 0.3}
      ]
    },
    {
      "message_id": 3,
      "speaker": "player_3",
      "action": "defend",
      "target": "self",
      "weight": 0.9,
      "day": 1,
      "raw_text": "I'm not Mafia! I'm the Doctor!",
      "indirect_targets": [],
      "claim": {"role": "Doctor", "verifiable": false}
    }
  ]
}
```

**Updated by:** [[Gameplay Loop#Step 1|Chat Semantic Analyzer]]
**Read by:** All AI players during [[Gameplay Loop#Step 2|Memory Update]]

---

## 3. Game State (Global)

### game_state.json

Ένα **global** αρχείο που αντικατοπτρίζει την τρέχουσα κατάσταση του παιχνιδιού.

```json
{
  "game_id": "game_001",
  "phase": "day",
  "day_number": 3,
  "sub_phase": "discussion",
  "players_alive": ["player_1", "player_2", "player_3", "player_5", "player_7"],
  "players_dead": [
    {"id": "player_4", "role": "Citizen", "killed_by": "mafia", "day": 1},
    {"id": "player_6", "role": "Mafia Goon", "killed_by": "lynch", "day": 2},
    {"id": "player_8", "role": "Doctor", "killed_by": "mafia", "day": 2}
  ],
  "mafia_members": ["player_2", "player_5"],
  "events_active": [],
  "full_moon_tonight": false,
  "votes_current": {},
  "mayor_revealed": null,
  "zombie_victims": [],
  "full_moon_count": 0,
  "game_config": {
    "total_players": 10,
    "town_count": 6,
    "mafia_count": 3,
    "neutral_count": 1,
    "decay_factor": 0.7,
    "last_wish_probability": 0.4,
    "night_echo_max_per_night": 2,
    "full_moon_probability": 0.15,
    "full_moon_max_per_game": 3,
    "balance_thresholds": {
      "stage_1": 0.05,
      "stage_2": 0.15
    }
  }
}
```

| Field               | Description                                       |
| ------------------- | ------------------------------------------------- |
| `phase`             | "day" / "night"                                   |
| `sub_phase`         | "morning_report" / "discussion" / "trial" / "mafia_chat" / "night_actions" / "resolution" |
| `players_alive`     | IDs ζωντανών παικτών                               |
| `players_dead`      | Λίστα νεκρών με role, cause, time of death        |
| `mafia_members`     | IDs Mafia μελών (server-only, not visible to Town) |
| `events_active`     | Τρέχοντα Dynamic Events                           |
| `mayor_revealed`    | Player ID του Mayor αν αποκαλύφθηκε (null αλλιώς)|
| `zombie_victims`    | IDs παικτών-zombies (30-char chat, no vote)       |
| `full_moon_count`   | Πόσες Full Moon έχουν ενεργοποιηθεί (max 3)       |
| `game_config`       | Αμετάβλητες ρυθμίσεις παιχνιδιού                  |

---

## 4. Data Flow Diagram

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  role.json   │     │ personality.json  │     │  memory.json     │
│  (static)    │     │ (static, 17 stats)│     │  (dynamic)       │
│              │     │                    │     │                  │
│ role (19)    │     │ speak_prob_base    │     │ relationships    │
│ alignment    │     │ perception_depth   │     │ known_roles      │
│ night_action │     │ aggression         │     │ night_results    │
│ appears_as   │     │ persuasion_power   │     │ events_witnessed │
│ is_zombie    │     │ memory_weight_mod  │     │ voting_history   │
│ importance   │     │ vote_threshold     │     │ gossip_hints     │
└──────┬───────┘     └────────┬───────────┘     └────────┬─────────┘
       │                      │                          │
       └──────────────────────┼──────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ AI Decision      │
                    │ Engine           │
                    │                  │
                    │ → Speak chance   │
                    │ → Vote decision  │
                    │ → Message gen    │
                    │ → Event reaction │
                    └───────┬──────────┘
                            │
                            ▼
                    ┌──────────────────┐
                    │ chat_events.json │ ← New message added
                    │ (shared)         │
                    └───────┬──────────┘
                            │
                            ▼
                    ┌──────────────────┐
                    │ game_state.json  │ ← Phase transitions
                    │ (global)         │   Win checks
                    │                  │   Balance Score
                    │ zombie_victims   │   Full Moon state
                    │ mayor_revealed   │   Night Echo events
                    └──────────────────┘
```

---

## Related Links

- [[Memory System]] (detailed memory mechanics)
- [[AI Decision Engine]] (how data is used for decisions)
- [[Gameplay Loop]] (when data is read/written)
- [[Game Setup]] (how data is initialized)
- [[Dynamic Events]] (Night Echo events E01–E14, Last Wish, Full Moon)
- [[Night Phase]] (Night Resolution Order — 7 phases)
- [[Technical Specs]] (implementation details)
