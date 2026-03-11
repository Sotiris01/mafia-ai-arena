---
tags:
  - event
  - event/balance
  - game_design
  - mechanic
---

# The Full Moon — Balance Mechanic
---

| Property       | Value                                                  |
| -------------- | ------------------------------------------------------ |
| **Type**        | Dynamic Event — Balance Mechanic                      |
| **Trigger**    |  |
| **Timing**     | Morning Report |
| **Frequency**  | ~15% , ** ** |
| **Max/Game**   | 3 |
| **Purpose**    | boost ****, balance |

---

---

## Balance Score

```
balance_score = (town_alive / total_alive) - expected_town_ratio

expected_town_ratio = initial_town_count / initial_total_count

  - total_alive = town_alive + mafia_alive
```

---

## Balance Score → Full Moon Stage

| Balance Score          |  | Beneficiary        | Stage |
| ---------------------- | ---------------------- | ------------------ | ----- |
| `score > +0.15`        | Town | 🔴 Mafia boost     | 2     |
| `+0.05 < score ≤ +0.15`| Town | 🟠 Mafia boost     | 1     |
| `-0.05 ≤ score ≤ +0.05`|  | ❌ No Full Moon    | 0     |
| `-0.15 ≤ score < -0.05`| Mafia | 🟠 Town boost      | 1     |
| `score < -0.15`        | Mafia | 🔴 Town boost      | 2     |

---

## Stage 1 — Light Boost

| Role             | Normal | Full Moon (Stage 1)  |
| ---------------- | ------ | -------------------- |
| **Consigliere**  | 1      | **2** investigations |
| **Framer**       | 1      | **2** frames         |
| **Silencer**     | 1      | **2** silences       |
| Mafia Kill       | 1      | 1 _(unchanged)_      |
| Janitor          | 1      | 1 _(unchanged)_      |

| Role             | Normal | Full Moon (Stage 1)  |
| ---------------- | ------ | -------------------- |
| **Sheriff**      | 1      | **2** investigations |
| **Lookout**      | 1      | **2** watches        |
| **Tracker**      | 1      | **2** tracks         |
| Doctor           | 1      | 1 _(unchanged)_      |

---

## Stage 2 — Full Boost

| Role             | Normal | Full Moon (Stage 2)  |
| ---------------- | ------ | -------------------- |
| **Mafia Kill**   | 1      | **2** kills          |
| **Consigliere**  | 1      | **2** investigations |
| **Framer**       | 1      | **2** frames         |
| **Silencer**     | 1      | **2** silences       |
| **Janitor**      | 1      | **2** investigations |

| Role             | Normal | Full Moon (Stage 2)  |
| ---------------- | ------ | -------------------- |
| **Doctor**       | 1      | **2** protects/cures |
| **Sheriff**      | 1      | **2** investigations |
| **Lookout**      | 1      | **2** watches        |
| **Tracker**      | 1      | **2** tracks         |
| **Gossip**       | 1      | **2** hints          |

> - **Bodyguard**
> - **Zombie & Survivor**
> - **Lovers**

---

## Balance Score Examples

```
  expected = 6/9 = 0.667
  actual = 5/7 = 0.714
  score = 0.714 - 0.667 = +0.047

  actual = 5/6 = 0.833
  score = 0.833 - 0.667 = +0.166
  → Stage 2: 🔴 Mafia Full Boost
  → Mafia gets 2 kills + double info roles

  expected = 7/10 = 0.700
 Night 3: 4 Town, 3 Mafia
  actual = 4/7 = 0.571
  score = 0.571 - 0.700 = -0.129
  → Stage 1: 🟠 Town Light Boost
  → Sheriff/Lookout/Tracker get double info actions

  actual = 3/6 = 0.500
  score = 0.500 - 0.700 = -0.200
  → Stage 2: 🔴 Town Full Boost
  → Doctor gets 2 protects + all info roles doubled
```

---

## Morning Report Announcements

| Stage | Announcement                                                              |
| ----- | ------------------------------------------------------------------------- |
| 0     | __                                              |
| 1     | _"🌕 The moon glows faintly. Some feel a strange surge of power tonight."_ |
| 2     | _"🌕 A FULL MOON rises! Great power awakens for those who need it most."_  |

---

## Impact on Gameplay

|  |  |
| ------------------------------ | ---------------------------------------------------------- |
| **Catch-up mechanic**          |  |
| ** ** | Stage 2 = saves, |
| **Strategic uncertainty**      | boost |
| **Prevents snowball**          |  |
| **Staged intensity**           | Light boost = , Full boost = + |

---

## Configuration

```json
{
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
```

---

## Related Links

- [[Dynamic Events]]
- [[Day Phase#Morning Report]]
- [[Night Phase]]
