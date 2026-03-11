// =============================================================================
// FILE: AIEngine.ts
// PURPOSE: AI Decision Engine orchestrator — coordinates all AI modules
//          for each AI player's turn
// LOCATION: src/engine/AIEngine.ts
// =============================================================================

// Orchestration flow per AI player:
//   Discussion: SpeakProbability → MessageGenerator → ChatAnalyzer
//   Voting:     VoteDecision → collect votes
//   Night:      NightDecision → collect targets (Phase 5)
//
// Supports 19 roles × 6 personalities × 3 perception levels.

import type { Message, ActionType } from "../types/chat.types";
import type { Vote } from "../types/game.types";
import type { SpeakContext } from "../ai/SpeakProbability";
import type { VoteContext } from "../ai/VoteDecision";
import { shouldSpeak } from "../ai/SpeakProbability";
import { generateMessage } from "../ai/MessageGenerator";
import { decideVote, getVoteTiming } from "../ai/VoteDecision";
import { analyzeAIMessage } from "./ChatAnalyzer";
import * as PlayerState from "../state/PlayerState";
import * as GameState from "../state/GameState";
import * as ChatState from "../state/ChatState";
import { shuffleArray, randomInt } from "../utils/probability";
import configData from "../data/config.json";
import type { AIConfig, DiscussionSizeConfig } from "../types/game.types";

const aiConfig = (configData as Record<string, unknown>).ai as AIConfig;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DiscussionResult {
  /** Messages generated during this discussion round */
  messages: Message[];
  /** Total messages sent (including human messages already in ChatState) */
  totalMessageCount: number;
}

export interface VoteResult {
  /** All AI votes collected */
  votes: Vote[];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Run one round of discussion: iterate all alive AI players in random order,
 * check if each should speak, generate and analyze their message.
 *
 * Returns all messages generated this round. The caller (useChat hook)
 * can feed them into the UI one by one with delays.
 */
export async function runDiscussionRound(): Promise<DiscussionResult> {
  const aiPlayers = getAIPlayerOrder();
  const messages: Message[] = [];
  const maxMessages = getMaxMessages();
  const currentMessageCount = ChatState.getRecentEvents(1000).length;

  // Stop if we've already hit the max for this game size
  if (currentMessageCount >= maxMessages) {
    return { messages, totalMessageCount: currentMessageCount };
  }

  for (const playerId of aiPlayers) {
    // Check if the player is still alive (could have been lynched mid-round)
    if (!GameState.isPlayerAlive(playerId)) continue;

    const context: SpeakContext = {
      messageCount: currentMessageCount + messages.length,
    };

    if (!shouldSpeak(playerId, context)) continue;

    // Stop before exceeding max messages
    if (currentMessageCount + messages.length >= maxMessages) break;

    const message = await generateMessage(playerId);

    // Stagger timestamps so messages don't all show the same HH:MM.
    // Each successive message is offset by 15–60 seconds.
    const staggerMs = (messages.length + 1) * randomInt(15, 60) * 1000;
    message.timestamp = message.timestamp + staggerMs;

    messages.push(message);

    // Analyze the AI's own message to create a ChatEvent
    // We know the action type from the message generation context
    // but MessageGenerator doesn't expose it directly, so we
    // extract it from the template provider's classification
    analyzeAIMessageFromGenerated(message);
  }

  return {
    messages,
    totalMessageCount: currentMessageCount + messages.length,
  };
}

/**
 * Collect AI votes during the voting sub-phase.
 * Each AI player decides who to vote for independently.
 * Votes are returned sorted by timing (early voters first).
 */
export function runVoteTurn(): VoteResult {
  const aiPlayers = getAIPlayerOrder();
  const day = GameState.getState().day;
  const collectedVotes: Vote[] = [];

  // Sort AI players by their voting_style timing
  const timedPlayers = aiPlayers.map((id) => {
    const personality = PlayerState.getPersonality(id);
    return {
      id,
      timing: getVoteTiming(personality.voting_style),
    };
  });
  timedPlayers.sort((a, b) => a.timing - b.timing);

  for (const { id } of timedPlayers) {
    // Skip dead or zombie players
    if (!GameState.isPlayerAlive(id)) continue;
    const player = PlayerState.getPlayer(id);
    if (player.is_zombie) continue;

    const context: VoteContext = {
      currentVotes: [...collectedVotes],
    };

    const targetId = decideVote(id, context);
    if (targetId) {
      const vote: Vote = {
        voter_id: id,
        target_id: targetId,
        weight: 1, // TODO(Phase 5): Mayor ×2 weight applied in useVoting
        day,
      };
      collectedVotes.push(vote);
    }
  }

  return { votes: collectedVotes };
}

// TODO(Phase 5): Implement runNightAction(playerId) — night target selection
// TODO(Phase 5): Implement runEventReaction(playerId, event) — Night Echo reactions

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get all alive AI player IDs in random order */
export function getAIPlayerOrder(): string[] {
  const aliveIds = GameState.getState().alive_player_ids.filter(
    (id) => id !== "human",
  );
  return shuffleArray([...aliveIds]);
}

/**
 * Determine maximum messages for the current game size.
 * Uses config.json ai.max_messages_per_discussion.
 */
function getMaxMessages(): number {
  const aliveCount = GameState.getAliveCount();
  const sizeConfigs = aiConfig.max_messages_per_discussion;

  for (const config of Object.values(sizeConfigs)) {
    const sizeConfig = config as unknown as DiscussionSizeConfig;
    if (aliveCount >= sizeConfig.min_players && aliveCount <= sizeConfig.max_players) {
      return randomInt(sizeConfig.min_messages, sizeConfig.max_messages);
    }
  }

  // Default fallback for edge cases
  return 12;
}

/**
 * Analyze an AI-generated message. Since MessageGenerator doesn't expose
 * the action type through the Message object, we use keyword-based
 * classification from ChatAnalyzer (same approach as TemplateProvider).
 */
function analyzeAIMessageFromGenerated(message: Message): void {
  // Use a simplified analysis — the ChatAnalyzer will classify
  // the text and extract targets
  const { classifyAction, identifyTarget } = require("./ChatAnalyzer") as typeof import("./ChatAnalyzer");
  const action = classifyAction(message.text);
  const targetId = identifyTarget(message.text);

  analyzeAIMessage(message.text, message.sender_id, action, targetId);
}
