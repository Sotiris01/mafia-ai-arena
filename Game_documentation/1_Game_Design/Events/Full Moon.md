---
tags:
  - event
  - event/balance
  - game_design
  - mechanic
---

# The Full Moon — Balance Mechanic
---

| Property       | Value                                                  |
| -------------- | ------------------------------------------------------ |
| **Type**        | Dynamic Event — Balance Mechanic                      |
| **Trigger**    | Αυτόματο — ενεργοποιείται όταν μία ομάδα χάνει         |
| **Timing**     | Ανακοινώνεται στο Morning Report πριν τη νύχτα          |
| **Frequency**  | ~15% πιθανότητα κάθε νύχτα (μετά τη Νύχτα 2), **μόνο αν υπάρχει ανισορροπία** |
| **Max/Game**   | 3 φορές ανά παιχνίδι                                   |
| **Purpose**    | Δίνει boost στην ομάδα που **υστερεί**, για balance     |

---

## Σχεδιαστική Φιλοσοφία

Η Full Moon **δεν** είναι τυχαίο buff. Είναι **catch-up mechanic** — δίνει πλεονέκτημα μόνο στην ομάδα που χάνει. Αν το παιχνίδι είναι ισορροπημένο, Full Moon **δεν ενεργοποιείται**. Δεν είναι binary (μόνο Mafia ή μόνο Town) — υπάρχουν **2 στάδια** boost ανάλογα με το πόσο χάνει η ομάδα.

---

## Balance Score — Ποιος Χάνει;

Ο Game Engine υπολογίζει κάθε νύχτα:

```
balance_score = (town_alive / total_alive) - expected_town_ratio

expected_town_ratio = initial_town_count / initial_total_count

Σημείωση:
  - Zombie θύματα μετράνε ως ζωντανοί (αλλά δεν ψηφίζουν)
  - Neutral δεν μετράνε στο score (εξαιρούνται)
  - total_alive = town_alive + mafia_alive (χωρίς Neutral)
```

---

## Balance Score → Full Moon Stage

| Balance Score          | Κατάσταση              | Beneficiary        | Stage |
| ---------------------- | ---------------------- | ------------------ | ----- |
| `score > +0.15`        | Town υπερέχει πολύ     | 🔴 Mafia boost     | 2     |
| `+0.05 < score ≤ +0.15`| Town ελαφρώς μπροστά  | 🟠 Mafia boost     | 1     |
| `-0.05 ≤ score ≤ +0.05`| Ισορροπία             | ❌ No Full Moon    | 0     |
| `-0.15 ≤ score < -0.05`| Mafia ελαφρώς μπροστά | 🟠 Town boost      | 1     |
| `score < -0.15`        | Mafia υπερέχει πολύ   | 🔴 Town boost      | 2     |

---

## Stage 1 — Light Boost (🟠 Πληροφοριακό)

**Μόνο ρόλοι πληροφοριών** της υστερούσας ομάδας λαμβάνουν +1 action:

**Αν Mafia υστερεί:**

| Role             | Normal | Full Moon (Stage 1)  |
| ---------------- | ------ | -------------------- |
| **Consigliere**  | 1      | **2** investigations |
| **Framer**       | 1      | **2** frames         |
| **Silencer**     | 1      | **2** silences       |
| Mafia Kill       | 1      | 1 _(unchanged)_      |
| Janitor          | 1      | 1 _(unchanged)_      |

**Αν Town υστερεί:**

| Role             | Normal | Full Moon (Stage 1)  |
| ---------------- | ------ | -------------------- |
| **Sheriff**      | 1      | **2** investigations |
| **Lookout**      | 1      | **2** watches        |
| **Tracker**      | 1      | **2** tracks         |
| Doctor           | 1      | 1 _(unchanged)_      |

> **Σκοπός:** Δίνει **πληροφοριακό πλεονέκτημα** χωρίς να αυξήσει kill power — η ομάδα μαθαίνει περισσότερα αλλά δεν γίνεται θανατηφόρα.

---

## Stage 2 — Full Boost (🔴 Ολικό)

**ΟΛΟΙ** οι ρόλοι της υστερούσας ομάδας λαμβάνουν +1 action:

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
| **Doctor**       | 1      | **2** protects/cures |
| **Sheriff**      | 1      | **2** investigations |
| **Lookout**      | 1      | **2** watches        |
| **Tracker**      | 1      | **2** tracks         |
| **Gossip**       | 1      | **2** hints          |

> **Εξαιρέσεις (δεν διπλασιάζονται ποτέ):**
> - **Bodyguard** — θυσιάζεται, δεν μπορεί να guard 2.
> - **Zombie & Survivor** — Neutral, δεν εντάσσονται σε faction boost.
> - **Lovers** — passive visit, δεν αλλάζει.

---

## Balance Score Examples

```
Παράδειγμα 1: Παιχνίδι 10 παικτών (6 Town, 3 Mafia, 1 Neutral)
  Μετά Night 2: 5 Town ζωντανοί, 2 Mafia ζωντανοί
  expected = 6/9 = 0.667 (εξαιρούμε Neutral)
  actual = 5/7 = 0.714
  score = 0.714 - 0.667 = +0.047
  → Stage 0: Ισορροπία — No Full Moon

Παράδειγμα 2: Παιχνίδι 10 παικτών
  Μετά Night 3: 5 Town ζωντανοί, 1 Mafia ζωντανός
  actual = 5/6 = 0.833
  score = 0.833 - 0.667 = +0.166
  → Stage 2: 🔴 Mafia Full Boost (Mafia χάνει σοβαρά)
  → Mafia gets 2 kills + double info roles

Παράδειγμα 3: Παιχνίδι 12 παικτών (7 Town, 3 Mafia, 2 Neutral)
  expected = 7/10 = 0.700
  Μετά Night 3: 4 Town, 3 Mafia
  actual = 4/7 = 0.571
  score = 0.571 - 0.700 = -0.129
  → Stage 1: 🟠 Town Light Boost (Mafia ελαφρώς μπροστά)
  → Sheriff/Lookout/Tracker get double info actions

Παράδειγμα 4: Ίδιο σενάριο αλλά 3 Town, 3 Mafia
  actual = 3/6 = 0.500
  score = 0.500 - 0.700 = -0.200
  → Stage 2: 🔴 Town Full Boost (Mafia κυριαρχεί)
  → Doctor gets 2 protects + all info roles doubled
```

---

## Morning Report Announcements

| Stage | Announcement                                                              |
| ----- | ------------------------------------------------------------------------- |
| 0     | _(δεν ανακοινώνεται τίποτα)_                                              |
| 1     | _"🌕 The moon glows faintly. Some feel a strange surge of power tonight."_ |
| 2     | _"🌕 A FULL MOON rises! Great power awakens for those who need it most."_  |

> **Κρίσιμο:** Η ανακοίνωση **δεν αποκαλύπτει** ποια ομάδα πήρε boost — οι παίκτες πρέπει να μαντέψουν βάσει των αποτελεσμάτων.

---

## Impact on Gameplay

| Αντίκτυπος                     | Περιγραφή                                                  |
| ------------------------------ | ---------------------------------------------------------- |
| **Catch-up mechanic**          | Η ομάδα που χάνει παίρνει δεύτερη ευκαιρία                 |
| **Δραματικές νύχτες**          | Stage 2 = πολλαπλοί θάνατοι ή saves, ανατροπές            |
| **Strategic uncertainty**      | Δεν ξέρεις ποια ομάδα πήρε boost                           |
| **Prevents snowball**          | Μία ομάδα δεν μπορεί να κυριαρχήσει χωρίς αντίδραση       |
| **Staged intensity**           | Light boost = πληροφορίες, Full boost = ενέργεια + πληροφορίες |

---

## Configuration

```json
{
  "full_moon": {
    "probability": 0.15,
    "min_night": 3,
    "max_per_game": 3,
    "requires_imbalance": true,
    "balance_thresholds": {
      "stage_1_threshold": 0.05,
      "stage_2_threshold": 0.15
    },
    "excluded_from_boost": ["Bodyguard", "Zombie", "Survivor", "Lovers"]
  }
}
```

---

## Related Links

- [[Dynamic Events]] — Κεντρικό σύστημα events
- [[Day Phase#Morning Report]] — Announcements εμφανίζονται εδώ
- [[Night Phase]] — Boost εφαρμόζεται κατά τη νύχτα
