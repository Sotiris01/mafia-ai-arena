/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { useChat, resetMessageCounter } from "../../src/hooks/useChat";
import * as ChatState from "../../src/state/ChatState";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../src/state/ChatState");
jest.mock("../../src/state/GameState");
jest.mock("../../src/engine/ChatAnalyzer");
jest.mock("../../src/engine/AIEngine");

const mockedChatState = ChatState as jest.Mocked<typeof ChatState>;

beforeEach(() => {
  jest.clearAllMocks();
  resetMessageCounter();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useChat", () => {
  describe("initial state", () => {
    it("starts with empty messages", () => {
      const { result } = renderHook(() => useChat());
      expect(result.current.messages).toEqual([]);
    });

    it("defaults to public channel", () => {
      const { result } = renderHook(() => useChat());
      expect(result.current.channel).toBe("public");
    });

    it("uses provided channel", () => {
      const { result } = renderHook(() => useChat("mafia"));
      expect(result.current.channel).toBe("mafia");
    });
  });

  describe("sendMessage", () => {
    it("adds a message to local state", () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.sendMessage("Hello everyone!");
      });

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].text).toBe("Hello everyone!");
    });

    it("creates message with correct fields", () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.sendMessage("Test message");
      });

      const msg = result.current.messages[0];
      expect(msg.sender_id).toBe("human");
      expect(msg.sender_name).toBe("Player");
      expect(msg.channel).toBe("public");
      expect(msg.is_human).toBe(true);
      expect(msg.id).toMatch(/^msg_\d+$/);
      expect(typeof msg.timestamp).toBe("number");
    });

    it("uses the correct channel for messages", () => {
      const { result } = renderHook(() => useChat("mafia"));

      act(() => {
        result.current.sendMessage("Mafia secret");
      });

      expect(result.current.messages[0].channel).toBe("mafia");
    });

    it("persists message to ChatState", () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.sendMessage("Hello");
      });

      expect(mockedChatState.addMessage).toHaveBeenCalledTimes(1);
      expect(mockedChatState.addMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          text: "Hello",
          sender_id: "human",
          channel: "public",
        }),
      );
    });

    it("trims whitespace from messages", () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.sendMessage("  trimmed message  ");
      });

      expect(result.current.messages[0].text).toBe("trimmed message");
    });

    it("ignores empty messages", () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.sendMessage("");
      });

      expect(result.current.messages).toHaveLength(0);
      expect(mockedChatState.addMessage).not.toHaveBeenCalled();
    });

    it("ignores whitespace-only messages", () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.sendMessage("   ");
      });

      expect(result.current.messages).toHaveLength(0);
    });

    it("assigns sequential message IDs", () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.sendMessage("First");
      });
      act(() => {
        result.current.sendMessage("Second");
      });
      act(() => {
        result.current.sendMessage("Third");
      });

      expect(result.current.messages[0].id).toBe("msg_1");
      expect(result.current.messages[1].id).toBe("msg_2");
      expect(result.current.messages[2].id).toBe("msg_3");
    });

    it("accumulates messages over time", () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.sendMessage("Message 1");
      });
      act(() => {
        result.current.sendMessage("Message 2");
      });

      expect(result.current.messages).toHaveLength(2);
    });
  });

  describe("resetMessageCounter", () => {
    it("resets ID counter for new game", () => {
      const { result } = renderHook(() => useChat());

      act(() => {
        result.current.sendMessage("Before reset");
      });
      expect(result.current.messages[0].id).toBe("msg_1");

      resetMessageCounter();

      act(() => {
        result.current.sendMessage("After reset");
      });
      expect(result.current.messages[1].id).toBe("msg_1");
    });
  });
});
