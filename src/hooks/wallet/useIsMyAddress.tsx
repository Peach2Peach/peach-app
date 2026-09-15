import { useQueries, useQuery } from "@tanstack/react-query";
import { rules } from "../../utils/validation/rules";
import { isAddressMine } from "../../utils/wallet/isAddressMine";
import { peachWallet } from "../../utils/wallet/setWallet";
import { walletKeys } from "../../views/wallet/hooks/useUTXOs";

const buildQuery = (address: string) => ({
  queryKey: walletKeys.belongsToWallet(address),
  queryFn: () => isAddressMine(address),
  enabled: !!address && !!peachWallet?.wallet && rules.bitcoinAddress(address),
});

export const useIsMyAddress = (address?: string) => {
  const { data: isMine } = useQuery({
    ...buildQuery(address ?? ""),
    enabled: !!address,
  });

  return isMine ?? false;
};

export const useAreMyAddresses = (address: string[]) => {
  const queries = useQueries({ queries: address.map(buildQuery) });

  const areMine = queries.map((query) => query.data);

  return areMine;
};
