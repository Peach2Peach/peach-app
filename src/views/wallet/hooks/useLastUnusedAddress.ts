import { useQuery } from "@tanstack/react-query";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { walletKeys } from "./useUTXOs";

export const useLastUnusedAddress = () =>
  useQuery({
    queryKey: walletKeys.lastUnusedAddress(),
    queryFn: () => peachWallet.getLastUnusedAddress(),
    enabled: peachWallet.initialized,
  });
