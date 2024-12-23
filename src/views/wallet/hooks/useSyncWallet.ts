import { useQuery } from "@tanstack/react-query";
import { MSINAMINUTE } from "../../../constants";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { walletKeys } from "./useUTXOs";

const MINUTES_OF_STALE_TIME = 10;

type Props = { refetchInterval?: number; enabled?: boolean };

export const useSyncWallet = ({
  refetchInterval,
  enabled = false,
}: Props = {}) =>
  useQuery({
    queryKey: walletKeys.synced(),
    queryFn: async () => {
      if (!peachWallet) throw new Error("Peach wallet not defined");
      if (!peachWallet.initialized) await peachWallet.initWallet();
      await peachWallet.syncWallet();
      return true;
    },
    enabled: enabled && !!peachWallet?.initialized,
    staleTime: MSINAMINUTE * MINUTES_OF_STALE_TIME,
    refetchInterval,
  });
