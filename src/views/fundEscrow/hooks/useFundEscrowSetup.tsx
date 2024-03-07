import { useEffect, useMemo } from "react";
import { MSINAMINUTE } from "../../../constants";
import { useFundingStatus } from "../../../hooks/query/useFundingStatus";
import { useMultipleOfferDetails } from "../../../hooks/query/useOfferDetail";
import { useRoute } from "../../../hooks/useRoute";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { isSellOffer } from "../../../utils/offer/isSellOffer";
import { parseError } from "../../../utils/parseError";
import { isDefined } from "../../../utils/validation/isDefined";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { useSyncWallet } from "../../wallet/hooks/useSyncWallet";
import { getFundingAmount } from "../helpers/getFundingAmount";
import { useHandleFundingStatus } from "./useHandleFundingStatus";

const shouldGetFundingStatus = (offer: SellOffer) =>
  !!offer.escrow &&
  !offer.refunded &&
  !offer.released &&
  offer.funding.status !== "FUNDED";

export const useFundEscrowSetup = () => {
  const { offerId } = useRoute<"fundEscrow">().params;
  const showErrorBanner = useShowErrorBanner();

  const fundMultiple = useWalletState((state) =>
    state.getFundMultipleByOfferId(offerId),
  );
  useSyncWallet({
    refetchInterval: fundMultiple ? MSINAMINUTE * 2 : undefined,
    enabled: true,
  });
  const { offers } = useMultipleOfferDetails(
    fundMultiple?.offerIds || [offerId],
  );
  const offer = offers[0];
  const sellOffer = offer && isSellOffer(offer) ? offer : undefined;
  const canFetchFundingStatus =
    !!sellOffer && shouldGetFundingStatus(sellOffer);
  const {
    fundingStatus,
    userConfirmationRequired,
    error: fundingStatusError,
    isLoading,
  } = useFundingStatus(offerId, canFetchFundingStatus);
  const escrows = offers
    .filter(isDefined)
    .filter(isSellOffer)
    .map((offr) => offr.escrow)
    .filter(isDefined);
  const fundingAmount = getFundingAmount(fundMultiple, sellOffer?.amount);

  useHandleFundingStatus({
    offerId,
    sellOffer,
    fundingStatus,
    userConfirmationRequired,
  });

  useEffect(() => {
    if (!fundingStatusError) return;
    showErrorBanner(parseError(fundingStatusError));
  }, [fundingStatusError, showErrorBanner]);

  const offerIdsWithoutEscrow = useMemo(
    () =>
      offers
        .filter(isDefined)
        .filter((o) => !("escrow" in o))
        .map((o) => o.id),
    [offers],
  );

  return {
    fundingAddress: fundMultiple?.address || sellOffer?.escrow,
    fundingAddresses: escrows,
    fundingStatus,
    fundingAmount,
    offerIdsWithoutEscrow,
    isLoading,
  };
};
