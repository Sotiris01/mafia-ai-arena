---
tags:
  - phase
  - phase/night
  - game_design
  - mechanic
---

# Night Phase
---

---

## Step 1: Town Sleeps — Chat Disabled

| Rule                       | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| **Public Chat**            | ❌ |
| **Private Mafia Chat**     | ✅ Mafia |
| **Human player UI**        |  |

---

## Step 2: Mafia Chat (Private Coordination)

### Kill Vote

| Rule                    | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| **** | Mafia |
| **Majority wins**       |  |
| **Godfather tiebreaker**| , [[Godfather]] |
| **Cannot self-kill**    | Mafia Mafia |

### Strategic Discussion

### AI Mafia Chat Behavior

---

## Step 3: Special Town Actions

### Action Summary

| Role           | Action       | Target              | Result                                        |
| -------------- | ------------ | ------------------- | --------------------------------------------- |
| [[Sheriff]]    | Investigate  | 1 | "Town" "Mafia" (⚠️ [[Godfather]]/[[Framer]] exceptions) |
| [[Doctor]]     | Protect/Cure | 1 | zombie |
| [[Lookout]]    | Watch        | 1 |  |
| [[Tracker]]    | Track        | 1 |  |
| [[Bodyguard]]  | Guard        | 1 | Mafia → Bodyguard + 1 Mafia , |
| [[Gossip]]     | Receive Clue |  | hint (passive) |
| [[Survivor]]   | Vest         | (optional) | Self-protection Mafia kill (limited uses) |

### AI Target Selection Logic

```
Sheriff AI:
  → memory.json → highest suspicion player not yet investigated
  → If all suspicious investigated → investigate random unknown

Doctor AI:
  → memory.json → highest trust player (protect ally)
  → If Sheriff claimed → protect Sheriff (high priority)
  → If zombie victims exist → evaluate: cure vs protect
  → Random if no strong trust relationships

Lookout AI:
  → memory.json → player most likely to be visited (high-profile)
  → Recently accused players (Mafia might kill accusers)

Tracker AI:
  → memory.json → highest suspicion player (follow the suspect)
  → Recently aggressive players → verify if they visited someone

Bodyguard AI:
  → memory.json → confirmed town roles (highest value targets)
  → If Sheriff/Doctor claimed → guard them
  → If no info → guard randomly (hope for the best)
```

---

## Step 4: Mafia Special Roles & Neutral Night Actions

### Mafia Special Actions

| Role             | Action        | When                     | Effect                                        |
| ---------------- | ------------- | ------------------------ | --------------------------------------------- |
| [[Framer]]       | Frame         | Kill Vote | → "Mafia" Sheriff |
| [[Silencer]]     | Silence       | Kill Vote | → |
| [[Consigliere]]  | Investigate   | Kill Vote | ** ** |
| [[Janitor]]      | Clean         | Kill Vote |  |

### Neutral Night Actions

| Role           | Action        | When                     | Effect                                        |
| -------------- | ------------- | ------------------------ | --------------------------------------------- |
| [[Zombie]]     | Infect        | Phase 4 (Post-kill)      | zombie |
| [[Survivor]]   | Vest          |  | Self-protection (limited uses)                |

---

## Step 5: Resolution — Night Action Order ⚡

### 🔵 Night Action Resolution Order (Definitive)

```
╔══════════════════════════════════════════════════════════════════╗
║  PHASE 0 — PASSIVE VISITS                                        ║
║  ┌──────────────────────────────────────────────────────┐        ║
║  │ 0.1  Lovers → Game randomly assigns one Lover to     │        ║
║  │      visit the other (visible to Lookout/Tracker)    │        ║
║  │      Fight check: ~15% → trigger Conflict Event      │        ║
║  └──────────────────────────────────────────────────────┘        ║
╠══════════════════════════════════════════════════════════════════╣
║  PHASE 1 — INFORMATION ALTERATION                                ║
║  ┌──────────────────────────────────────────────────────┐        ║
║  │ 1.1  Framer → Mark target as "framed"                │        ║
║  │      (Before Sheriff check — affects investigation)   │        ║
║  └──────────────────────────────────────────────────────┘        ║
╠══════════════════════════════════════════════════════════════════╣
║  PHASE 2 — INVESTIGATION & OBSERVATION                           ║
║  ┌──────────────────────────────────────────────────────┐        ║
║  │ 2.1  Consigliere → Learn exact role of target        │        ║
║  │ 2.2  Sheriff → Learn alignment of target             │        ║
║  │      (Affected by: Framer frame, Godfather immunity)  │        ║
║  │      (Zombie victims appear as "🧟 Zombie")           │        ║
║  │      (Zombie itself appears as "Town")                │        ║
║  │ 2.3  Tracker → See who target visited                 │        ║
║  │      (Can see Lover visiting their partner)           │        ║
║  │ 2.4  Lookout → See who visited target                 │        ║
║  │      (Can see Lover visiting their partner)           │        ║
║  └──────────────────────────────────────────────────────┘        ║
╠══════════════════════════════════════════════════════════════════╣
║  PHASE 3 — KILL & PROTECTION                                    ║
║  ┌──────────────────────────────────────────────────────┐        ║
║  │ 3.1  Mafia Kill Vote → Determine kill target         │        ║
║  │ 3.2  Doctor Protect → If healing kill target → SAVE   │        ║
║  │      (Doctor save has priority over Bodyguard)        │        ║
║  │      (Doctor can CURE zombie victim instead)          │        ║
║  │ 3.3  Bodyguard Guard → If guarding kill target AND    │        ║
║  │      Doctor NOT healing same target:                  │        ║
║  │        → Target SAVED                                 │        ║
║  │        → Bodyguard DIES                               │        ║
║  │        → 1 random Mafia voter DIES                    │        ║
║  │ 3.4  Survivor Vest → If vested AND targeted → SAVE    │        ║
║  └──────────────────────────────────────────────────────┘        ║
╠══════════════════════════════════════════════════════════════════╣
║  PHASE 4 — POST-KILL EFFECTS                                    ║
║  ┌──────────────────────────────────────────────────────┐        ║
║  │ 4.1  Janitor Investigate → Select a dead player:      │        ║
║  │        → Janitor learns their role + alignment        │        ║
║  │        → Information shared in Mafia Chat             │        ║
║  │ 4.2  Silencer → Mark target for mute (next Day Phase) │        ║
║  │ 4.3  Zombie Infect → Target becomes zombie:           │        ║
║  │        → Limited chat (30 chars), cannot vote          │        ║
║  │        → Night action disabled                        │        ║
║  │        → Appears as "🧟 Zombie" to Sheriff             │        ║
║  │ 4.4  Lovers Death Link → If one Lover died:           │        ║
║  │        → Partner dies automatically (heartbreak)      │        ║
║  └──────────────────────────────────────────────────────┘        ║
╠══════════════════════════════════════════════════════════════════╣
║  PHASE 5 — PASSIVE INFORMATION                                  ║
║  ┌──────────────────────────────────────────────────────┐        ║
║  │ 5.1  Gossip → Generate cryptic hint from night events │        ║
║  └──────────────────────────────────────────────────────┘        ║
╠══════════════════════════════════════════════════════════════════╣
║  PHASE 6 — CLEANUP                                              ║
║  ┌──────────────────────────────────────────────────────┐        ║
║  │ 6.1  All results stored in respective memory.json     │        ║
║  │ 6.2  Dead players removed from active roster          │        ║
║  │ 6.3  Executioner check → If target died at night:     │        ║
║  │        → Executioner becomes Jester                   │        ║
║  │ 6.4  Zombie win check → All alive non-zombie?         │        ║
║  │ 6.5  Win Condition check                              │        ║
║  └──────────────────────────────────────────────────────┘        ║
╚══════════════════════════════════════════════════════════════════╝
```

### Resolution Order — Quick Reference Table

| Phase | Order | Role           | Action              | Affected By                        |
| ----- | ----- | -------------- | ------------------- | ---------------------------------- |
| 0     | 0.1   | **Lovers**     | Visit (passive)     | —                                  |
| 1     | 1.1   | **Framer**     | Frame               | —                                  |
| 2     | 2.1   | **Consigliere**| Investigate (exact) | —                                  |
| 2     | 2.2   | **Sheriff**    | Investigate (align) | Framer, Godfather, Zombie victims  |
| 2     | 2.3   | **Tracker**    | Track               | Sees Lover visits                  |
| 2     | 2.4   | **Lookout**    | Watch               | Sees Lover visits                  |
| 3     | 3.1   | **Mafia**      | Kill Vote           | —                                  |
| 3     | 3.2   | **Doctor**     | Protect / Cure      | Can cure zombie victims            |
| 3     | 3.3   | **Bodyguard**  | Guard (sacrifice)   | Doctor priority                    |
| 3     | 3.4   | **Survivor**   | Vest                | —                                  |
| 4     | 4.1   | **Janitor**    | Investigate dead    | Requires dead players              |
| 4     | 4.2   | **Silencer**   | Silence             | —                                  |
| 4     | 4.3   | **Zombie**     | Infect              | Doctor can cure next night         |
| 4     | 4.4   | **Lovers**     | Death link          | If one died → both die             |
| 5     | 5.1   | **Gossip**     | Clue                | —                                  |
| 6     | 6.3   | **Executioner**| Target check        | Target death                       |

### Why This Order Matters

### Resolution Examples (Updated)

| Scenario                                                     | Resolution                                    |
| ------------------------------------------------------------ | --------------------------------------------- |
| Mafia kills A, Doctor protects B                              | **A dies** (role NOT revealed)                |
| Mafia kills A, Doctor protects A                              | **Nobody dies** — A saved                     |
| Mafia kills A, Bodyguard guards A (no Doctor)                 | **Bodyguard dies + 1 Mafia dies**, A lives    |
| Mafia kills A, Doctor + Bodyguard both protect A              | **Nobody dies** — Doctor save, Bodyguard safe |
| Mafia kills A, Lookout watches A                              | **A dies**, Lookout sees killer               |
| Mafia kills A, Tracker tracks killer                          | **A dies**, Tracker sees killer → A           |
| Sheriff investigates B, Framer frames B                       | Sheriff gets **false "Mafia"**                |
| Mafia kills A, Janitor investigates A                         | **A dies**, Janitor learns A's role            |
| Mafia kills A, A = Survivor with vest                         | **Nobody dies** — A vested                    |
| Sheriff investigates Godfather                                | Sheriff gets **false "Town"**                 |
| Consigliere investigates framed player                        | Sees **real role** (not affected by Framer)   |
| Zombie infects Player B                                       | **B becomes zombie** — limited chat, no vote  |
| Doctor cures zombie Player B                                  | **B recovers** — restored to normal           |
| Mafia kills Lover A                                           | **A + Lover B both die** (linked death)       |
| Sheriff investigates zombie victim                            | Sheriff sees **"🧟 Zombie"**                  |
| Sheriff investigates Zombie (the role)                        | Sheriff sees **"Town"** (hidden)              |
| Lookout watches Lover A, Lover B visits A                     | Lookout sees **Lover B** visiting             |

---

## Dynamic Events at Night

### Full Moon — Balance Mechanic (Rare)

**Detailed:** [[Dynamic Events#The Full Moon]]

#### Balance Score Calculation

```
balance_score = (town_alive / total_alive) - expected_town_ratio

expected_town_ratio:
```

| Balance Score          |  | Beneficiary  |
| ---------------------- | ---------------------- | ------------ |
| `score > +0.15`        | Town | 🔴 Mafia     |
| `+0.05 < score ≤ +0.15`| Town | 🟠 Mafia (light) |
| `-0.05 ≤ score ≤ +0.05`|  | ❌ No Full Moon |
| `-0.15 ≤ score < -0.05`| Mafia | 🟠 Town (light) |
| `score < -0.15`        | Mafia | 🔴 Town      |

#### Stage 1 — Light Boost (🟠)

| Role             | Normal | Full Moon (Stage 1)  |
| ---------------- | ------ | -------------------- |
| **Consigliere**  | 1      | **2** investigations |
| **Framer**       | 1      | **2** frames         |
| **Silencer**     | 1      | **2** silences       |
| Mafia Kill       | 1      | 1 (unchanged)        |

| Role             | Normal | Full Moon (Stage 1)  |
| ---------------- | ------ | -------------------- |
| **Sheriff**      | 1      | **2** investigations |
| **Lookout**      | 1      | **2** watches        |
| **Tracker**      | 1      | **2** tracks         |
| Doctor Protect   | 1      | 1 (unchanged)        |

#### Stage 2 — Full Boost (🔴)

| Role             | Normal | Full Moon (Stage 2)  |
| ---------------- | ------ | -------------------- |
| **Mafia Kill**   | 1      | **2** kills          |
| **Consigliere**  | 1      | **2** investigations |
| **Framer**       | 1      | **2** frames         |
| **Silencer**     | 1      | **2** silences       |
| **Janitor**      | 1      | **2** investigations |

| Role             | Normal | Full Moon (Stage 2)  |
| ---------------- | ------ | -------------------- |
| **Doctor**       | 1      | **2** protects       |
| **Sheriff**      | 1      | **2** investigations |
| **Lookout**      | 1      | **2** watches        |
| **Tracker**      | 1      | **2** tracks         |
| **Gossip**       | 1      | **2** hints          |

---

## Night Phase Flow Diagram

```
┌──────────────────────────────────────────────────────┐
│                    NIGHT PHASE                        │
│                                                       │
│  ┌──────────────────┐                                 │
│  │ Town Sleeps       │ ← Public Chat disabled          │
│  └────────┬─────────┘                                 │
│           ▼                                           │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │ Mafia Chat        │  │ Town Actions      │           │
│  │ Kill Vote +       │  │ Sheriff, Doctor,  │           │
│  │ Framer, Silencer, │  │ Lookout, Tracker, │           │
│  │ Consigliere,      │  │ Bodyguard, Gossip │           │
│  │ Janitor           │  │                   │           │
│  └────────┬─────────┘  └────────┬──────────┘           │
│           └───────┬─────────────┘                      │
│                   ▼                                    │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │ Neutral Actions   │  │ Passive Events    │           │
│  │ Zombie (infect)   │  │ Lovers (visit)    │           │
│  │ Survivor (vest)   │  │                   │           │
│  └────────┬─────────┘  └──────────────────┘           │
│           ▼                                           │
│  ╔══════════════════════════════════════════╗          │
│  ║         RESOLUTION ENGINE               ║          │
│  ║                                          ║          │
│  ║  Phase 0: Lovers passive visit           ║          │
│  ║  Phase 1: Framer frame                   ║          │
│  ║  Phase 2: Investigations & Observations  ║          │
│  ║  Phase 3: Kill & Protection              ║          │
│  ║  Phase 4: Post-kill + Zombie + Lovers    ║          │
│  ║  Phase 5: Passive info (Gossip)          ║          │
│  ║  Phase 6: Cleanup & Win Check            ║          │
│  ╚══════════════════════════════════════════╝          │
│           ▼                                           │
│     → Day Phase (Morning Report)                      │
└──────────────────────────────────────────────────────┘
```

---

## Related Links

- [[Day Phase]]
- [[Dynamic Events#The Full Moon]] (amplified night)
- [[Gameplay Loop]]
- [[Win Conditions]]
- [[Data Architecture]]
