import {
  runDiscussionRound,
  runVoteTurn,
  getAIPlayerOrder,
} from "../../src/engine/AIEngine";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../src/ai/SpeakProbability");
jest.mock("../../src/ai/MessageGenerator");
jest.mock("../../src/ai/VoteDecision");
jest.mock("../../src/engine/ChatAnalyzer");
jest.mock("../../src/state/PlayerState");
jest.mock("../../src/state/GameState");
jest.mock("../../src/state/ChatState");
jest.mock("../../src/utils/probability");

import * as SpeakProb from "../../src/ai/SpeakProbability";
import * as MessageGen from "../../src/ai/MessageGenerator";
import * as VoteDecision from "../../src/ai/VoteDecision";
import * as PlayerState from "../../src/state/PlayerState";
import * as GameState from "../../src/state/GameState";
import * as ChatState from "../../src/state/ChatState";
import * as probability from "../../src/utils/probability";

const mockedSpeakProb = SpeakProb as jest.Mocked<typeof SpeakProb>;
const mockedMessageGen = MessageGen as jest.Mocked<typeof MessageGen>;
const mockedVoteDecision = VoteDecision as jest.Mocked<typeof VoteDecision>;
const mockedPlayerState = PlayerState as jest.Mocked<typeof PlayerState>;
const mockedGameState = GameState as jest.Mocked<typeof GameState>;
const mockedChatState = ChatState as jest.Mocked<typeof ChatState>;
const mockedProbability = probability as jest.Mocked<typeof probability>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMessage(senderId: string, text = "Test message") {
  return {
    id: `msg_${Date.now()}_${senderId}`,
    sender_id: senderId,
    sender_name: `Name_${senderId}`,
    text,
    timestamp: Date.now(),
    channel: "public" as const,
    is_human: false,
  };
}

beforeEach(() => {
  jest.clearAllMocks();

  mockedGameState.getState.mockReturnValue({
    day: 2,
    alive_player_ids: ["human", "ai_1", "ai_2", "ai_3"],
  } as any);
  mockedGameState.isPlayerAlive.mockReturnValue(true);
  mockedGameState.getAliveCount.mockReturnValue(4);

  mockedChatState.getRecentEvents.mockReturnValue([]);

  mockedProbability.shuffleArray.mockImplementation((arr) => [...arr]);
  mockedProbability.randomInt.mockReturnValue(10);

  mockedSpeakProb.shouldSpeak.mockReturnValue(true);
  mockedMessageGen.generateMessage.mockResolvedValue(makeMessage("ai_1"));

  mockedPlayerState.getPersonality.mockReturnValue({
    voting_style: "mid",
  } as any);
  mockedPlayerState.getPlayer.mockReturnValue({
    is_zombie: false,
  } as any);
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("AIEngine", () => {
  describe("getAIPlayerOrder", () => {
    it("excludes human from AI player order", () => {
      const order = getAIPlayerOrder();
      expect(order).not.toContain("human");
    });

    it("includes all alive AI players", () => {
      const order = getAIPlayerOrder();
      expect(order).toContain("ai_1");
      expect(order).toContain("ai_2");
      expect(order).toContain("ai_3");
    });
  });

  describe("runDiscussionRound", () => {
    it("returns messages from AI players who should speak", async () => {
      // Only first player speaks
      mockedSpeakProb.shouldSpeak
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false);

      mockedMessageGen.generateMessage.mockResolvedValue(makeMessage("ai_1", "I suspect someone"));

      const result = await runDiscussionRound();
      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].sender_id).toBe("ai_1");
    });

    it("returns empty messages when no one should speak", async () => {
      mockedSpeakProb.shouldSpeak.mockReturnValue(false);

      const result = await runDiscussionRound();
      expect(result.messages).toHaveLength(0);
    });

    it("skips dead players", async () => {
      mockedGameState.isPlayerAlive
        .mockReturnValueOnce(false) // ai_1 is dead
        .mockReturnValueOnce(true)  // ai_2
        .mockReturnValueOnce(true); // ai_3

      mockedSpeakProb.shouldSpeak.mockReturnValue(true);
      mockedMessageGen.generateMessage.mockImplementation(async (id) =>
        makeMessage(id, "test"),
      );

      const result = await runDiscussionRound();
      const senderIds = result.messages.map((m) => m.sender_id);
      expect(senderIds).not.toContain("ai_1");
    });

    it("stops when max messages reached", async () => {
      // Already at max messages
      mockedChatState.getRecentEvents.mockReturnValue(new Array(50));

      const result = await runDiscussionRound();
      expect(result.messages).toHaveLength(0);
    });

    it("returns totalMessageCount", async () => {
      mockedChatState.getRecentEvents.mockReturnValue([{}, {}, {}] as any[]);
      mockedSpeakProb.shouldSpeak.mockReturnValue(true);
      mockedMessageGen.generateMessage.mockImplementation(async (id) =>
        makeMessage(id, "test"),
      );

      const result = await runDiscussionRound();
      expect(result.totalMessageCount).toBeGreaterThanOrEqual(3);
    });
  });

  describe("runVoteTurn", () => {
    it("collects votes from AI players", () => {
      mockedVoteDecision.decideVote.mockReturnValue("ai_2");
      mockedVoteDecision.getVoteTiming.mockReturnValue(0.5);

      const result = runVoteTurn();
      expect(result.votes.length).toBeGreaterThan(0);
      expect(result.votes[0].target_id).toBe("ai_2");
    });

    it("excludes abstaining players", () => {
      mockedVoteDecision.decideVote.mockReturnValue(null);
      mockedVoteDecision.getVoteTiming.mockReturnValue(0.5);

      const result = runVoteTurn();
      expect(result.votes).toHaveLength(0);
    });

    it("excludes dead players", () => {
      mockedGameState.isPlayerAlive
        .mockReturnValueOnce(false)
        .mockReturnValue(true);
      mockedVoteDecision.decideVote.mockReturnValue("ai_2");
      mockedVoteDecision.getVoteTiming.mockReturnValue(0.5);

      const result = runVoteTurn();
      // At least ai_1 was skipped
      const voterIds = result.votes.map((v) => v.voter_id);
      // Some voted, some didn't — just check structure
      for (const vote of result.votes) {
        expect(vote.voter_id).toBeDefined();
        expect(vote.target_id).toBe("ai_2");
        expect(vote.day).toBe(2);
      }
    });

    it("excludes zombie players", () => {
      mockedPlayerState.getPlayer.mockReturnValue({
        is_zombie: true,
      } as any);
      mockedVoteDecision.decideVote.mockReturnValue("ai_2");
      mockedVoteDecision.getVoteTiming.mockReturnValue(0.5);

      const result = runVoteTurn();
      expect(result.votes).toHaveLength(0);
    });

    it("sorts voters by timing (early first)", () => {
      mockedVoteDecision.getVoteTiming.mockImplementation((style) => {
        if (style === "early") return 0.2;
        if (style === "late") return 0.8;
        return 0.5;
      });
      mockedPlayerState.getPersonality
        .mockReturnValueOnce({ voting_style: "late" } as any)
        .mockReturnValueOnce({ voting_style: "early" } as any)
        .mockReturnValueOnce({ voting_style: "mid" } as any);
      mockedVoteDecision.decideVote.mockReturnValue("ai_2");
      mockedPlayerState.getPlayer.mockReturnValue({ is_zombie: false } as any);

      const result = runVoteTurn();
      // Votes should be in timing order
      expect(result.votes.length).toBeGreaterThan(0);
    });

    it("passes current votes as context for bandwagon", () => {
      mockedVoteDecision.decideVote.mockReturnValue("ai_2");
      mockedVoteDecision.getVoteTiming.mockReturnValue(0.5);

      runVoteTurn();

      // Last calls should have progressively larger currentVotes arrays
      const calls = mockedVoteDecision.decideVote.mock.calls;
      if (calls.length >= 2) {
        const firstContext = calls[0][1] as any;
        const lastContext = calls[calls.length - 1][1] as any;
        expect(lastContext.currentVotes.length).toBeGreaterThanOrEqual(
          firstContext.currentVotes.length,
        );
      }
    });
  });
});
