import { LocalUtxo } from "bdk-rn/lib/classes/Bindings";
import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import { OfferSummary } from "../../peach-api/src/@types/offer";
import { MSINAMINUTE } from "../constants";
import { useTradeSummaryStore } from "../store/tradeSummaryStore";
import { estimateTransactionSize } from "../utils/bitcoin/estimateTransactionSize";
import { sum } from "../utils/math/sum";
import { keys } from "../utils/object/keys";
import { getOffer } from "../utils/offer/getOffer";
import { isSellOffer } from "../utils/offer/isSellOffer";
import { isDefined } from "../utils/validation/isDefined";
import { peachWallet } from "../utils/wallet/setWallet";
import {
  buildTransaction,
  setMultipleRecipients,
} from "../utils/wallet/transaction";
import { useWalletState } from "../utils/wallet/walletStore";
import { useSyncWallet } from "../views/wallet/hooks/useSyncWallet";
import { useHandleTransactionError } from "./error/useHandleTransactionError";
import { useOfferSummaries } from "./query/useOfferSummaries";
import { useFeeRate } from "./useFeeRate";
import { useInterval } from "./useInterval";

const getAmountAfterFees = (
  localUtxo: LocalUtxo[],
  escrows: string[],
  feeRate: number,
) => {
  const availableAmount = localUtxo
    .map((utx) => utx.txout.value)
    .reduce(sum, 0);
  const estimatedTxSize = estimateTransactionSize(
    localUtxo.length,
    escrows.length,
  );
  const amountAfterFees = availableAmount - estimatedTxSize * feeRate;
  return amountAfterFees;
};

const getSellOfferSummariesByAddress = (
  fundMultipleMap: Record<string, string[]>,
  address: string,
) => {
  const offers = fundMultipleMap[address].map(
    useTradeSummaryStore.getState().getOffer,
  );
  const sellOffers = offers.filter(isDefined);

  return sellOffers;
};

const getSellOffersByAddress = (
  fundMultipleMap: Record<string, string[]>,
  address: string,
) => {
  const offers = fundMultipleMap[address].map(getOffer);
  const sellOffers = offers.filter(isDefined).filter(isSellOffer);

  return sellOffers;
};
const canFundSellOffers = (sellOffers: OfferSummary[]) =>
  sellOffers.every((sellOffer) => !sellOffer.fundingTxId);

const getEscrowAddresses = (sellOffers: SellOffer[]) =>
  sellOffers.map((offr) => offr.escrow).filter(isDefined);

export const useCheckFundingMultipleEscrows = () => {
  const [fundMultipleMap, unregisterFundMultiple] = useWalletState(
    (state) => [state.fundMultipleMap, state.unregisterFundMultiple],
    shallow,
  );

  const handleTransactionError = useHandleTransactionError();
  const feeRate = useFeeRate();
  const addresses = keys(fundMultipleMap);
  const shouldCheck = addresses.length > 0;
  const { refetch: refetchOffers } = useOfferSummaries(addresses.length > 0);
  useSyncWallet({ enabled: shouldCheck, refetchInterval: MSINAMINUTE });

  const checkAddress = useCallback(
    async (address: string) => {
      const sellOfferSummaries = getSellOfferSummariesByAddress(
        fundMultipleMap,
        address,
      );
      const sellOffers = getSellOffersByAddress(fundMultipleMap, address);

      // sell offers are not stored locally, skip
      if (sellOffers.length === 0) return;

      if (!canFundSellOffers(sellOfferSummaries)) {
        unregisterFundMultiple(address);
        return;
      }

      const escrows = getEscrowAddresses(sellOffers);
      if (escrows.length === 0) return;

      const localUtxo = await peachWallet.getAddressUTXO(address);
      if (localUtxo.length === 0) return;

      const amountAfterFees = getAmountAfterFees(localUtxo, escrows, feeRate);
      const transaction = await buildTransaction({ feeRate, utxos: localUtxo });
      await setMultipleRecipients(transaction, amountAfterFees, escrows);

      try {
        const finishedTransaction =
          await peachWallet.finishTransaction(transaction);
        await peachWallet.signAndBroadcastPSBT(finishedTransaction.psbt);
        unregisterFundMultiple(address);
      } catch (e) {
        handleTransactionError(e);
      }
    },
    [feeRate, fundMultipleMap, handleTransactionError, unregisterFundMultiple],
  );

  const callback = useCallback(() => {
    refetchOffers().then(() => Promise.all(addresses.map(checkAddress)));
  }, [addresses, checkAddress, refetchOffers]);

  useInterval({
    callback,
    interval: shouldCheck ? MSINAMINUTE : null,
  });
};
