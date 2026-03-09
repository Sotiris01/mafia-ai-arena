---
tags:
  - meta
  - navigation
---

# Graph View Setup Guide
---

Οδηγός ρύθμισης του Obsidian Graph View για χρωματική ομαδοποίηση των notes.

---

## Πώς να ανοίξεις το Graph View

1. `Ctrl + G` → Global Graph View
2. Ή πάτα στο μενού αριστερά → **Open graph view**
3. Πάνω δεξιά στο graph, πάτα **⚙️ Settings** (gear icon)

---

## Graph View Groups — Copy-Paste Setup

Στο **Settings → Groups**, πρόσθεσε τα παρακάτω groups **με αυτή τη σειρά** (πρώτο = πιο πάνω στη λίστα = υψηλότερη προτεραιότητα):

| #   | Query                   | Color        | Περιγραφή                                                     |
| --- | ----------------------- | ------------ | ------------------------------------------------------------- |
| 1   | `tag:#role/town`        | 🔵 `#4a9eff` | Town roles (9 notes)                                          |
| 2   | `tag:#role/mafia`       | 🔴 `#ff4a4a` | Mafia roles (6 notes)                                         |
| 3   | `tag:#role/neutral`     | 🟡 `#ffd700` | Neutral roles (4 notes)                                       |
| 4   | `tag:#personality`      | 🟣 `#b44aff` | Personalities (6 notes)                                       |
| 5   | `tag:#event/night_echo` | 🟠 `#ff8c00` | Night Echo Events E01–E14 (14 notes)                          |
| 6   | `tag:#event`            | 🟤 `#cd853f` | Other events — Full Moon, Last Wish, Dynamic Events (3 notes) |
| 7   | `tag:#phase`            | 🩵 `#00cec9` | Day Phase, Night Phase (2 notes)                              |
| 8   | `tag:#technical`        | 🟢 `#00b894` | Technical Workflow (4 notes)                                  |
| 9   | `tag:#project`          | 🩷 `#e84393` | Project Structure (4 notes)                                   |
| 10  | `tag:#mechanic`         | ⚪ `#a0a0a0`  | Win Conditions, Game Setup (2 notes)                          |
| 11  | `tag:#MOC`              | ⬜ `#ffffff`  | Index / Navigation (1 note)                                   |

> **Tip:** Obsidian αξιολογεί τα groups από πάνω προς τα κάτω. Βάλε τα πιο specific groups (π.χ. `tag:#role/town`) **πριν** τα generic (π.χ. `tag:#role`).

---

## Recommended Graph Settings

### Filters (Φίλτρα)
- ✅ **Tags** → ON (εμφανίζει tag nodes στο graph)
- ✅ **Attachments** → OFF
- ✅ **Existing files only** → ON
- ✅ **Orphans** → ON (βλέπεις αν κάποιο note δεν είναι linked)

### Display (Εμφάνιση)
- **Arrows** → ON (δείχνει κατεύθυνση links)
- **Text fade threshold** → 1.5 (κρύβει κείμενο σε zoom-out)
- **Node size** → 5–6
- **Line thickness** → 0.5

### Forces (Δυνάμεις)
- **Center force** → 0.3 (κρατάει το graph centered)
- **Repel force** → 10–12 (απλώνει τα nodes)
- **Link force** → 0.8 (τραβάει linked notes κοντά)
- **Link distance** → 50–60

---

## Tag Taxonomy (Πλήρης κατάλογος)

Όλα τα tags χρησιμοποιούν **nested/hierarchical** format. Το Obsidian αναγνωρίζει αυτόματα τους γονείς: `#role/town` δημιουργεί και `#role`.

### Category Tags (Κύριες κατηγορίες)

```
#role                    → Όλοι οι ρόλοι (19)
  #role/town             → Town ρόλοι (9)
  #role/mafia            → Mafia ρόλοι (6)
  #role/neutral          → Neutral ρόλοι (4)

#personality             → Personalities (6)

#event                   → Όλα τα events
  #event/night_echo      → Night Echo E01–E14 (14)
  #event/system          → Dynamic Events overview (1)
  #event/lynch           → Last Wish (1)
  #event/balance         → Full Moon (1)

#phase                   → Day/Night Phases (2)
  #phase/day
  #phase/night

#technical               → Technical Workflow (4)
  #technical/data        → Data Architecture
  #technical/ai          → AI Decision Engine
  #technical/memory      → Memory System
  #technical/loop        → Gameplay Loop

#project                 → Project Structure (4)
  #project/specs         → Technical Specs
  #project/structure     → Folder Structure
  #project/roadmap       → Implementation Roadmap
  #project/architecture  → AI Architecture
```

### Importance Tier Tags

```
#tier/core               → 🟢 CORE — Always present (7+ players)
#tier/important          → 🟡 IMPORTANT — Added at 8–9 players
#tier/advanced           → 🔵 ADVANCED — Added at 10–12 players
#tier/expanded           → 🟣 EXPANDED — Added at 13+ players
```

### Perception Depth Tags

```
#perception/superficial  → Level 1 — Aggressive, Shy
#perception/smart        → Level 2 — Cautious, Logical, Charismatic
#perception/deep         → Level 3 — Paranoid
```

### Event Timing Tags

```
#timing/morning          → 🌅 Ανακοινώνεται στο Morning Report
#timing/midday           → 💬 Ανακοινώνεται κατά τη Mid-Day Discussion
```

### Mechanic Tags (Cross-cutting)

```
#night_action            → Ρόλοι με νυχτερινή ενέργεια
#investigation           → Investigation roles (Sheriff, Lookout, Tracker, Consigliere)
#protection              → Protection roles (Doctor, Bodyguard, Survivor)
#killing                 → Killing roles (Godfather, Mafia Goon)
#deception               → Deception roles (Godfather, Framer, Jester)
#information             → Information roles (Gossip, Janitor)
#mechanic                → Game mechanics (Win Conditions, Setup, Full Moon, Last Wish)
#win_condition           → Win condition rules
```

### Meta Tags

```
#game_design             → Game Design documents
#workflow                → Technical Workflow documents
#architecture            → Architecture documents
#ai_strategy             → AI Implementation Strategy documents
#MOC                     → Map of Content (Index)
#template                → Template files
#meta                    → Meta/utility files
#navigation              → Navigation aids
#setup                   → Setup/configuration guides
```

---

## Useful Graph Searches

Χρησιμοποίησε αυτά τα queries στο **Search** ή στο **Graph filter**:

| Σκοπός                                  | Query                          |
| --------------------------------------- | ------------------------------ |
| Μόνο ρόλοι                              | `tag:#role`                    |
| Roles με night action                   | `tag:#night_action`            |
| Investigation cluster                    | `tag:#investigation`           |
| Town vs Mafia visual                     | `tag:#role/town OR tag:#role/mafia` |
| Mafia + deception roles                 | `tag:#role/mafia OR tag:#deception` |
| Night events μόνο Morning               | `tag:#timing/morning`          |
| Core roles μόνο                         | `tag:#tier/core`               |
| Technical docs                          | `tag:#technical OR tag:#project` |
| AI-related                              | `tag:#technical/ai OR tag:#ai_strategy` |
| Game balance mechanics                  | `tag:#mechanic`                |

---

## Alternative Views: Local Graph

Για κάθε note, μπορείς να δεις **Local Graph** (δεξί panel → More options → Open local graph):
- Δείχνει μόνο τα direct links + tags του τρέχοντος note
- Πολύ χρήσιμο για roles → βλέπεις ποια events/phases/mechanics συνδέονται

---

## Related Links

- [[Index]] (κεντρική πλοήγηση)
