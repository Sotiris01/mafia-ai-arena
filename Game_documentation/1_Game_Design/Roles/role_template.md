---
tags:
  - template
  - meta
---

# Role Template
---

---

| #  | Section                          |  |  |
| -- | -------------------------------- | ----------- | ----------------------------------------------------------------- |
| 1  | Title & Property Table           | ⭐ |  |
| 2  | Gameplay Importance & Scaling    | ⭐ |  |
| 3  | Overview                         | ⭐ |  |
| 4  | Night/Day Action                 | ⭐ |  |
| 5  | Strategy Notes                   | ⭐ |  |
| 6  | AI Behavior (Virtual Player)     | ⭐ |  |
| 7  | Related Links                    | ⭐ |  |
| 8  | Win Condition (detail)           | Conditional  | Neutral , win condition |
| 9  | Comparison Table                 | Optional     | (counterpart) |
| 10 | Interactions with Other Roles    | Optional     |  |
| 11 | UI/UX Impact                     | Optional     |  |
| 12 | Morning Report Messages          | Optional     | events Morning Report |
| 13 | Setup & Assignment               | Optional     | assignment |

---

## 1. Title & Property Table ⭐

**Factions:** `Town`, `Mafia`, `Neutral`

```markdown
# RoleName (Faction)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Town]] / [[The Mafia]] / [[Neutral]] |
| **Night Action** | ActionName / None                |
| **Appears as** | Town / Mafia (to [[Sheriff]])      |
```

| Property         |  |  |
| ---------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Alignment**    | `[[The Town]]`, `[[The Mafia]]`, `[[Neutral]]`                             | Wikilink faction page |
| **Night Action** | `None` | Passive : `None (Passive — ...)`, Day-focused: `None (Day-focused role)` |
| **Appears as**   | Sheriff | Town → `Town`, Mafia → `Mafia`, Exceptions: Godfather → `**Town** ⚠️`, Zombie → `Town` |
| **Win Condition** | **Neutral** | Wikilink Win Conditions + |

|  | Appears as                        |  |
| ------------- | --------------------------------- | ------------------------------------------- |
| Sheriff       | `Town (to [[Sheriff]])`           | Town |
| Godfather     | `**Town** (to [[Sheriff]]) ⚠️`    | Investigation immunity|
| Mafia Goon    | `Mafia (to [[Sheriff]])`          | Mafia |
| Jester        | `Town (to [[Sheriff]])`           | Neutral Town |
| Zombie | `🧟 Zombie (to [[Sheriff]])`      | detection |

---

## 2. Gameplay Importance & Scaling ⭐

```markdown
## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟢/🟡/🔵/🟣 **TIER**|
| **Min Players**      |  |
| **Scaling**          |  |
| **Unique?**          | ✅ / ❌ |
```

### Importance Tiers

| Tier | Emoji | Label        | Min Players |  |
| ---- | ----- | ------------ | ----------- | ------------------------------------------------------------- |
| 1    | 🟢    | **CORE**     | 7           |  |
| 2    | 🟡    | **IMPORTANT**| 8–9         | medium games |
| 3    | 🔵    | **ADVANCED** | 10–12       | experienced players |
| 4    | 🟣    | **EXPANDED** | 13–16       |  |

#### Why [Tier Name]

```markdown
### Why [Tier Name]

```

### Conditional Subsections

| Subsection                     |  |  |
| ------------------------------ | --------------------------------------------------------- | ---------------------------------- |
| **When NOT Present**           |  | Framer, Lookout, Survivor          |
| **Balance Tradeoff**           | /reward tradeoff | Lovers, Mayor, Zombie              |
| **Death Impact**               | win rates | Godfather                          |
| **Impact by Game Size**        | player count | Silencer                           |
| **Instances by Player Count**  | ** unique** (❌) | Citizen, Mafia Goon                |

#### Instances by Player Count

```markdown
### Instances by Player Count

| Total Players | Instances |
| ------------- | --------- |
| 7             | X         |
| 10            | X         |
| 12            | X–Y       |
| 15            | X–Y       |
```

---

## 3. Overview ⭐

```markdown
## Overview

```

### Optional Overview Subsections

| Subsection                  |  |  |
| --------------------------- | ------------------------------------------------- | --------------------------------- |
| **Key Mechanics**           |  | Lovers, Janitor, Zombie           |
| ** / ** | Investigation/info | Consigliere, Lookout, Tracker     |
| **Investigation Immunity**  | Sheriff investigation | Godfather                         |
| **Mafia Leadership**        | Mafia leader | Godfather                         |
| **Effects on Victims**      |  | Zombie, Silencer                  |
| **Sheriff Interaction**     | Sheriff | Zombie (self vs victims)          |

---

## 4. Night / Day Action ⭐

```markdown
## Night Action: ActionName

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Target**      |  |
| **Effect**      |  |
| **Duration**    |  |
| **Uses**        | / |
| **Self-target** | ✅ / ❌                                                              |
| **Cooldown**    | cooldown |
| **Blocked by**  | / |
| **Stacking**    |  |
```

### Resolution Logic

```markdown
### Resolution Logic

\```
\```
```

### Night Resolution Phase

| Phase |  |  |
| ----- | -------------------------------------- | ---------------------------------------- |
| 0     | Passive visits                         | Lovers visit                             |
| 1     | Manipulation     | Framer, Silencer                         |
| 2     | Investigation                          | Sheriff, Consigliere, Lookout, Tracker   |
| 3     | Kill, Protection                       | Mafia Kill, Doctor Protect, Bodyguard    |
| 4     | Post-kill effects, linked death        | Zombie infect, Lovers death link         |
| 5     | Passive info                           | Gossip clue                              |
| 6     | Cleanup, state updates                 | Janitor inspect dead                     |

```markdown
## Day Action: ActionName

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Trigger**     |  |
| **Effect**      |  |
| **Permanent**   | ✅ / ❌                                                              |
| **Reversible**  | ✅ / ❌                                                              |
```

```markdown
## Abilities

```

---

## 5. Strategy Notes ⭐

```markdown
## Strategy Notes

- **Bullet 1:** [Strat tip]
- **Bullet 2:** [Strat tip]
```

```markdown
## Strategy Notes

### As [RoleName]
- ...

### Against [RoleName]
- ...
```

**:** Lovers (As Lovers / Against Lovers), Zombie (As Zombie / Against Zombie), Jester (As Jester / Against Jester)

- [ ] **Counters**
- [ ] **Timing**
- [ ] **Fake claims**

---

## 6. AI Behavior (Virtual Player) ⭐

```markdown
## AI Behavior (Virtual Player)

- **Target selection:** [ [[Data Architecture#memory.json|memory.json]]]
- **[[AI Decision Engine#Speak Probability|speak probability]]:** [Low / Moderate / High + ]
- **[[Data Architecture#personality.json|personality]] interaction:** [ personality ]
```

### Checklist AI Behavior

- [ ] **Target selection logic**
- [ ] **Speak probability**
- [ ] **Personality effects**
- [ ] **Information sharing**
- [ ] **Defensive behavior**
- [ ] **Role-specific triggers**

### JSON State

```json
// memory.json entry example
{
  "night_results": [
    {
      "night": 2,
      "target": "Player X",
      "result": "..."
    }
  ]
}
```

---

## 7. Related Links ⭐

```markdown
## Related Links

- [[Night Phase#...]] [[Day Phase#...]] (phase association)
- [[Win Conditions#... Victory]] (win condition)
- [[RoleName]] (counterpart / ally / synergy)
```

### Minimum Links

|  | Minimum Links                                                  |
| ----------------- | -------------------------------------------------------------- |
| **Town ** | Night Phase section + Win Conditions#Town Victory + direct counterpart |
| **Mafia ** | Night Phase#Mafia Chat + Win Conditions#Mafia Victory + Godfather + teammates |
| **Neutral ** | Win Conditions#[Role] Victory + Day/Night Phase + related Neutral |

---

## 8–13. Optional Sections

### 8. Win Condition Detail

```markdown
## Win Condition

| Condition        | Result               |
| ---------------- | -------------------- |
| [ ] | **[ROLE] WINS**      |
| [ 1] | **** |
| [ 2] | **** / |
```

### 9. Comparison Table

```markdown
### [Role A] vs [Role B]

| Aspect              | Role A                        | Role B                         |
| ------------------- | ----------------------------- | ------------------------------ |
| **Alignment**       | ...                           | ...                            |
| **/** | ...                           | ...                            |
| **Counter**         | ...                           | ...                            |
| **Best for**        | ...                           | ...                            |
```

- Consigliere vs Sheriff
- Tracker vs Lookout
- Bodyguard vs Doctor
- Executioner vs Jester

### 10. Interactions with Other Roles

```markdown
## Interactions with Other Roles

### [RoleName] Interaction

```

### 11. UI/UX Impact

```markdown
## UI/UX Impact

- [ UI: badges, icons, chat restrictions, voting display]
```

### 12. Morning Report Messages

```markdown
## Morning Report Messages

| Event              | Message                              |
| ------------------ | ------------------------------------ |
| [Event type]       | _"Message text..."_                   |
```

### 13. Setup & Assignment

```markdown
## Setup & Assignment

| Rule              | Description                          |
| ----------------- | ------------------------------------ |
| **** |  |
| **** |  |
| **Compatibility** | (restrictions) |
```

---

- [ ] Title format: `# RoleName (Faction)` + `---`
- [ ] Property Table: Alignment, Night Action, Appears as
- [ ] Gameplay Importance & Scaling table + Why [Tier] subsection
- [ ] Overview
- [ ] Night/Day Action — parameter table + resolution logic code block
- [ ] Resolution phase assigned (0–6)
- [ ] Strategy Notes
- [ ] AI Behavior — target selection + speak probability + personality
- [ ] Related Links

|  |  |
| ------------------------------------------ | ------------------------------------------------------------- |
| [[Night Phase]]                            | Resolution order, night action list                            |
| [[Day Phase]]                              | Day mechanics |
| [[Win Conditions]]                         | win condition |
| [[Index]]                                  |  |
| [[Folder Structure]]                       |  |
| [[Data Architecture]]                      | JSON fields |
| [[AI Decision Engine]]                     | AI |
| Role files | .. Sheriff (investigation exceptions), Doctor (protection) . |

### Sheriff Investigation Exceptions

- file Sheriff (Investigation Exceptions table) 
- property table (Appears as)
- Night Phase (resolution order)

---

## Design Principles

### Balance Rules

5. **Unique vs Multi-instance:** 
 - Filler (Citizen, Mafia Goon) → ❌ Non-unique, scales with player count

### Fundamental Game Mechanic

> - Fake claims
> - Role counting
> - Janitor exclusive knowledge

### Naming Convention

### File Placement

```
Game_documentation/1_Game_Design/Roles/
├── Town/
│   └── NewTownRole.md
├── Mafia/
│   └── NewMafiaRole.md
├── Neutral/
│   └── NewNeutralRole.md
└── role_template.md
```

---

### Town

|  | Tier       | Min | Night Action        | Unique |
| ---------- | ---------- | --- | ------------------- | ------ |
| Citizen    | 🟢 CORE    | 7   | None                | ❌     |
| Sheriff    | 🟢 CORE    | 7   | Investigate         | ✅     |
| Doctor     | 🟢 CORE    | 7   | Protect / Cure      | ✅     |
| Lookout    | 🟡 IMPORTANT| 8  | Watch               | ✅     |
| Gossip     | 🟡 IMPORTANT| 9  | Passive (clue)      | ✅     |
| Bodyguard  | 🔵 ADVANCED| 10  | Protect (sacrifice) | ✅     |
| Lovers     | 🔵 ADVANCED| 10  | Passive (visit)     | ✅ |
| Tracker    | 🔵 ADVANCED| 12  | Track               | ✅     |
| Mayor      | 🟣 EXPANDED| 13  | Day: Reveal         | ✅     |

### Mafia

|  | Tier       | Min | Night Action            | Unique |
| ------------ | ---------- | --- | ----------------------- | ------ |
| Godfather    | 🟢 CORE    | 7   | Kill Vote (Leader)      | ✅     |
| Mafia Goon   | 🟢 CORE    | 7   | Kill Vote               | ❌     |
| Framer       | 🟡 IMPORTANT| 9  | Frame                   | ✅     |
| Silencer     | 🔵 ADVANCED| 11  | Silence                 | ✅     |
| Consigliere  | 🟣 EXPANDED| 13  | Investigate (Exact Role)| ✅     |
| Janitor      | 🟣 EXPANDED| 14  | Investigate Dead        | ✅     |

### Neutral

|  | Tier       | Min | Night Action    | Unique | Win Condition           |
| ------------ | ---------- | --- | --------------- | ------ | ----------------------- |
| Jester       | 🟢 CORE    | 7   | None            | ✅     | Get lynched (game ends) |
| Survivor     | 🟡 IMPORTANT| 9  | Vest (self)     | ✅     | Stay alive              |
| Executioner  | 🔵 ADVANCED| 12  | None            | ✅     | Target lynched          |
| Zombie       | 🟣 EXPANDED| 14  | Infect          | ✅     | All players zombified   |

---

## Blank Template

```markdown
# [RoleName] ([Faction])
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Town]] / [[The Mafia]] / [[Neutral]] |
| **Night Action** | [ActionName] / None              |
| **Appears as** | [Town/Mafia] (to [[Sheriff]])      |
| **Win Condition** | [ Neutral |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | [🟢/🟡/🔵/🟣] **[TIER]**|
| **Min Players**      | [] |
| **Scaling**          | [ ] |
| **Unique?**          | [✅ / ❌ ] |

### Why [Tier Name]

## Overview

## Night Action: [ActionName]

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Target**      | [ ] |
| **Effect**      | [ ] |
| **Duration**    | [ ] |
| **Blocked by**  | [ ] |

### Resolution Logic

\```
\```

## Strategy Notes

## AI Behavior (Virtual Player)

- **Target selection:** [ [[Data Architecture#memory.json|memory.json]]]
- **[[AI Decision Engine#Speak Probability|speak probability]]:** [Low/Moderate/High + ]

## Related Links

- [[Night Phase#...]]
- [[Win Conditions#... Victory]]
- [[RoleName]] (counterpart / synergy)
```
