import { MMKVInstance } from "react-native-mmkv-storage";
import { createJSONStorage } from "zustand/middleware";
import { error } from "../utils/log/error";
import { dateTimeReviver } from "../utils/system/dateTimeReviver";

export type StorePersist = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (fn: () => void) => () => void;
  };
};
export const createPersistStorage = <T>(storage: MMKVInstance) =>
  createJSONStorage<T>(() => ({
    setItem: async (name: string, value: unknown) => {
      await storage.setItem(name, JSON.stringify(value));
    },
    getItem: async (name: string) => {
      const value = await storage.getItem(name);
      try {
        if (value && typeof value === "string")
          return JSON.parse(value, dateTimeReviver);
      } catch (e) {
        error(e);
      }
      return null;
    },
    removeItem: (name: string) => {
      storage.removeItem(name);
    },
  }));
