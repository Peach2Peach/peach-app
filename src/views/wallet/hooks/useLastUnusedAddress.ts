import { useQuery } from "@tanstack/react-query";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { walletKeys } from "./useUTXOs";

export const useLastUnusedAddress = () =>
  useQuery({
    queryKey: walletKeys.lastUnusedAddress(),
    queryFn: () => {
      if (!peachWallet) throw new Error("Peach wallet not defined");
      return peachWallet.getLastUnusedAddress();
    },
    enabled: peachWallet?.initialized,
  });
