---
tags:
  - phase
  - phase/night
  - game_design
  - mechanic
---

# Night Phase
---

Η Night Phase είναι η φάση **μυστικών ενεργειών**. Το Public Chat κλείνει, οι παίκτες "κοιμούνται", και κάθε ρόλος με νυχτερινή δύναμη εκτελεί την ενέργειά του. Η Mafia συντονίζεται σε ιδιωτικό chat για να επιλέξει θύμα.

---

## Step 1: Town Sleeps — Chat Disabled

| Rule                       | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| **Public Chat**            | ❌ Απενεργοποιημένο                                      |
| **Private Mafia Chat**     | ✅ Ανοιχτό μόνο για Mafia μέλη                            |
| **Human player UI**        | Βλέπει μόνο τη δική του νυχτερινή ενέργεια (αν έχει ρόλο) |

---

## Step 2: Mafia Chat (Private Coordination)

Τα μέλη της Μαφίας ([[Godfather]], [[Mafia Goon]], [[Framer]], [[Silencer]], [[Consigliere]], [[Janitor]]) εισέρχονται σε **ιδιωτικό chat** για να αποφασίσουν:

### Kill Vote

| Rule                    | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| **Ψηφοφορία**           | Κάθε Mafia μέλος ψηφίζει στόχο δολοφονίας                |
| **Majority wins**       | Ο στόχος με τις περισσότερες ψήφους εξοντώνεται           |
| **Godfather tiebreaker**| Σε ισοψηφία, η ψήφος του [[Godfather]] μετράει διπλά     |
| **Cannot self-kill**    | Η Mafia δεν μπορεί να στοχεύσει μέλος Mafia              |

### Strategic Discussion

Πέρα από την ψηφοφορία, η Mafia συζητά:
- **Target priority:** Ποιος πρέπει να πεθάνει (π.χ. ύποπτος Sheriff, active accuser).
- **Framer target:** Ποιον θα κάνει frame ο [[Framer]] (π.χ. αθώο που μπορεί να ερευνηθεί).
- **Silencer target:** Ποιον θα σιγάσει ο [[Silencer]] (π.χ. κάποιος που κατηγόρησε Mafia).
- **Consigliere target:** Ποιον θα ερευνήσει ο [[Consigliere]] (π.χ. ποιος είναι Doctor/Sheriff).
- **Janitor target:** Ποιον νεκρό θα ερευνήσει ο [[Janitor]] (μαθαίνει ρόλο νεκρού).
- **Day strategy:** Πώς θα συμπεριφερθούν αύριο (ποιον θα κατηγορήσουν/υπερασπιστούν).

### AI Mafia Chat Behavior

Αν ο ανθρώπινος παίκτης είναι Mafia:
- Βλέπει τα μηνύματα των AI συμπαικτών του.
- Μπορεί να γράψει στο Mafia Chat.
- Ψηφίζει για τον στόχο.

Αν ο ανθρώπινος παίκτης είναι Town/Neutral:
- Δεν βλέπει τίποτα — μόνο την δική του night action (αν έχει).
- Τα AI εκτελούν τη Mafia phase αυτόματα.

---

## Step 3: Special Town Actions

Κάθε Town ρόλος με νυχτερινή ικανότητα εκτελεί την ενέργειά του. Ο ανθρώπινος παίκτης **επιλέγει τον στόχο** αν έχει ρόλο. Τα AI **αποφασίζουν αυτόματα** βάσει [[Memory System]] και [[AI Decision Engine]].

### Action Summary

| Role           | Action       | Target              | Result                                        |
| -------------- | ------------ | ------------------- | --------------------------------------------- |
| [[Sheriff]]    | Investigate  | 1 παίκτης            | Μαθαίνει "Town" ή "Mafia" (⚠️ [[Godfather]]/[[Framer]] exceptions) |
| [[Doctor]]     | Protect/Cure | 1 παίκτης            | Αποτρέπει θάνατο ΄Η θεραπεύει zombie θύμα       |
| [[Lookout]]    | Watch        | 1 παίκτης            | Βλέπει ποιοι επισκέφτηκαν τον στόχο             |
| [[Tracker]]    | Track        | 1 παίκτης            | Βλέπει πού πήγε ο στόχος (ποιον επισκέφτηκε)    |
| [[Bodyguard]]  | Guard        | 1 παίκτης            | Αν η Mafia χτυπήσει τον στόχο → Bodyguard + 1 Mafia πεθαίνουν, στόχος ζει |
| [[Gossip]]     | Receive Clue | Αυτόματο             | Λαμβάνει κρυπτικό hint (passive)                |
| [[Survivor]]   | Vest         | Εαυτός (optional)    | Self-protection από Mafia kill (limited uses)  |

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

Παράλληλα με το Kill Vote, οι ειδικοί Mafia ρόλοι και ορισμένοι Neutral εκτελούν:

### Mafia Special Actions

| Role             | Action        | When                     | Effect                                        |
| ---------------- | ------------- | ------------------------ | --------------------------------------------- |
| [[Framer]]       | Frame         | Μαζί με Kill Vote        | Στοχεύει αθώο → εμφανίζεται "Mafia" στον Sheriff |
| [[Silencer]]     | Silence       | Μαζί με Kill Vote        | Στοχεύει παίκτη → δεν μπορεί να μιλήσει αύριο  |
| [[Consigliere]]  | Investigate   | Μαζί με Kill Vote        | Μαθαίνει τον **ακριβή ρόλο** του στόχου         |
| [[Janitor]]      | Clean         | Μαζί με Kill Vote        | Κρύβει τον ρόλο του θύματος (αν kill πετύχει)    |

### Neutral Night Actions

| Role           | Action        | When                     | Effect                                        |
| -------------- | ------------- | ------------------------ | --------------------------------------------- |
| [[Zombie]]     | Infect        | Phase 4 (Post-kill)      | Μετατρέπει στόχο σε zombie (περιορισμός chat/vote) |
| [[Survivor]]   | Vest          | Ανεξάρτητα               | Self-protection (limited uses)                |

---

## Step 5: Resolution — Night Action Order ⚡

Ο Game Engine **δεν** επεξεργάζεται τις ενέργειες "ταυτόχρονα". Υπάρχει **αυστηρή σειρά** (Resolution Order) που καθορίζει τι εφαρμόζεται πρώτα. Αυτή η σειρά είναι **κρίσιμη** γιατί αλλάζει τα αποτελέσματα.

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

Η σειρά δημιουργεί **αλυσιδωτές αντιδράσεις**:

1. **Lovers visit πρώτα:** Η αυτόματη επίσκεψη πρέπει να καταγραφεί πριν τα investigations — αλλιώς ο Lookout/Tracker δεν θα τη δει.
2. **Framer πριν Sheriff:** Ο Framer πρέπει να εφαρμόσει frame **πριν** ο Sheriff ερευνήσει, αλλιώς δεν λειτουργεί.
3. **Investigation πριν Kill:** Ο Tracker/Lookout βλέπει τις κινήσεις **πριν** αποφασιστεί αν το kill πέρασε.
4. **Doctor πριν Bodyguard:** Αν ο Doctor σώσει, ο Bodyguard δεν χρειάζεται να θυσιαστεί.
5. **Janitor μετά Kill:** Ο Janitor μπορεί να ερευνήσει νεκρούς **αφού** γίνουν τα kills.
6. **Zombie μετά Kill:** Η μόλυνση συμβαίνει αφού αποφασιστεί ποιος πέθανε.
7. **Lovers death link τελευταία στο Phase 4:** Αν ένας Lover πεθάνει από Mafia kill, ο partner πεθαίνει μετά.

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

Η Full Moon είναι **μηχανισμός εξισορρόπησης**: ενεργοποιείται μόνο όταν μία ομάδα χάνει, και δίνει boost στην **ομάδα που υστερεί**. Δεν είναι binary — υπάρχουν **στάδια** boost ανάλογα με το πόσο χάνει η ομάδα.

**Detailed:** [[Dynamic Events#The Full Moon]]

#### Balance Score Calculation

```
balance_score = (town_alive / total_alive) - expected_town_ratio

expected_town_ratio:
  Αρχικά: ~0.57–0.60 (βάσει Player Count Scaling)
  Game-adjusted: αρχικό_town / αρχικό_total
```

| Balance Score          | Κατάσταση              | Beneficiary  |
| ---------------------- | ---------------------- | ------------ |
| `score > +0.15`        | Town υπερέχει πολύ     | 🔴 Mafia     |
| `+0.05 < score ≤ +0.15`| Town ελαφρώς μπροστά  | 🟠 Mafia (light) |
| `-0.05 ≤ score ≤ +0.05`| Ισορροπία             | ❌ No Full Moon |
| `-0.15 ≤ score < -0.05`| Mafia ελαφρώς μπροστά | 🟠 Town (light) |
| `score < -0.15`        | Mafia υπερέχει πολύ   | 🔴 Town      |

#### Stage 1 — Light Boost (🟠)

Η ομάδα που **υστερεί ελαφρώς** λαμβάνει +1 action σε **ρόλους πληροφοριών** μόνο:

**Αν Mafia υστερεί (Town μπροστά):**

| Role             | Normal | Full Moon (Stage 1)  |
| ---------------- | ------ | -------------------- |
| **Consigliere**  | 1      | **2** investigations |
| **Framer**       | 1      | **2** frames         |
| **Silencer**     | 1      | **2** silences       |
| Mafia Kill       | 1      | 1 (unchanged)        |

**Αν Town υστερεί (Mafia μπροστά):**

| Role             | Normal | Full Moon (Stage 1)  |
| ---------------- | ------ | -------------------- |
| **Sheriff**      | 1      | **2** investigations |
| **Lookout**      | 1      | **2** watches        |
| **Tracker**      | 1      | **2** tracks         |
| Doctor Protect   | 1      | 1 (unchanged)        |

#### Stage 2 — Full Boost (🔴)

Η ομάδα που **χάνει σοβαρά** λαμβάνει +1 action σε **ΟΛΟΥΣ** τους ρόλους:

**Αν Mafia χάνει σοβαρά:**

| Role             | Normal | Full Moon (Stage 2)  |
| ---------------- | ------ | -------------------- |
| **Mafia Kill**   | 1      | **2** kills          |
| **Consigliere**  | 1      | **2** investigations |
| **Framer**       | 1      | **2** frames         |
| **Silencer**     | 1      | **2** silences       |
| **Janitor**      | 1      | **2** investigations |

**Αν Town χάνει σοβαρά:**

| Role             | Normal | Full Moon (Stage 2)  |
| ---------------- | ------ | -------------------- |
| **Doctor**       | 1      | **2** protects       |
| **Sheriff**      | 1      | **2** investigations |
| **Lookout**      | 1      | **2** watches        |
| **Tracker**      | 1      | **2** tracks         |
| **Gossip**       | 1      | **2** hints          |

> **Σημείωση:** Bodyguard **δεν** διπλασιάζεται ποτέ — γιατί θυσιάζεται.  
> **Σημείωση:** Zombie και Survivor δεν επηρεάζονται — είναι Neutral.  
> **Σημείωση:** Αν η ισορροπία είναι κοντά (balanced), **δεν γίνεται Full Moon**.

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

- [[Day Phase]] (επόμενη φάση)
- [[Dynamic Events#The Full Moon]] (amplified night)
- [[Gameplay Loop]] (τεχνική ροή Mafia Chat)
- [[Win Conditions]] (ελέγχονται μετά τη Resolution)
- [[Data Architecture]] (αποθήκευση αποτελεσμάτων)
