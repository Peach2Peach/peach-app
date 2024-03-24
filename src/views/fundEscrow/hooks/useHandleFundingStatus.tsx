import { useEffect } from "react";
import { useSetOverlay } from "../../../Overlay";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { WronglyFundedPopup } from "../../../popups/WronglyFundedPopup";
import { useStartRefundPopup } from "../../../popups/useStartRefundPopup";
import { info } from "../../../utils/log/info";
import { OfferPublished } from "../../search/OfferPublished";
import { useOfferMatches } from "../../search/hooks/useOfferMatches";

type Props = {
  offerId: string;
  sellOffer?: SellOffer;
  funding: FundingStatus;
  userConfirmationRequired?: boolean;
};

export const useHandleFundingStatus = ({
  offerId,
  sellOffer,
  funding,
  userConfirmationRequired,
}: Props) => {
  const navigation = useStackNavigation();
  const setPopup = useSetPopup();
  const setOverlay = useSetOverlay();
  const startRefund = useStartRefundPopup();

  const { refetch: fetchMatches } = useOfferMatches(
    offerId,
    undefined,
    funding.status === "FUNDED",
  );

  useEffect(() => {
    if (!sellOffer || !funding) return;

    info("Checked funding status", funding);

    if (funding.status === "CANCELED") {
      startRefund(sellOffer);
      return;
    }
    if (funding.status === "WRONG_FUNDING_AMOUNT") {
      setPopup(<WronglyFundedPopup sellOffer={sellOffer} />);
      return;
    }
    if (userConfirmationRequired) {
      navigation.replace("wrongFundingAmount", { offerId: sellOffer.id });
      return;
    }
    if (funding.status === "FUNDED") {
      fetchMatches().then(({ data }) => {
        const allMatches = (data?.pages || []).flatMap((page) => page.matches);
        const hasMatches = allMatches.length > 0;
        if (hasMatches) {
          navigation.replace("search", { offerId });
        } else {
          setOverlay(<OfferPublished offerId={offerId} shouldGoBack={false} />);
        }
      });
    }
  }, [
    fetchMatches,
    funding,
    navigation,
    offerId,
    sellOffer,
    setOverlay,
    setPopup,
    startRefund,
    userConfirmationRequired,
  ]);
};
