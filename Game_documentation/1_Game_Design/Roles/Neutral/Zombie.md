---
tags:
  - role
  - role/neutral
  - tier/expanded
  - game_design
  - night_action
---

# Zombie (Neutral)
---

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Alignment**  | [[Neutral]]                        |
| **Night Action** | Infect (Turn into Zombie)        |
| **Appears as** | Town (to [[Sheriff]])              |
| **Win Condition** | [[Win Conditions#Zombie Victory|Turn all players into Zombies]] |

## Gameplay Importance & Scaling

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Importance Tier**  | 🟣 **EXPANDED** — Εμφανίζεται σε 14+ παίκτες              |
| **Min Players**      | 14                                                         |
| **Scaling**          | Πάντα ακριβώς 1 Zombie — δεν κλιμακώνεται                  |
| **Unique?**          | ✅ Ναι — μόνο 1 ανά παιχνίδι (αλλά δημιουργεί zombie θύματα) |

### Why Expanded

Ο Zombie εισάγει ένα **εντελώς νέο win condition** — δεν ανήκει σε Town ούτε Mafia. Στόχος του: μετατρέπει σταδιακά όλους τους παίκτες σε zombies. Σε 14+ παίκτες, η πολυπλοκότητα του παιχνιδιού αντέχει αυτή τη μηχανική χωρίς να γίνεται ασύμμετρα unfair.

### Balance Tradeoff

- ✅ **Stealth:** Εμφανίζεται ως "Town" στον [[Sheriff]] — δύσκολα εντοπίζεται.
- ✅ **Gradual power:** Κάθε νύχτα γίνεται πιο δυνατός (περισσότερα zombie θύματα).
- ❌ **Doctor counter:** Ο [[Doctor]] μπορεί να **θεραπεύσει** zombie θύματα — αντίμετρο.
- ❌ **Detection via Sheriff:** Τα zombie θύματα εμφανίζονται ως "**Zombie**" στον Sheriff → αποκαλύπτεται η ύπαρξη του Zombie.
- ❌ **Visible effects:** Τα zombie θύματα έχουν ορατά συμπτώματα (περιορισμένο chat, δεν ψηφίζουν).

## Overview

Ο Zombie είναι ένας **Neutral ρόλος** με μοναδικό win condition: να **μετατρέψει όλους** τους ζωντανούς παίκτες σε zombies. Κάθε νύχτα, ο Zombie επιλέγει ένα θύμα και το **μολύνει** — μετατρέποντάς το σε zombie. Τα zombie θύματα χάνουν τις ικανότητές τους αλλά **δεν πεθαίνουν** — παραμένουν στο παιχνίδι με **σοβαρούς περιορισμούς**.

### Zombie Effects on Victims

| Effect                   | Description                                                     |
| -------------------------| --------------------------------------------------------------- |
| **Περιορισμένο chat**     | Τα zombie θύματα μπορούν να γράψουν μόνο **30 χαρακτήρες** ανά μήνυμα |
| **Δεν ψηφίζουν**         | Τα zombie θύματα **δεν μπορούν** να ψηφίσουν κατά τη [[Day Phase#The Trial & Vote|Trial]] |
| **Χαμένες ικανότητες**   | Ο αρχικός ρόλος τους **απενεργοποιείται** — δεν εκτελούν night actions |
| **Ζωντανοί αλλά ανενεργοί** | Μετράνε ως ζωντανοί παίκτες αλλά δεν μπορούν να συνεισφέρουν |
| **Sheriff detection**    | Εμφανίζονται ως "**🧟 Zombie**" στον Sheriff (αντί Town/Mafia)  |

### Sheriff Interaction

| Target                | Sheriff Result                                            |
| --------------------- | --------------------------------------------------------- |
| **Zombie (ο ίδιος)**  | Εμφανίζεται ως "**Town**" — ο Zombie κρύβεται             |
| **Zombie θύμα**        | Εμφανίζεται ως "**🧟 Zombie**" — αποκαλύπτεται η μόλυνση  |
| **Κανονικός παίκτης** | Κανονικό αποτέλεσμα (Town/Mafia)                          |

## Night Action: Infect

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Target**      | 1 ζωντανός, μη-zombie παίκτης                                      |
| **Effect**      | Ο στόχος μετατρέπεται σε zombie τo επόμενο πρωί                    |
| **Uses**        | Απεριόριστες — 1 ανά νύχτα                                         |
| **Self-target** | ❌ Δεν μπορεί                                                       |
| **Blocked by**  | [[Doctor]] cure — αν ο Doctor θεραπεύσει zombie θύμα                |

### Infection Resolution

```
Night:
  Zombie selects Target X
  → Target X is marked as "infected"

Morning:
  → Target X becomes zombie
  → Morning Report: "Player X doesn't look well today... 🧟"
  → Target X: chat limited to 30 chars, cannot vote, loses night action
```

### Doctor Cure Mechanic

Ο [[Doctor]] μπορεί να **θεραπεύσει** ένα zombie θύμα αντί να προστατεύσει κάποιον:

```
Doctor selects zombie Target Y:
  → Target Y is CURED — επιστρέφει σε κανονική κατάσταση
  → Ο αρχικός ρόλος τους επανενεργοποιείται
  → Morning Report: "Player Y looks much better today! 💊"
```

> ⚠️ **Στρατηγικό δίλημμα:** Ο Doctor πρέπει να επιλέξει — **Protect** κάποιον από Mafia kill ή **Cure** ένα zombie. Δεν μπορεί να κάνει και τα δύο.

## Strategy Notes

### As Zombie

- **Target key roles:** Μετατρέψτε Sheriff, Doctor, Bodyguard σε zombies → αφαιρείτε τις ικανότητές τους.
- **Target Doctor last:** Ο Doctor μπορεί να cure — μετατρέψτε τον **αργά** αφού δεν θα έχει ποιον να cure.
- **Fly under radar:** Ο Zombie εμφανίζεται ως Town στον Sheriff — χρησιμοποιήστε το.
- **Blend in:** Μιλήστε κανονικά, κατηγορήστε Mafia — μοιάζετε Town member.
- **Late game rush:** Αν αρκετοί γίνουν zombies, η ψηφοφορία γίνεται ευκολότερη αφού τα zombies δεν ψηφίζουν.

### Against Zombie (ως Town/Mafia)

- **Doctor priority:** Ο Doctor πρέπει να cure zombies αντί να protect — αλλιώς ο Zombie κερδίζει σταδιακά.
- **Sheriff detection:** Αν ο Sheriff δει "Zombie" σε κάποιον → υπάρχει Zombie στο παιχνίδι. Ψάξτε τον.
- **Kill the Zombie:** Lynch ή Mafia kill τον Zombie → τα θύματα **παραμένουν** zombies, αλλά δεν μολύνονται νέα.
- **Watch the silence:** Παίκτες που ξαφνικά γράφουν σύντομα μηνύματα → πιθανά zombies.

## AI Behavior (Virtual Player)

- **Target selection:** Ο AI Zombie εστιάζει σε:
  - Doctor → κορυφαία προτεραιότητα (αφαίρεση cure)
  - Sheriff → δεύτερη (αφαίρεση investigation)
  - Active players → τρίτη (μείωση voting power)
  - Doctor τελευταίος αν θέλει να εξασφαλίσει ότι δεν cure-άρεται τα θύματα
- **Blending:** Ο AI Zombie φαίνεται ως **κανονικός Town member** — κατηγορεί Mafia, ψηφίζει λογικά.
- **[[AI Decision Engine#Speak Probability|speak probability]]:** Moderate — μοιάζει με κανονικό πολίτη.
- **Panic mode:** Αν κατηγορηθεί → κάνει role claim Citizen ή Survivor.
- **Strategic patience:** Δεν αποκαλύπτεται ποτέ — ο στόχος είναι gradual infection.

## Related Links

- [[Night Phase#Resolution]]
- [[Day Phase#Morning Report]]
- [[Win Conditions#Zombie Victory]]
- [[Doctor]] (can cure zombie victims)
- [[Sheriff]] (detects zombie victims, NOT the Zombie itself)
- [[Dynamic Events]] (zombie spreading effects)

## Win Condition

| Condition                                               | Result                    |
| ------------------------------------------------------- | ------------------------- |
| Όλοι οι ζωντανοί παίκτες είναι zombies (εκτός Zombie)   | **🧟 ZOMBIE WINS**        |
| Ο Zombie πεθαίνει (νύχτα ή lynch)                        | **Χάνει**                 |
| Town ή Mafia κερδίζει πρώτα                               | **Χάνει** (εκτός αν surviving) |

### Win Check

```
onPhaseEnd():
  alive_non_zombie = players.filter(p => p.is_alive && !p.is_zombie && p.role !== "Zombie")
  if alive_non_zombie.length === 0 && zombie_player.is_alive:
    game.end(winner = "Zombie")
```

## Zombie Spreading Visualization

```
Night 1: 🧟 → Player A infected
Day 2:   Player A = 🧟 (limited chat, no vote)
Night 2: 🧟 → Player B infected  
Day 3:   Players A, B = 🧟🧟 (Doctor cures A → A recovers!)
Night 3: 🧟 → Player C infected
Day 4:   Players B, C = 🧟🧟 ...
```

## Morning Report Messages

| Event                     | Message                                                    |
| ------------------------- | ---------------------------------------------------------- |
| **Νέα μόλυνση**           | _"Player X doesn't look well today... 🧟"_                 |
| **Doctor cure**           | _"Player Y looks much better today! 💊"_                    |
| **Zombie θύμα μιλάει**    | _(max 30 χαρακτήρες ανά μήνυμα — UI enforced)_              |
| **Zombie θύμα ψηφίζει**   | ❌ Δεν εμφανίζεται στις επιλογές ψηφοφορίας                 |
