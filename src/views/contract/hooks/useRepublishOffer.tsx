import { useMutation } from "@tanstack/react-query";
import {
  useClosePopup,
  useSetPopup,
} from "../../../components/popup/GlobalPopup";
import { PopupAction } from "../../../components/popup/PopupAction";
import { PopupComponent } from "../../../components/popup/PopupComponent";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { getSellOfferIdFromContract } from "../../../utils/contract/getSellOfferIdFromContract";
import { peachAPI } from "../../../utils/peachAPI";
import { useTranslate } from "@tolgee/react";

export const useRepublishOffer = () => {
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const showErrorBanner = useShowErrorBanner();
  const navigation = useStackNavigation();

  const closeAction = (contractId: string) => {
    navigation.replace("contract", { contractId });
    closePopup();
  };
  const goToOfferAction = (offerId: string) => {
    navigation.replace("search", { offerId });
    closePopup();
  };

  return useMutation({
    mutationFn: republishOffer,
    onError: (error) => {
      showErrorBanner(error?.message);
      closePopup();
    },
    onSuccess: ({ newOfferId }, { id: contractId }) => {
      setPopup(
        <RepublishedOfferPopup
          closeAction={() => closeAction(contractId)}
          goToOfferAction={() => goToOfferAction(newOfferId)}
        />,
      );
    },
  });
};

async function republishOffer(contract: Contract) {
  const { result: reviveSellOfferResult, error: err } =
    await peachAPI.private.offer.republishSellOffer({
      offerId: getSellOfferIdFromContract(contract),
    });

  if (!reviveSellOfferResult || err) {
    throw new Error(err?.error || "Could not republish offer");
  }
  return reviveSellOfferResult;
}

function RepublishedOfferPopup({
  closeAction,
  goToOfferAction,
}: {
  closeAction: () => void;
  goToOfferAction: () => void;
}) {
  const { t } = useTranslate("contract");
  return (
    <PopupComponent
      title={t("contract.cancel.offerRepublished.title")}
      content={t("contract.cancel.offerRepublished.text")}
      actions={
        <>
          <PopupAction
            label={t("close", { ns: "global" })}
            iconId="xSquare"
            onPress={closeAction}
          />
          <PopupAction
            label={t("goToOffer", { ns: "global" })}
            iconId="arrowRightCircle"
            onPress={goToOfferAction}
            reverseOrder
          />
        </>
      }
    />
  );
}
