import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createStorage } from "../utils/storage/createStorage";
import { createPersistStorage } from "./createPersistStorage";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
}

const themeStorage = createStorage("theme");
const storage = createPersistStorage(themeStorage);

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,

      toggleTheme: () => set({ isDarkMode: !get().isDarkMode }),
      setDarkMode: (isDarkMode: boolean) => set({ isDarkMode }),
    }),
    {
      name: "theme",
      version: 0,
      storage,
    },
  ),
);