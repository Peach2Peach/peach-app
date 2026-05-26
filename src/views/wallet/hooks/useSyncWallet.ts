import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MSINAMINUTE } from "../../../constants";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { walletKeys } from "./useUTXOs";

const MINUTES_OF_STALE_TIME = 10;

type Props = { refetchInterval?: number; enabled?: boolean };

export const useSyncWallet = ({
  refetchInterval,
  enabled = false,
}: Props = {}) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: walletKeys.synced(),
    queryFn: async () => {
      if (!peachWallet) throw new Error("Peach wallet not defined");
      if (!peachWallet.initialized) await peachWallet.initWallet();
      await peachWallet.syncWallet();
      queryClient.invalidateQueries({ queryKey: walletKeys.addresses() });
      queryClient.invalidateQueries({ queryKey: walletKeys.utxos() });
      return true;
    },
    enabled: enabled && !!peachWallet?.initialized,
    staleTime: MSINAMINUTE * MINUTES_OF_STALE_TIME,
    refetchInterval,
  });
};
