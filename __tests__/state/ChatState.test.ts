import * as ChatState from "../../src/state/ChatState";
import type { ChatEvent, Message } from "../../src/types/chat.types";

function makeChatEvent(overrides: Partial<ChatEvent> = {}): ChatEvent {
  return {
    message_id: 1,
    speaker: "ai_1",
    action: "accuse",
    target: "ai_2",
    weight: 0.8,
    day: 1,
    raw_text: "I think ai_2 is Mafia!",
    indirect_targets: [],
    ...overrides,
  };
}

function makeMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: "msg_1",
    sender_id: "ai_1",
    sender_name: "Player 1",
    text: "Hello everyone",
    timestamp: Date.now(),
    channel: "public",
    is_human: false,
    ...overrides,
  };
}

beforeEach(() => {
  ChatState.reset();
});

describe("ChatState", () => {
  describe("addChatEvent / getAllEvents", () => {
    it("stores chat events", () => {
      ChatState.addChatEvent(makeChatEvent());
      ChatState.addChatEvent(makeChatEvent({ message_id: 2, action: "defend" }));
      expect(ChatState.getAllEvents()).toHaveLength(2);
    });
  });

  describe("addMessage / getMessagesByChannel", () => {
    it("stores and retrieves public messages", () => {
      ChatState.addMessage(makeMessage());
      ChatState.addMessage(makeMessage({ id: "msg_2", channel: "mafia" }));
      expect(ChatState.getMessagesByChannel("public")).toHaveLength(1);
      expect(ChatState.getMessagesByChannel("mafia")).toHaveLength(1);
    });
  });

  describe("getEventsByDay", () => {
    it("filters events by day number", () => {
      ChatState.addChatEvent(makeChatEvent({ day: 1 }));
      ChatState.addChatEvent(makeChatEvent({ message_id: 2, day: 1 }));
      ChatState.addChatEvent(makeChatEvent({ message_id: 3, day: 2 }));
      expect(ChatState.getEventsByDay(1)).toHaveLength(2);
      expect(ChatState.getEventsByDay(2)).toHaveLength(1);
      expect(ChatState.getEventsByDay(3)).toHaveLength(0);
    });
  });

  describe("getEventsForPlayer", () => {
    it("returns events where player is speaker", () => {
      ChatState.addChatEvent(makeChatEvent({ speaker: "ai_1", target: "ai_3" }));
      ChatState.addChatEvent(makeChatEvent({ message_id: 2, speaker: "ai_2", target: "ai_3" }));
      const events = ChatState.getEventsForPlayer("ai_1");
      expect(events).toHaveLength(1);
    });

    it("returns events where player is target", () => {
      ChatState.addChatEvent(makeChatEvent({ speaker: "ai_2", target: "ai_1" }));
      const events = ChatState.getEventsForPlayer("ai_1");
      expect(events).toHaveLength(1);
    });

    it("returns events where player is indirect target", () => {
      ChatState.addChatEvent(
        makeChatEvent({
          speaker: "ai_2",
          target: "ai_3",
          indirect_targets: [
            { player_id: "ai_1", relationship: "indirect_accuse", weight_modifier: 0.4 },
          ],
        }),
      );
      const events = ChatState.getEventsForPlayer("ai_1");
      expect(events).toHaveLength(1);
    });
  });

  describe("getRecentEvents", () => {
    it("returns last N events", () => {
      for (let i = 0; i < 10; i++) {
        ChatState.addChatEvent(makeChatEvent({ message_id: i }));
      }
      const recent = ChatState.getRecentEvents(3);
      expect(recent).toHaveLength(3);
      expect(recent[0].message_id).toBe(7);
      expect(recent[2].message_id).toBe(9);
    });

    it("returns all events if count > total", () => {
      ChatState.addChatEvent(makeChatEvent());
      expect(ChatState.getRecentEvents(5)).toHaveLength(1);
    });
  });

  describe("getRecentMessages", () => {
    it("returns last N messages for channel", () => {
      for (let i = 0; i < 5; i++) {
        ChatState.addMessage(makeMessage({ id: `pub_${i}`, channel: "public" }));
      }
      ChatState.addMessage(makeMessage({ id: "maf_1", channel: "mafia" }));
      const recent = ChatState.getRecentMessages("public", 2);
      expect(recent).toHaveLength(2);
      expect(recent[0].id).toBe("pub_3");
    });
  });

  describe("reset", () => {
    it("clears all chat data", () => {
      ChatState.addChatEvent(makeChatEvent());
      ChatState.addMessage(makeMessage());
      ChatState.reset();
      expect(ChatState.getAllEvents()).toHaveLength(0);
      expect(ChatState.getMessagesByChannel("public")).toHaveLength(0);
    });
  });
});
