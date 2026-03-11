/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { useVoting, tallyVotes } from "../../src/hooks/useVoting";
import type { Vote } from "../../src/types/game.types";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../src/engine/AIEngine");
jest.mock("../../src/engine/PhaseManager");
jest.mock("../../src/state/GameState");
jest.mock("../../src/state/PlayerState");
jest.mock("../../src/state/MemoryManager");

import * as AIEngine from "../../src/engine/AIEngine";
import * as PhaseManager from "../../src/engine/PhaseManager";
import * as GameState from "../../src/state/GameState";
import * as PlayerState from "../../src/state/PlayerState";
import * as MemoryManager from "../../src/state/MemoryManager";

const mockedAIEngine = AIEngine as jest.Mocked<typeof AIEngine>;
const mockedPhaseManager = PhaseManager as jest.Mocked<typeof PhaseManager>;
const mockedGameState = GameState as jest.Mocked<typeof GameState>;
const mockedPlayerState = PlayerState as jest.Mocked<typeof PlayerState>;
const mockedMemory = MemoryManager as jest.Mocked<typeof MemoryManager>;

beforeEach(() => {
  jest.clearAllMocks();

  mockedGameState.getState.mockReturnValue({
    day: 2,
    alive_player_ids: ["human", "ai_1", "ai_2", "ai_3"],
  } as any);

  mockedPlayerState.getHumanPlayer.mockReturnValue({
    player_id: "human",
    player_name: "Player",
    role: "Citizen",
    alignment: "Town",
    is_alive: true,
    is_zombie: false,
    is_revealed_mayor: false,
  } as any);

  mockedPlayerState.getPlayer.mockImplementation((id) => ({
    player_id: id,
    player_name: `Name_${id}`,
    role: "Citizen",
    alignment: "Town",
    is_alive: true,
    is_zombie: false,
    is_revealed_mayor: false,
  } as any));

  mockedAIEngine.runVoteTurn.mockReturnValue({
    votes: [
      { voter_id: "ai_1", target_id: "ai_2", weight: 1, day: 2 },
      { voter_id: "ai_3", target_id: "ai_2", weight: 1, day: 2 },
    ],
  });

  mockedPhaseManager.handleLynch.mockReturnValue(null);
  (mockedMemory.addVoteRecord as jest.Mock).mockImplementation(() => {});
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useVoting", () => {
  describe("initial state", () => {
    it("starts with empty votes", () => {
      const { result } = renderHook(() => useVoting());
      expect(result.current.votes).toEqual([]);
    });

    it("human has not voted", () => {
      const { result } = renderHook(() => useVoting());
      expect(result.current.hasHumanVoted).toBe(false);
    });

    it("AI votes not collected", () => {
      const { result } = renderHook(() => useVoting());
      expect(result.current.aiVotesCollected).toBe(false);
    });

    it("result is null", () => {
      const { result } = renderHook(() => useVoting());
      expect(result.current.result).toBeNull();
    });
  });

  describe("castVote", () => {
    it("adds human vote to votes array", () => {
      const { result } = renderHook(() => useVoting());

      act(() => {
        result.current.castVote("ai_2");
      });

      expect(result.current.votes).toHaveLength(1);
      expect(result.current.votes[0].voter_id).toBe("human");
      expect(result.current.votes[0].target_id).toBe("ai_2");
    });

    it("sets hasHumanVoted to true", () => {
      const { result } = renderHook(() => useVoting());

      act(() => {
        result.current.castVote("ai_2");
      });

      expect(result.current.hasHumanVoted).toBe(true);
    });

    it("cannot vote twice", () => {
      const { result } = renderHook(() => useVoting());

      act(() => {
        result.current.castVote("ai_2");
      });

      act(() => {
        result.current.castVote("ai_3");
      });

      expect(result.current.votes).toHaveLength(1);
    });

    it("zombie cannot vote", () => {
      mockedPlayerState.getHumanPlayer.mockReturnValue({
        player_id: "human",
        is_zombie: true,
        is_revealed_mayor: false,
      } as any);

      const { result } = renderHook(() => useVoting());

      act(() => {
        result.current.castVote("ai_2");
      });

      expect(result.current.votes).toHaveLength(0);
      expect(result.current.hasHumanVoted).toBe(false);
    });

    it("Mayor gets ×2 vote weight", () => {
      mockedPlayerState.getHumanPlayer.mockReturnValue({
        player_id: "human",
        is_zombie: false,
        is_revealed_mayor: true,
      } as any);

      const { result } = renderHook(() => useVoting());

      act(() => {
        result.current.castVote("ai_2");
      });

      expect(result.current.votes[0].weight).toBe(2);
    });

    it("non-Mayor gets ×1 vote weight", () => {
      const { result } = renderHook(() => useVoting());

      act(() => {
        result.current.castVote("ai_2");
      });

      expect(result.current.votes[0].weight).toBe(1);
    });
  });

  describe("abstain", () => {
    it("marks human as voted without adding a vote", () => {
      const { result } = renderHook(() => useVoting());

      act(() => {
        result.current.abstain();
      });

      expect(result.current.hasHumanVoted).toBe(true);
      expect(result.current.votes).toHaveLength(0);
    });

    it("cannot abstain twice", () => {
      const { result } = renderHook(() => useVoting());

      act(() => {
        result.current.abstain();
      });

      // Should silently ignore
      act(() => {
        result.current.abstain();
      });

      expect(result.current.hasHumanVoted).toBe(true);
    });
  });

  describe("resolveVoting", () => {
    it("collects AI votes and merges with human votes", () => {
      const { result } = renderHook(() => useVoting());

      act(() => {
        result.current.castVote("ai_2");
      });

      act(() => {
        result.current.resolveVoting();
      });

      // 1 human + 2 AI votes
      expect(result.current.votes).toHaveLength(3);
      expect(result.current.aiVotesCollected).toBe(true);
    });

    it("sets result with tallied votes", () => {
      const { result } = renderHook(() => useVoting());

      act(() => {
        result.current.castVote("ai_2");
      });

      act(() => {
        result.current.resolveVoting();
      });

      expect(result.current.result).not.toBeNull();
      expect(result.current.result!.tallies.length).toBeGreaterThan(0);
    });

    it("lynches when clear winner", () => {
      const { result } = renderHook(() => useVoting());

      act(() => {
        result.current.castVote("ai_2");
      });

      act(() => {
        result.current.resolveVoting();
      });

      // ai_2 has 3 votes (1 human + 2 AI)
      expect(result.current.result!.lynchedPlayer).not.toBeNull();
      expect(result.current.result!.lynchedPlayer!.player_id).toBe("ai_2");
    });

    it("no lynch on tie", () => {
      mockedAIEngine.runVoteTurn.mockReturnValue({
        votes: [
          { voter_id: "ai_1", target_id: "ai_2", weight: 1, day: 2 },
          { voter_id: "ai_3", target_id: "ai_4", weight: 1, day: 2 },
        ],
      });

      mockedPlayerState.getPlayer.mockImplementation((id) => ({
        player_id: id,
        player_name: `Name_${id}`,
      } as any));

      const { result } = renderHook(() => useVoting());

      // Human votes for ai_4 → tie between ai_2 (1) and ai_4 (2)
      // Actually: ai_2 gets 1 vote, ai_4 gets 1+1=2 → ai_4 wins
      // Let's set up a real tie:
      mockedAIEngine.runVoteTurn.mockReturnValue({
        votes: [
          { voter_id: "ai_1", target_id: "ai_3", weight: 1, day: 2 },
        ],
      });

      act(() => {
        result.current.castVote("ai_2");
      });

      act(() => {
        result.current.resolveVoting();
      });

      // ai_2: 1 vote, ai_3: 1 vote → tie → no lynch
      expect(result.current.result!.lynchedPlayer).toBeNull();
    });

    it("cannot resolve twice", () => {
      const { result } = renderHook(() => useVoting());

      act(() => {
        result.current.resolveVoting();
      });

      act(() => {
        result.current.resolveVoting();
      });

      expect(mockedAIEngine.runVoteTurn).toHaveBeenCalledTimes(1);
    });

    it("calls handleLynch when someone is lynched", () => {
      const { result } = renderHook(() => useVoting());

      act(() => {
        result.current.castVote("ai_2");
      });

      act(() => {
        result.current.resolveVoting();
      });

      expect(mockedPhaseManager.handleLynch).toHaveBeenCalledWith("ai_2");
    });

    it("includes win result from handleLynch", () => {
      const winResult = {
        winner: "Town" as const,
        co_winners: [],
        reason: "All Mafia eliminated",
      };
      mockedPhaseManager.handleLynch.mockReturnValue(winResult);

      const { result } = renderHook(() => useVoting());

      act(() => {
        result.current.castVote("ai_2");
      });

      act(() => {
        result.current.resolveVoting();
      });

      expect(result.current.result!.winResult).toEqual(winResult);
    });
  });
});

describe("tallyVotes", () => {
  it("tallies votes by target", () => {
    const votes: Vote[] = [
      { voter_id: "ai_1", target_id: "ai_2", weight: 1, day: 2 },
      { voter_id: "ai_3", target_id: "ai_2", weight: 1, day: 2 },
      { voter_id: "ai_4", target_id: "ai_5", weight: 1, day: 2 },
    ];

    mockedPlayerState.getPlayer.mockImplementation((id) => ({
      player_id: id,
      player_name: `Name_${id}`,
    } as any));

    const tallies = tallyVotes(votes);
    expect(tallies[0].targetId).toBe("ai_2");
    expect(tallies[0].totalWeight).toBe(2);
    expect(tallies[1].targetId).toBe("ai_5");
    expect(tallies[1].totalWeight).toBe(1);
  });

  it("sorts by weight descending", () => {
    const votes: Vote[] = [
      { voter_id: "ai_1", target_id: "ai_5", weight: 1, day: 2 },
      { voter_id: "ai_2", target_id: "ai_3", weight: 2, day: 2 },
    ];

    mockedPlayerState.getPlayer.mockImplementation((id) => ({
      player_id: id,
      player_name: `Name_${id}`,
    } as any));

    const tallies = tallyVotes(votes);
    expect(tallies[0].totalWeight).toBeGreaterThanOrEqual(tallies[1].totalWeight);
  });

  it("returns empty array for no votes", () => {
    expect(tallyVotes([])).toEqual([]);
  });

  it("handles Mayor ×2 weight", () => {
    const votes: Vote[] = [
      { voter_id: "human", target_id: "ai_2", weight: 2, day: 2 },
      { voter_id: "ai_1", target_id: "ai_3", weight: 1, day: 2 },
    ];

    mockedPlayerState.getPlayer.mockImplementation((id) => ({
      player_id: id,
      player_name: `Name_${id}`,
    } as any));

    const tallies = tallyVotes(votes);
    expect(tallies[0].targetId).toBe("ai_2");
    expect(tallies[0].totalWeight).toBe(2);
  });
});
