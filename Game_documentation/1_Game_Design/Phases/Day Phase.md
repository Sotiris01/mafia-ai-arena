---
tags:
  - phase
  - phase/day
  - game_design
  - mechanic
---

# Day Phase
---

Η Day Phase είναι η κύρια φάση **αλληλεπίδρασης** του παιχνιδιού. Οι παίκτες συζητούν στο Public Chat, κατηγορούν, υπερασπίζονται, και τελικά ψηφίζουν για την εξόντωση ενός υπόπτου. Η φάση αποτελείται από **4 βήματα** που εκτελούνται με σειρά.

---

## Step 1: Morning Report

**Τι γίνεται:** Ο Game Engine ανακοινώνει τα αποτελέσματα της νύχτας.

### Ανακοινώσεις

| Τύπος                     | Μήνυμα                                                    | Πάντα; |
| ------------------------- | --------------------------------------------------------- | ------ |
| **Θάνατος**               | _"Player X was found dead."_                              | Ναι    |
| **Πολλαπλοί θάνατοι**    | _"Player X and Player Y were found dead."_ (Bodyguard sacrifice) | Ναι |
| **Linked death (Lovers)** | _"Player X was also found dead."_ (partner died)          | Ναι    |
| **Κανένας θάνατος**       | _"Nobody died tonight."_ (Doctor saved ή Mafia missed)    | Ναι    |
| **Zombie infection**      | _"Player X doesn't look well today... 🧟"_                | Ναι    |
| **Doctor cure**           | _"Player Y looks much better today! 💊"_                   | Ναι    |
| **Silenced player**       | _"Player Y seems unable to speak today."_                 | Ναι    |
| **Mayor reveal**          | _"👑 Player Z has revealed themselves as the Mayor!"_      | Event  |
| **Conflict Event**        | _"A loud argument was heard near Player Z's house."_      | ~30%   |
| **Full Moon (Stage 1)**   | _"🌕 The moon glows faintly. Some feel a strange surge of power tonight."_ | Balance |
| **Full Moon (Stage 2)**   | _"🌕 A FULL MOON rises! Great power awakens for those who need it most."_ | Balance |

### Report Parsing Logic

```
For each dead player:
  → Show "Player X was found dead." (ρόλος ΔΕΝ αποκαλύπτεται ποτέ)
  
For Bodyguard sacrifice:
  → Show Bodyguard death + Mafia member death (χωρίς role reveal)
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

> ⚠️ **ΚΡΙΣΙΜΟ ΜΗΧΑΝΙΚΟ:** Σε αυτό το παιχνίδι, ο **ρόλος ενός νεκρού παίκτη ΔΕΝ αποκαλύπτεται ποτέ δημόσια** — ούτε κατά τη νυχτερινή δολοφονία, ούτε κατά το lynch. Μόνο ο [[Janitor]] μπορεί να μάθει ρόλους νεκρών.

Αυτό σημαίνει:
- Κανένα **role counting** — κανείς δεν ξέρει πόσοι Mafia ή Town έχουν μείνει βάσει νεκρών.
- Κανένα **verification** — δεν μπορείς να αποδείξεις ότι κάποιος ψεύτηκε για τον ρόλο του μέσω νεκρού.
- Αυξημένη **αβεβαιότητα** — το Town πρέπει να βασιστεί σε investigations και deduction, όχι σε πληροφορίες νεκρών.
- Ο [[Janitor]] αποκτά **μοναδικό στρατηγικό ρόλο** — είναι ο μόνος που μπορεί να σπάσει αυτό το σκοτάδι.

### Information Available to Players

| Source                    | Information Type                   | Reliability      |
| ------------------------- | ---------------------------------- | ---------------- |
| **Death announcement**    | Who died (χωρίς ρόλο)             | 100% accurate    |
| **Zombie announcement**   | Who became zombie                  | 100% accurate    |
| **Silenced notification** | Who is silenced                    | 100% accurate    |
| **Night personal results**| Investigation/tracking results     | Can be manipulated (Framer) |
| **Previous day memories** | Who said what, who accused whom    | Subject to memory decay |

**Related:** [[Dynamic Events#The Conflict]], [[Dynamic Events#The Full Moon]], [[Janitor]]

---

## Step 2: Public Discussion (The Chat)

**Τι γίνεται:** Οι παίκτες χρησιμοποιούν το Public Chat για να συζητήσουν, να κατηγορήσουν, να αμυνθούν, ή να κάνουν role claims.

### Chat Mechanics

- Ο **ανθρώπινος παίκτης** γράφει μηνύματα κανονικά.
- Τα **AI** αντιδρούν βάσει του [[Gameplay Loop]] (Analyze → Memory Update → Speak Probability → Generate).
- Δεν υπάρχει σειρά ομιλίας — οποιοσδήποτε μπορεί να μιλήσει, βασισμένο στο [[AI Decision Engine#Speak Probability|Speak Probability Engine]].

### Discussion Dynamics

Η συζήτηση δεν είναι τυχαία — ακολουθεί **φυσικά patterns** βάσει ρόλων:

| Role Type           | Discussion Behavior                                              |
| ------------------- | ---------------------------------------------------------------- |
| **Sheriff**         | Μπορεί να μοιραστεί investigation results (ρισκάροντας εμφάνιση) |
| **Lookout/Tracker** | Μπορεί να αναφέρει ποιον είδε/ακολούθησε                        |
| **Gossip**          | Αναφέρει cryptic hints (πιθανώς misleading context)              |
| **Mafia members**   | Κατηγορούν αθώους, υπερασπίζουν συμπαίκτες (διακριτικά)         |
| **Executioner**     | Πιέζει κατηγορίες κατά του assigned target                       |
| **Jester**          | Φαίνεται ύποπτος σκόπιμα — στοχεύει στο να ψηφιστεί             |
| **Mayor (revealed)**| Ηγείται discussion, η διπλή ψήφος δίνει authority, μόνος proven Town |
| **Citizen/Survivor**| Αμύνεται αν κατηγορηθεί, αλλιώς ακολουθεί majority              |

### Accusation & Role Claim System

Οι κατηγορίες ακολουθούν **escalation pattern**:

```
Level 0: Ήρεμη συζήτηση (no accusations)
Level 1: Soft suspicion — "Ο Player X μου φαίνεται ύποπτος..."
Level 2: Direct accusation — "Νομίζω ο Player X είναι Mafia!"
Level 3: Role claim challenge — "Αν δεν είσαι Mafia, πες μας τι ρόλο έχεις."
Level 4: Counter-claim — "Εγώ είμαι ο Sheriff, ΟΧΙ αυτός!"
```

#### Role Claim Rules

| Claim Type        | Risk                                                        |
| ----------------- | ----------------------------------------------------------- |
| **True claim**    | Αποκαλύπτει ρόλο → Mafia ξέρει ποιον να σκοτώσει            |
| **False claim**   | Αν αποδειχθεί ψέμα → σχεδόν σίγουρο lynch                   |
| **No claim**      | Αυξάνει suspicion αλλά κρατάει anonymity                     |
| **Duplicate claim**| 2 παίκτες δηλώνουν ίδιο unique role → ένας ψεύτης guaranteed |

### Discussion Timer

| Game Size    | Discussion Duration | Reason                                |
| ------------ | ------------------- | ------------------------------------- |
| 7–9 παίκτες  | 8–12 AI μηνύματα    | Λίγοι παίκτες, γρήγορη αλληλεπίδραση |
| 10–12 παίκτες| 12–18 AI μηνύματα   | Μέτριο πλήθος, περισσότερη ανάλυση    |
| 13–16 παίκτες| 18–25 AI μηνύματα   | Πολλοί παίκτες, πολύπλοκη κατάσταση   |

> **Σημείωση:** Ο ανθρώπινος παίκτης μπορεί να γράψει ανά πάσα στιγμή — τα AI σταματούν να περιμένουν.

### Human Window

Μεταξύ κάθε AI μηνύματος, υπάρχει **παύση 2-3 δευτερολέπτων** για να δώσει χρόνο στον ανθρώπινο παίκτη να αντιδράσει. Αν ο άνθρωπος πληκτρολογεί, η παύση επεκτείνεται.

**Related:** [[Gameplay Loop#Step 3]]

### Silenced Players

Αν κάποιος παίκτης σιγάστηκε από τον [[Silencer]], **δεν μπορεί να γράψει** στο Public Chat αυτή τη μέρα. Μπορεί ακόμα να **ψηφίσει**.

### Mayor Reveal Mechanic

Ο [[Mayor]] μπορεί **οποτεδήποτε** κατά τη Discussion Phase να πατήσει "Reveal as Mayor". Αυτό:
- Εμφανίζει **δημόσια ανακοίνωση** στο chat: "👑 Player X has revealed as Mayor!"
- Η ψήφος του γίνεται **×2** αμέσως.
- Ο [[Doctor]] και [[Bodyguard]] **μπορούν** ακόμα να τον προστατεύσουν.
- Ο Mayor είναι ο **μόνος ρόλος** που μπορεί να **αποδείξει** ότι είναι Town.
- Είναι **μη αναστρέψιμο** — δεν μπορεί να "un-reveal".

### Chat Event Recording

Κάθε μήνυμα αναλύεται and αποθηκεύεται σημασιολογικά στο **[[Data Architecture#chat_events.json|chat_events.json]]**:

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

**Τι γίνεται:** Μετά τη συζήτηση, ξεκινάει η **φάση ψηφοφορίας**. Κάθε παίκτης ψηφίζει ποιον θέλει να εξοντώσουν.

### Voting Mechanics

| Rule                  | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| **1 ψήφος/παίκτη**   | Κάθε ζωντανός παίκτης ψηφίζει ακριβώς 1 φορά                     |
| **Vote weight**       | ×1 κανονικά, ×2 αν [[Mayor]] αποκαλυφθεί                         |
| **Majority wins**     | Ο παίκτης με τις **περισσότερες ψήφους** εξοντώνεται              |
| **Tie = No lynch**    | Σε ισοψηφία, **κανείς δεν εξοντώνεται** (controversial talk day) |
| **Abstain**           | Ο παίκτης μπορεί να ψηφίσει "Skip" (χωρίς lynch)                |
| **Silenced vote**     | Σιγασμένοι παίκτες **μπορούν** να ψηφίσουν κανονικά              |

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
| **Sheriff**     | Ψηφίζει confirmed Mafia — αν ερεύνησε ≥ 1 Mafia            |
| **Mafia**       | ΠΟΤΕ δεν ψηφίζει fellow Mafia — ψηφίζει Town threats        |
| **Jester**      | Ψηφίζει ασυνεπώς — θέλει να φαίνεται ύποπτος                |
| **Executioner** | Ψηφίζει πάντα τον assigned target (ή πιέζει τους άλλους)    |
| **Survivor**    | Ψηφίζει majority — αποφεύγει confrontation                  |
| **Mayor**       | Μετά reveal: ψηφίζει μόνο αν σίγουρος (×2 = σημαντικό ρίσκο) |
| **Zombie**      | Ψηφίζει κανονικά — μοιάζει με Town member (κρύβεται)          |

### AI Vote Decision Process

Κάθε AI αξιολογεί ποιον θα ψηφίσει μέσω:

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

**Τι γίνεται:** Μετά τη ψηφοφορία, ο εξοντωμένος παίκτης αποκαλύπτεται και μπορεί να ενεργοποιηθεί ένα [[Dynamic Events#The Last Wish|Last Wish]] event.

### Lynch Resolution

| Βήμα | Action                                                           |
| ---- | ---------------------------------------------------------------- |
| 1    | Ο παίκτης με τις περισσότερες ψήφους **εξοντώνεται**              |
| 2    | Ο ρόλος **ΔΕΝ** αποκαλύπτεται — μόνο ο [[Janitor]] μπορεί να μάθει |
| 3    | **Win Condition Check** — [[Win Conditions]]                      |
| 4    | Αν δεν υπάρχει νικητής → **Last Wish** roll (40% πιθανότητα)      |
| 5    | Transition στη [[Night Phase]]                                    |

### Special Lynch Outcomes

| Lynched Role       | Outcome                                                  |
| ------------------- | -------------------------------------------------------- |
| **[[Jester]]**      | 🃏 **JESTER WINS** — Game Over. Κανείς άλλος δεν κερδίζει. |
| **[[Executioner]] target** | ⚔️ **EXECUTIONER WINS** — Παιχνίδι συνεχίζει, target νεκρός. |
| **Mafia member**    | ✅ Town successfully eliminated a Mafia member.           |
| **Town member**     | ❌ Town εξόντωσε αθώο — Mafia πλεονεκτεί.                |
| **[[Survivor]]**    | 💀 Survivor χάνει — δεν τον σώζει vest στο lynch.         |

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

- [[Night Phase]] (επόμενη φάση)
- [[Gameplay Loop]] (τεχνική ροή chat)
- [[AI Decision Engine]] (πώς αποφασίζουν τα AI)
- [[Memory System]] (πώς ψηφίζουν τα AI)
- [[Dynamic Events]] (Last Wish, Conflicts)
- [[Win Conditions]] (ελέγχονται μετά τη ψηφοφορία)
