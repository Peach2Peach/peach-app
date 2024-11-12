import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false, // Default to light mode

  // Toggle and persist theme
  toggleTheme: async () => {
    set((state) => {
      const newTheme = !state.isDarkMode;
      AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
      return { isDarkMode: newTheme };
    });
  },

  // Set theme directly and persist
  setDarkMode: (isDark: boolean) => {
    set({ isDarkMode: isDark });
    AsyncStorage.setItem("theme", isDark ? "dark" : "light");
  },
}));

// Load and set theme on app start
AsyncStorage.getItem("theme").then((storedTheme) => {
  if (storedTheme) {
    useThemeStore.getState().setDarkMode(storedTheme === "dark");
  }
});
