---
tags:
  - phase
  - phase/day
  - game_design
  - mechanic
---

# Day Phase
---

---

## Step 1: Morning Report

|  |  | ; |
| ------------------------- | --------------------------------------------------------- | ------ |
| **** | _"Player X was found dead."_                              |  |
| ** ** | _"Player X and Player Y were found dead."_ (Bodyguard sacrifice) |  |
| **Linked death (Lovers)** | _"Player X was also found dead."_ (partner died)          |  |
| ** ** | _"Nobody died tonight."_    |  |
| **Zombie infection**      | _"Player X doesn't look well today... 🧟"_                |  |
| **Doctor cure**           | _"Player Y looks much better today! 💊"_                   |  |
| **Silenced player**       | _"Player Y seems unable to speak today."_                 |  |
| **Mayor reveal**          | _"👑 Player Z has revealed themselves as the Mayor!"_      | Event  |
| **Conflict Event**        | _"A loud argument was heard near Player Z's house."_      | ~30%   |
| **Full Moon (Stage 1)**   | _"🌕 The moon glows faintly. Some feel a strange surge of power tonight."_ | Balance |
| **Full Moon (Stage 2)**   | _"🌕 A FULL MOON rises! Great power awakens for those who need it most."_ | Balance |

### Report Parsing Logic

```
For each dead player:
  → Show "Player X was found dead."
  
For Bodyguard sacrifice:
  → Show Bodyguard death + Mafia member death
  → Target is alive (survived)

For Lovers linked death:
  → Show partner death as separate announcement

For Doctor save:
  → Show "Nobody died tonight" (target never learns they were saved)

For Zombie infection:
  → Show "Player X doesn't look well today... 🧟"

For Doctor cure (zombie):
  → Show "Player Y looks much better today! 💊"
```

### No Role Reveal on Death

### Information Available to Players

| Source                    | Information Type                   | Reliability      |
| ------------------------- | ---------------------------------- | ---------------- |
| **Death announcement**    | Who died             | 100% accurate    |
| **Zombie announcement**   | Who became zombie                  | 100% accurate    |
| **Silenced notification** | Who is silenced                    | 100% accurate    |
| **Night personal results**| Investigation/tracking results     | Can be manipulated (Framer) |
| **Previous day memories** | Who said what, who accused whom    | Subject to memory decay |

**Related:** [[Dynamic Events#The Conflict]], [[Dynamic Events#The Full Moon]], [[Janitor]]

---

## Step 2: Public Discussion (The Chat)

### Chat Mechanics

- **AI** [[Gameplay Loop]] (Analyze → Memory Update → Speak Probability → Generate).

### Discussion Dynamics

| Role Type           | Discussion Behavior                                              |
| ------------------- | ---------------------------------------------------------------- |
| **Sheriff**         | investigation results |
| **Lookout/Tracker** | / |
| **Gossip**          | cryptic hints |
| **Mafia members**   | , |
| **Executioner**     | assigned target |
| **Jester**          |  |
| **Mayor (revealed)**| discussion, authority, proven Town |
| **Citizen/Survivor**| , majority |

### Accusation & Role Claim System

```
Level 1: Soft suspicion
Level 2: Direct accusation
Level 3: Role claim challenge
Level 4: Counter-claim
```

#### Role Claim Rules

| Claim Type        | Risk                                                        |
| ----------------- | ----------------------------------------------------------- |
| **True claim**    | → Mafia |
| **False claim**   | → lynch |
| **No claim**      | suspicion anonymity |
| **Duplicate claim**| 2 unique role → guaranteed |

### Discussion Timer

| Game Size    | Discussion Duration | Reason                                |
| ------------ | ------------------- | ------------------------------------- |
| 7–9 | 8–12 AI | , |
| 10–12 | 12–18 AI | , |
| 13–16 | 18–25 AI | , |

### Human Window

**Related:** [[Gameplay Loop#Step 3]]

### Silenced Players

### Mayor Reveal Mechanic

### Chat Event Recording

```json
{
  "message_id": 15,
  "speaker": "player_2",
  "action": "accuse",
  "target": "player_6",
  "weight": 0.9,
  "day": 2,
  "raw_text": "I'm telling you, Player 6 is definitely Mafia!"
}
```

---

## Step 3: The Trial & Vote

### Voting Mechanics

| Rule                  | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| **1 /** | 1 |
| **Vote weight**       | ×1 , ×2 [[Mayor]] |
| **Majority wins**     | ** ** |
| **Tie = No lynch**    | , ** ** (controversial talk day) |
| **Abstain**           | "Skip" |
| **Silenced vote**     | **** |

### Vote Weight Calculation

```
base_vote = 1
if player.role == "Mayor" AND player.revealed:
    base_vote = 2

effective_votes[target] += base_vote
winner = max(effective_votes)
if tie: winner = None (no lynch)
```

### Voting Psychology by Role

| Role            | Typical Voting Behavior                                     |
| --------------- | ----------------------------------------------------------- |
| **Sheriff**     | confirmed Mafia |
| **Mafia**       | fellow Mafia |
| **Jester**      |  |
| **Executioner** | assigned target |
| **Survivor**    | majority |
| **Mayor**       | reveal: |
| **Zombie**      |  |

### AI Vote Decision Process

```
1. memory.json → Collect suspicion scores (filtered by Perception Depth)
2. Role override → Sheriff votes known-Mafia, Mafia NEVER votes fellow Mafia
3. Personality modifier → Shy follows majority, Logical follows evidence
4. Select highest suspicion target
5. Cast vote
```

**Detailed:** [[Memory System#Voting Decision Process]]

### Vote UI

```
╔══════════════════════════════════════╗
║  🗳️ VOTING PHASE                    ║
║                                      ║
║  Player A  →  votes Player D         ║
║  Player B  →  votes Player D         ║
║  Player C  →  votes Player F         ║
║  Player D  →  votes Player C         ║
║  Player E  →  votes Player D  ✋     ║
║  You       →  [Select target]        ║
║                                      ║
║  Result: Player D — 3 votes (majority)║
╚══════════════════════════════════════╝
```

---

## Step 4: Last Wish & Resolution

### Lynch Resolution

|  | Action                                                           |
| ---- | ---------------------------------------------------------------- |
| 1    | **** |
| 2    | **** |
| 3    | **Win Condition Check** — [[Win Conditions]]                      |
| 4    | → **Last Wish** roll |
| 5    | Transition [[Night Phase]] |

### Special Lynch Outcomes

| Lynched Role       | Outcome                                                  |
| ------------------- | -------------------------------------------------------- |
| **[[Jester]]**      | 🃏 **JESTER WINS**|
| **[[Executioner]] target** | ⚔️ **EXECUTIONER WINS**|
| **Mafia member**    | ✅ Town successfully eliminated a Mafia member.           |
| **Town member**     | ❌ Town |
| **[[Survivor]]**    | 💀 Survivor |

### Jester Lynch

```
if lynched_player.role == "Jester":
  game.end(winner="Jester")
  // Town and Mafia both lose
```

### Executioner Lynch (Target)

```
if lynched_player == executioner.target:
  executioner.win = true
  // Executioner wins, but game CONTINUES
  // Remaining players keep playing for Town/Mafia victory
```

---

## Day Phase Flow Diagram

```
┌─────────────────────────────────────────────┐
│              DAY PHASE                       │
│                                              │
│  ┌─────────────────┐                         │
│  │ Morning Report   │ ← Night results +      │
│  │                  │   Dynamic Events        │
│  └───────┬──────────┘                         │
│          ▼                                    │
│  ┌─────────────────┐                         │
│  │ Public Discussion│ ← Chat Loop             │
│  │ (The Chat)       │   (Gameplay Loop)       │
│  └───────┬──────────┘                         │
│          ▼                                    │
│  ┌─────────────────┐                         │
│  │ The Trial & Vote │ ← All players vote      │
│  │                  │                         │
│  └───────┬──────────┘                         │
│          ▼                                    │
│  ┌─────────────────┐                         │
│  │ Resolution       │ ← Lynch + Last Wish     │
│  │ + Last Wish      │   + Win Check           │
│  └───────┬──────────┘                         │
│          ▼                                    │
│     → Night Phase                             │
└─────────────────────────────────────────────┘
```

---

## Related Links

- [[Night Phase]]
- [[Gameplay Loop]]
- [[AI Decision Engine]]
- [[Memory System]]
- [[Dynamic Events]] (Last Wish, Conflicts)
- [[Win Conditions]]
