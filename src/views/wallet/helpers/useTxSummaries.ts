import { useQueries } from "@tanstack/react-query";
import { getOffer } from "../../../utils/offer/getOffer";
import { isNotNull } from "../../../utils/validation/isNotNull";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { walletKeys } from "../hooks/useUTXOs";
import { getTxSummary } from "./getTxSummary";

export function useTxSummaries() {
  const txs = useWalletState((state) => state.transactions);
  const txOfferMap = useWalletState((state) => state.txOfferMap);
  return useQueries({
    queries: txs.map((tx) => ({
      queryKey: walletKeys.transactionSummary(tx.txid),
      queryFn: async () => {
        const offerIds = txOfferMap[tx.txid] || [];
        const offers = await Promise.all(offerIds.map(getOffer));
        return getTxSummary({ tx, offers: offers.filter(isNotNull) });
      },
      enabled: !!tx,
    })),
  });
}
