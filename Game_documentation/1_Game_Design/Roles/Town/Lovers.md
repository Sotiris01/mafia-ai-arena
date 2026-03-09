---
tags:
  - role
  - role/town
  - tier/advanced
  - game_design
---

# Lovers (Town)
---

| Property         | Value                                        |
| ---------------- | -------------------------------------------- |
| **Alignment**    | [[The Town]]                                 |
| **Night Action** | None (Passive — visits happen automatically) |
| **Appears as**   | Town (to [[Sheriff]])                        |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🔵 **ADVANCED** — Εμφανίζεται σε 10+ παίκτες              |
| **Min Players**      | 10                                                         |
| **Scaling**          | Πάντα ακριβώς 2 Lovers — πάντα ζευγάρι                     |
| **Unique?**          | ✅ Ναι — ακριβώς 1 ζευγάρι ανά παιχνίδι                    |

### Why Advanced

Οι Lovers δημιουργούν **συνδεδεμένο ρίσκο** — ο θάνατος ενός σημαίνει θάνατο δύο. Σε 10+ παίκτες, αυτό προσθέτει μια **δραματική** διάσταση χωρίς να αλλάζει υπερβολικά το balance. Σε μικρά παιχνίδια, η απώλεια 2 παικτών ταυτόχρονα θα ήταν υπερβολική.

### Balance Tradeoff

Οι Lovers έχουν **ενσωματωμένο κόστος**:
- ❌ **Linked death:** Ο θάνατος ενός σκοτώνει αυτόματα και τον άλλο.
- ❌ **Visible visits:** Κάθε νύχτα ο ένας επισκέπτεται τον άλλο — ο [[Lookout]] και ο [[Tracker]] μπορούν να το δουν.
- ✅ **Two guaranteed Town:** Αν αποδειχθεί ο ένας Town, ο άλλος είναι σίγουρα Town.
- ⚠️ **Noise event:** Μπορεί μια νύχτα να μαλώσουν → trigger [[Dynamic Events#The Conflict|Conflict Event]].

## Overview

Δύο παίκτες **Citizens** ορίζονται κατά το Setup ως **Lovers**. Η σχέση τους είναι **μυστική** — μόνο οι ίδιοι γνωρίζουν. Ο δεσμός τους είναι **θανάσιμος**: αν πεθάνει ο ένας (νύχτα, lynch, ή οποιοσδήποτε τρόπος), ο άλλος πεθαίνει **αυτόματα αμέσως**.

### Key Mechanics

- **Linked Death:** Θάνατος Lover A → Lover B πεθαίνει αμέσως (και αντίστροφα).
- **Nightly Visits:** Κάθε νύχτα, ο Game Engine αποφασίζει **τυχαία** ποιος Lover πηγαίνει στο σπίτι του άλλου. Αυτή η επίσκεψη είναι **ορατή** στον [[Lookout]] (αν παρακολουθεί) και στον [[Tracker]] (αν ακολουθεί).
- **Fight Event:** Υπάρχει πιθανότητα (~15%) μια νύχτα οι Lovers να **μαλώσουν**, κάνοντας trigger ένα **Conflict event** (θόρυβος κοντά στο σπίτι τους). Αυτό αναφέρεται στο [[Day Phase#Morning Report|Morning Report]].
- **Origin:** Οι Lovers ξεκινούν ως [[Citizen|Citizens]] — δεν έχουν δική τους νυχτερινή ενέργεια.

### Death Link Resolution

```
onDeath(player):
  if player.is_lover:
    partner = getLoverPartner(player)
    if partner.is_alive:
      partner.kill(cause = "heartbreak")
      // Ο partner πεθαίνει αμέσως — δεν μπορεί να σωθεί
```

### Nightly Visit Logic

```
each Night:
  visitor = random_choice(lover_A, lover_B)
  visited = the_other_lover
  
  // Register visit for Lookout/Tracker
  register_visit(from = visitor, to = visited)
  
  // Fight check
  if random() < 0.15:
    trigger_conflict_event(near = visited.house)
```

## Strategy Notes

### As Lovers

- **Protect each other:** Αν ο ένας Lover κινδυνεύει, ο άλλος πρέπει να τον υπερασπιστεί — ο θάνατος του ενός σκοτώνει και τους δύο.
- **Don't reveal early:** Η αποκάλυψη ότι είστε Lovers δίνει στη Mafia δύο στόχους αντί ενός.
- **Coordinate votes:** Δύο ψήφοι μαζί μπορούν να κάνουν τη διαφορά σε lynch.
- **Trust anchor:** Αν αποδειχθεί ο ένας Town, ο partner είναι guaranteed Town.

### Against Lovers (ως Mafia)

- **Two for one:** Σκοτώνοντας ένα Lover, εξοντώνετε αυτόματα δύο Town members.
- **Identify via visits:** Ο Lookout/Tracker μπορεί να αποκαλύψει τη σχέση μέσω nightly visits → η Mafia μπορεί να εκμεταλλευτεί αυτή τη γνώση.
- **Target efficiently:** Η εξόντωση ενός Lover late-game μπορεί να τελειώσει το παιχνίδι.

## AI Behavior (Virtual Player)

- **Protective behavior:** Ο AI Lover υπερασπίζεται τον partner του στο chat — αλλά **όχι υπερβολικά** (αποφεύγει να αποκαλύψει τη σχέση).
- **Vote coordination:** Οι AI Lovers τείνουν να ψηφίζουν **μαζί** — αλλά όχι πάντα (αποφυγή pattern).
- **[[AI Decision Engine#Speak Probability|speak probability]]:** Moderate — αυξάνεται αν ο partner είναι σε κίνδυνο.
- **Panic mode:** Αν ο partner κατηγορηθεί → ο Lover κάνει role claim ή αλλάζει ψήφο.
- **Secret keeping:** Ο AI Lover δεν αποκαλύπτει ποτέ εθελοντικά ότι είναι Lover — εκτός αν πιεστεί.

## Related Links

- [[Night Phase#Resolution]]
- [[Day Phase#Morning Report]]
- [[Win Conditions#Town Victory]]
- [[Lookout]] (can see Lover visits)
- [[Tracker]] (can track Lover movements)
- [[Dynamic Events#The Conflict]] (fight event)
- [[Citizen]] (Lovers originate from Citizens)

## Interactions with Other Roles

### Lookout Interaction

Αν ο [[Lookout]] παρακολουθεί το σπίτι ενός Lover, μπορεί να δει τον **άλλο Lover** να τον επισκέπτεται (αν εκείνη τη νύχτα ο Game Engine αποφάσισε αυτή τη φορά).

```
Lookout watches Lover A:
  → Night visit: Lover B visited Lover A
  → Lookout sees: "Player [Lover B] visited Player [Lover A]"
```

### Tracker Interaction

Αν ο [[Tracker]] ακολουθεί έναν Lover, μπορεί να δει ότι πήγε στο σπίτι του partner του.

```
Tracker tracks Lover B:
  → If Lover B visited Lover A this night:
     Tracker sees: "Player [Lover B] → Player [Lover A]"
  → If Lover A visited Lover B this night:
     Tracker sees: "Player [Lover B] → (κανένας)" (δεν πήγε πουθενά)
```

### Fight / Conflict Event

Μια νύχτα μπορεί οι Lovers να μαλώσουν (~15% πιθανότητα). Αυτό κάνει trigger ένα [[Dynamic Events#The Conflict|Conflict Event]]:

```
Morning Report:
  "A loud argument was heard near Player [Lover]'s house last night."
```

Αυτό μπορεί να αποκαλύψει πληροφορίες — αν το Town καταλάβει ότι δύο παίκτες μαλώνουν τακτικά, μπορεί να τους ταυτοποιήσει ως Lovers.

## Setup & Assignment

| Rule                        | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| **Πηγή**                    | 2 Citizens μετατρέπονται σε Lovers κατά το Setup          |
| **Γνώση**                   | Κάθε Lover ξέρει ποιος είναι ο partner του                |
| **Alignment**               | Και οι δύο Town — δεν αλλάζει                             |
| **Night Action**            | Κανένα (η επίσκεψη γίνεται αυτόματα)                     |
| **Compatibility**           | Δεν μπορεί να γίνει Lover κάποιος με unique role          |

### Role Card UI

```
┌─────────────────────────────────┐
│  💕 YOUR ROLE: Lover             │
│                                 │
│  Alignment: TOWN                │
│                                 │
│  Your Partner: Player X         │
│                                 │
│  ⚠️ If your partner dies,       │
│  you die too — and vice versa.  │
│                                 │
│  Win Condition:                 │
│  Eliminate all Mafia members    │
│                                 │
│  💡 Each night, one of you      │
│  visits the other (randomly).   │
└─────────────────────────────────┘
```
