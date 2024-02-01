import { useQueries, useQuery } from "@tanstack/react-query";
import { rules } from "../../utils/validation/rules";
import { peachWallet } from "../../utils/wallet/setWallet";
import { getScriptPubKeyFromAddress } from "../../utils/wallet/transaction/getScriptPubKeyFromAddress";

const buildQuery = (address: string) => ({
  queryKey: ["isMine", address],
  queryFn: async () => {
    if (!peachWallet?.wallet) throw new Error("Wallet not initialized");
    const script = await getScriptPubKeyFromAddress(address);
    return peachWallet.wallet.isMine(script);
  },
  enabled: !!address && !!peachWallet?.wallet && rules.bitcoinAddress(address),
});

export const useIsMyAddress = (address: string) => {
  const { data: isMine } = useQuery(buildQuery(address));

  return isMine;
};

export const useAreMyAddresses = (address: string[]) => {
  const queries = useQueries({ queries: address.map(buildQuery) });

  const areMine = queries.map((query) => query.data);

  return areMine;
};
