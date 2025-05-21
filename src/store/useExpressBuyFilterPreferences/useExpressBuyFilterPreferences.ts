import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { TOTAL_SATS } from "../../constants";
import { createStorage } from "../../utils/storage/createStorage";
import { createPersistStorage } from "../createPersistStorage";

type ExpressBuyFilterPreferences = {
  minAmount: number;
  maxAmount: number;
  maxPremium: number;
};

export const defaultPreferences: ExpressBuyFilterPreferences = {
  minAmount: 1,
  maxAmount: TOTAL_SATS,
  maxPremium: 21,
};

type ExpressBuyFilterPreferencesActions = {
  setMinAmount: (minAmount: number) => void;
  setMaxAmount: (maxAmount: number) => void;
  setMaxPremium: (maxPremium: number) => void;
};

type ExpressBuyFilterPreferencesStore = ExpressBuyFilterPreferences &
  ExpressBuyFilterPreferencesActions;

export const expressBuyFilterPreferencesStorage = createStorage(
  "expressBuyFilterPreferences",
);
const storage = createPersistStorage(expressBuyFilterPreferencesStorage);

export const useExpressBuyFilterPreferences =
  create<ExpressBuyFilterPreferencesStore>()(
    persist(
      immer((set) => ({
        ...defaultPreferences,
        setMinAmount: (minAmount) => set({ minAmount }),
        setMaxAmount: (maxAmount) => set({ maxAmount }),
        setMaxPremium: (maxPremium) => set({ maxPremium }),
      })),
      {
        name: "expressBuyFilterPreferences",
        version: 0,
        storage,
      },
    ),
  );
