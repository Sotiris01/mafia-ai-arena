---
tags:
  - game_design
  - mechanic
  - win_condition
---

# Win Conditions
---

Οι συνθήκες νίκης ελέγχονται **αυτόματα** μετά από κάθε [[Day Phase#The Trial & Vote|Lynch]] και μετά από κάθε [[Night Phase#Resolution|Night Resolution]]. Αν πληρείται κάποια συνθήκη, το παιχνίδι τελειώνει αμέσως.

---

## Town Victory

| Condition       | Όλα τα μέλη της Μαφίας έχουν εξοντωθεί                    |
| --------------- | ---------------------------------------------------------- |
| **Check**       | `mafia_alive_count == 0`                                   |
| **When checked**| Μετά από Day Lynch + μετά από Night Resolution              |
| **Result**      | 🏆 **Town Wins!** — Όλα τα ζωντανά Town μέλη κερδίζουν     |

### How Town Wins

```
if (players.filter(p => p.alignment === "Mafia" && p.is_alive).length === 0):
  game.end(winner = "Town")
```

- Ο [[Sheriff]] εντοπίζει Mafia μέλη με investigations.
- Το Town ψηφίζει τους υπόπτους κατά τη [[Day Phase#The Trial & Vote|Trial]].
- Ο [[Doctor]] προστατεύει κρίσιμους ρόλους κατά τη νύχτα.
- Ο [[Lookout]] και ο [[Gossip]] παρέχουν επιπλέον στοιχεία.

---

## Mafia Victory

| Condition       | Τα ζωντανά Mafia μέλη ≥ ζωντανά Town μέλη                  |
| --------------- | ---------------------------------------------------------- |
| **Check**       | `mafia_alive_count >= town_alive_count`                    |
| **When checked**| Μετά από Day Lynch + μετά από Night Resolution              |
| **Result**      | 🏆 **Mafia Wins!** — Η πόλη δεν μπορεί πλέον να τους ψηφίσει |

### Why Majority = Victory

Αν η Mafia αποκτήσει **αριθμητική ισοτιμία** ή πλεονέκτημα, το Town δεν μπορεί πλέον να τους ψηφίσει κατά πλειοψηφία — η Mafia ελέγχει τις ψηφοφορίες.

### Examples

| Alive Town | Alive Mafia | Result                                    |
| ---------- | ----------- | ----------------------------------------- |
| 5          | 2           | Game continues — Town majority            |
| 3          | 2           | Game continues — Town 3 vs Mafia 2        |
| 2          | 2           | **MAFIA WINS** — Equal = Mafia controls   |
| 1          | 2           | **MAFIA WINS** — Mafia majority           |

### Neutral Players in Count

- **[[Survivor]]** μετράει ως **Town** στο count check (δεν ανήκει στη Mafia).
- **[[Jester]]** μετράει ως **Town** στο count check.
- **[[Executioner]]** μετράει ως **Town** στο count check.
- **[[Zombie]]** μετράει ως **Town** στο count check (κρύβεται ως Town).
- **Zombie θύματα** μετράνε ως **ζωντανοί** αλλά **δεν ψηφίζουν** — δεν επηρεάζουν Town/Mafia balance.

---

## Jester Victory (Special)

| Condition       | Ο [[Jester]] ψηφίζεται για εξόντωση κατά τη Day Phase     |
| --------------- | ---------------------------------------------------------- |
| **Check**       | Αμέσως μετά τo Lynch, πριν οποιονδήποτε άλλο έλεγχο        |
| **Result**      | 🏆 **Jester Wins!** — Game Over αμέσως                      |
| **Others**      | ❌ Ούτε Town, ούτε Mafia κερδίζουν                          |

### Priority

Ο Jester Win check γίνεται **ΠΡΙΝ** από τα Town/Mafia checks:

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

- Αν η Mafia ήταν κοντά στη νίκη αλλά ψηφιστεί ο Jester → **Jester κερδίζει**, η Mafia **χάνει**.
- Αν το Town είχε εντοπίσει σχεδόν όλη τη Mafia → **Jester κερδίζει**, το Town **χάνει**.
- Αυτό κάνει τον Jester ένα **wild card** που μπορεί να ανατρέψει τα πάντα.

---

## Survivor Win Condition

| Condition       | Ο [[Survivor]] είναι ζωντανός όταν τελειώσει το παιχνίδι  |
| --------------- | ---------------------------------------------------------- |
| **Check**       | Μετά το Game Over (Town ή Mafia νίκη)                      |
| **Result**      | 🏆 **Survivor ALSO Wins** — Κερδίζει μαζί με τον νικητή    |

### Co-Victory

Ο Survivor μπορεί να κερδίσει **μαζί** με το Town ΚΑΙ μαζί με τη Mafia. Δεν αντιτίθεται σε κανέναν — αρκεί να είναι ζωντανός.

```
onGameEnd(winner):
  if survivor.is_alive:
    survivor.wins = true  // Regardless of who won
```

---

## Executioner Victory

| Condition       | Ο assigned target του [[Executioner]] ψηφίζεται κατά τη Day Phase |
| --------------- | ---------------------------------------------------------- |
| **Check**       | Αμέσως μετά τo Lynch (μετά τον Jester check)                |
| **Result**      | 🏆 **Executioner Wins!** — Αλλά το παιχνίδι **ΣΥΝΕΧΙΖΕΙ**   |
| **Others**      | Το παιχνίδι δεν τελειώνει — Town vs Mafia συνεχίζεται      |

### Key Differences from Jester

- Ο Jester win **τερματίζει** το παιχνίδι → **κανείς** δεν κερδίζει εκτός Jester.
- Ο Executioner win **ΔΕΝ τερματίζει** → ο Executioner κερδίζει **αλλά** Town vs Mafia συνεχίζεται.
- Ο Executioner δεν μπορεί πλέον να χάσει μετά τη νίκη — ακόμα κι αν πεθάνει.

### Fallback: Target Died at Night

```
onNightDeath(player):
  if player == executioner.target:
    executioner.role = "Jester"  // Fallback — τώρα πρέπει να ψηφιστεί ο ίδιος
```

---

## Zombie Victory

| Condition       | Όλοι οι ζωντανοί παίκτες (εκτός Zombie) είναι zombies     |
| --------------- | ---------------------------------------------------------- |
| **Check**       | Μετά κάθε Night Resolution (Phase 6)                        |
| **Result**      | 🧟 **Zombie Wins!** — Game Over αμέσως                      |
| **Others**      | ❌ Ούτε Town, ούτε Mafia κερδίζουν                          |

### Win Logic

```
onPhaseEnd():
  alive_non_zombie = players.filter(p => p.is_alive && !p.is_zombie && p.role !== "Zombie")
  if alive_non_zombie.length === 0 && zombie_player.is_alive:
    game.end(winner = "Zombie")
```

### Important Notes

- Ο Zombie κερδίζει **μόνο αν** κάθε ζωντανός παίκτης (εκτός αυτού) είναι zombie.
- Αν ο Zombie πεθάνει (lynch ή Mafia kill), **χάνει** — αλλά τα θύματά του **παραμένουν** zombies.
- Ο [[Doctor]] μπορεί να **cure** zombie θύματα → αντίμετρο.
- Τα zombie θύματα δεν ψηφίζουν → η ψηφοφορία γίνεται ευκολότερη για τους εναπομείναντες.

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
