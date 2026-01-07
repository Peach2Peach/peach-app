import { ChainPosition_Tags, TxDetails } from "bdk-rn";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPersistStorage } from "../../store/createPersistStorage";
import { bytesToHex } from "../../views/wallet/helpers/txIdToString";
import { createStorage } from "../storage/createStorage";
import { migrateWalletStore } from "./migration/migrateWalletStore";
import { WalletTransaction } from "./WalletTransaction";

export type WalletState = {
  balance: number;
  transactions: WalletTransaction[];
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
  getTransaction: (txId: string) => WalletTransaction | undefined;
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

export const txDetailsToWalletTransaction = (
  item: TxDetails,
): WalletTransaction => {
  console.log("FOOOOUND", item);
  const result = {
    txid: bytesToHex(item.txid.serialize()),
    received: Number(item.received.toSat()),
    sent: Number(item.sent.toSat()),
    fee: item.fee ? Number(item.fee?.toSat()) : undefined,
    confirmationTime:
      item.chainPosition.tag === ChainPosition_Tags.Confirmed
        ? {
            timestamp:
              "confirmationBlockTime" in item.chainPosition.inner
                ? Number(
                    item.chainPosition.inner.confirmationBlockTime
                      .confirmationTime,
                  )
                : undefined,

            height:
              "confirmationBlockTime" in item.chainPosition.inner
                ? Number(
                    item.chainPosition.inner.confirmationBlockTime.blockId
                      .height,
                  )
                : undefined,
          }
        : undefined,
  };
  return result;
};

export const useWalletState = create<WalletStore>()(
  persist(
    (set, get) => ({
      ...defaultWalletState,
      reset: () => set(() => defaultWalletState),
      setBalance: (balance) => set({ balance }),
      setTransactions: (transactions) => {
        set({
          transactions: transactions.map((item) => {
            return txDetailsToWalletTransaction(item);
          }),
        });
      },
      addTransaction: (transaction) =>
        set({
          transactions: [
            ...get().transactions,
            txDetailsToWalletTransaction(transaction),
          ],
        }),
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
    }),
    {
      name: "wallet",
      version: 2,
      storage,
      migrate: migrateWalletStore,
    },
  ),
);
