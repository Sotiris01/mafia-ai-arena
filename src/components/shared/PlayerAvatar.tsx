// =============================================================================
// FILE: PlayerAvatar.tsx
// PURPOSE: Player icon with status — alive/dead/zombie/silenced indicators
// LOCATION: src/components/shared/PlayerAvatar.tsx
// =============================================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface PlayerAvatarProps {
  playerId: string;
  playerName: string;
  isAlive: boolean;
  isZombie?: boolean;
  isSilenced?: boolean;
  /** Whether this player is the human player */
  isHuman?: boolean;
  size?: "small" | "medium" | "large";
  // TODO(Phase 5): isMayor — show MayorBadge overlay after reveal
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SIZES = {
  small: { circle: 32, font: 12, badge: 10 },
  medium: { circle: 44, font: 16, badge: 14 },
  large: { circle: 56, font: 20, badge: 16 },
} as const;

/** Generate a stable color from a player ID string */
function idToColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 50%)`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PlayerAvatar({
  playerId,
  playerName,
  isAlive,
  isZombie = false,
  isSilenced = false,
  isHuman = false,
  size = "medium",
}: PlayerAvatarProps) {
  const s = SIZES[size];
  const initial = playerName.charAt(0).toUpperCase();
  const bgColor = isAlive ? idToColor(playerId) : "#555";

  return (
    <View style={[styles.container, { width: s.circle }]}>
      {/* Circle with initial */}
      <View
        style={[
          styles.circle,
          {
            width: s.circle,
            height: s.circle,
            borderRadius: s.circle / 2,
            backgroundColor: isZombie ? "#2e7d32" : bgColor,
            opacity: isAlive ? 1 : 0.45,
          },
          isHuman && styles.humanBorder,
        ]}
      >
        <Text style={[styles.initial, { fontSize: s.font }]}>
          {isAlive ? initial : "💀"}
        </Text>
      </View>

      {/* Status badges */}
      {isZombie && isAlive && (
        <View style={[styles.badge, { width: s.badge, height: s.badge, borderRadius: s.badge / 2 }]}>
          <Text style={styles.badgeText}>🧟</Text>
        </View>
      )}
      {isSilenced && isAlive && (
        <View style={[styles.badge, styles.silencedBadge, { width: s.badge, height: s.badge, borderRadius: s.badge / 2 }]}>
          <Text style={styles.badgeText}>🔇</Text>
        </View>
      )}

      {/* Name label */}
      <Text
        style={[styles.name, { fontSize: s.font - 4 }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {playerName}
      </Text>
    </View>
  );
}

// TODO(Phase 5): Add MayorBadge overlay when is_revealed_mayor
// TODO(Phase 5): Add ZombieIndicator component overlay
// TODO(LOW): Personality-based color coding (map PersonalityType → hue range)
// TODO(LOW): Status transition animations (alive → dead fade)

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 2,
  },
  circle: {
    justifyContent: "center",
    alignItems: "center",
  },
  humanBorder: {
    borderWidth: 2,
    borderColor: "#ffd700",
  },
  initial: {
    color: "#fff",
    fontWeight: "700",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    justifyContent: "center",
    alignItems: "center",
  },
  silencedBadge: {
    right: undefined,
    left: -2,
  },
  badgeText: {
    fontSize: 10,
  },
  name: {
    color: "#ccc",
    textAlign: "center",
    maxWidth: 60,
  },
});
