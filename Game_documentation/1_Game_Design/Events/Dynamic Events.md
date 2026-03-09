---
tags:
  - event
  - event/system
  - game_design
---

# Dynamic Events System
---

Το Dynamic Events System εισάγει τυχαία γεγονότα στο παιχνίδι για να αποτρέψει την προβλεψιμότητα, να δώσει στοιχεία στους παίκτες και να δημιουργήσει δραματικές ανατροπές. Κανένα παιχνίδι δεν είναι ίδιο χάρη σε αυτό το σύστημα.

---

## Event Types

Το σύστημα περιλαμβάνει **3 κατηγορίες** events:

| #  | Κατηγορία                                  | Trigger                            | Timing                               |
| -- | ------------------------------------------ | ---------------------------------- | ------------------------------------ |
| 1  | [[Last Wish]]                              | Παίκτης lynched                    | Αμέσως μετά την εξόντωση              |
| 2  | [[#Night Echo Events — Κατάλογος Γεγονότων]] | Νυχτερινές ενέργειες ρόλων         | Morning Report ή Mid-Day Discussion   |
| 3  | [[Full Moon]]                              | Ανισορροπία ομάδων                 | Morning Report πριν τη νύχτα          |

---

## Night Echo Events — Κατάλογος Γεγονότων

Τα Night Echo Events είναι **κρυπτικά γεγονότα** που εμφανίζονται ως αντίκτυπος νυχτερινών ενεργειών. Δίνουν **μερική πληροφορία** — αρκετή για να πυροδοτήσει συζήτηση, αλλά **ποτέ ολόκληρη** την αλήθεια.

### Βασικοί Κανόνες

| Κανόνας                            | Περιγραφή                                                          |
| ---------------------------------- | ------------------------------------------------------------------ |
| **Σύνδεση με ρόλο**                | Κάθε event εμφανίζεται **μόνο** αν ο συνδεδεμένος ρόλος υπάρχει στο παιχνίδι |
| **Μερική αλήθεια**                 | Τα events δίνουν clues, δεν αποκαλύπτουν ρόλους ή alignment        |
| **Πιθανότητα ανά trigger**         | Κάθε event έχει `probability` (0.0–1.0) — ΔΕΝ εμφανίζεται πάντα   |
| **Max events ανά νύχτα**           | Μέγιστο **2 events** ανά νύχτα (αποτρέπει information overload)     |
| **Δύο χρόνοι εμφάνισης**          | Morning Report ή κατά τη Discussion (mid-day interrupt)             |

### Χρόνοι Εμφάνισης

| Timing             | Πότε                                                    | Εμφάνιση                                    |
| ------------------ | ------------------------------------------------------- | ------------------------------------------- |
| **🌅 Morning**     | Αρχή Day Phase, μέσα στο [[Day Phase#Morning Report]]   | Μαζί με θανάτους + announcements             |
| **💬 Mid-Day**     | Κατά τη [[Day Phase#Public Discussion\|συζήτηση]]         | Interrupt μήνυμα — σπάει τη ροή, πυροδοτεί αντιδράσεις |

### Master Event Table

| ID   | Event                                            | Timing     | Prob  | Linked Roles                                    | Τι Αποκαλύπτει                                    |
| ---- | ------------------------------------------------ | ---------- | ----- | ----------------------------------------------- | ------------------------------------------------- |
| E01  | [[E01 - Noise at House\|Noise at House]]          | 🌅 Morning | 0.30  | ALL visiting roles                              | Κάποιος πήγε στο σπίτι — όχι ποιος/γιατί          |
| E02  | [[E02 - Shadow Spotted\|Shadow Spotted]]          | 🌅 Morning | 0.20  | Mafia + Zombie                                  | Ύποπτη κίνηση — πιθανή απειλή                     |
| E03  | [[E03 - Footsteps Heard\|Footsteps Heard]]        | 🌅 Morning | 0.25  | Sheriff, Consigliere, Tracker, Lookout          | Έρευνα/παρατήρηση — Town ή Mafia investigator;    |
| E04  | [[E04 - Argument Heard\|Argument Heard]]          | 🌅 Morning | 0.15* | Lovers, Bodyguard                               | Σύγκρουση — ρομαντική ή μάχη;                     |
| E05  | [[E05 - Someone Seen Leaving\|Someone Seen Leaving]] | 🌅 Morning | 0.15  | ALL visiting roles                           | Reconfirm επίσκεψης — ισχυρότερο clue             |
| E06  | [[E06 - Commotion\|Commotion]]                    | 🌅 Morning | 0.40  | Doctor + Mafia (same target)                    | Πολλαπλή δραστηριότητα — πιθανό save               |
| E07  | [[E07 - Gun License\|Gun License]]                | 💬 Mid-Day | 0.10  | Bodyguard, Sheriff _(σπάνια)_, Mafia            | "Οπλισμένος" ρόλος — αλλά ποια faction;           |
| E08  | [[E08 - Nervous Behavior\|Nervous Behavior]]      | 💬 Mid-Day | 0.15  | Mafia voters, Jester                            | Νευρικότητα — ένοχος ή bait;                      |
| E09  | [[E09 - Watchful Eyes\|Watchful Eyes]]             | 💬 Mid-Day | 0.15  | Tracker, Lookout, Executioner                   | Ενδιαφέρον για παίκτη — παρατήρηση ή στόχος;      |
| E10  | [[E10 - Whispered Conversation\|Whispered Conversation]] | 💬 Mid-Day | 0.12 | Mafia members, Lovers                     | Μυστική σχέση — αλλά ποια;                        |
| E11  | [[E11 - Medical Supplies\|Medical Supplies]]       | 🌅 Morning | 0.20  | Doctor                                          | Πιθανή προστασία/θεραπεία                         |
| E12  | [[E12 - Guard Post\|Guard Post]]                   | 🌅 Morning | 0.25  | Bodyguard                                       | Κάποιος φυλάσσεται                                |
| E13  | [[E13 - Strange Illness\|Strange Illness]]         | 💬 Mid-Day | 0.20  | Zombie                                          | Πιθανή μόλυνση (ή red herring)                    |
| E14  | [[E14 - Silenced Morning\|Silenced Morning]]       | 🌅 Morning | 0.20  | Silencer                                        | Hint σιώπησης                                     |

> \* E04 probability: `0.15` για Lovers fight (per night), `1.00` αν Bodyguard πεθάνει σώζοντας

---

### Event Selection Engine

Κάθε νύχτα, μετά το Resolution:

```
generateNightEchoEvents(night_actions):
  candidate_events = []
  
  // 1. Collect all eligible events
  for action in night_actions:
    for event in EVENT_CATALOG:
      if action.role in event.linked_roles:
        if event.role_exists_in_game:  // ΚΡΙΣΙΜΟ: μόνο αν ο ρόλος υπάρχει
          if random() < event.probability:
            candidate_events.add(event.generate(action))
  
  // 2. Max 2 events per night
  if candidate_events.length > 2:
    candidate_events = random_select(candidate_events, 2)
  
  // 3. Split by timing
  morning_events = candidate_events.filter(e => e.timing == "morning")
  midday_events = candidate_events.filter(e => e.timing == "midday")
  
  // 4. Morning events → Morning Report
  for event in morning_events:
    morning_report.add(event.message)
  
  // 5. Mid-Day events → scheduled during Discussion
  for event in midday_events:
    schedule_interrupt(event.message, delay = random(30s, 120s))
```

### Σχεδιαστικές Σημειώσεις

| Αρχή                                | Γιατί                                                          |
| ------------------------------------ | -------------------------------------------------------------- |
| **Μερική αλήθεια μόνο**             | Αν τα events αποκάλυπταν τα πάντα, η συζήτηση θα ήταν trivial  |
| **Linked σε ρόλους**                | Αποτρέπει impossible events (π.χ. Doctor event χωρίς Doctor)    |
| **Max 2 ανά νύχτα**                 | Πολλά events = information overload → αδύνατη ανάλυση          |
| **Δύο χρόνοι**                      | Morning = context, Mid-Day = discussion catalyst               |
| **Ίδιο event, πολλά αίτια**        | "Φασαρία στο σπίτι" μπορεί να σημαίνει 5+ πράγματα = αβεβαιότητα |
| **Probabilities χαμηλές**           | Δεν πρέπει να εμφανίζεται event κάθε νύχτα — σπανιότητα = αξία |

---

## Event Configuration (Game Engine)

```json
{
  "events": {
    "last_wish": {
      "probability": 0.4,
      "actions": ["reveal_evidence", "force_public_vote", "expose_alignment", "curse"]
    },
    "night_echo": {
      "max_per_night": 2,
      "min_night": 1,
      "catalog": {
        "E01_NOISE":        { "probability": 0.30, "timing": "morning", "linked": ["*_visiting"] },
        "E02_SHADOW":       { "probability": 0.20, "timing": "morning", "linked": ["Mafia", "Zombie"] },
        "E03_FOOTSTEPS":    { "probability": 0.25, "timing": "morning", "linked": ["Sheriff", "Consigliere", "Tracker", "Lookout"] },
        "E04_ARGUMENT":     { "probability": 0.15, "timing": "morning", "linked": ["Lovers", "Bodyguard"] },
        "E05_SEEN_LEAVING": { "probability": 0.15, "timing": "morning", "linked": ["*_visiting"] },
        "E06_COMMOTION":    { "probability": 0.40, "timing": "morning", "linked": ["Doctor+Mafia_same_target"] },
        "E07_GUN_LICENSE":  { "probability": 0.10, "timing": "midday", "linked": ["Bodyguard", "Sheriff", "Godfather", "Mafia Goon"], "weights": [0.50, 0.15, 0.175, 0.175] },
        "E08_NERVOUS":      { "probability": 0.15, "timing": "midday", "linked": ["Mafia_voters", "Jester"] },
        "E09_WATCHFUL":     { "probability": 0.15, "timing": "midday", "linked": ["Tracker", "Lookout", "Executioner"] },
        "E10_WHISPERS":     { "probability": 0.12, "timing": "midday", "linked": ["Mafia_chat", "Lovers"] },
        "E11_MEDICAL":      { "probability": 0.20, "timing": "morning", "linked": ["Doctor"] },
        "E12_GUARD_POST":   { "probability": 0.25, "timing": "morning", "linked": ["Bodyguard"] },
        "E13_ILLNESS":      { "probability": 0.20, "timing": "midday", "linked": ["Zombie"], "red_herring_chance": 0.30 },
        "E14_SILENCED":     { "probability": 0.20, "timing": "morning", "linked": ["Silencer"] }
      }
    },
    "full_moon": {
      "probability": 0.15,
      "min_night": 3,
      "max_per_game": 3,
      "requires_imbalance": true,
      "balance_thresholds": {
        "stage_1_threshold": 0.05,
        "stage_2_threshold": 0.15
      },
      "excluded_from_boost": ["Bodyguard", "Zombie", "Survivor", "Lovers"]
    }
  }
}
```

---

## AI Response to Events

Κάθε AI Player αντιδρά στα Night Echo Events βάσει:
- **[[Data Architecture#personality.json|Personality]]**: Ο [[Paranoid]] αντιδρά εντόνως σε E01/E02 (ύποπτη δραστηριότητα). Ο [[Shy]] αγνοεί τα περισσότερα events. Ο [[Logical]] cross-references events με memory data.
- **[[Data Architecture#memory.json|Memory]]**: Τα events καταγράφονται στο memory.json και αυξάνουν suspicion weights στους εμπλεκόμενους παίκτες.
- **[[AI Decision Engine#Perception Depth|Perception Depth]]**: Smart/Deep AI cross-references events με vote patterns + investigation results.
- **Timing impact**: Morning events ξεκινούν τη συζήτηση. Mid-Day events διακόπτουν τη ροή — πυροδοτούν νέες κατηγορίες.

### Event Weight Impact on Memory

| Event Type       | Suspicion Weight στο Target | Σχόλιο                              |
| ---------------- | --------------------------- | ----------------------------------- |
| E01, E05         | +0.15                       | Ήπιο — κάποιος πήγε εκεί           |
| E02 (Shadow)     | +0.30                       | Πιο ύποπτο — Mafia/Zombie linked   |
| E03 (Footsteps)  | +0.10                       | Neutral — μπορεί να ήταν Sheriff    |
| E04 (Argument)   | +0.20                       | Αξιοσημείωτο — σύγκρουση           |
| E06 (Commotion)  | +0.25                       | Πολλαπλή δραστηριότητα              |
| E07 (Gun)        | +0.35                       | Ψηλό — "οπλισμένος" = επικίνδυνος  |
| E08 (Nervous)    | +0.30                       | Νευρικός = πιθανός ένοχος           |
| E09 (Watchful)   | +0.15                       | Ήπιο — παρατήρηση                  |
| E10 (Whispers)   | +0.40                       | Πολύ ψηλό — μυστική σχέση           |
| E11 (Medical)    | -0.10                       | Αρνητικό (μειώνει suspicion = πιθανός Doctor ally) |
| E12 (Guard Post) | -0.15                       | Αρνητικό (φυλάσσεται = πιθανός Town) |
| E13 (Illness)    | +0.20                       | Zombie concern                      |
| E14 (Silenced)   | +0.10                       | Ήπιο hint                          |

---

## Related Links

- [[Last Wish]] — Event κατά το lynch
- [[Full Moon]] — Balance mechanic
- [[Day Phase#Morning Report]] (Morning events εμφανίζονται εδώ)
- [[Day Phase#Public Discussion]] (Mid-Day events εμφανίζονται εδώ)
- [[Night Phase]] (events πηγάζουν από νυχτερινές ενέργειες)
- [[AI Decision Engine]] (πώς τα AI αντιδρούν σε events)
- [[Memory System]] (events αποθηκεύονται ως memory weights)
- [[Gossip]] (λαμβάνει παρόμοια hints — αλλά ο Gossip είναι role-specific, τα events είναι public)
