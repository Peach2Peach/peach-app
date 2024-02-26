import { useQuery } from "@tanstack/react-query";
import { getUTXOId } from "../../../utils/wallet/getUTXOId";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { useWalletState } from "../../../utils/wallet/walletStore";

export const walletKeys = {
  wallet: ["wallet"] as const,
  utxos: () => [...walletKeys.wallet, "utxos"] as const,
  utxoAddress: (id: string) => [...walletKeys.utxos(), id] as const,
  addresses: () => [...walletKeys.wallet, "addresses"] as const,
  address: (address: string) => [...walletKeys.addresses(), address] as const,
  belongsToWallet: (address: string) =>
    [...walletKeys.address(address), "belongsToWallet"] as const,
  addressByIndex: (index: number) =>
    [...walletKeys.addresses(), index] as const,
  lastUnusedAddress: () => [...walletKeys.addresses(), "lastUnused"] as const,
  transactions: () => [...walletKeys.wallet, "transactions"] as const,
  transaction: (id: string | null) =>
    [...walletKeys.transactions(), id] as const,
  transactionSummary: (id: string) =>
    [...walletKeys.transaction(id), "summary"] as const,
  transactionFeeRate: (id: string | null) =>
    [...walletKeys.transaction(id), "feeRate"] as const,
  serializedTransaction: (id: string | null) =>
    [...walletKeys.transaction(id), "serialized"] as const,
  synced: (type: 'bitcoin' | 'liquid') => [...walletKeys.wallet, "synced", type] as const,
};

export const useUTXOs = () => {
  const storedUTXOSelection = useWalletState((state) => state.selectedUTXOIds);
  const queryData = useQuery({
    queryKey: walletKeys.utxos(),
    queryFn: () => {
      if (!peachWallet?.wallet) throw new Error("Wallet not initialized");
      return peachWallet.wallet?.listUnspent();
    },
    enabled: !!peachWallet?.wallet,
  });

  const selectedUTXOs =
    queryData.data?.filter((utxo) =>
      storedUTXOSelection.includes(getUTXOId(utxo)),
    ) ?? [];

  return { ...queryData, selectedUTXOs };
};
