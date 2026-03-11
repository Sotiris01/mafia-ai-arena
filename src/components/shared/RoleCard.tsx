// =============================================================================
// FILE: RoleCard.tsx
// PURPOSE: Role card — shown only to owner, never public, displays role info
// LOCATION: src/components/shared/RoleCard.tsx
// =============================================================================

import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { PlayerRole } from "../../types/player.types";
import type { RoleDefinition } from "../../types/role.types";
import { formatRole } from "../../utils/formatters";
import FactionBanner from "./FactionBanner";
import rolesData from "../../data/roles.json";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface RoleCardProps {
  /** The human player's role data */
  player: PlayerRole;
  /** Start revealed (lobby) or hidden (in-game peek) */
  startRevealed?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Look up the full RoleDefinition from roles.json to get description + night action text */
function getRoleDefinition(roleName: string): RoleDefinition | undefined {
  const defs = (rolesData as unknown as { roles: RoleDefinition[] }).roles;
  return defs.find((r) => r.role === roleName);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RoleCard({
  player,
  startRevealed = true,
}: RoleCardProps) {
  const [revealed, setRevealed] = useState(startRevealed);
  const def = getRoleDefinition(player.role);

  if (!revealed) {
    return (
      <Pressable style={styles.cardHidden} onPress={() => setRevealed(true)}>
        <Text style={styles.hiddenIcon}>🎭</Text>
        <Text style={styles.hiddenText}>
          Tap to reveal your role
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.card}>
      {/* Faction header */}
      <FactionBanner alignment={player.alignment} size="small" />

      {/* Role name */}
      <Text style={styles.roleName}>{formatRole(player.role)}</Text>

      {/* Description */}
      {def && (
        <Text style={styles.description}>
          {def.description}
        </Text>
      )}

      {/* Night action */}
      {def && def.night_action.type !== "none" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            🌙 Night Action
          </Text>
          <Text style={styles.sectionBody}>{def.night_action.description}</Text>
        </View>
      )}

      {/* Special rules */}
      {player.special_rules.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ⚡ Special Rules
          </Text>
          {player.special_rules.map((rule) => (
            <Text key={rule} style={styles.ruleItem}>
              • {rule.replaceAll("_", " ")}
            </Text>
          ))}
        </View>
      )}

      {/* Tier badge */}
      <Text style={styles.tier}>{player.importance_tier.toUpperCase()} TIER</Text>
    </View>
  );
}

// TODO(LOW): Add role-specific icon from assets/icons/
// TODO(LOW): Add flip animation (card back → card front)
// TODO(Phase 5): Compact/expandable mode for in-game peek

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e1e2e",
    borderRadius: 12,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardHidden: {
    backgroundColor: "#1e1e2e",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#555",
    gap: 8,
  },
  hiddenIcon: {
    fontSize: 48,
  },
  hiddenText: {
    color: "#999",
    fontSize: 14,
  },
  roleName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  description: {
    color: "#bbb",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  section: {
    gap: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionBody: {
    color: "#ccc",
    fontSize: 13,
  },
  ruleItem: {
    color: "#ccc",
    fontSize: 13,
    paddingLeft: 4,
  },
  tier: {
    color: "#666",
    fontSize: 10,
    textAlign: "right",
    fontWeight: "600",
    letterSpacing: 1,
  },
});
