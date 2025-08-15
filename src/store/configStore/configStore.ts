import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PaymentMethodInfo } from "../../../peach-api/src/@types/payment";
import { createStorage } from "../../utils/storage/createStorage";
import { createPersistStorage } from "../createPersistStorage";

type Config = {
  paymentMethods: PaymentMethodInfo[];
  peachFee: number;
  minTradingAmount: number;
  maxTradingAmount: number;
  seenDisputeDisclaimer: boolean;
};
type ConfigStore = Config & {
  reset: () => void;
  setPaymentMethods: (paymentMethods: PaymentMethodInfo[]) => void;
  setPeachFee: (fee: number) => void;
  setMinTradingAmount: (minTradingAmount: number) => void;
  setMaxTradingAmount: (maxTradingAmount: number) => void;
  setSeenDisputeDisclaimer: (seenDisputeDisclaimer: boolean) => void;
};

export const configStorage = createStorage("config");
const storage = createPersistStorage<ConfigStore>(configStorage);

export const defaultConfig: Config = {
  paymentMethods: [],
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
