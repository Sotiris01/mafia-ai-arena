import {
  formatPlayerName,
  formatPhase,
  formatRole,
  formatAlignment,
  formatTime,
  formatDeathMessage,
  formatVoteResult,
  formatEventTitle,
} from "../../src/utils/formatters";

describe("formatters", () => {
  describe("formatPlayerName", () => {
    it("returns plain name for alive non-zombie", () => {
      expect(formatPlayerName("Alex", { is_alive: true, is_zombie: false })).toBe("Alex");
    });

    it("prefixes skull for dead player", () => {
      const result = formatPlayerName("Alex", { is_alive: false, is_zombie: false });
      expect(result).toContain("Alex");
      expect(result).toContain("\u{1F480}");
    });

    it("prefixes zombie emoji for zombie player", () => {
      const result = formatPlayerName("Alex", { is_alive: true, is_zombie: true });
      expect(result).toContain("Alex");
      expect(result).toContain("\u{1F9DF}");
    });
  });

  describe("formatPhase", () => {
    it("formats day", () => {
      expect(formatPhase("day", 3)).toBe("Day 3");
    });

    it("formats night", () => {
      expect(formatPhase("night", 2)).toBe("Night 2");
    });
  });

  describe("formatRole", () => {
    it("returns role name unchanged", () => {
      expect(formatRole("Sheriff")).toBe("Sheriff");
      expect(formatRole("Godfather")).toBe("Godfather");
    });
  });

  describe("formatAlignment", () => {
    it("returns correct labels", () => {
      expect(formatAlignment("Town")).toBe("Town");
      expect(formatAlignment("Mafia")).toBe("Mafia");
      expect(formatAlignment("Neutral")).toBe("Neutral");
    });
  });

  describe("formatTime", () => {
    it("formats 90 seconds as 1:30", () => {
      expect(formatTime(90)).toBe("1:30");
    });

    it("formats 0 seconds as 0:00", () => {
      expect(formatTime(0)).toBe("0:00");
    });

    it("pads single-digit seconds", () => {
      expect(formatTime(5)).toBe("0:05");
    });

    it("formats exact minutes", () => {
      expect(formatTime(120)).toBe("2:00");
    });
  });

  describe("formatDeathMessage", () => {
    it("returns death message", () => {
      expect(formatDeathMessage("Alex")).toBe("Alex was found dead...");
    });
  });

  describe("formatVoteResult", () => {
    it("formats single vote", () => {
      expect(formatVoteResult("Alex", 1)).toBe("Alex: 1 vote");
    });

    it("formats plural votes", () => {
      expect(formatVoteResult("Alex", 3)).toBe("Alex: 3 votes");
    });
  });

  describe("formatEventTitle", () => {
    it("returns event name", () => {
      const event = { name: "Full Moon" };
      expect(formatEventTitle(event)).toBe("Full Moon");
    });
  });
});
