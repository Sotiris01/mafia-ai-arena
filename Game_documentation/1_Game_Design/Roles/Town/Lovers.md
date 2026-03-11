---
tags:
  - role
  - role/town
  - tier/advanced
  - game_design
---

# Lovers (Town)
---

| Property         | Value                                        |
| ---------------- | -------------------------------------------- |
| **Alignment**    | [[The Town]]                                 |
| **Night Action** | None (Passive — visits happen automatically) |
| **Appears as**   | Town (to [[Sheriff]])                        |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🔵 **ADVANCED**|
| **Min Players**      | 10                                                         |
| **Scaling**          | 2 Lovers |
| **Unique?**          | ✅ |

### Why Advanced

### Balance Tradeoff

## Overview

### Key Mechanics

- **Origin:** Lovers [[Citizen|Citizens]]

### Death Link Resolution

```
onDeath(player):
  if player.is_lover:
    partner = getLoverPartner(player)
    if partner.is_alive:
      partner.kill(cause = "heartbreak")
```

### Nightly Visit Logic

```
each Night:
  visitor = random_choice(lover_A, lover_B)
  visited = the_other_lover
  
  // Register visit for Lookout/Tracker
  register_visit(from = visitor, to = visited)
  
  // Fight check
  if random() < 0.15:
    trigger_conflict_event(near = visited.house)
```

## Strategy Notes

### As Lovers

### Against Lovers

## AI Behavior (Virtual Player)

- **[[AI Decision Engine#Speak Probability|speak probability]]:** Moderate

## Related Links

- [[Night Phase#Resolution]]
- [[Day Phase#Morning Report]]
- [[Win Conditions#Town Victory]]
- [[Lookout]] (can see Lover visits)
- [[Tracker]] (can track Lover movements)
- [[Dynamic Events#The Conflict]] (fight event)
- [[Citizen]] (Lovers originate from Citizens)

## Interactions with Other Roles

### Lookout Interaction

```
Lookout watches Lover A:
  → Night visit: Lover B visited Lover A
  → Lookout sees: "Player [Lover B] visited Player [Lover A]"
```

### Tracker Interaction

```
Tracker tracks Lover B:
  → If Lover B visited Lover A this night:
     Tracker sees: "Player [Lover B] → Player [Lover A]"
  → If Lover A visited Lover B this night:
     Tracker sees: "Player [Lover B] →"
```

### Fight / Conflict Event

```
Morning Report:
  "A loud argument was heard near Player [Lover]'s house last night."
```

## Setup & Assignment

| Rule                        | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| **** | 2 Citizens Lovers Setup |
| **** | Lover partner |
| **Alignment**               | Town |
| **Night Action**            |  |
| **Compatibility**           | Lover unique role |

### Role Card UI

```
┌─────────────────────────────────┐
│  💕 YOUR ROLE: Lover             │
│                                 │
│  Alignment: TOWN                │
│                                 │
│  Your Partner: Player X         │
│                                 │
│  ⚠️ If your partner dies,       │
│  you die too — and vice versa.  │
│                                 │
│  Win Condition:                 │
│  Eliminate all Mafia members    │
│                                 │
│  💡 Each night, one of you      │
│  visits the other (randomly).   │
└─────────────────────────────────┘
```
