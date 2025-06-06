import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPersistStorage } from "../../store/createPersistStorage";
import { keys } from "../object/keys";
import { omit } from "../object/omit";
import { createStorage } from "../storage/createStorage";
import { migrateWalletStore } from "./migration/migrateWalletStore";

export type WalletState = {
  balance: number;
  transactions: TransactionDetails[];
  fundedFromPeachWallet: string[];
  txOfferMap: { [offerId: string]: string[] | undefined };
  addressLabelMap: { [address: string]: string | undefined };
  fundMultipleMap: { [address: string]: string[] | undefined };
  showBalance: boolean;
  selectedUTXOIds: string[];
};

export type FundMultipleInfo = {
  address: string;
  offerIds: string[];
};

export type WalletStore = WalletState & {
  reset: () => void;
  setBalance: (balance: number) => void;
  setTransactions: (txs: TransactionDetails[]) => void;
  addTransaction: (transaction: TransactionDetails) => void;
  removeTransaction: (txId: string) => void;
  getTransaction: (txId: string) => TransactionDetails | undefined;
  isFundedFromPeachWallet: (address: string) => boolean;
  setFundedFromPeachWallet: (address: string) => void;
  labelAddress: (address: string, label: string) => void;
  updateTxOfferMap: (txid: string, offerIds: string[]) => void;
  registerFundMultiple: (address: string, offerIds: string[]) => void;
  unregisterFundMultiple: (address: string) => void;
  getFundMultipleByOfferId: (offerId: string) => FundMultipleInfo | undefined;
  toggleShowBalance: () => void;
  setSelectedUTXOIds: (utxos: string[]) => void;
};

export const defaultWalletState: WalletState = {
  balance: 0,
  transactions: [],
  fundedFromPeachWallet: [],
  txOfferMap: {},
  addressLabelMap: {},
  fundMultipleMap: {},
  showBalance: true,
  selectedUTXOIds: [],
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
      registerFundMultiple: (address, offerIds) =>
        set((state) => ({
          fundMultipleMap: {
            ...state.fundMultipleMap,
            [address]: offerIds,
          },
        })),
      unregisterFundMultiple: (address) =>
        set((state) => ({
          fundMultipleMap: omit(state.fundMultipleMap, address),
        })),
      getFundMultipleByOfferId: (offerId) => {
        const map = get().fundMultipleMap;
        const address = keys(map).find((a) => map[a]?.includes(offerId));
        if (!address) return undefined;
        const offerIds = map[address] || [];
        return { address, offerIds };
      },
      toggleShowBalance: () =>
        set((state) => ({ showBalance: !state.showBalance })),
      setSelectedUTXOIds: (utxos) => set({ selectedUTXOIds: utxos }),
    }),
    {
      name: "wallet",
      version: 2,
      storage,
      migrate: migrateWalletStore,
    },
  ),
);
