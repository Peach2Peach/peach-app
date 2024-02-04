import { useMutation } from "@tanstack/react-query";
import { useClosePopup, useSetPopup } from "../../../components/popup/Popup";
import { PopupAction } from "../../../components/popup/PopupAction";
import { PopupComponent } from "../../../components/popup/PopupComponent";
import { useNavigation } from "../../../hooks/useNavigation";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { getSellOfferFromContract } from "../../../utils/contract/getSellOfferFromContract";
import i18n from "../../../utils/i18n";
import { peachAPI } from "../../../utils/peachAPI";

export const useRepublishOffer = () => {
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const showErrorBanner = useShowErrorBanner();

  return useMutation({
    mutationFn: republishOffer,
    onError: (error) => {
      showErrorBanner(error?.message);
      closePopup();
    },
    onSuccess: ({ newOfferId }, { id: contractId }) => {
      setPopup(
        <RepublishedOfferPopup
          contractId={contractId}
          newOfferId={newOfferId}
        />,
      );
    },
  });
};

async function republishOffer(contract: Contract) {
  const sellOffer = getSellOfferFromContract(contract);

  const { result: reviveSellOfferResult, error: err } =
    await peachAPI.private.offer.republishSellOffer({
      offerId: sellOffer.id,
    });

  if (!reviveSellOfferResult || err) {
    throw new Error(err?.error || "Could not republish offer");
  }
  return reviveSellOfferResult;
}

function RepublishedOfferPopup({
  contractId,
  newOfferId,
}: {
  contractId: string;
  newOfferId: string;
}) {
  const closePopup = useClosePopup();
  const navigation = useNavigation();

  const closeAction = () => {
    navigation.replace("contract", { contractId });
    closePopup();
  };
  const goToOfferAction = () => {
    navigation.replace("search", {
      offerId: newOfferId,
    });
    closePopup();
  };

  return (
    <PopupComponent
      title={i18n("contract.cancel.offerRepublished.title")}
      content={i18n("contract.cancel.offerRepublished.text")}
      actions={
        <>
          <PopupAction
            label={i18n("close")}
            iconId="xSquare"
            onPress={closeAction}
          />
          <PopupAction
            label={i18n("goToOffer")}
            iconId="arrowRightCircle"
            onPress={goToOfferAction}
            reverseOrder
          />
        </>
      }
    />
  );
}
