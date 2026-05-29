import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPersistStorage } from "../../store/createPersistStorage";
import { createStorage } from "../storage/createStorage";
import type { WalletTx } from "./bdkShim";
import { migrateWalletStore } from "./migration/migrateWalletStore";

export type WalletState = {
  balance: number;
  transactions: WalletTx[];
  fundedFromPeachWallet: string[];
  txOfferMap: { [offerId: string]: string[] | undefined };
  addressLabelMap: { [address: string]: string | undefined };
  showBalance: boolean;
  selectedUTXOIds: string[];
  hasScanned: boolean;
  externalUsedIndices: number[];
};

export type FundMultipleInfo = {
  address: string;
  offerIds: string[];
};

export type WalletStore = WalletState & {
  reset: () => void;
  setBalance: (balance: number) => void;
  setTransactions: (txs: WalletTx[]) => void;
  addTransaction: (transaction: WalletTx) => void;
  removeTransaction: (txId: string) => void;
  getTransaction: (txId: string) => WalletTx | undefined;
  isFundedFromPeachWallet: (address: string) => boolean;
  setFundedFromPeachWallet: (address: string) => void;
  labelAddress: (address: string, label: string) => void;
  updateTxOfferMap: (txid: string, offerIds: string[]) => void;
  toggleShowBalance: () => void;
  setSelectedUTXOIds: (utxos: string[]) => void;
  setHasScanned: (hasScanned: boolean) => void;
  markExternalIndexUsed: (index: number) => void;
};

export const defaultWalletState: WalletState = {
  balance: 0,
  transactions: [],
  fundedFromPeachWallet: [],
  txOfferMap: {},
  addressLabelMap: {},
  showBalance: true,
  selectedUTXOIds: [],
  hasScanned: false,
  externalUsedIndices: [],
};
export const walletStorage = createStorage("wallet");
const storage = createPersistStorage(walletStorage);

export const useWalletState = create<WalletStore>()(
  persist(
    (set, get) => ({
      ...defaultWalletState,
      reset: () => set(() => defaultWalletState),
      setBalance: (balance) => set({ balance }),
      setTransactions: (transactions) => set({ transactions }),
      addTransaction: (transaction) =>
        set({ transactions: [...get().transactions, transaction] }),
      removeTransaction: (txId) =>
        set({
          transactions: get().transactions.filter((tx) => tx.txid !== txId),
        }),
      getTransaction: (txId) =>
        get().transactions.find((tx) => tx.txid === txId),
      isFundedFromPeachWallet: (address) =>
        get().fundedFromPeachWallet.includes(address),
      setFundedFromPeachWallet: (address) =>
        set({
          fundedFromPeachWallet: [...get().fundedFromPeachWallet, address],
        }),
      labelAddress: (address, label) =>
        set((state) => ({
          addressLabelMap: {
            ...state.addressLabelMap,
            [address]: label,
          },
        })),
      updateTxOfferMap: (txId, offerIds) =>
        set((state) => ({
          txOfferMap: {
            ...state.txOfferMap,
            [txId]: offerIds,
          },
        })),
      toggleShowBalance: () =>
        set((state) => ({ showBalance: !state.showBalance })),
      setSelectedUTXOIds: (utxos) => set({ selectedUTXOIds: utxos }),
      setHasScanned: (hasScanned) => set({ hasScanned }),
      markExternalIndexUsed: (index) =>
        set((state) =>
          state.externalUsedIndices.includes(index)
            ? state
            : {
                externalUsedIndices: [...state.externalUsedIndices, index],
              },
        ),
    }),
    {
      name: "wallet",
      version: 4,
      storage,
      migrate: migrateWalletStore,
    },
  ),
);
