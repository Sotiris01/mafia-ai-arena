// =============================================================================
// FILE: RolePreview.tsx
// PURPOSE: Role distribution preview by tier in game lobby
// LOCATION: src/components/lobby/RolePreview.tsx
// =============================================================================

import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import type { RoleDefinition } from "../../types/role.types";
import type { ImportanceTier } from "../../types/player.types";
import { formatRole } from "../../utils/formatters";
import rolesData from "../../data/roles.json";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface RolePreviewProps {
  playerCount: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TIER_CONFIG: {
  tier: ImportanceTier;
  label: string;
  color: string;
}[] = [
  { tier: "core", label: "Core (always)", color: "#43a047" },
  { tier: "important", label: "Important (8+)", color: "#4a9eff" },
  { tier: "advanced", label: "Advanced (10+)", color: "#ab47bc" },
  { tier: "expanded", label: "Expanded (13+)", color: "#ff9800" },
];

const ALIGNMENT_COLORS: Record<string, string> = {
  Town: "#1565c0",
  Mafia: "#b71c1c",
  Neutral: "#6a1b9a",
};

/** Parse count_scaling keys like "7-9" and return how many copies at playerCount */
function getScalingCount(
  scaling: Record<string, number>,
  playerCount: number,
): number {
  for (const [range, count] of Object.entries(scaling)) {
    const parts = range.split("-");
    const lo = parseInt(parts[0], 10);
    const hi = parseInt(parts[1] ?? parts[0], 10);
    if (playerCount >= lo && playerCount <= hi) return count;
  }
  return 0;
}

/** Get roles grouped by tier that are active at this player count */
function getRolesByTier(
  playerCount: number,
): Map<ImportanceTier, { role: RoleDefinition; count: number }[]> {
  const defs = (rolesData as unknown as { roles: RoleDefinition[] }).roles;
  const grouped = new Map<ImportanceTier, { role: RoleDefinition; count: number }[]>();

  for (const tier of ["core", "important", "advanced", "expanded"] as ImportanceTier[]) {
    grouped.set(tier, []);
  }

  for (const role of defs) {
    if (role.min_players > playerCount) continue;
    const count = getScalingCount(
      role.count_scaling as Record<string, number>,
      playerCount,
    );
    if (count <= 0) continue;
    const list = grouped.get(role.importance_tier as ImportanceTier);
    if (list) list.push({ role, count });
  }

  return grouped;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RolePreview({ playerCount }: RolePreviewProps) {
  const grouped = useMemo(() => getRolesByTier(playerCount), [playerCount]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {TIER_CONFIG.map(({ tier, label, color }) => {
        const roles = grouped.get(tier) ?? [];
        if (roles.length === 0) return null;

        return (
          <View key={tier} style={styles.section}>
            <Text style={[styles.tierLabel, { color }]}>{label}</Text>
            <View style={styles.roleList}>
              {roles.map(({ role, count }) => (
                <View key={role.role} style={styles.roleRow}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: ALIGNMENT_COLORS[role.alignment] ?? "#666" },
                    ]}
                  />
                  <Text style={styles.roleName}>
                    {formatRole(role.role)}
                    {count > 1 ? ` ×${count}` : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

// TODO(LOW): Add role detail popup on tap (show description + night action)
// TODO(LOW): Highlight newly unlocked roles when count changes
// TODO(LOW): Add role icons from assets/icons/

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  section: {
    marginBottom: 14,
  },
  tierLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  roleList: {
    gap: 4,
    paddingLeft: 4,
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  roleName: {
    color: "#ddd",
    fontSize: 14,
  },
});
