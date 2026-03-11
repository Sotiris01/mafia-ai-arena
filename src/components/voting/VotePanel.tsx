// =============================================================================
// FILE: VotePanel.tsx
// PURPOSE: Voting UI container — player selection grid, Mayor ×2 indicator
// LOCATION: src/components/voting/VotePanel.tsx
// =============================================================================

import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import PlayerAvatar from "../shared/PlayerAvatar";
import Timer from "../shared/Timer";
import VoteCard from "./VoteCard";
import type { PlayerRole } from "../../types/player.types";
import type { Vote } from "../../types/game.types";
import * as PlayerState from "../../state/PlayerState";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface VotePanelProps {
  /** All votes cast so far */
  votes: Vote[];
  /** Whether the human has already voted */
  hasHumanVoted: boolean;
  /** Whether the human is a zombie (can't vote) */
  isHumanZombie: boolean;
  /** Voting timer duration in seconds */
  timerSeconds: number;
  /** Called when the human selects a target */
  onVote: (targetId: string) => void;
  /** Called when the human chooses to abstain */
  onAbstain: () => void;
  /** Called when the timer expires */
  onTimerExpire: () => void;
  /** Whether the timer is paused */
  timerPaused?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function VotePanel({
  votes,
  hasHumanVoted,
  isHumanZombie,
  timerSeconds,
  onVote,
  onAbstain,
  onTimerExpire,
  timerPaused = false,
}: VotePanelProps) {
  const alivePlayers = PlayerState.getAllAlivePlayers();
  const humanPlayer = PlayerState.getHumanPlayer();

  // Human cannot vote for themselves
  const selectablePlayers = alivePlayers.filter(
    (p) => p.player_id !== humanPlayer.player_id,
  );

  const canVote = !hasHumanVoted && !isHumanZombie;

  return (
    <View style={styles.container}>
      {/* Timer */}
      <Timer
        seconds={timerSeconds}
        onExpire={onTimerExpire}
        paused={timerPaused || hasHumanVoted}
      />

      {/* Status */}
      {isHumanZombie && (
        <Text style={styles.zombieWarning}>
          🧟 Zombies cannot vote
        </Text>
      )}
      {hasHumanVoted && !isHumanZombie && (
        <Text style={styles.votedLabel}>
          ✅ Vote cast — waiting for others…
        </Text>
      )}

      {/* Player selection grid */}
      {canVote && (
        <>
          <Text style={styles.sectionTitle}>
            Select a player to lynch
          </Text>
          <ScrollView
            horizontal={false}
            style={styles.gridScroll}
            contentContainerStyle={styles.grid}
          >
            {selectablePlayers.map((p) => (
              <Pressable
                key={p.player_id}
                style={styles.playerCell}
                onPress={() => onVote(p.player_id)}
              >
                <PlayerAvatar
                  playerId={p.player_id}
                  playerName={p.player_name}
                  isAlive
                  isZombie={p.is_zombie}
                  size="medium"
                  showName={false}
                />
                <Text
                  style={styles.playerCellName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {p.player_name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Abstain button */}
          <Pressable style={styles.abstainButton} onPress={onAbstain}>
            <Text style={styles.abstainText}>
              Abstain
            </Text>
          </Pressable>
        </>
      )}

      {/* Vote log */}
      {votes.length > 0 && (
        <View style={styles.voteLog}>
          <Text style={styles.sectionTitle}>
            Votes ({votes.length})
          </Text>
          {votes.map((v, i) => {
            const voter = safeGetPlayer(v.voter_id);
            const target = safeGetPlayer(v.target_id);
            return (
              <VoteCard
                key={`${v.voter_id}-${i}`}
                voterName={voter?.player_name ?? v.voter_id}
                targetName={target?.player_name ?? v.target_id}
                isMayor={v.weight > 1}
                weight={v.weight}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

// TODO(Phase 5): Add MayorBadge component overlay on player grid
// TODO(LOW): Add vote confirmation dialog before casting

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function safeGetPlayer(id: string): PlayerRole | null {
  try {
    return PlayerState.getPlayer(id);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  zombieWarning: {
    color: "#2e7d32",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 12,
  },
  votedLabel: {
    color: "#43a047",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12,
  },
  gridScroll: {
    maxHeight: 220,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 12,
    gap: 12,
  },
  playerCell: {
    alignItems: "center",
    width: 72,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#16213e",
  },
  playerCellName: {
    color: "#ccc",
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
    width: 68,
  },
  abstainButton: {
    alignSelf: "center",
    marginTop: 16,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#666",
  },
  abstainText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
  },
  voteLog: {
    marginTop: 16,
    flex: 1,
  },
});
