---
tags:
  - technical
  - technical/ai
  - workflow
---

# AI Decision Engine
---

---

## 1. Speak Probability Engine

### Formula

```
speak_chance(player) =
    personality_base
  × role_modifier
  × trigger_modifier
  × cooldown_modifier
```

### Factor 1: Personality Base

| Personality   | Base Probability | Behavior                               |
| ------------- | ---------------- | -------------------------------------- |
| **Shy**       | 0.10 (10%)       | , |
| **Cautious**  | 0.30 (30%)       |  |
| **Logical**   | 0.50 (50%)       | moderate, evidence-based |
| **Paranoid**  | 0.60 (60%)       | , |
| **Charismatic**| 0.70 (70%)      | , , |
| **Aggressive**| 0.80 (80%)       | , |

### Factor 2: Role Modifier

| Role                          | Modifier | Reason                                                |
| ----------------------------- | -------- | ----------------------------------------------------- |
| Town general ([[Citizen]], [[Doctor]], [[Lookout]], [[Tracker]], [[Gossip]]) | ×1.0 | modifier |
| [[Sheriff]]                   | ×1.1     | evidence |
| [[Bodyguard]]                 | ×1.0     |  |
| [[Lovers]]                    | ×1.0     | Citizens |
| [[Mayor]] (pre-reveal)        | ×0.9     | profile reveal |
| [[Mayor]] (post-reveal)       | ×1.3     | ×2 |
| Mafia general ([[Mafia Goon]], [[Framer]], [[Silencer]]) | ×0.7 | Mafia |
| [[Godfather]]                 | ×1.1     | (investigation immune) |
| [[Consigliere]]               | ×0.8     |  |
| [[Janitor]]                   | ×0.7     |  |
| [[Jester]]                    | ×1.2     |  |
| [[Executioner]]               | ×1.0     |  |
| [[Survivor]]                  | ×0.6     | profile |
| [[Zombie]]                    | ×0.8     | Town |

### Factor 3: Trigger Modifiers

| Trigger                                | New Probability | Priority  |
| -------------------------------------- | --------------- | --------- |
| **DIRECTLY ACCUSED** by another player | **0.95**        | Highest   |
| **Has evidence** (Sheriff knows Mafia + Mafia accused) | **0.85** | High |
| **Ally defended/attacked**             | **+0.40**       | Medium    |
| **Saw something** (Lookout/Tracker witness) | **+0.30**  | Medium    |
| **Night Echo Event** mentions self/ally | **+0.25**      | Medium    |
| **Mayor revealed** (post-reveal boost) | **+0.20**      | Medium    |
| **Lover partner accused**              | **+0.50**       | High      |
| **General discussion**                 | Base value      | Low       |

### Factor 4: Cooldown Modifier

```
if player spoke in last 2 messages:
  cooldown_modifier = 0.2  // Dramatic reduction
elif player spoke in last 5 messages:
  cooldown_modifier = 0.6
else:
  cooldown_modifier = 1.0  // No penalty
```

### Selection Process

```
for each alive AI player:
  chance = personality_base × role_mod × trigger_mod × cooldown_mod
  roll = random(0, 1)
  if roll < chance:
    add to speakers_queue

sort speakers_queue by:
  1. Directly accused (highest priority)
  2. Has critical evidence
  3. Strong emotional trigger
  4. Normal reaction

execute first speaker → generate message → restart loop
```

---

## 2. Perception Depth

**Detailed:** [[Memory System#Perception Depth]]

### Quick Reference

| Level | Type            | Filter                     | Data Scope  | Personalities            | Behavior                                |
| ----- | --------------- | -------------------------- | ----------- | ------------------------ | --------------------------------------- |
| **1** | **Superficial** | `weight > 0.7` or `< -0.7`| Current day | [[Aggressive]], [[Shy]]  | , |
| **2** | **Smart**       | `weight > 0.2` or `< -0.2`| All days    | [[Cautious]], [[Charismatic]], [[Logical]] | patterns, cross-references |
| **3** | **Deep**        | `weight > 0.1` or `< -0.1`| All days + indirect | [[Paranoid]]      |  |

### Practical Example

**Scenario:** Player A defended Player B (Day 1, weight +0.4), Player B later revealed as Mafia (Day 3).

| AI Level      | Analysis                                                   |
| ------------- | ---------------------------------------------------------- |
| 1 Superficial | Day 1 data. A↔B. |
| 2 Smart       | historical data: A defended known-Mafia B → A |
| 3 Deep        | Cross-references: A defended B + A Town C + Night Echo event E02 A → A |

---

## 3. Vote Decision Logic

### Step-by-Step

```
1. LOAD memory.json
2. APPLY Perception Depth filter
3. COLLECT all suspicion scores for alive players
4. APPLY Time Decay to historical data
5. CHECK Role overrides:
   - Sheriff + known_role = "Mafia" → FORCE vote that player
   - Mafia → NEVER vote fellow Mafia
   - Jester → Vote strategically to provoke accusations
6. SELECT player with highest aggregated suspicion
7. IF tie → Prefer most recently accused
8. CAST vote
```

### Personality Impact on Voting

| Personality    | Voting Behavior                                         | Wait Time    |
| -------------- | ------------------------------------------------------- | ------------ |
| **Aggressive** | , | Early voter  |
| **Cautious**   |  | Late voter   |
| **Paranoid**   | Random element| Mid voter    |
| **Logical**    | 100% evidence | Mid voter    |
| **Shy**        | majority — "bandwagon" voter | Latest voter |
| **Charismatic**|  | Early voter  |

---

## 4. Message Generation

### Inputs

| Source                  | What it provides                                  |
| ----------------------- | ------------------------------------------------- |
| **role.json**           | Alignment, role-specific knowledge                |
| **personality.json**    | Tone, vocabulary, aggression level                |
| **memory.json**         | Who to accuse/defend, what evidence to share      |
| **chat_events.json**    | Context of current discussion                     |

### Message Types

| Type              | When                                     | Example                                          |
| ----------------- | ---------------------------------------- | ------------------------------------------------ |
| **Accusation**    | High suspicion target                    | "I've been watching Player D — very suspicious."  |
| **Defense**       | Self or ally accused                     | "I'm not Mafia! I voted Town yesterday."          |
| **Agreement**     | Ally makes accusation                    | "I agree with Player A. Player D is suspicious."  |
| **Role Claim**    | Critical moment (life-or-death)          | "I'm the Sheriff. Player D is Mafia."             |
| **Deflection**    | Mafia trying to divert attention         | "Let's focus on Player F instead."                |
| **Random Chat**   | Low-trigger, Paranoid personality        | "I don't trust anyone here."                      |

---

## 5. Special AI Behaviors by Role

### Town (9)

| Role              | Special Behavior                                                                    |
| ----------------- | ----------------------------------------------------------------------------------- |
| **Citizen AI**    | . suspicion + personality. |
| **Sheriff AI**    | Reveals investigation results "optimal" . results . |
| **Doctor AI**     | . protect cure zombie threat. |
| **Lookout AI**    |  |
| **Tracker AI**    | . Mafia killers. |
| **Gossip AI**     | hints . Cross-references events. |
| **Lovers AI**     | partner. partner. trust bonus. |
| **Bodyguard AI**  | Town player. . |
| **Mayor AI**      | Pre-reveal: profile. Post-reveal: ×2 . . |

### Mafia (6)

| Role              | Special Behavior                                                                    |
| ----------------- | ----------------------------------------------------------------------------------- |
| **Godfather AI**  | Town members (investigation immune). Mafia Chat. |
| **Mafia Goon AI** | Godfather strategy. Fake accusations. teammates. |
| **Framer AI**     | frame target Mafia kill target max confusion. |
| **Silencer AI**   | Town player. |
| **Consigliere AI**| role info Mafia Chat. kill target . |
| **Janitor AI**    | Mafia Chat. Exploits "no role reveal" mechanic. |

### Neutral (4)

| Role              | Special Behavior                                                                    |
| ----------------- | ----------------------------------------------------------------------------------- |
| **Jester AI**     | . confusion. : . |
| **Executioner AI**| 100% assigned target. |
| **Survivor AI**   | neutral. profile. . Vest . |
| **Zombie AI**     | Town. . |

---

## 6. Night Echo Event Reactions

 AI Players [[Dynamic Events#Night Echo Events|Night Echo Events]] (E01–E14) `perception_depth` + `emotional_reactivity` + `suspicion_sensitivity`.

### Event Weight → Memory Impact

```
new_suspicion = existing_suspicion + (event_weight × emotional_reactivity × memory_weight_modifier)
```

| Event              | Base Weight |  |
| ------------------ | ----------- | ----------------------------------- |
| E01 Noise, E05 Seen | +0.15      |  |
| E02 Shadow         | +0.30       | — Mafia/Zombie linked |
| E03 Footsteps      | +0.10       | Neutral|
| E04 Argument       | +0.20       |  |
| E06 Commotion      | +0.25       |  |
| E07 Gun            | +0.35       | "" = |
| E08 Nervous        | +0.30       | = |
| E09 Watchful       | +0.15       |  |
| E10 Whispers       | +0.40       |  |
| E11 Medical        | -0.10       | suspicion |
| E12 Guard Post     | -0.15       | suspicion |
| E13 Illness        | +0.20       | Zombie concern                      |
| E14 Silenced       | +0.10       | hint |

### Personality × Event Reactions

| `perception_depth` | Event Reaction                                                      |
| ------------------ | ------------------------------------------------------------------- |
| 1 (Superficial)    | events weight ≥ 0.25. events. |
| 2 (Smart)          | events. Cross-references 1–2 . |
| 3 (Deep)           | Cross-references events + vote patterns + night results + events. . |

| Personality     | `emotional_reactivity` | `memory_weight_modifier` | Behavior                               |
| --------------- | ---------------------- | ------------------------ | -------------------------------------- |
| [[Aggressive]]  | 1.40                   | 1.20                     |  |
| [[Cautious]]    | 0.60                   | 0.70                     |  |
| [[Charismatic]] | 1.00                   | 0.90                     | events |
| [[Logical]]     | 0.50                   | 1.00                     |  |
| [[Paranoid]]    | 1.60                   | 1.50                     |  |
| [[Shy]]         | 0.80                   | 0.80                     | events |

---

## Related Links

- [[Gameplay Loop]] (where the engine runs)
- [[Memory System]] (data source for decisions)
- [[Data Architecture]] (JSON storage — 17 personality stats)
- [[Day Phase]] (where speaking + voting happens)
- [[Night Phase]] (where night decisions + Resolution Order happens)
- [[Dynamic Events]] (Night Echo Events E01–E14, Last Wish, Full Moon)
