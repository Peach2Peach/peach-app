import { Appearance } from "react-native";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createStorage } from "../utils/storage/createStorage";
import { createPersistStorage } from "./createPersistStorage";

type ThemeState = {
  isDarkMode: boolean;
  autoMode: boolean;
  toggleTheme: () => void;
  toggleAutoMode: () => void;
};

const themeStorage = createStorage("theme");
const storage = createPersistStorage(themeStorage);

let subscription: ReturnType<typeof Appearance.addChangeListener> | null = null;

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => {
      const initialIsDark = Appearance.getColorScheme() === "dark";
      
      if (subscription === null) {
        subscription = Appearance.addChangeListener(({ colorScheme }) => {
          const { autoMode } = get();
          if (autoMode) {
            set({ isDarkMode: colorScheme === "dark" });
          }
        });
      }
      
      return {
        isDarkMode: initialIsDark,
        autoMode: true,
        toggleTheme: () => set({ isDarkMode: !get().isDarkMode }),
        toggleAutoMode: () => {
          const newAutoMode = !get().autoMode;
          if (newAutoMode) {
            const systemIsDark = Appearance.getColorScheme() === "dark";
            set({ autoMode: newAutoMode, isDarkMode: systemIsDark });
          } else {
            set({ autoMode: newAutoMode });
          }
        },
      };
    },
    {
      name: "theme",
      version: 0,
      storage,
    },
  ),
);
