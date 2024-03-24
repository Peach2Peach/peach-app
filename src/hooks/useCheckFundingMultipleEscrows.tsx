import { LocalUtxo } from "bdk-rn/lib/classes/Bindings";
import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import { MSINAMINUTE } from "../constants";
import { estimateTransactionSize } from "../utils/bitcoin/estimateTransactionSize";
import { sum } from "../utils/math/sum";
import { keys } from "../utils/object/keys";
import { getOffer } from "../utils/offer/getOffer";
import { isSellOffer } from "../utils/offer/isSellOffer";
import { isDefined } from "../utils/validation/isDefined";
import { isNotNull } from "../utils/validation/isNotNull";
import { buildTransaction } from "../utils/wallet/bitcoin/transaction/buildTransaction";
import { setMultipleRecipients } from "../utils/wallet/bitcoin/transaction/setMultipleRecipients";
import { peachWallet } from "../utils/wallet/setWallet";
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
  return availableAmount - estimatedTxSize * feeRate;
};

export const useCheckFundingMultipleEscrows = () => {
  const [fundMultipleMap, unregisterFundMultiple] = useWalletState(
    (state) => [state.fundMultipleMap, state.unregisterFundMultiple],
    shallow,
  );

  const handleTransactionError = useHandleTransactionError();
  const feeRate = useFeeRate();
  const addresses = keys(fundMultipleMap);
  const shouldCheck = addresses.length > 0;
  const { refetch: refetchOffers, offers: offerSummaries } =
    useOfferSummaries(shouldCheck);
  useSyncWallet({ enabled: shouldCheck, refetchInterval: MSINAMINUTE });

  const checkAddress = useCallback(
    async (address: string) => {
      const offerIds = fundMultipleMap[address] || [];
      const offers = await Promise.all(offerIds.map(getOffer));
      const sellOffers = offers.filter(isNotNull).filter(isSellOffer);

      const sellOfferSummaries = offerSummaries.filter((summary) =>
        offerIds.includes(summary.id),
      );
      if (sellOffers.length === 0) return;
      if (sellOfferSummaries.some((summary) => summary.fundingTxId)) {
        unregisterFundMultiple(address);
        return;
      }
      const escrows = sellOffers.map((offer) => offer.escrow).filter(isDefined);
      if (escrows.length === 0) return;
      if (!peachWallet) throw new Error("PeachWallet not set");
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
    [
      feeRate,
      fundMultipleMap,
      handleTransactionError,
      offerSummaries,
      unregisterFundMultiple,
    ],
  );

  const callback = useCallback(() => {
    refetchOffers().then(() => Promise.all(addresses.map(checkAddress)));
  }, [addresses, checkAddress, refetchOffers]);

  useInterval({
    callback,
    interval: shouldCheck ? MSINAMINUTE : null,
  });
};
