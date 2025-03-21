import { useQueries } from "@tanstack/react-query";
import { useContractSummaries } from "../../../hooks/query/useContractSummaries";
import { getOffer } from "../../../utils/offer/getOffer";
import { getTransactionType } from "../../../utils/transaction/getTransactionType";
import { isNotNull } from "../../../utils/validation/isNotNull";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { walletKeys } from "../hooks/useUTXOs";
import { getOfferData } from "./getOfferData";
import { getTxSummary } from "./getTxSummary";

export function useTxSummaries() {
  const txs = useWalletState((state) => state.transactions);
  const txOfferMap = useWalletState((state) => state.txOfferMap);
  const { contracts } = useContractSummaries();
  return useQueries({
    queries: txs.map((tx) => ({
      queryKey: walletKeys.transactionSummary(tx.txid),
      queryFn: async () => {
        const offerIds = txOfferMap[tx.txid] || [];
        const offers = await Promise.all(offerIds.map(getOffer));
        const partialSummary = getTxSummary(tx);
        const type = getTransactionType(tx, offers.filter(isNotNull)[0]);

        return {
          ...partialSummary,
          type,
          offerData: getOfferData(offers.filter(isNotNull), contracts, type),
        };
      },
      enabled: !!tx,
    })),
  });
}
