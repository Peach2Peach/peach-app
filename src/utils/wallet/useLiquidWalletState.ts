import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UTXO } from "../../../peach-api/src/@types/electrs-liquid";
import { createPersistStorage } from "../../store/createPersistStorage";
import { createStorage } from "../storage/createStorage";

export type UTXOWithPath = UTXO & { derivationPath: string };
export type LiquidWalletState = {
  balance: number;
  addresses: string[];
  internalAddresses: string[];
  utxos: UTXOWithPath[];
  isSynced: boolean;
};

export type LiquidWalletStore = LiquidWalletState & {
  reset: () => void;
  setAddresses: (addresses: string[]) => void;
  setInternalAddresses: (addresses: string[]) => void;
  setBalance: (balance: number) => void;
  setUTXO: (utxo: UTXOWithPath[]) => void;
  setIsSynced: (isSynced: boolean) => void;
};

export const defaultWalletState: LiquidWalletState = {
  addresses: [],
  internalAddresses: [],
  balance: 0,
  utxos: [],
  isSynced: false,
};
export const liquidWalletStorage = createStorage("liquidWallet");
const storage = createPersistStorage(liquidWalletStorage);

export const useLiquidWalletState = create<LiquidWalletStore>()(
  persist(
    (set) => ({
      ...defaultWalletState,
      reset: () => set(() => defaultWalletState),
      setAddresses: (addresses) => set({ addresses }),
      setInternalAddresses: (internalAddresses) => set({ internalAddresses }),
      setBalance: (balance) => set({ balance }),
      setUTXO: (utxos) => set({ utxos }),
      setIsSynced: (isSynced) => set({ isSynced }),
    }),
    {
      name: "liquid-wallet",
      version: 0,
      storage,
      partialize: (state) => {
        const { isSynced: _unused, ...rest } = state;
        return rest;
      },
    },
  ),
);
