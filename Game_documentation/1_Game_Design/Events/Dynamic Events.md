---
tags:
  - event
  - event/system
  - game_design
---

# Dynamic Events System
---

---

## Event Types

| #  |  | Trigger                            | Timing                               |
| -- | ------------------------------------------ | ---------------------------------- | ------------------------------------ |
| 1  | [[Last Wish]]                              | lynched |  |
| 2  | [[#Night Echo Events|  | Morning Report Mid-Day Discussion |
| 3  | [[Full Moon]]                              |  | Morning Report |

---

## Night Echo Events

|  |  |
| ---------------------------------- | ------------------------------------------------------------------ |
| ** ** | event **** |
| ** ** | events clues, alignment |
| ** trigger** | event `probability` (0.0–1.0)|
| **Max events ** | **2 events** |
| ** ** | Morning Report Discussion (mid-day interrupt) |

| Timing             |  |  |
| ------------------ | ------------------------------------------------------- | ------------------------------------------- |
| **🌅 Morning**     | Day Phase, [[Day Phase#Morning Report]] | + announcements |
| **💬 Mid-Day**     | [[Day Phase#Public Discussion\| ]] | Interrupt |

### Master Event Table

| ID   | Event                                            | Timing     | Prob  | Linked Roles                                    |  |
| ---- | ------------------------------------------------ | ---------- | ----- | ----------------------------------------------- | ------------------------------------------------- |
| E01  | [[E01 - Noise at House\|Noise at House]]          | 🌅 Morning | 0.30  | ALL visiting roles                              |  |
| E02  | [[E02 - Shadow Spotted\|Shadow Spotted]]          | 🌅 Morning | 0.20  | Mafia + Zombie                                  |  |
| E03  | [[E03 - Footsteps Heard\|Footsteps Heard]]        | 🌅 Morning | 0.25  | Sheriff, Consigliere, Tracker, Lookout          | / |
| E04  | [[E04 - Argument Heard\|Argument Heard]]          | 🌅 Morning | 0.15* | Lovers, Bodyguard                               |  |
| E05  | [[E05 - Someone Seen Leaving\|Someone Seen Leaving]] | 🌅 Morning | 0.15  | ALL visiting roles                           | Reconfirm |
| E06  | [[E06 - Commotion\|Commotion]]                    | 🌅 Morning | 0.40  | Doctor + Mafia (same target)                    |  |
| E07  | [[E07 - Gun License\|Gun License]]                | 💬 Mid-Day | 0.10  | Bodyguard, Sheriff __, Mafia            | "" |
| E08  | [[E08 - Nervous Behavior\|Nervous Behavior]]      | 💬 Mid-Day | 0.15  | Mafia voters, Jester                            |  |
| E09  | [[E09 - Watchful Eyes\|Watchful Eyes]]             | 💬 Mid-Day | 0.15  | Tracker, Lookout, Executioner                   |  |
| E10  | [[E10 - Whispered Conversation\|Whispered Conversation]] | 💬 Mid-Day | 0.12 | Mafia members, Lovers                     |  |
| E11  | [[E11 - Medical Supplies\|Medical Supplies]]       | 🌅 Morning | 0.20  | Doctor                                          | / |
| E12  | [[E12 - Guard Post\|Guard Post]]                   | 🌅 Morning | 0.25  | Bodyguard                                       |  |
| E13  | [[E13 - Strange Illness\|Strange Illness]]         | 💬 Mid-Day | 0.20  | Zombie                                          |  |
| E14  | [[E14 - Silenced Morning\|Silenced Morning]]       | 🌅 Morning | 0.20  | Silencer                                        | Hint |

> \* E04 probability: `0.15` Lovers fight (per night), `1.00` Bodyguard 

---

### Event Selection Engine

```
generateNightEchoEvents(night_actions):
  candidate_events = []
  
  // 1. Collect all eligible events
  for action in night_actions:
    for event in EVENT_CATALOG:
      if action.role in event.linked_roles:
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

|  |  |
| ------------------------------------ | -------------------------------------------------------------- |
| ** ** | events , trivial |
| **Linked ** | impossible events |
| **Max 2 ** | events = information overload → |
| ** ** | Morning = context, Mid-Day = discussion catalyst               |
| ** event, ** | " " 5+ = |
| **Probabilities ** | event |

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

- **[[Data Architecture#personality.json|Personality]]**: [[Paranoid]] E01/E02. [[Shy]] events. [[Logical]] cross-references events memory data.
- **[[AI Decision Engine#Perception Depth|Perception Depth]]**: Smart/Deep AI cross-references events vote patterns + investigation results.

### Event Weight Impact on Memory

| Event Type       | Suspicion Weight Target |  |
| ---------------- | --------------------------- | ----------------------------------- |
| E01, E05         | +0.15                       |  |
| E02 (Shadow)     | +0.30                       | — Mafia/Zombie linked |
| E03 (Footsteps)  | +0.10                       | Neutral|
| E04 (Argument)   | +0.20                       |  |
| E06 (Commotion)  | +0.25                       |  |
| E07 (Gun)        | +0.35                       |  |
| E08 (Nervous)    | +0.30                       | = |
| E09 (Watchful)   | +0.15                       |  |
| E10 (Whispers)   | +0.40                       |  |
| E11 (Medical)    | -0.10                       |  |
| E12 (Guard Post) | -0.15                       |  |
| E13 (Illness)    | +0.20                       | Zombie concern                      |
| E14 (Silenced)   | +0.10                       | hint |

---

## Related Links

- [[Last Wish]]
- [[Full Moon]] — Balance mechanic
- [[Day Phase#Morning Report]]
- [[Day Phase#Public Discussion]]
- [[Night Phase]]
- [[AI Decision Engine]]
- [[Memory System]]
- [[Gossip]]
