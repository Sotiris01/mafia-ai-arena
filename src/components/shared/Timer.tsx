// =============================================================================
// FILE: Timer.tsx
// PURPOSE: Phase timer — countdown display for all timed phases
// LOCATION: src/components/shared/Timer.tsx
// =============================================================================

import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatTime } from "../../utils/formatters";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface TimerProps {
  /** Total seconds for the countdown */
  seconds: number;
  /** Called once when the timer hits 0 */
  onExpire: () => void;
  /** If true, start in yellow "warning" mode regardless of seconds left */
  isWarning?: boolean;
  /** If true, timer is frozen (e.g., game paused) */
  paused?: boolean;
}

// ---------------------------------------------------------------------------
// Color thresholds
// ---------------------------------------------------------------------------

const COLOR_GREEN = "#43a047";
const COLOR_YELLOW = "#f9a825";
const COLOR_RED = "#e53935";

function timerColor(remaining: number, isWarning?: boolean): string {
  if (remaining <= 10) return COLOR_RED;
  if (remaining <= 30 || isWarning) return COLOR_YELLOW;
  return COLOR_GREEN;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Timer({
  seconds,
  onExpire,
  isWarning,
  paused = false,
}: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const expiredRef = useRef(false);

  // Reset when seconds prop changes (new phase)
  useEffect(() => {
    setRemaining(seconds);
    expiredRef.current = false;
  }, [seconds]);

  // Countdown interval
  useEffect(() => {
    if (paused || remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0 && !expiredRef.current) {
          expiredRef.current = true;
          // Defer callback to avoid state-update-during-render
          setTimeout(onExpire, 0);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [paused, remaining, onExpire]);

  const color = timerColor(remaining, isWarning);

  return (
    <View style={[styles.container, { borderColor: color }]}>
      <Text style={[styles.time, { color }]}>{formatTime(remaining)}</Text>
    </View>
  );
}

// TODO(LOW): Add tick sound effect in final 5 seconds (expo-av)
// TODO(LOW): Pulse / scale animation when remaining < 10

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
  },
  time: {
    fontSize: 28,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});
