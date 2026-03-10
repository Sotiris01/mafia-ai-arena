// =============================================================================
// FILE: FactionBanner.tsx
// PURPOSE: Faction display — Town/Mafia/Neutral color banner
// LOCATION: src/components/shared/FactionBanner.tsx
// =============================================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Alignment } from "../../types/player.types";
import { formatAlignment } from "../../utils/formatters";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface FactionBannerProps {
  alignment: Alignment;
  size?: "small" | "large";
}

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

const FACTION_COLORS: Record<Alignment, { bg: string; text: string }> = {
  Town: { bg: "#1565c0", text: "#e3f2fd" },
  Mafia: { bg: "#b71c1c", text: "#ffcdd2" },
  Neutral: { bg: "#6a1b9a", text: "#e1bee7" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FactionBanner({
  alignment,
  size = "large",
}: FactionBannerProps) {
  const colors = FACTION_COLORS[alignment];
  const isSmall = size === "small";

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: colors.bg },
        isSmall && styles.bannerSmall,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: colors.text },
          isSmall && styles.labelSmall,
        ]}
      >
        {formatAlignment(alignment)}
      </Text>
    </View>
  );
}

// TODO(LOW): Add faction icon/emblem alongside text
// TODO(Phase 7): Support result screen variant with glow / animation

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  bannerSmall: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  labelSmall: {
    fontSize: 12,
  },
});
