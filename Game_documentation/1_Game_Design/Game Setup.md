---
tags:
  - game_design
  - mechanic
  - setup
---

# Game Setup & Start
---

## 1. Lobby

| Step | Action                                                         |
| ---- | -------------------------------------------------------------- |
| 1    |  |
| 2    | ** AI ** |
| 3    | : |
| 4    | "Start Game" |

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
| 14            | 8    | 4     | 2       | +Tracker Mayor | =                                    | =                            |
| 15            | 8    | 4     | 3       | =                                             | =                                    | +Executioner Zombie |
| 16            | 9    | 5     | 2       | +Mayor Tracker | +Consigliere Janitor | =                            |

### Role Importance Tiers

| Tier |  |  |  |
| ---- | ------- | ----------- | -------------------------------------------------------- |
| 🟢 **CORE**     |  | 7+ | Sheriff, Doctor, Citizen, Godfather, Mafia Goon, Jester  |
| 🟡 **IMPORTANT** |  | 8–9 | Lookout, Framer, Survivor                                |
| 🔵 **ADVANCED** |  | 10–12 | Gossip, Bodyguard, Executioner, Tracker                  |
| 🟣 **EXPANDED** |  | 13–16 | Silencer, Mayor, Consigliere, Janitor, Zombie            |

### Faction Balance Ratios

| Total Players | Town %  | Mafia % | Neutral % | Balance Note                          |
| ------------- | ------- | ------- | --------- | ------------------------------------- |
| 7             | 57%     | 29%     | 14%       | Tight — 1 bad lynch = Mafia edge      |
| 10            | 60%     | 30%     | 10%       | Balanced — standard experience        |
| 12            | 58%     | 25%     | 17%       | Town advantage → Mafia gets more tools|
| 15            | 53%     | 27%     | 20%       | Complex — Neutrals influence heavily  |

---

## 2. Role Distribution

```
2. Shuffle randomly
3. Determine available roles based on Player Count Scaling table
   - 1x Godfather
   - 1x Mafia Goon
   - Framer
   - Silencer
 - Consigliere Janitor
   - Extra Mafia Goon
   - 1x Jester
   - 1x Survivor
 - 1x Executioner Zombie
   - 1x Sheriff
   - 1x Doctor
   - 1x Lookout
   - 1x Gossip
   - 1x Bodyguard
 - 1x Tracker Mayor
   - Citizens
7. Lovers assignment:
8. Executioner target assignment:
   - Eligible targets: Citizen, Lookout, Gossip
```

### Restrictions

- **Unique **: Sheriff, Doctor, Lookout, Gossip, Bodyguard, Tracker, Mayor, Godfather, Framer, Silencer, Consigliere, Janitor, Jester, Survivor, Executioner, Zombie.

---

## 3. AI Personality Assignment

| Personality Type | speak_probability_base | perception_depth | Behavior                           |
| ---------------- | ---------------------- | ---------------- | ---------------------------------- |
| **Aggressive**   | 0.8                    | superficial      | , |
| **Cautious**     | 0.3                    | smart            | , |
| **Paranoid**     | 0.6                    | deep             |  |
| **Logical**      | 0.5                    | smart            |  |
| **Shy**          | 0.1                    | superficial      | , |
| **Charismatic**  | 0.7                    | smart            | , |

---

## 4. Role Reveal

|  |  |
| -------------- | ---------------------------------------------------------- |
| **Town ** | + Win Condition |
| **Mafia ** | + Win Condition + ** Mafia** |
| **Neutral**    | + Win Condition |

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
| **Night 1**, Day 1 |  |
| ** ** |  |
| Night actions | Morning Report Day 1 |

### Night 1 Flow

```
Night 1:
  Phase 1: Framer frame → marks target
  Phase 2: Investigations
  Phase 3: Kill & Protection
    → Survivor: Vest decision
  Phase 4: Post-kill
    → Lovers: Death link check
  Phase 6: Resolution + Win Check
  
Day 1:
```

---

## JSON Initialization

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
// memory.json
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
