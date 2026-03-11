// =============================================================================
// FILE: VoteCard.tsx
// PURPOSE: Individual vote display — shows who voted for whom
// LOCATION: src/components/voting/VoteCard.tsx
// =============================================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface VoteCardProps {
  voterName: string;
  targetName: string;
  /** Show Mayor ×2 badge */
  isMayor: boolean;
  /** Vote weight (1 or 2 for Mayor) */
  weight: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function VoteCard({
  voterName,
  targetName,
  isMayor,
  weight,
}: VoteCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.voterName}>{voterName}</Text>
      <Text style={styles.arrow}> → </Text>
      <Text style={styles.targetName}>{targetName}</Text>
      {isMayor && (
        <View style={styles.mayorBadge}>
          <Text style={styles.mayorText}>×{weight}</Text>
        </View>
      )}
    </View>
  );
}

// TODO(Phase 5): Add MayorBadge component overlay instead of inline badge
// TODO(LOW): Add vote appear animation

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16213e",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 3,
    marginHorizontal: 12,
  },
  voterName: {
    color: "#e0e0e0",
    fontSize: 14,
    fontWeight: "600",
  },
  arrow: {
    color: "#666",
    fontSize: 14,
  },
  targetName: {
    color: "#e94560",
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  mayorBadge: {
    backgroundColor: "#f9a825",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  mayorText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "800",
  },
});
