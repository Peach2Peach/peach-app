import { useEffect, useMemo } from "react";
import { useSetPopup } from "../../../components/popup/Popup";
import { MSINAMINUTE } from "../../../constants";
import { CancelOfferPopup } from "../../../hooks/CancelOfferPopup";
import { useFundingStatus } from "../../../hooks/query/useFundingStatus";
import { useMultipleOfferDetails } from "../../../hooks/query/useOfferDetails";
import { useRoute } from "../../../hooks/useRoute";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { getSellOfferFunding } from "../../../utils/offer/getSellOfferFunding";
import { isSellOffer } from "../../../utils/offer/isSellOffer";
import { parseError } from "../../../utils/result/parseError";
import { isDefined } from "../../../utils/validation/isDefined";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { useSyncWallet } from "../../wallet/hooks/useSyncWallet";
import { getFundingAmount } from "../helpers/getFundingAmount";
import { useHandleFundingStatus } from "./useHandleFundingStatus";

type FundingInfo = {
  fundingAddress?: string
  fundingAddresses: string[]
  fundingStatus: FundingStatus
}

const shouldGetFundingStatus = (offer: SellOffer) => {
  const funding = getSellOfferFunding(offer)

  return !!offer.escrow &&
    !offer.refunded &&
    !offer.released &&
    funding.status !== "FUNDED";
}


// TODO liquify
export const useFundEscrowSetup = () => {
  const { offerId } = useRoute<"fundEscrow">().params;
  const setPopup = useSetPopup();

  const showErrorBanner = useShowErrorBanner();

  // TODO liquify
  const fundMultiple = useWalletState((state) =>
    state.getFundMultipleByOfferId(offerId),
  );
  useSyncWallet({
    refetchInterval: fundMultiple ? MSINAMINUTE * 2 : undefined,
    enabled: true,
  });

  // TODO liquify
  const { offers } = useMultipleOfferDetails(
    fundMultiple?.offerIds || [offerId],
  );
  const offer = offers[0];
  const sellOffer = offer && isSellOffer(offer) ? offer : undefined;
  const canFetchFundingStatus = !sellOffer || shouldGetFundingStatus(sellOffer);
  const {
    fundingStatus,
    fundingStatusLiquid,
    userConfirmationRequired,
    error: fundingStatusError,
  } = useFundingStatus(offerId, canFetchFundingStatus);
  const sellOffers = offers
  .filter(isDefined)
  .filter(isSellOffer)
  const escrows = sellOffers.map((offr) => offr.escrows.bitcoin).filter(isDefined);
  const escrowsLiquid = sellOffers.map((offr) => offr.escrows.liquid).filter(isDefined);
  const fundingAmount = getFundingAmount(fundMultiple, sellOffer?.amount);
  const cancelOffer = () => setPopup(<CancelOfferPopup offerId={offerId} />);

  const funding: Record<EscrowType, FundingInfo> = {
    bitcoin: {
      fundingAddress: fundMultiple?.address || sellOffer?.escrows.bitcoin,
      fundingAddresses: escrows,
      fundingStatus,
    },
    liquid: {
      fundingAddress: fundMultiple?.address || sellOffer?.escrows.liquid,
      fundingAddresses: escrowsLiquid,
      fundingStatus: fundingStatusLiquid,
    }
  }
  const activeFunding = useMemo(
      ()=> fundingStatusLiquid.status !== 'NULL' ? fundingStatusLiquid : fundingStatus,
      [fundingStatus, fundingStatusLiquid]
    )

  useHandleFundingStatus({
    offerId,
    sellOffer,
    funding: activeFunding,
    userConfirmationRequired,
  });

  useEffect(() => {
    if (!fundingStatusError) return;
    showErrorBanner(parseError(fundingStatusError));
  }, [fundingStatusError, showErrorBanner]);

  return {
    offerId,
    funding,
    activeFunding,
    fundingAmount,
    cancelOffer,
  };
};
