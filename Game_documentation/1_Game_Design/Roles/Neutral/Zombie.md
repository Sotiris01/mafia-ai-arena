---
tags:
  - role
  - role/neutral
  - tier/expanded
  - game_design
  - night_action
---

# Zombie (Neutral)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[Neutral]]                        |
| **Night Action** | Infect (Turn into Zombie)        |
| **Appears as** | Town (to [[Sheriff]])              |
| **Win Condition** | [[Win Conditions#Zombie Victory|Turn all players into Zombies]] |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟣 **EXPANDED**|
| **Min Players**      | 14                                                         |
| **Scaling**          | 1 Zombie |
| **Unique?**          | ✅ |

### Why Expanded

### Balance Tradeoff

## Overview

### Zombie Effects on Victims

| Effect                   | Description                                                     |
| -------------------------| --------------------------------------------------------------- |
| ** chat** | zombie **30 ** |
| ** ** | zombie ** ** [[Day Phase#The Trial & Vote |Trial]] |
| ** ** | **** |
| ** ** |  |
| **Sheriff detection**    | "**🧟 Zombie**" Sheriff |

### Sheriff Interaction

| Target                | Sheriff Result                                            |
| --------------------- | --------------------------------------------------------- |
| **Zombie**  | "**Town**" |
| **Zombie ** | "**🧟 Zombie**" |
| ** ** | (Town/Mafia) |

## Night Action: Infect

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Target**      | 1 , -zombie |
| **Effect**      | zombie o |
| **Uses**        |  |
| **Self-target** | ❌ |
| **Blocked by**  | [[Doctor]] cure|

### Infection Resolution

```
Night:
  Zombie selects Target X
  → Target X is marked as "infected"

Morning:
  → Target X becomes zombie
  → Morning Report: "Player X doesn't look well today... 🧟"
  → Target X: chat limited to 30 chars, cannot vote, loses night action
```

### Doctor Cure Mechanic

```
Doctor selects zombie Target Y:
  → Target Y is CURED
  → Morning Report: "Player Y looks much better today! 💊"
```

## Strategy Notes

### As Zombie

- **Target Doctor last:** Doctor cure

### Against Zombie

## AI Behavior (Virtual Player)

 - Active players → 
- **[[AI Decision Engine#Speak Probability|speak probability]]:** Moderate

## Related Links

- [[Night Phase#Resolution]]
- [[Day Phase#Morning Report]]
- [[Win Conditions#Zombie Victory]]
- [[Doctor]] (can cure zombie victims)
- [[Sheriff]] (detects zombie victims, NOT the Zombie itself)
- [[Dynamic Events]] (zombie spreading effects)

## Win Condition

| Condition                                               | Result                    |
| ------------------------------------------------------- | ------------------------- |
| zombies | **🧟 ZOMBIE WINS**        |
| Zombie | **** |
| Town Mafia | **** |

### Win Check

```
onPhaseEnd():
  alive_non_zombie = players.filter(p => p.is_alive && !p.is_zombie && p.role !== "Zombie")
  if alive_non_zombie.length === 0 && zombie_player.is_alive:
    game.end(winner = "Zombie")
```

## Zombie Spreading Visualization

```
Night 1: 🧟 → Player A infected
Day 2:   Player A = 🧟 (limited chat, no vote)
Night 2: 🧟 → Player B infected  
Day 3:   Players A, B = 🧟🧟 (Doctor cures A → A recovers!)
Night 3: 🧟 → Player C infected
Day 4:   Players B, C = 🧟🧟 ...
```

## Morning Report Messages

| Event                     | Message                                                    |
| ------------------------- | ---------------------------------------------------------- |
| ** ** | _"Player X doesn't look well today... 🧟"_                 |
| **Doctor cure**           | _"Player Y looks much better today! 💊"_                    |
| **Zombie ** | __              |
| **Zombie ** | ❌ |
