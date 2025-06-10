import { useEffect } from "react";
import { useSetGlobalOverlay } from "../../../Overlay";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { WronglyFundedPopup } from "../../../popups/WronglyFundedPopup";
import { useStartRefundPopup } from "../../../popups/useStartRefundPopup";
import { EscrowOfContractFunded } from "../../search/EscrowOfContractFunded";
import { OfferPublished } from "../../search/OfferPublished";
import { useOfferMatches } from "../../search/hooks/useOfferMatches";

type Props = {
  offerId: string;
  sellOffer?: SellOffer;
  fundingStatus?: FundingStatus;
  userConfirmationRequired?: boolean;
  contractId?: string;
};
export const useHandleFundingStatus = ({
  offerId,
  sellOffer,
  fundingStatus,
  userConfirmationRequired,
  contractId,
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

    if (fundingStatus.status === "WRONG_FUNDING_AMOUNT") {
      setPopup(<WronglyFundedPopup sellOffer={sellOffer} />);
      return;
    }
    if (userConfirmationRequired) {
      navigation.replace("wrongFundingAmount", { offerId: sellOffer.id });
      return;
    }
    if (fundingStatus.status === "FUNDED") {
      void fetchMatches().then(() => {
        if (contractId !== undefined) {
          setOverlay(
            <EscrowOfContractFunded
              contractId={contractId}
              shouldGoBack={false}
            />,
          );
        } else {
          navigation.replace("search", { offerId });
          setOverlay(<OfferPublished offerId={offerId} shouldGoBack={false} />);
        }
      });
    }
  }, [
    fetchMatches,
    fundingStatus,
    navigation,
    offerId,
    contractId,
    sellOffer,
    setOverlay,
    setPopup,
    startRefund,
    userConfirmationRequired,
  ]);
};
