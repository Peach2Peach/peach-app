import { create } from "zustand";
import { persist } from "zustand/middleware";
import { APPVERSION } from "../../constants";
import { createStorage } from "../../utils/storage/createStorage";
import { createPersistStorage } from "../createPersistStorage";

type ConfigStore = Config & {
  reset: () => void;
  setPaymentMethods: (paymentMethods: PaymentMethodInfo[]) => void;
  setPeachPGPPublicKey: (pgpPublicKey: string) => void;
  setPeachFee: (fee: number) => void;
  setMinAppVersion: (ver: string) => void;
  setLatestAppVersion: (ver: string) => void;
  setMinTradingAmount: (minTradingAmount: number) => void;
  setMaxTradingAmount: (maxTradingAmount: number) => void;
  setSeenDisputeDisclaimer: (seenDisputeDisclaimer: boolean) => void;
  setHasSeenGroupHugAnnouncement: (
    hasSeenGroupHugAnnouncement: boolean,
  ) => void;
};

export const configStorage = createStorage("config");
const storage = createPersistStorage<ConfigStore>(configStorage);

export const defaultConfig: Config = {
  paymentMethods: [],
  peachPGPPublicKey: "",
  peachFee: 0.02,
  minAppVersion: APPVERSION,
  latestAppVersion: APPVERSION,
  minTradingAmount: 0,
  maxTradingAmount: Infinity,
  seenDisputeDisclaimer: false,
  hasSeenGroupHugAnnouncement: false,
};

export const useConfigStore = create(
  persist<ConfigStore>(
    (set) => ({
      ...defaultConfig,
      reset: () => set(() => defaultConfig),
      setPaymentMethods: (paymentMethods) => set({ paymentMethods }),
      setPeachPGPPublicKey: (peachPGPPublicKey) => set({ peachPGPPublicKey }),
      setPeachFee: (peachFee) => set({ peachFee }),
      setMinAppVersion: (minAppVersion) => set({ minAppVersion }),
      setLatestAppVersion: (latestAppVersion) => set({ latestAppVersion }),
      setMinTradingAmount: (minTradingAmount) => set({ minTradingAmount }),
      setMaxTradingAmount: (maxTradingAmount) => set({ maxTradingAmount }),
      setSeenDisputeDisclaimer: (seenDisputeDisclaimer) =>
        set({ seenDisputeDisclaimer }),
      setHasSeenGroupHugAnnouncement: (hasSeenGroupHugAnnouncement) =>
        set({ hasSeenGroupHugAnnouncement }),
    }),
    {
      name: "config",
      version: 0,
      storage,
    },
  ),
);
