// =============================================================================
// FILE: SettingsContext.tsx
// PURPOSE: React context for user settings with AsyncStorage persistence
// LOCATION: src/contexts/SettingsContext.tsx
// =============================================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../data/config.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AppSettings {
  /** Default player count for lobby */
  defaultPlayerCount: number;
}

export interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetToDefaults: () => void;
  isLoaded: boolean;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const STORAGE_KEY = "mafia_settings";

const DEFAULT_SETTINGS: AppSettings = {
  defaultPlayerCount: 10,
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const SettingsContext = createContext<SettingsContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<AppSettings>;
          setSettings((prev) => ({ ...prev, ...parsed }));
        }
      })
      .catch(() => {
        // Silently fall back to defaults
      })
      .finally(() => setIsLoaded(true));
  }, []);

  // Persist to AsyncStorage whenever settings change (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch(() => {
      // Silently ignore write errors
    });
  }, [settings, isLoaded]);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, resetToDefaults, isLoaded }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Consumer hook
// ---------------------------------------------------------------------------

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within a <SettingsProvider>");
  }
  return ctx;
}

// TODO(Phase 4): Add timer duration overrides (discussion, trial, vote, night)
// TODO(Phase 6): Add AI provider selector (Template / API / Local)
// TODO(Phase 6): Add API key field (stored via expo-secure-store, not here)
// TODO(LOW): Add game speed multiplier (affects all timers proportionally)
