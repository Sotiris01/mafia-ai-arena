import {
  setLocale,
  getLocale,
  localize,
  formatPlayerName,
  formatPhase,
  formatRole,
  formatAlignment,
  formatTime,
  formatDeathMessage,
  formatVoteResult,
  formatEventTitle,
} from "../../src/utils/formatters";

beforeEach(() => {
  setLocale("en");
});

describe("formatters", () => {
  describe("setLocale / getLocale", () => {
    it("defaults to en", () => {
      expect(getLocale()).toBe("en");
    });

    it("switches to gr", () => {
      setLocale("gr");
      expect(getLocale()).toBe("gr");
    });
  });

  describe("localize", () => {
    const text = { en: "Hello", gr: "Γεια" };

    it("returns English when locale is en", () => {
      expect(localize(text)).toBe("Hello");
    });

    it("returns Greek when locale is gr", () => {
      setLocale("gr");
      expect(localize(text)).toBe("Γεια");
    });
  });

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
    it("formats day in English", () => {
      expect(formatPhase("day", 3)).toBe("Day 3");
    });

    it("formats night in English", () => {
      expect(formatPhase("night", 2)).toBe("Night 2");
    });

    it("formats day in Greek", () => {
      setLocale("gr");
      expect(formatPhase("day", 1)).toContain("1");
    });

    it("formats night in Greek", () => {
      setLocale("gr");
      expect(formatPhase("night", 1)).toContain("1");
    });
  });

  describe("formatRole", () => {
    it("returns role name unchanged", () => {
      expect(formatRole("Sheriff")).toBe("Sheriff");
      expect(formatRole("Godfather")).toBe("Godfather");
    });
  });

  describe("formatAlignment", () => {
    it("returns English labels when locale is en", () => {
      expect(formatAlignment("Town")).toBe("Town");
      expect(formatAlignment("Mafia")).toBe("Mafia");
      expect(formatAlignment("Neutral")).toBe("Neutral");
    });

    it("returns Greek labels when locale is gr", () => {
      setLocale("gr");
      expect(formatAlignment("Town")).toBe("Πόλη");
      expect(formatAlignment("Mafia")).toBe("Μαφία");
      expect(formatAlignment("Neutral")).toBe("Ουδέτεροι");
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
    it("returns English death message", () => {
      expect(formatDeathMessage("Alex")).toBe("Alex was found dead...");
    });

    it("returns Greek death message", () => {
      setLocale("gr");
      const result = formatDeathMessage("Alex");
      expect(result).toContain("Alex");
      expect(result).toContain("νεκρός");
    });
  });

  describe("formatVoteResult", () => {
    it("formats single vote in English", () => {
      expect(formatVoteResult("Alex", 1)).toBe("Alex: 1 vote");
    });

    it("formats plural votes in English", () => {
      expect(formatVoteResult("Alex", 3)).toBe("Alex: 3 votes");
    });

    it("formats votes in Greek", () => {
      setLocale("gr");
      const result = formatVoteResult("Alex", 2);
      expect(result).toContain("Alex");
      expect(result).toContain("2");
    });
  });

  describe("formatEventTitle", () => {
    it("returns localized event name", () => {
      const event = { name: { en: "Full Moon", gr: "Πανσέληνος" } };
      expect(formatEventTitle(event)).toBe("Full Moon");
      setLocale("gr");
      expect(formatEventTitle(event)).toBe("Πανσέληνος");
    });
  });
});
