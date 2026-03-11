/**
 * @jest-environment jsdom
 */

import React from "react";
import { renderHook, act } from "@testing-library/react";

// waitFor is re-exported from @testing-library/dom
const { waitFor } = require("@testing-library/react") as { waitFor: (cb: () => void) => Promise<void> };
import {
  SettingsProvider,
  useSettings,
  type AppSettings,
} from "../../src/contexts/SettingsContext";

// ---------------------------------------------------------------------------
// AsyncStorage mock
// ---------------------------------------------------------------------------

const mockStorage: Record<string, string> = {};

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn((key: string) => Promise.resolve(mockStorage[key] ?? null)),
  setItem: jest.fn((key: string, value: string) => {
    mockStorage[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key: string) => {
    delete mockStorage[key];
    return Promise.resolve();
  }),
}));

// Suppress config.json import issue (if any)
jest.mock("../../src/data/config.json", () => ({
  total_players: { min: 7, max: 16 },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function wrapper({ children }: { children: React.ReactNode }) {
  return <SettingsProvider>{children}</SettingsProvider>;
}

const DEFAULT_SETTINGS: AppSettings = {
  defaultPlayerCount: 10,
};

beforeEach(() => {
  // Clear mock storage
  for (const key of Object.keys(mockStorage)) {
    delete mockStorage[key];
  }
  jest.clearAllMocks();
});

// Suppress React act() warnings from async useEffect in SettingsProvider
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("not wrapped in act")) return;
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("SettingsContext", () => {
  describe("useSettings outside provider", () => {
    it("throws when used outside SettingsProvider", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        renderHook(() => useSettings());
      }).toThrow("useSettings must be used within a <SettingsProvider>");

      spy.mockRestore();
    });
  });

  describe("default settings", () => {
    it("provides default settings on first load", async () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
    });

    it("sets defaultPlayerCount to 10 by default", async () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      await waitFor(() => expect(result.current.isLoaded).toBe(true));
      expect(result.current.settings.defaultPlayerCount).toBe(10);
    });
  });

  describe("updateSettings", () => {
    it("updates defaultPlayerCount", async () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.updateSettings({ defaultPlayerCount: 14 });
      });

      expect(result.current.settings.defaultPlayerCount).toBe(14);
    });

    it("partially updates settings (preserves other fields)", async () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.updateSettings({ defaultPlayerCount: 14 });
      });

      expect(result.current.settings.defaultPlayerCount).toBe(14);
    });

    it("persists settings to AsyncStorage", async () => {
      const AsyncStorage = require("@react-native-async-storage/async-storage");
      const { result } = renderHook(() => useSettings(), { wrapper });

      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.updateSettings({ defaultPlayerCount: 14 });
      });

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          "mafia_settings",
          expect.stringContaining('"defaultPlayerCount":14'),
        );
      });
    });
  });

  describe("resetToDefaults", () => {
    it("restores all settings to defaults", async () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      // Change settings first
      act(() => {
        result.current.updateSettings({ defaultPlayerCount: 16 });
      });
      expect(result.current.settings.defaultPlayerCount).toBe(16);

      // Reset
      act(() => {
        result.current.resetToDefaults();
      });

      expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe("AsyncStorage loading", () => {
    it("loads saved settings from AsyncStorage on mount", async () => {
      const saved: AppSettings = { defaultPlayerCount: 12 };
      mockStorage["mafia_settings"] = JSON.stringify(saved);

      const { result } = renderHook(() => useSettings(), { wrapper });

      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      expect(result.current.settings.defaultPlayerCount).toBe(12);
    });

    it("merges partial saved data with defaults", async () => {
      mockStorage["mafia_settings"] = JSON.stringify({ defaultPlayerCount: 8 });

      const { result } = renderHook(() => useSettings(), { wrapper });

      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      expect(result.current.settings.defaultPlayerCount).toBe(8);
    });

    it("falls back to defaults when AsyncStorage is empty", async () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
    });

    it("falls back to defaults on AsyncStorage read error", async () => {
      const AsyncStorage = require("@react-native-async-storage/async-storage");
      AsyncStorage.getItem.mockRejectedValueOnce(new Error("Storage error"));

      const { result } = renderHook(() => useSettings(), { wrapper });

      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe("isLoaded flag", () => {
    it("starts as false before async load completes", () => {
      const { result } = renderHook(() => useSettings(), { wrapper });
      // Before the async getItem resolves
      expect(result.current.isLoaded).toBe(false);
    });

    it("becomes true after load completes", async () => {
      const { result } = renderHook(() => useSettings(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });
    });
  });
});
