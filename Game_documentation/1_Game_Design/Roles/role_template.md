---
tags:
  - template
  - meta
---

# Role Template — Οδηγός Δημιουργίας Νέου Ρόλου
---

> 📋 **Σκοπός:** Αυτό το αρχείο αποτελεί το **blueprint** για τη δημιουργία νέων ρόλων. Κάθε νέος ρόλος πρέπει να ακολουθεί αυτή τη δομή για συνέπεια στο documentation. Αντιγράψτε το [[#Blank Template]] στο τέλος του αρχείου και συμπληρώστε τα πεδία.

---

## Δομή Αρχείου Ρόλου

Κάθε role file ακολουθεί την παρακάτω **σειρά sections**. Τα sections με ⭐ είναι **υποχρεωτικά**, τα υπόλοιπα προστίθενται ανάλογα τη φύση του ρόλου.

| #  | Section                          | Υποχρεωτικό | Πότε χρησιμοποιείται                                              |
| -- | -------------------------------- | ----------- | ----------------------------------------------------------------- |
| 1  | Title & Property Table           | ⭐ Ναι       | Πάντα                                                              |
| 2  | Gameplay Importance & Scaling    | ⭐ Ναι       | Πάντα                                                              |
| 3  | Overview                         | ⭐ Ναι       | Πάντα                                                              |
| 4  | Night/Day Action                 | ⭐ Ναι       | Αν ο ρόλος έχει ενεργή ικανότητα (αλλιώς αναφέρεται ότι δεν έχει) |
| 5  | Strategy Notes                   | ⭐ Ναι       | Πάντα                                                              |
| 6  | AI Behavior (Virtual Player)     | ⭐ Ναι       | Πάντα                                                              |
| 7  | Related Links                    | ⭐ Ναι       | Πάντα                                                              |
| 8  | Win Condition (detail)           | Conditional  | Neutral ρόλοι μόνο, ή ρόλοι με μοναδικό win condition              |
| 9  | Comparison Table                 | Optional     | Αν υπάρχει αντίστοιχος ρόλος (counterpart)                        |
| 10 | Interactions with Other Roles    | Optional     | Αν ο ρόλος έχει σύνθετες αλληλεπιδράσεις                          |
| 11 | UI/UX Impact                     | Optional     | Αν ο ρόλος αλλάζει τη διεπαφή (chat restrictions, badges κλπ.)    |
| 12 | Morning Report Messages          | Optional     | Αν ο ρόλος δημιουργεί ορατά events στο Morning Report              |
| 13 | Setup & Assignment               | Optional     | Αν ο ρόλος έχει ειδικούς κανόνες assignment (π.χ. Lovers, Executioner) |

---

## 1. Title & Property Table ⭐

**Format:** `# RoleName (Faction)` ακολουθούμενο από `---` και property table.

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

### Κανόνες Property Table

| Property         | Τιμές                                                                      | Σημειώσεις                                                        |
| ---------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Alignment**    | `[[The Town]]`, `[[The Mafia]]`, `[[Neutral]]`                             | Wikilink στη faction page                                          |
| **Night Action** | Όνομα ενέργειας ή `None`                                                    | Passive ρόλοι: `None (Passive — ...)`, Day-focused: `None (Day-focused role)` |
| **Appears as**   | Πώς εμφανίζεται στον Sheriff                                                | Town ρόλοι → `Town`, Mafia ρόλοι → `Mafia`, Exceptions: Godfather → `**Town** ⚠️`, Zombie → `Town` |
| **Win Condition** | Μόνο για **Neutral** ρόλους                                                | Wikilink στο Win Conditions + σύντομη περιγραφή                    |

### Παραδείγματα "Appears as"

| Ρόλος         | Appears as                        | Λόγος                                       |
| ------------- | --------------------------------- | ------------------------------------------- |
| Sheriff       | `Town (to [[Sheriff]])`           | Κανονικό Town                                |
| Godfather     | `**Town** (to [[Sheriff]]) ⚠️`    | Investigation immunity — ψευδές αποτέλεσμα   |
| Mafia Goon    | `Mafia (to [[Sheriff]])`          | Κανονικό Mafia                               |
| Jester        | `Town (to [[Sheriff]])`           | Neutral αλλά εμφανίζεται Town                 |
| Zombie θύματα | `🧟 Zombie (to [[Sheriff]])`      | Ειδική κατηγορία detection                   |

---

## 2. Gameplay Importance & Scaling ⭐

Ορίζει **πότε** εμφανίζεται ο ρόλος και **πόσους** instances μπορεί να έχει.

```markdown
## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟢/🟡/🔵/🟣 **TIER** — Σύντομη περιγραφή                  |
| **Min Players**      | Αριθμός                                                    |
| **Scaling**          | Πώς κλιμακώνεται                                           |
| **Unique?**          | ✅ Ναι / ❌ Όχι                                             |
```

### Importance Tiers

| Tier | Emoji | Label        | Min Players | Φιλοσοφία                                                    |
| ---- | ----- | ------------ | ----------- | ------------------------------------------------------------- |
| 1    | 🟢    | **CORE**     | 7           | Πάντα παρόντες — θεμελιώδεις για το gameplay                   |
| 2    | 🟡    | **IMPORTANT**| 8–9         | Προσθέτουν βάθος σε medium games                               |
| 3    | 🔵    | **ADVANCED** | 10–12       | Πολυπλοκότητα για experienced players                          |
| 4    | 🟣    | **EXPANDED** | 13–16       | Πολυτέλεια — πλήρη εμπειρία σε μεγάλα παιχνίδια               |

### Υποχρεωτικά Subsections

#### Why [Tier Name]

Εξηγεί **γιατί** ο ρόλος ανήκει σε αυτό το tier. Πρέπει να απαντά:
- Γιατί δεν μπορεί να είναι σε χαμηλότερο tier;
- Τι προσθέτει στο game balance σε αυτό το player count;
- Τι "λείπει" χωρίς αυτόν;

```markdown
### Why [Tier Name]

[Αιτιολόγηση σε 2–4 σειρές]
```

### Conditional Subsections

| Subsection                     | Πότε                                                      | Παράδειγμα από                     |
| ------------------------------ | --------------------------------------------------------- | ---------------------------------- |
| **When NOT Present**           | Αν ο ρόλος δεν εμφανίζεται σε μικρά παιχνίδια             | Framer, Lookout, Survivor          |
| **Balance Tradeoff**           | Αν ο ρόλος έχει ρίσκο/reward tradeoff                     | Lovers, Mayor, Zombie              |
| **Death Impact**               | Αν ο θάνατος του ρόλου αλλάζει δραστικά τα win rates      | Godfather                          |
| **Impact by Game Size**        | Αν η δύναμη αλλάζει ανά player count                      | Silencer                           |
| **Instances by Player Count**  | Αν ο ρόλος **δεν είναι unique** (❌)                       | Citizen, Mafia Goon                |

#### Instances by Player Count (μόνο για non-unique ρόλους)

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

Αφηγηματική περιγραφή **τι κάνει** ο ρόλος, γραμμένη στα **Ελληνικά**. Πρέπει να καλύπτει:

- **Ταυτότητα:** Ποιος είναι; Σε ποια ομάδα ανήκει;
- **Core mechanic:** Τι κάνει; Πώς επηρεάζει το παιχνίδι;
- **Μοναδικότητα:** Τι τον κάνει ξεχωριστό από παρόμοιους ρόλους;

```markdown
## Overview

[2–5 παράγραφοι στα Ελληνικά που εξηγούν τον ρόλο σε αφηγηματικό ύφος.
Χρησιμοποιήστε [[wikilinks]] για αναφορές σε άλλους ρόλους και phases.
Μπορείτε να χρησιμοποιήσετε **bold** για κρίσιμες λέξεις και numbered lists.]
```

### Optional Overview Subsections

Ανάλογα τον ρόλο, μπορεί να περιλαμβάνει:

| Subsection                  | Πότε                                              | Παράδειγμα                        |
| --------------------------- | ------------------------------------------------- | --------------------------------- |
| **Key Mechanics**           | Αν ο ρόλος έχει πολλούς μηχανισμούς               | Lovers, Janitor, Zombie           |
| **Τι Αποκαλύπτει / ΔΕΝ Αποκαλύπτει** | Investigation/info ρόλοι                   | Consigliere, Lookout, Tracker     |
| **Investigation Immunity**  | Αν επηρεάζει Sheriff investigation                 | Godfather                         |
| **Mafia Leadership**        | Mafia leader ρόλοι                                 | Godfather                         |
| **Effects on Victims**      | Αν ο ρόλος αλλάζει κατάσταση άλλων παικτών         | Zombie, Silencer                  |
| **Sheriff Interaction**     | Αν η αλληλεπίδραση με Sheriff είναι σύνθετη        | Zombie (self vs victims)          |

---

## 4. Night / Day Action ⭐

Κάθε ρόλος πρέπει να τεκμηριώνει τις ικανότητές του.

### Για ρόλους ΜΕ ενέργεια

```markdown
## Night Action: ActionName

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Target**      | Ποιον στοχεύει (1 ζωντανός παίκτης / εαυτός / νεκρός / κλπ.)       |
| **Effect**      | Τι κάνει η ενέργεια                                                 |
| **Duration**    | Πόσο διαρκεί (1 νύχτα / μόνιμο / κλπ.)                             |
| **Uses**        | Απεριόριστες / Πεπερασμένες (αν applicable)                         |
| **Self-target** | ✅ / ❌                                                              |
| **Cooldown**    | Αν υπάρχει cooldown (π.χ. "όχι ίδιος στόχος 2 σερί νύχτες")       |
| **Blocked by**  | Τι αποτρέπει/ακυρώνει την ενέργεια                                  |
| **Stacking**    | Πώς αλληλεπιδρά με άλλες ενέργειες στον ίδιο στόχο                 |
```

> **Σημείωση:** Συμπεριλάβετε μόνο τα rows που ισχύουν.

### Resolution Logic (Υποχρεωτικό code block)

Κάθε ενέργεια πρέπει να έχει **ψευδοκώδικα** που δείχνει τη σειρά εκτέλεσης:

```markdown
### Resolution Logic

\```
[Ψευδοκώδικας βήμα-βήμα]
Πρέπει να καλύπτει:
  → Τι γίνεται αν η ενέργεια πετύχει
  → Τι γίνεται αν αποτρέπεται
  → Αλληλεπιδράσεις με άλλες ενέργειες
\```
```

### Night Resolution Phase

Κάθε νέος ρόλος πρέπει να **τοποθετηθεί** σε μία από τις 7 φάσεις resolution:

| Phase | Τι εκτελείται                          | Παραδείγματα                             |
| ----- | -------------------------------------- | ---------------------------------------- |
| 0     | Passive visits                         | Lovers visit                             |
| 1     | Manipulation (frame, silence κλπ.)     | Framer, Silencer                         |
| 2     | Investigation                          | Sheriff, Consigliere, Lookout, Tracker   |
| 3     | Kill, Protection                       | Mafia Kill, Doctor Protect, Bodyguard    |
| 4     | Post-kill effects, linked death        | Zombie infect, Lovers death link         |
| 5     | Passive info                           | Gossip clue                              |
| 6     | Cleanup, state updates                 | Janitor inspect dead                     |

> ⚠️ Ο νέος ρόλος πρέπει να ενημερώσει και το [[Night Phase#Resolution]] αρχείο.

### Για ρόλους με Day Action (αντί Night)

```markdown
## Day Action: ActionName

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Trigger**     | Πώς ενεργοποιείται (εθελοντική / αυτόματη / conditional)            |
| **Effect**      | Τι κάνει                                                            |
| **Permanent**   | ✅ / ❌                                                              |
| **Reversible**  | ✅ / ❌                                                              |
```

### Για ρόλους ΧΩΡΙΣ ενέργεια

Αναφέρετε ρητά ότι δεν υπάρχει ενέργεια και εξηγήστε γιατί ο ρόλος είναι χρήσιμος χωρίς αυτή:

```markdown
## Abilities

- Ο [RoleName] **δεν** διαθέτει νυχτερινή ή ημερήσια ενέργεια.
- [Εξήγηση αξίας: π.χ. αριθμός, στρατηγική, πληροφορία]
```

---

## 5. Strategy Notes ⭐

Πρακτικές συμβουλές χωρισμένες σε **bullets** ή **υποσections ανά πλευρά**:

### Για ρόλους με 1 πλευρά στρατηγικής

```markdown
## Strategy Notes

- **Bullet 1:** [Strat tip]
- **Bullet 2:** [Strat tip]
- **Counter:** [Πώς αντιμετωπίζεται]
```

### Για ρόλους με πολλαπλές πλευρές (πιο σύνθετοι ρόλοι)

```markdown
## Strategy Notes

### As [RoleName]
- ...

### Against [RoleName] (ως Town/Mafia)
- ...
```

**Παραδείγματα:** Lovers (As Lovers / Against Lovers), Zombie (As Zombie / Against Zombie), Jester (As Jester / Against Jester)

### Checklist Στρατηγικών Σημείων

Κάθε Strategy Notes section πρέπει να καλύπτει:
- [ ] **Πώς παίζεται** ο ρόλος αποτελεσματικά
- [ ] **Combos** με άλλους ρόλους (αν υπάρχουν)
- [ ] **Counters** — τι τον σταματάει
- [ ] **Timing** — πότε είναι πιο αποτελεσματικός (early/mid/late game)
- [ ] **Fake claims** — τι μπορεί να δηλώσει ψευδώς (ή πώς ανιχνεύονται fake claims εναντίον του)

---

## 6. AI Behavior (Virtual Player) ⭐

Πώς θα παίξει ο AI αυτόν τον ρόλο. Πρέπει να καλύπτει:

```markdown
## AI Behavior (Virtual Player)

- **Target selection:** [Πώς επιλέγει στόχο βάσει [[Data Architecture#memory.json|memory.json]]]
- **[[AI Decision Engine#Speak Probability|speak probability]]:** [Low / Moderate / High + αιτιολόγηση]
- **[[Data Architecture#personality.json|personality]] interaction:** [Πώς η personality επηρεάζει τη στρατηγική]
- **Day Phase behavior:** [Πώς συμπεριφέρεται στο Public Chat]
- **Special triggers:** [Τι ενεργοποιεί αλλαγή συμπεριφοράς]
```

### Checklist AI Behavior

- [ ] **Target selection logic** — βάσει memory.json analysis
- [ ] **Speak probability** — πόσο μιλάει στη Day Phase
- [ ] **Personality effects** — πώς Aggressive/Cautious/Charismatic/Shy αλλάζει behavior
- [ ] **Information sharing** — πότε αποκαλύπτει info (αμέσως / μετά 1–2 νύχτες)
- [ ] **Defensive behavior** — τι κάνει αν κατηγορηθεί
- [ ] **Role-specific triggers** — μοναδικές conditions που ενεργοποιούν actions

### JSON State (αν applicable)

Αν ο ρόλος αποθηκεύει δεδομένα, δώστε παράδειγμα:

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

Wikilinks σε σχετικά αρχεία. **Πάντα** περιλαμβάνει:

```markdown
## Related Links

- [[Night Phase#...]] ή [[Day Phase#...]] (phase association)
- [[Win Conditions#... Victory]] (win condition)
- [[RoleName]] (counterpart / ally / synergy)
```

### Minimum Links

| Κατηγορία         | Minimum Links                                                  |
| ----------------- | -------------------------------------------------------------- |
| **Town ρόλοι**    | Night Phase section + Win Conditions#Town Victory + direct counterpart |
| **Mafia ρόλοι**   | Night Phase#Mafia Chat + Win Conditions#Mafia Victory + Godfather + teammates |
| **Neutral ρόλοι** | Win Conditions#[Role] Victory + Day/Night Phase + related Neutral ρόλοι |

---

## 8–13. Optional Sections

### 8. Win Condition Detail (Neutral ρόλοι)

```markdown
## Win Condition

| Condition        | Result               |
| ---------------- | -------------------- |
| [Συνθήκη νίκης]  | **[ROLE] WINS**      |
| [Συνθήκη αποτυχίας 1] | **Χάνει**       |
| [Συνθήκη αποτυχίας 2] | **Χάνει** / Αλλαγή ρόλου |
```

**Σημαντικό:** Αν η νίκη **τερματίζει** το παιχνίδι (π.χ. Jester), αναφέρετέ το ρητά. Αν **δεν τερματίζει** (π.χ. Executioner), αναφέρετε ότι το παιχνίδι συνεχίζει.

### 9. Comparison Table (αν υπάρχει counterpart)

```markdown
### [Role A] vs [Role B]

| Aspect              | Role A                        | Role B                         |
| ------------------- | ----------------------------- | ------------------------------ |
| **Alignment**       | ...                           | ...                            |
| **Μαθαίνει/Κάνει**  | ...                           | ...                            |
| **Counter**         | ...                           | ...                            |
| **Best for**        | ...                           | ...                            |
```

**Υπάρχοντα comparison ζευγάρια:**
- Consigliere vs Sheriff
- Tracker vs Lookout
- Bodyguard vs Doctor
- Executioner vs Jester

### 10. Interactions with Other Roles

Χρησιμοποιείται όταν ο ρόλος αλληλεπιδρά με πολλούς ρόλους με **σύνθετο τρόπο**:

```markdown
## Interactions with Other Roles

### [RoleName] Interaction

[Περιγραφή + code block με resolution logic]
```

### 11. UI/UX Impact

```markdown
## UI/UX Impact

- [Πώς αλλάζει το UI: badges, icons, chat restrictions, voting display]
- [Τι βλέπει ο παίκτης που επηρεάζεται]
- [Τι βλέπουν οι υπόλοιποι]
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
| **Πηγή**          | Πώς ανατίθεται                       |
| **Γνώση**         | Τι γνωρίζει κατά την ανάθεση         |
| **Compatibility** | Τι ΔΕΝ μπορεί (restrictions)         |
```

---

## Checklist Πριν Ολοκληρώσεις Νέο Ρόλο

Πριν θεωρηθεί ολοκληρωμένο ένα role file, ελέγξτε:

### Εσωτερικό Αρχείο
- [ ] Title format: `# RoleName (Faction)` + `---`
- [ ] Property Table: Alignment, Night Action, Appears as (+ Win Condition αν Neutral)
- [ ] Gameplay Importance & Scaling table + Why [Tier] subsection
- [ ] Overview — αφηγηματικό, στα Ελληνικά, με wikilinks
- [ ] Night/Day Action — parameter table + resolution logic code block
- [ ] Resolution phase assigned (0–6)
- [ ] Strategy Notes — bullets ή subsections ανά πλευρά
- [ ] AI Behavior — target selection + speak probability + personality
- [ ] Related Links — minimum links ανά faction

### Εξωτερικά Αρχεία (Cascade Updates)

Κάθε νέος ρόλος πρέπει να ενημερώσει τα εξής αρχεία:

| Αρχείο                                     | Τι Ενημερώνεται                                              |
| ------------------------------------------ | ------------------------------------------------------------- |
| [[Night Phase]]                            | Resolution order, night action list                            |
| [[Day Phase]]                              | Αν ο ρόλος επηρεάζει Day mechanics (voting, chat κλπ.)         |
| [[Win Conditions]]                         | Αν υπάρχει νέο win condition (Neutral ρόλοι)                   |
| [[Index]]                                  | Προσθήκη στη λίστα ρόλων                                       |
| [[Folder Structure]]                       | Αν δημιουργείται νέο αρχείο                                    |
| [[Data Architecture]]                      | Αν ο ρόλος εισάγει νέα JSON fields                             |
| [[AI Decision Engine]]                     | Αν ο ρόλος έχει ειδικούς AI κανόνες                            |
| Role files αλληλεπίδρασης                   | Π.χ. Sheriff (investigation exceptions), Doctor (protection) κλπ. |

### Sheriff Investigation Exceptions

Αν ο νέος ρόλος **δεν εμφανίζεται κανονικά** στον Sheriff, ενημερώστε:
- Το file του Sheriff (Investigation Exceptions table)  
- Το property table (Appears as)
- Τη Night Phase (resolution order)

---

## Design Principles

### Balance Rules

1. **Faction Balance:** Κάθε faction πρέπει να διατηρεί αναλογικό αριθμό ρόλων ανά player count:
   - Town: ~55–60% παικτών
   - Mafia: ~25–30% παικτών  
   - Neutral: ~10–15% παικτών

2. **Counter-play:** Κάθε ρόλος πρέπει να έχει τουλάχιστον ένα **counter**. Κανένας ρόλος δεν πρέπει να είναι invincible.

3. **Information Economy:** Ρόλοι που δίνουν πληροφορία (Sheriff, Lookout, Tracker, Consigliere) πρέπει να έχουν **αντίβαρο** (Framer, Godfather immunity, no role reveal on death).

4. **Power Budget:** Πιο ισχυροί ρόλοι → υψηλότερο tier (περισσότεροι παίκτες απαιτούνται).

5. **Unique vs Multi-instance:** 
   - Ρόλοι με ειδικές ικανότητες → ✅ Unique
   - Filler ρόλοι (Citizen, Mafia Goon) → ❌ Non-unique, scales with player count

### Fundamental Game Mechanic

> ⚠️ **Ρόλοι νεκρών δεν αποκαλύπτονται ποτέ.** Αυτός ο σχεδιαστικός κανόνας επηρεάζει:
> - Fake claims (δεν μπορείς να αποδείξεις ότι κάποιος ψεύδεται βάσει νεκρού ρόλου)
> - Role counting (δεν ξέρεις πόσοι Mafia μένουν)
> - Janitor exclusive knowledge

### Naming Convention

- **Town ρόλοι:** Επαγγελματικοί τίτλοι (Doctor, Sheriff, Mayor, Bodyguard)
- **Mafia ρόλοι:** Μαφιόζικοι τίτλοι (Godfather, Consigliere, Framer, Silencer)
- **Neutral ρόλοι:** Αφηρημένοι ή χαρακτηριστικοί τίτλοι (Jester, Survivor, Executioner, Zombie)

### File Placement

```
Game_documentation/1_Game_Design/Roles/
├── Town/
│   └── NewTownRole.md
├── Mafia/
│   └── NewMafiaRole.md
├── Neutral/
│   └── NewNeutralRole.md
└── role_template.md (αυτό το αρχείο)
```

---

## Αναφορά Υπαρχόντων Ρόλων

### Town (9 ρόλοι)

| Ρόλος      | Tier       | Min | Night Action        | Unique |
| ---------- | ---------- | --- | ------------------- | ------ |
| Citizen    | 🟢 CORE    | 7   | None                | ❌     |
| Sheriff    | 🟢 CORE    | 7   | Investigate         | ✅     |
| Doctor     | 🟢 CORE    | 7   | Protect / Cure      | ✅     |
| Lookout    | 🟡 IMPORTANT| 8  | Watch               | ✅     |
| Gossip     | 🟡 IMPORTANT| 9  | Passive (clue)      | ✅     |
| Bodyguard  | 🔵 ADVANCED| 10  | Protect (sacrifice) | ✅     |
| Lovers     | 🔵 ADVANCED| 10  | Passive (visit)     | ✅ (ζευγάρι) |
| Tracker    | 🔵 ADVANCED| 12  | Track               | ✅     |
| Mayor      | 🟣 EXPANDED| 13  | Day: Reveal         | ✅     |

### Mafia (6 ρόλοι)

| Ρόλος        | Tier       | Min | Night Action            | Unique |
| ------------ | ---------- | --- | ----------------------- | ------ |
| Godfather    | 🟢 CORE    | 7   | Kill Vote (Leader)      | ✅     |
| Mafia Goon   | 🟢 CORE    | 7   | Kill Vote               | ❌     |
| Framer       | 🟡 IMPORTANT| 9  | Frame                   | ✅     |
| Silencer     | 🔵 ADVANCED| 11  | Silence                 | ✅     |
| Consigliere  | 🟣 EXPANDED| 13  | Investigate (Exact Role)| ✅     |
| Janitor      | 🟣 EXPANDED| 14  | Investigate Dead        | ✅     |

### Neutral (4 ρόλοι)

| Ρόλος        | Tier       | Min | Night Action    | Unique | Win Condition           |
| ------------ | ---------- | --- | --------------- | ------ | ----------------------- |
| Jester       | 🟢 CORE    | 7   | None            | ✅     | Get lynched (game ends) |
| Survivor     | 🟡 IMPORTANT| 9  | Vest (self)     | ✅     | Stay alive              |
| Executioner  | 🔵 ADVANCED| 12  | None            | ✅     | Target lynched          |
| Zombie       | 🟣 EXPANDED| 14  | Infect          | ✅     | All players zombified   |

---

## Blank Template

Αντιγράψτε τα παρακάτω σε νέο αρχείο `[RoleName].md` μέσα στον κατάλληλο faction φάκελο:

```markdown
# [RoleName] ([Faction])
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[The Town]] / [[The Mafia]] / [[Neutral]] |
| **Night Action** | [ActionName] / None              |
| **Appears as** | [Town/Mafia] (to [[Sheriff]])      |
| **Win Condition** | [Μόνο Neutral — αφαιρέστε αν Town/Mafia] |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | [🟢/🟡/🔵/🟣] **[TIER]** — [σύντομη περιγραφή]            |
| **Min Players**      | [αριθμός]                                                  |
| **Scaling**          | [πώς κλιμακώνεται]                                         |
| **Unique?**          | [✅ Ναι / ❌ Όχι]                                           |

### Why [Tier Name]

[Αιτιολόγηση — γιατί ανήκει σε αυτό το tier; Τι προσθέτει;]

## Overview

[Αφηγηματική περιγραφή στα Ελληνικά. Ποιος είναι; Τι κάνει; 
Γιατί είναι σημαντικός; Χρησιμοποιήστε [[wikilinks]].]

## Night Action: [ActionName]

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Target**      | [ποιον στοχεύει]                                                    |
| **Effect**      | [τι κάνει]                                                          |
| **Duration**    | [πόσο διαρκεί]                                                      |
| **Blocked by**  | [τι το σταματάει]                                                   |

### Resolution Logic

\```
[Ψευδοκώδικας step-by-step]
  → Τι γίνεται αν πετύχει
  → Τι γίνεται αν αποτρέπεται
  → Αλληλεπιδράσεις
\```

## Strategy Notes

- **[Tip 1]:** [Περιγραφή]
- **[Tip 2]:** [Περιγραφή]
- **Counter:** [Πώς αντιμετωπίζεται]

## AI Behavior (Virtual Player)

- **Target selection:** [Πώς επιλέγει στόχο βάσει [[Data Architecture#memory.json|memory.json]]]
- **[[AI Decision Engine#Speak Probability|speak probability]]:** [Low/Moderate/High + αιτιολόγηση]
- **Day Phase behavior:** [Πώς συμπεριφέρεται στο Public Chat]
- **Defensive behavior:** [Τι κάνει αν κατηγορηθεί]

## Related Links

- [[Night Phase#...]]
- [[Win Conditions#... Victory]]
- [[RoleName]] (counterpart / synergy)
```
