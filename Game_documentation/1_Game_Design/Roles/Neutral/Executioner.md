---
tags:
  - role
  - role/neutral
  - tier/advanced
  - game_design
---

# Executioner (Neutral)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[Neutral]]                        |
| **Night Action** | None (Day-focused role)          |
| **Appears as** | Town (to [[Sheriff]])              |
| **Win Condition** | [[Win Conditions#Executioner Victory|Get target lynched]] |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🔵 **ADVANCED** — Εμφανίζεται σε 12+ παίκτες              |
| **Min Players**      | 12                                                         |
| **Scaling**          | Πάντα ακριβώς 1 Executioner — δεν κλιμακώνεται             |
| **Unique?**          | ✅ Ναι — μόνο 1 ανά παιχνίδι                                |

### Why Advanced

Ο Executioner δημιουργεί **στοχευμένο χάος** — αντί να θέλει να ψηφιστεί ο ίδιος (σαν τον [[Jester]]), θέλει να ψηφιστεί **κάποιος συγκεκριμένος αθώος**. Αυτό:
- Πιέζει τη Day Phase με **false accusations**.
- Δημιουργεί διαφωνία μεταξύ Town members.
- Σε 12+ παίκτες, η επιπλέον confusion αξίζει.

### Executioner vs Jester

| Aspect              | Jester                          | Executioner                        |
| -------------------- | ------------------------------- | ---------------------------------- |
| **Στόχος**           | Ψηφιστεί **ο ίδιος**           | Ψηφιστεί **ο assigned target**     |
| **Plays as**         | Ύποπτος — θέλει lynch on self   | Κατήγορος — πιέζει lynch on other  |
| **Game End on Win?** | ✅ Ναι — instant game over      | ❌ Όχι — παιχνίδι συνεχίζει        |
| **On Failure**       | Χάνει                           | Γίνεται [[Jester]]                 |
| **Sheriff sees**     | Town                            | Town                               |

## Overview

Κατά το setup, ο Executioner αποκτά **έναν τυχαίο Town παίκτη ως στόχο** (ο στόχος δεν ξέρει ότι στοχοποιείται). Ο σκοπός του Executioner είναι να πείσει τους υπόλοιπους να **ψηφίσουν τον στόχο του** κατά τη Day Phase.

### Target Assignment

- Ο στόχος είναι **πάντα Town** (ποτέ Mafia ή Neutral).
- Ο στόχος είναι **πάντα μη-unique role** (π.χ. Citizen) ή Lookout/Gossip — **ποτέ** Sheriff ή Doctor (θα ήταν ανισορρόπιστο).
- Αν ο στόχος **πεθάνει τη νύχτα** (πριν ψηφιστεί), ο Executioner **γίνεται [[Jester]]** — τώρα πρέπει να ψηφιστεί ο ίδιος.

## Strategy Notes

### As Executioner

- **Fake Sheriff claim:** Ο Executioner μπορεί να δηλώσει "Sheriff" και να πει "Ερεύνησα τον Player X, είναι Mafia" → πιέζει lynch.
- **Build evidence gradually:** Μην κατηγορήσετε αμέσως — χτίστε υποψίες σταδιακά σε πολλές μέρες.
- **Ally with Mafia:** Η Mafia ωφελείται από τη δράση του Executioner — ένας αθώος λιγότερος.
- **Avoid own suspicion:** Αν φαίνεται υπερβολικά επιθετικός, μπορεί να ψηφιστεί ο ίδιος.

### Against Executioner

- **Verify claims:** Αν κάποιος κατηγορεί επίμονα **έναν** συγκεκριμένο παίκτη, μπορεί να είναι Executioner.
- **Cross-reference:** Sheriff investigation + Lookout/Tracker data → αν δεν συμφωνούν, κάτι δεν πάει καλά.
- **Protect potential targets:** Αν ένας αθώος κατηγορείται χωρίς evidence, σκεφτείτε Executioner.

## AI Behavior (Virtual Player)

- **Accusation strategy:** Ο AI Executioner χτίζει case κατά του στόχου σταδιακά:
  - Day 1–2: Ελαφρές αναφορές, planting seeds of doubt.
  - Day 3+: Direct accusation, possible fake investigation claim.
- **Fake role claim:** Μπορεί να δηλώσει [[Sheriff]] σε critical moments — "Ερεύνησα τον [στόχο], είναι Mafia."
- **Memory tracking:** Χρησιμοποιεί [[Data Architecture#memory.json|memory.json]] για να βρει **ποιοι ψηφίζουν συχνά** → αυτούς πρέπει να πείσει.
- **Transition to Jester:** Αν ο στόχος πεθάνει, η AI στρατηγική αλλάζει εντελώς → τώρα παίζει ως Jester.
- **[[AI Decision Engine#Speak Probability|speak probability]]:** High — ο Executioner πρέπει να μιλάει ενεργά.

## Related Links

- [[Day Phase#The Trial & Vote]]
- [[Win Conditions#Executioner Victory]]
- [[Jester]] (fallback role if target dies)
- [[Sheriff]] (common fake claim)
- [[Survivor]] (fellow Neutral, different goal)

## Win Condition

| Condition                                      | Result                               |
| ---------------------------------------------- | ------------------------------------ |
| Ο στόχος ψηφίζεται κατά τη Day Phase            | **EXECUTIONER WINS** (παιχνίδι συνεχίζει) |
| Ο στόχος πεθαίνει τη νύχτα                      | Executioner → γίνεται **Jester**      |
| Ο Executioner πεθαίνει                          | **Χάνει**                             |
| Το παιχνίδι τελειώνει χωρίς lynch του στόχου   | **Χάνει**                             |

**Σημαντικό:** Η νίκη του Executioner **ΔΕΝ** τερματίζει το παιχνίδι — ο αθώος στόχος πεθαίνει, το Town χάνει ένα μέλος, αλλά το παιχνίδι συνεχίζει κανονικά.

## Setup & Assignment

| Rule                        | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| **Πηγή**                    | Τυχαία ανάθεση στόχου κατά το Setup                     |
| **Γνώση**                   | Ο Executioner ξέρει τον στόχο του — ο στόχος δεν ξέρει |
| **Στόχος**               | Πάντα Town, πάντα μη-unique role (ποτέ Sheriff/Doctor)  |
| **On target death**         | Executioner → γίνεται [[Jester]]                           |
