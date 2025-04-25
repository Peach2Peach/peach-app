import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createStorage } from "../../utils/storage/createStorage";
import { createPersistStorage } from "../createPersistStorage";

type ConfigStore = Config & {
  reset: () => void;
  setPaymentMethods: (paymentMethods: PaymentMethodInfo[]) => void;
  setPeachPGPPublicKey: (pgpPublicKey: string) => void;
  setPeachFee: (fee: number) => void;
  setMinTradingAmount: (minTradingAmount: number) => void;
  setMaxTradingAmount: (maxTradingAmount: number) => void;
  setSeenDisputeDisclaimer: (seenDisputeDisclaimer: boolean) => void;
};

export const configStorage = createStorage("config");
const storage = createPersistStorage<ConfigStore>(configStorage);

export const defaultConfig: Config = {
  paymentMethods: [],
  peachPGPPublicKey: "",
  peachFee: 0.02,
  minTradingAmount: 0,
  maxTradingAmount: Infinity,
  seenDisputeDisclaimer: false,
};

export const useConfigStore = create(
  persist<ConfigStore>(
    (set) => ({
      ...defaultConfig,
      reset: () => set(() => defaultConfig),
      setPaymentMethods: (paymentMethods) => set({ paymentMethods }),
      setPeachPGPPublicKey: (peachPGPPublicKey) => set({ peachPGPPublicKey }),
      setPeachFee: (peachFee) => set({ peachFee }),
      setMinTradingAmount: (minTradingAmount) => set({ minTradingAmount }),
      setMaxTradingAmount: (maxTradingAmount) => set({ maxTradingAmount }),
      setSeenDisputeDisclaimer: (seenDisputeDisclaimer) =>
        set({ seenDisputeDisclaimer }),
    }),
    {
      name: "config",
      version: 0,
      storage,
    },
  ),
);
