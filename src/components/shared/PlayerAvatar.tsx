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
  /** Whether to show the name label below the avatar (default: true) */
  showName?: boolean;
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

/** Generate a visually distinct color from a player ID using golden-ratio spacing */
function idToColor(id: string): string {
  // Extract numeric index from IDs like "ai_1", "ai_2" etc.
  const match = id.match(/(\d+)/);
  const index = match ? parseInt(match[1], 10) : 0;
  // Golden angle (~137.5°) guarantees maximum hue separation between consecutive IDs
  const hue = (index * 137.508) % 360;
  return `hsl(${hue}, 60%, 50%)`;
}

/** Extract a short display label from the player name or ID.
 *  e.g. "Player 5" → "5", "Player" → "P", "ai_3" → "3" */
function extractLabel(playerName: string, playerId: string): string {
  // Try to extract a trailing number from the name ("Player 7" → "7")
  const nameNum = playerName.match(/(\d+)$/);
  if (nameNum) return nameNum[1];
  // Try to extract a number from the ID ("ai_3" → "3")
  const idNum = playerId.match(/(\d+)/);
  if (idNum) return idNum[1];
  // Fallback: first character of name
  return playerName.charAt(0).toUpperCase();
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
  showName = true,
}: PlayerAvatarProps) {
  const s = SIZES[size];
  const label = extractLabel(playerName, playerId);
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
          {isAlive ? label : "💀"}
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
      {showName && (
        <Text
          style={[styles.name, { fontSize: s.font - 4 }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {playerName}
        </Text>
      )}
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
