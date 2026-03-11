---
tags:
  - game_design
  - mechanic
  - win_condition
---

# Win Conditions
---

---

## Town Victory

| Condition       |  |
| --------------- | ---------------------------------------------------------- |
| **Check**       | `mafia_alive_count == 0`                                   |
| **When checked**| Day Lynch + Night Resolution |
| **Result**      | 🏆 **Town Wins!**|

### How Town Wins

```
if (players.filter(p => p.alignment === "Mafia" && p.is_alive).length === 0):
  game.end(winner = "Town")
```

---

## Mafia Victory

| Condition       | Mafia ≥ Town |
| --------------- | ---------------------------------------------------------- |
| **Check**       | `mafia_alive_count >= town_alive_count`                    |
| **When checked**| Day Lynch + Night Resolution |
| **Result**      | 🏆 **Mafia Wins!**|

### Why Majority = Victory

### Examples

| Alive Town | Alive Mafia | Result                                    |
| ---------- | ----------- | ----------------------------------------- |
| 5          | 2           | Game continues — Town majority            |
| 3          | 2           | Game continues — Town 3 vs Mafia 2        |
| 2          | 2           | **MAFIA WINS** — Equal = Mafia controls   |
| 1          | 2           | **MAFIA WINS** — Mafia majority           |

### Neutral Players in Count

- **[[Survivor]]** **Town** count check.
- **[[Executioner]]** **Town** count check.

---

## Jester Victory (Special)

| Condition       | [[Jester]] Day Phase |
| --------------- | ---------------------------------------------------------- |
| **Check**       | o Lynch, |
| **Result**      | 🏆 **Jester Wins!**|
| **Others**      | ❌ Town, Mafia |

### Priority

```
onLynch(player):
  if player.role === "Jester":
    game.end(winner = "Jester")  // IMMEDIATE — no other checks
    return
  
  // Normal checks continue...
  checkTownVictory()
  checkMafiaVictory()
```

### Implications

---

## Survivor Win Condition

| Condition       | [[Survivor]] |
| --------------- | ---------------------------------------------------------- |
| **Check**       | Game Over |
| **Result**      | 🏆 **Survivor ALSO Wins**|

### Co-Victory

```
onGameEnd(winner):
  if survivor.is_alive:
    survivor.wins = true  // Regardless of who won
```

---

## Executioner Victory

| Condition       | assigned target [[Executioner]] Day Phase |
| --------------- | ---------------------------------------------------------- |
| **Check**       | o Lynch |
| **Result**      | 🏆 **Executioner Wins!**|
| **Others**      |  |

### Key Differences from Jester

### Fallback: Target Died at Night

```
onNightDeath(player):
  if player == executioner.target:
    executioner.role = "Jester"  // Fallback
```

---

## Zombie Victory

| Condition       | zombies |
| --------------- | ---------------------------------------------------------- |
| **Check**       | Night Resolution (Phase 6) |
| **Result**      | 🧟 **Zombie Wins!**|
| **Others**      | ❌ Town, Mafia |

### Win Logic

```
onPhaseEnd():
  alive_non_zombie = players.filter(p => p.is_alive && !p.is_zombie && p.role !== "Zombie")
  if alive_non_zombie.length === 0 && zombie_player.is_alive:
    game.end(winner = "Zombie")
```

### Important Notes

---

## Win Check Flow

```
After every Day Lynch:
  1. Is lynched player Jester? → JESTER WINS (Game Over)
  2. Is lynched player Executioner's target? → EXECUTIONER WINS (game continues)
  3. Are all Mafia dead? → TOWN WINS
  4. Mafia ≥ Town? → MAFIA WINS
  5. All alive non-zombie? → ZOMBIE WINS
  6. None → Game continues → Night Phase

After every Night Resolution:
  1. Did Executioner's target die? → Executioner becomes Jester
  2. Are all Mafia dead? → TOWN WINS (unlikely at night)
  3. Mafia ≥ Town? → MAFIA WINS
  4. All alive non-zombie? → ZOMBIE WINS
  5. None → Game continues → Day Phase

On any Game End:
  - Check if Survivor is alive → Survivor also wins
  - If Executioner already won → Executioner still wins
```

---

## Related Links

- [[Day Phase#The Trial & Vote]] (where Lynch happens)
- [[Night Phase#Resolution]] (where night kills happen)
- [[Jester]] (special win condition — game ender)
- [[Survivor]] (co-victory condition)
- [[Executioner]] (target lynch — game continues)
- [[Zombie]] (zombie infection — game ender)
- [[Game Setup]] (how game starts)
