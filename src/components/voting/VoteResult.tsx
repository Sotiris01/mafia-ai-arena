// =============================================================================
// FILE: VoteResult.tsx
// PURPOSE: Lynch result display — shows who was lynched (NO role reveal)
// LOCATION: src/components/voting/VoteResult.tsx
// =============================================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { VoteTally } from "../../hooks/useVoting";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface VoteResultProps {
  /** Name of the lynched player, or null for acquittal/tie */
  lynchedPlayerName: string | null;
  /** Vote tallies sorted by weight descending */
  tallies: VoteTally[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function VoteResult({
  lynchedPlayerName,
  tallies,
}: VoteResultProps) {
  const isLynch = lynchedPlayerName !== null;

  return (
    <View style={styles.container}>
      {/* Outcome banner */}
      <Text style={styles.emoji}>{isLynch ? "⚰️" : "⚖️"}</Text>
      <Text style={[styles.outcome, isLynch ? styles.lynchText : styles.acquitText]}>
        {isLynch
          ? `${lynchedPlayerName} has been lynched`
          : "No one was lynched"}
      </Text>

      {/* Role is NOT revealed — core game mechanic */}
      {isLynch && (
        <Text style={styles.roleHidden}>
          Role remains hidden
        </Text>
      )}

      {/* Tallies */}
      {tallies.length > 0 && (
        <View style={styles.tallySection}>
          <Text style={styles.tallyTitle}>
            Vote Tally
          </Text>
          {tallies.map((t) => (
            <View key={t.targetId} style={styles.tallyRow}>
              <Text style={styles.tallyName}>{t.targetName}</Text>
              <Text style={styles.tallyCount}>
                {t.totalWeight} {t.totalWeight !== 1
                  ? "votes"
                  : "vote"}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// TODO(Phase 5): Add dramatic reveal animation
// TODO(Phase 5): Trigger LastWishBanner after lynch display

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  outcome: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  lynchText: {
    color: "#e94560",
  },
  acquitText: {
    color: "#43a047",
  },
  roleHidden: {
    color: "#888",
    fontSize: 13,
    fontStyle: "italic",
    marginBottom: 16,
  },
  tallySection: {
    width: "100%",
    marginTop: 16,
    paddingHorizontal: 8,
  },
  tallyTitle: {
    color: "#aaa",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  tallyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#16213e",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    marginVertical: 2,
  },
  tallyName: {
    color: "#e0e0e0",
    fontSize: 14,
    fontWeight: "600",
  },
  tallyCount: {
    color: "#999",
    fontSize: 14,
  },
});
