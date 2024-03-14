import { useQueries } from "@tanstack/react-query";
import { Transaction } from "../../../../peach-api/src/@types/electrs-liquid";
import { OfferSummary } from "../../../../peach-api/src/@types/offer";
import { MSINASECOND } from "../../../constants";
import { useContractSummaries } from "../../../hooks/query/useContractSummaries";
import { sum } from "../../../utils/math/sum";
import { getOffer } from "../../../utils/offer/getOffer";
import { isNotNull } from "../../../utils/validation/isNotNull";
import { useLiquidWalletState } from "../../../utils/wallet/useLiquidWalletState";
import { walletKeys } from "../hooks/useUTXOs";
import { getOfferData } from "./getOfferData";

const getSent = (tx: Transaction) => {
  const { addresses, internalAddresses } = useLiquidWalletState.getState();
  const knownAddresses = [...addresses, ...internalAddresses];

  return tx.vin
    .filter(
      (vin) =>
        vin.prevout?.scriptpubkey_address &&
        knownAddresses.includes(vin.prevout.scriptpubkey_address),
    )
    .map((vin) => vin.prevout?.value || 0)
    .reduce(sum, 0);
};
const getReceived = (tx: Transaction) => {
  const { addresses, internalAddresses } = useLiquidWalletState.getState();
  const knownAddresses = [...addresses, ...internalAddresses];
  return tx.vout
    .filter(
      (vout) =>
        vout.scriptpubkey_address &&
        knownAddresses.includes(vout.scriptpubkey_address),
    )
    .map((vout) => vout.value)
    .reduce(sum, 0);
};
const getTransactionType = (
  { received, sent }: { received: number; sent: number },
  offer?: Pick<OfferSummary, "type">,
): TransactionType => {
  if (offer) {
    if (received > 0 && sent === 0)
      return offer.type === "ask" ? "REFUND" : "TRADE";
    if (sent > 0 && offer.type === "ask") return "ESCROWFUNDED";
  }

  return sent === 0 ? "DEPOSIT" : "WITHDRAWAL";
};
export function getTxSummaryLiquid({
  tx,
  offer,
}: {
  tx: Transaction;
  offer: SellOffer | BuyOffer | undefined;
}) {
  const isConfirmed = tx.status.confirmed;
  const sent = getSent(tx);
  const received = getReceived(tx);
  return {
    id: tx.txid,
    type: getTransactionType({ received, sent }, offer),
    amount: Math.abs(sent - received),
    date: tx.status.block_time
      ? new Date(tx.status.block_time * MSINASECOND)
      : new Date(),
    height: tx.status.block_height,
    confirmed: isConfirmed,
  };
}

export function useTxSummariesLiquid() {
  const txs = useLiquidWalletState((state) => state.transactions);
  const txOfferMap = useLiquidWalletState((state) => state.txOfferMap);
  const { contracts } = useContractSummaries();
  return useQueries({
    queries: txs.map((tx) => ({
      queryKey: walletKeys.transactionSummary(tx.txid),
      queryFn: async () => {
        const offerIds = txOfferMap[tx.txid] || [];
        const offers = await Promise.all(offerIds.map(getOffer));
        const partialSummary = getTxSummaryLiquid({
          tx,
          offer: offers.filter(isNotNull)[0],
        });

        return {
          ...partialSummary,
          chain: "liquid" as Chain,
          offerData: getOfferData(
            offers.filter(isNotNull),
            contracts,
            partialSummary.type,
          ),
        };
      },
      enabled: !!tx,
    })),
  });
}
