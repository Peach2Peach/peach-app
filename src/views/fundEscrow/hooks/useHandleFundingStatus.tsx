import { useEffect } from "react";
import { useSetGlobalOverlay } from "../../../Overlay";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { WronglyFundedPopup } from "../../../popups/WronglyFundedPopup";
import { useStartRefundPopup } from "../../../popups/useStartRefundPopup";
import { info } from "../../../utils/log/info";
import { saveOffer } from "../../../utils/offer/saveOffer";
import { OfferPublished } from "../../search/OfferPublished";
import { useOfferMatches } from "../../search/hooks/useOfferMatches";

type Props = {
  offerId: string;
  sellOffer?: SellOffer;
  fundingStatus?: FundingStatus;
  userConfirmationRequired?: boolean;
};
export const useHandleFundingStatus = ({
  offerId,
  sellOffer,
  fundingStatus,
  userConfirmationRequired,
}: Props) => {
  const navigation = useStackNavigation();
  const setPopup = useSetPopup();

  const setOverlay = useSetGlobalOverlay();

  const startRefund = useStartRefundPopup();
  const { refetch: fetchMatches } = useOfferMatches(
    offerId,
    undefined,
    fundingStatus?.status === "FUNDED",
  );

  useEffect(() => {
    if (!sellOffer || !fundingStatus) return;

    info("Checked funding status", fundingStatus);
    const updatedOffer = {
      ...sellOffer,
      funding: fundingStatus,
    };

    saveOffer(updatedOffer);

    if (fundingStatus.status === "WRONG_FUNDING_AMOUNT") {
      setPopup(<WronglyFundedPopup sellOffer={sellOffer} />);
      return;
    }
    if (userConfirmationRequired) {
      navigation.replace("wrongFundingAmount", { offerId: updatedOffer.id });
      return;
    }
    if (fundingStatus.status === "FUNDED") {
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
    fundingStatus,
    navigation,
    offerId,
    sellOffer,
    setOverlay,
    setPopup,
    startRefund,
    userConfirmationRequired,
  ]);
};
