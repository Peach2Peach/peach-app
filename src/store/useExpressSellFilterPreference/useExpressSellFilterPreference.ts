import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createStorage } from "../../utils/storage/createStorage";
import { createPersistStorage } from "../createPersistStorage";

type ExpressSellFilterPreferences = {
  amount: number;
  premium: number;
};

export const defaultPreferences: ExpressSellFilterPreferences = {
  amount: 0,
  premium: 0,
};

type ExpressSellFilterPreferencesActions = {
  setPremium: (premium: number) => void;
  setAmount: (amount: number) => void;
};

type ExpressSellFilterPreferencesStore = ExpressSellFilterPreferences &
  ExpressSellFilterPreferencesActions;

export const expressSellFilterPreferencesStorage = createStorage(
  "expressSellFilterPreferences",
);
const storage = createPersistStorage(expressSellFilterPreferencesStorage);

export const useExpressSellFilterPreferences =
  create<ExpressSellFilterPreferencesStore>()(
    persist(
      immer((set) => ({
        ...defaultPreferences,
        setAmount: (amount) => set({ amount }),
        setPremium: (premium) => set({ premium }),
      })),
      {
        name: "expressSellFilterPreferences",
        version: 0,
        storage,
      },
    ),
  );
