import { useQueries, useQuery } from "@tanstack/react-query";
import { rules } from "../../utils/validation/rules";
import { getScriptPubKeyFromAddress } from "../../utils/wallet/bitcoin/transaction/getScriptPubKeyFromAddress";
import { peachLiquidWallet, peachWallet } from "../../utils/wallet/setWallet";
import { walletKeys } from "../../views/wallet/hooks/useUTXOs";

const buildQuery = (address: string, chain: Chain) => ({
  queryKey: walletKeys.belongsToWallet(address),
  queryFn: async () => {
    if (chain === "bitcoin") {
      if (!peachWallet?.wallet) throw new Error("Wallet not initialized");
      const script = await getScriptPubKeyFromAddress(address);
      return peachWallet.wallet.isMine(script);
    }
    if (!peachLiquidWallet) throw new Error("Wallet not initialized");

    return peachLiquidWallet.isMine(address);
  },
  enabled:
    !!address &&
    (rules.bitcoinAddress(address) || rules.liquidAddress(address)),
});

type Props = { address: string; chain: Chain };
export const useIsMyAddress = ({ address, chain }: Props) => {
  const { data: isMine } = useQuery(buildQuery(address, chain));
  return isMine;
};

type MultipleProps = {
  addresses: string[];
  chain: Chain;
};
export const useAreMyAddresses = ({ addresses, chain }: MultipleProps) => {
  const queries = useQueries({
    queries: addresses.map((addr) => buildQuery(addr, chain)),
  });

  const areMine = queries.map((query) => query.data);

  return areMine;
};
