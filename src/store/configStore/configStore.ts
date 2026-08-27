import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PaymentMethodInfo } from "../../../peach-api/src/@types/payment";
import { bundledPeachPGPPublicKey } from "../../utils/pgp/peachPGPPublicKey";
import { createStorage } from "../../utils/storage/createStorage";
import { createPersistStorage } from "../createPersistStorage";

type Config = {
  paymentMethods: PaymentMethodInfo[];
  peachPGPPublicKey: string;
  peachFee: number;
  minTradingAmount: number;
  maxTradingAmount: number;
  seenDisputeDisclaimer: boolean;
  webAppAvailable: boolean;
  showPasteDesktopConnection: boolean;
};
type ConfigStore = Config & {
  reset: () => void;
  setPaymentMethods: (paymentMethods: PaymentMethodInfo[]) => void;
  setPeachPGPPublicKey: (pgpPublicKey: string) => void;
  setPeachFee: (fee: number) => void;
  setMinTradingAmount: (minTradingAmount: number) => void;
  setMaxTradingAmount: (maxTradingAmount: number) => void;
  setSeenDisputeDisclaimer: (seenDisputeDisclaimer: boolean) => void;
  setWebAppAvailable: (webAppAvailable: boolean) => void;
  setShowPasteDesktopConnection: (showPasteDesktopConnection: boolean) => void;
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
  webAppAvailable: false,
  showPasteDesktopConnection: false,
};

export const useConfigStore = create(
  persist<ConfigStore>(
    (set) => ({
      ...defaultConfig,
      reset: () => set(() => defaultConfig),
      setPaymentMethods: (paymentMethods) => set({ paymentMethods }),
      // Ignore an empty key: a server response that omits it must not overwrite
      // a good stored one, and storing "" is what leaves the app with no
      // encryption recipient at all.
      setPeachPGPPublicKey: (peachPGPPublicKey) => {
        if (peachPGPPublicKey) set({ peachPGPPublicKey });
      },
      setPeachFee: (peachFee) => set({ peachFee }),
      setMinTradingAmount: (minTradingAmount) => set({ minTradingAmount }),
      setMaxTradingAmount: (maxTradingAmount) => set({ maxTradingAmount }),
      setSeenDisputeDisclaimer: (seenDisputeDisclaimer) =>
        set({ seenDisputeDisclaimer }),
      setWebAppAvailable: (webAppAvailable) => set({ webAppAvailable }),
      setShowPasteDesktopConnection: (showPasteDesktopConnection) =>
        set({ showPasteDesktopConnection }),
    }),
    {
      name: "config",
      version: 0,
      storage,
    },
  ),
);

/**
 * The key to encrypt to when sending data to Peach, falling back to the key
 * bundled with the app when the server-provided one was never fetched.
 *
 * Read through this rather than `state.peachPGPPublicKey` directly: persisted
 * state is merged OVER the store's defaults, so the many clients that already
 * hold a stored `""` would keep it no matter what the default says. Resolving
 * the fallback on read heals them without needing a store migration.
 */
const selectPeachPGPPublicKey = (state: Config) =>
  state.peachPGPPublicKey || bundledPeachPGPPublicKey;

export const usePeachPGPPublicKey = () =>
  useConfigStore(selectPeachPGPPublicKey);

export const getPeachPGPPublicKey = () =>
  selectPeachPGPPublicKey(useConfigStore.getState());
