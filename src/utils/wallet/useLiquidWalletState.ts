import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UTXO } from "../../../peach-api/src/@types/electrs-liquid";
import { createPersistStorage } from "../../store/createPersistStorage";
import { createStorage } from "../storage/createStorage";

export type UTXOWithPath = UTXO & { derivationPath: string };
export type LiquidWalletState = {
  balance: number;
  addresses: string[];
  usedAddresses: Record<string, boolean>;
  internalAddresses: string[];
  utxos: UTXOWithPath[];
  isSynced: boolean;
};

export type LiquidWalletStore = LiquidWalletState & {
  reset: () => void;
  setAddresses: (addresses: string[]) => void;
  setAddressUsed: (address: string) => void;
  setInternalAddresses: (addresses: string[]) => void;
  setBalance: (balance: number) => void;
  setUTXO: (utxo: UTXOWithPath[]) => void;
  setIsSynced: (isSynced: boolean) => void;
};

export const defaultWalletState: LiquidWalletState = {
  addresses: [],
  usedAddresses: {},
  internalAddresses: [],
  balance: 0,
  utxos: [],
  isSynced: false,
};
export const liquidWalletStorage = createStorage("liquidWallet");
const storage = createPersistStorage(liquidWalletStorage);

export const useLiquidWalletState = create<LiquidWalletStore>()(
  persist(
    (set, get) => ({
      ...defaultWalletState,
      reset: () => set(() => defaultWalletState),
      setAddresses: (addresses) => set({ addresses }),
      setAddressUsed: (address) =>
        set({
          usedAddresses: {
            ...get().usedAddresses,
            [address]: true,
          },
        }),
      setInternalAddresses: (internalAddresses) => set({ internalAddresses }),
      setBalance: (balance) => set({ balance }),
      setUTXO: (utxos) => set({ utxos }),
      setIsSynced: (isSynced) => set({ isSynced }),
    }),
    {
      name: "liquid-wallet",
      version: 1,
      storage,
      partialize: (state) => {
        const { isSynced: _unused, ...rest } = state;
        return rest;
      },
      migrate: (persistedState: unknown, version: number) => {
        let migratedState = persistedState as LiquidWalletState;
        if (version < 1) {
          migratedState = {
            ...migratedState,
            addresses: [],
            internalAddresses: [],
          };
        }
        return migratedState as LiquidWalletStore;
      },
    },
  ),
);
