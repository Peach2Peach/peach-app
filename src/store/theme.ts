import { Appearance } from "react-native";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createStorage } from "../utils/storage/createStorage";
import { createPersistStorage } from "./createPersistStorage";

export const THEME_PREFERENCES = ["light", "dark", "system"] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

/** Wider than RN's exported ColorSchemeName, which excludes null/undefined. */
export type SystemColorScheme = ReturnType<typeof Appearance.getColorScheme>;

const DEFAULT_THEME_PREFERENCE: ThemePreference = "system";

export const resolveIsDarkMode = (
  preference: ThemePreference,
  systemColorScheme: SystemColorScheme = Appearance.getColorScheme(),
) =>
  preference === "system" ? systemColorScheme === "dark" : preference === "dark";

type ThemeState = {
  themePreference: ThemePreference;
  /**
   * The scheme actually rendered. Derived from themePreference plus the device
   * scheme, never persisted — useThemeSync keeps it in step with the device.
   */
  isDarkMode: boolean;
  setThemePreference: (preference: ThemePreference) => void;
  cycleThemePreference: () => void;
  setSystemColorScheme: (systemColorScheme: SystemColorScheme) => void;
};

/** Only the preference is written to storage; isDarkMode is always derived. */
type PersistedThemeState = { themePreference: ThemePreference };

/** v0 stored a single boolean toggle, with no way to follow the device. */
type ThemeStateV0 = { isDarkMode: boolean };

const themeStorage = createStorage("theme");
const storage = createPersistStorage<PersistedThemeState>(themeStorage);

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themePreference: DEFAULT_THEME_PREFERENCE,
      isDarkMode: resolveIsDarkMode(DEFAULT_THEME_PREFERENCE),

      setThemePreference: (themePreference) =>
        set({ themePreference, isDarkMode: resolveIsDarkMode(themePreference) }),

      cycleThemePreference: () => {
        const next =
          THEME_PREFERENCES[
            (THEME_PREFERENCES.indexOf(get().themePreference) + 1) %
              THEME_PREFERENCES.length
          ];
        set({ themePreference: next, isDarkMode: resolveIsDarkMode(next) });
      },

      setSystemColorScheme: (systemColorScheme) => {
        const isDarkMode = resolveIsDarkMode(
          get().themePreference,
          systemColorScheme,
        );
        if (isDarkMode !== get().isDarkMode) set({ isDarkMode });
      },
    }),
    {
      name: "theme",
      version: 1,
      storage,
      partialize: ({ themePreference }): PersistedThemeState => ({
        themePreference,
      }),
      migrate: (persistedState, version): PersistedThemeState => {
        if (version === 0) {
          // Hydration writes back to storage, so every existing install has a
          // v0 entry even if the user never opened the setting. Mapping it to
          // an explicit scheme keeps their appearance unchanged on update —
          // "system" is the default for fresh installs only.
          const { isDarkMode } = persistedState as ThemeStateV0;
          return { themePreference: isDarkMode ? "dark" : "light" };
        }
        return persistedState as PersistedThemeState;
      },
      // Runs before the hydrated state is set, so isDarkMode is already correct
      // on the first render after hydration rather than a frame later.
      merge: (persistedState, currentState) => {
        const themePreference =
          (persistedState as PersistedThemeState | undefined)?.themePreference ??
          currentState.themePreference;
        return {
          ...currentState,
          themePreference,
          isDarkMode: resolveIsDarkMode(themePreference),
        };
      },
    },
  ),
);
