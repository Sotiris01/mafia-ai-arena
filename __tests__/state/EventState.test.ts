import * as EventState from "../../src/state/EventState";
import type { NightEchoEvent, LastWish } from "../../src/types/event.types";

const mockNightEcho: NightEchoEvent = {
  id: "E01",
  name: { en: "Whispers in the Dark", gr: "Ψίθυροι στο Σκοτάδι" },
  description_template: { en: "Someone whispers a name...", gr: "Κάποιος ψιθυρίζει ένα όνομα..." },
  probability: 0.30,
  suspicion_weight: 0.5,
  linked_roles: ["Sheriff"],
  timing: "morning",
  trigger_condition: "always",
};

const mockLastWish: LastWish = {
  lynched_player_id: "ai_1",
  action: "reveal_evidence",
  target_id: "ai_2",
  day: 2,
};

beforeEach(() => {
  EventState.reset();
});

describe("EventState", () => {
  describe("addPendingEvent / getUndelivered", () => {
    it("stores a pending event", () => {
      EventState.addPendingEvent({
        event: mockNightEcho,
        timing: "morning",
        night: 1,
      });
      expect(EventState.getUndelivered()).toHaveLength(1);
    });

    it("marks event as not delivered by default", () => {
      const pending = EventState.addPendingEvent({
        event: mockNightEcho,
        timing: "morning",
        night: 1,
      });
      expect(pending.delivered).toBe(false);
    });
  });

  describe("getPendingByTiming", () => {
    it("filters by timing", () => {
      EventState.addPendingEvent({ event: mockNightEcho, timing: "morning", night: 1 });
      EventState.addPendingEvent({
        event: { ...mockNightEcho, id: "E02" as any, timing: "midday" },
        timing: "midday",
        night: 1,
      });

      expect(EventState.getPendingByTiming("morning")).toHaveLength(1);
      expect(EventState.getPendingByTiming("midday")).toHaveLength(1);
    });

    it("excludes delivered events", () => {
      EventState.addPendingEvent({ event: mockNightEcho, timing: "morning", night: 1 });
      EventState.markDelivered(0);
      expect(EventState.getPendingByTiming("morning")).toHaveLength(0);
    });
  });

  describe("markDelivered", () => {
    it("marks event as delivered by index", () => {
      EventState.addPendingEvent({ event: mockNightEcho, timing: "morning", night: 1 });
      EventState.markDelivered(0);
      expect(EventState.getUndelivered()).toHaveLength(0);
    });

    it("ignores invalid index", () => {
      EventState.addPendingEvent({ event: mockNightEcho, timing: "morning", night: 1 });
      EventState.markDelivered(99); // should not throw
      expect(EventState.getUndelivered()).toHaveLength(1);
    });
  });

  describe("Last Wish", () => {
    it("stores and retrieves Last Wish", () => {
      EventState.setLastWish(mockLastWish);
      expect(EventState.getLastWish()).toEqual(mockLastWish);
    });

    it("returns null when no Last Wish", () => {
      expect(EventState.getLastWish()).toBeNull();
    });

    it("clears Last Wish", () => {
      EventState.setLastWish(mockLastWish);
      EventState.clearLastWish();
      expect(EventState.getLastWish()).toBeNull();
    });
  });

  describe("clearDeliveredEvents", () => {
    it("removes delivered events, keeps undelivered", () => {
      EventState.addPendingEvent({ event: mockNightEcho, timing: "morning", night: 1 });
      EventState.addPendingEvent({
        event: { ...mockNightEcho, id: "E02" as any },
        timing: "midday",
        night: 1,
      });
      EventState.markDelivered(0);
      EventState.clearDeliveredEvents();
      expect(EventState.getUndelivered()).toHaveLength(1);
    });
  });

  describe("clearNightEvents", () => {
    it("removes all pending events", () => {
      EventState.addPendingEvent({ event: mockNightEcho, timing: "morning", night: 1 });
      EventState.addPendingEvent({ event: mockNightEcho, timing: "midday", night: 1 });
      EventState.clearNightEvents();
      expect(EventState.getUndelivered()).toHaveLength(0);
    });
  });

  describe("reset", () => {
    it("clears all events and Last Wish", () => {
      EventState.addPendingEvent({ event: mockNightEcho, timing: "morning", night: 1 });
      EventState.setLastWish(mockLastWish);
      EventState.reset();
      expect(EventState.getUndelivered()).toHaveLength(0);
      expect(EventState.getLastWish()).toBeNull();
    });
  });
});
