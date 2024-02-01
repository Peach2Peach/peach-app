import { useQuery } from "@tanstack/react-query";
import { getUTXOId } from "../../../utils/wallet/getUTXOId";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { useWalletState } from "../../../utils/wallet/walletStore";

export const useUTXOs = () => {
  const storedUTXOSelection = useWalletState((state) => state.selectedUTXOIds);
  const queryData = useQuery({
    queryKey: ["utxos"],
    queryFn: () => {
      if (!peachWallet.wallet) throw new Error("Wallet not initialized");
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
