import { TxDetails } from "bdk-rn";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPersistStorage } from "../../store/createPersistStorage";
import { bytesToHex } from "../../views/wallet/helpers/txIdToString";
import { createStorage } from "../storage/createStorage";
import { migrateWalletStore } from "./migration/migrateWalletStore";

export type WalletState = {
  balance: number;
  transactions: TxDetails[];
  fundedFromPeachWallet: string[];
  txOfferMap: { [offerId: string]: string[] | undefined };
  addressLabelMap: { [address: string]: string | undefined };
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
  setTransactions: (txs: TxDetails[]) => void;
  addTransaction: (transaction: TxDetails) => void;
  removeTransaction: (txId: string) => void;
  getTransaction: (txId: string) => TxDetails | undefined;
  isFundedFromPeachWallet: (address: string) => boolean;
  setFundedFromPeachWallet: (address: string) => void;
  labelAddress: (address: string, label: string) => void;
  updateTxOfferMap: (txid: string, offerIds: string[]) => void;
  toggleShowBalance: () => void;
  setSelectedUTXOIds: (utxos: string[]) => void;
};

export const defaultWalletState: WalletState = {
  balance: 0,
  transactions: [],
  fundedFromPeachWallet: [],
  txOfferMap: {},
  addressLabelMap: {},
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
      setTransactions: (transactions) => {
        const fixedTxs = transactions.map((tx) => {
          return {
            ...tx,
            balanceDelta: Number(tx.balanceDelta),
            received: Number(tx.received.toSat()),
            sent: Number(tx.sent.toSat()),
            fee: tx.fee ? Number(tx.fee.toSat()) : undefined,
          };
        });
        set({ transactions: fixedTxs });
      },
      addTransaction: (transaction) =>
        set({ transactions: [...get().transactions, transaction] }),
      removeTransaction: (txId) =>
        set({
          transactions: get().transactions.filter(
            (tx) => bytesToHex(tx.txid.serialize()) !== txId,
          ),
        }),
      getTransaction: (txId) =>
        get().transactions.find(
          (tx) => bytesToHex(tx.txid.serialize()) === txId,
        ),
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
    }),
    {
      name: "wallet",
      version: 2,
      storage,
      migrate: migrateWalletStore,
    },
  ),
);
