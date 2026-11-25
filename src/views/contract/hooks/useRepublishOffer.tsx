import { useMutation } from "@tanstack/react-query";
import {
  useClosePopup,
  useSetPopup,
} from "../../../components/popup/GlobalPopup";
import { PopupAction } from "../../../components/popup/PopupAction";
import { PopupComponent } from "../../../components/popup/PopupComponent";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { useStartRefundPopup } from "../../../popups/useStartRefundPopup";
import { getSellOfferFromContract } from "../../../utils/contract/getSellOfferFromContract";
import { getSellOfferIdFromContract } from "../../../utils/contract/getSellOfferIdFromContract";
import i18n from "../../../utils/i18n";
import { submitInstantTradeSignature } from "../../../utils/offer/submitInstantTradeSignature";
import { submitOldOfferIdSignature } from "../../../utils/offer/submitOldOfferIdSignature";
import { error as logError } from "../../../utils/log/error";
import { parseError } from "../../../utils/parseError";
import { peachAPI } from "../../../utils/peachAPI";

export const useRepublishOffer = () => {
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const showErrorBanner = useShowErrorBanner();
  const navigation = useStackNavigation();
  const startRefund = useStartRefundPopup();

  const closeAction = (contractId: string) => {
    navigation.replace("contract", { contractId });
    closePopup();
  };
  const goToOfferAction = (offerId: string) => {
    navigation.replace("browseTradeRequestsToMySellOffer", { offerId }); // TODO: check if correct
    closePopup();
  };

  return useMutation({
    mutationFn: republishOffer,
    onError: async (error, contract) => {
      showErrorBanner(error?.message);
      closePopup();
      // legacy escrows can no longer be republished - the only way out is a
      // refund, so take the user straight there
      if (parseError(error) === "REPUBLISH_NOT_POSSIBLE") {
        const sellOffer = await getSellOfferFromContract(contract);
        if (sellOffer) startRefund(sellOffer);
      }
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
  // not awaited: a failure here must not fail the republish
  declareInstantTrade(reviveSellOfferResult.newOfferId).catch((e) =>
    logError("instantTradeSignature: republish declaration failed", e),
  );
  // the revived offer declares which offer it came from (never throws)
  submitOldOfferIdSignature(reviveSellOfferResult.newOfferId);
  return reviveSellOfferResult;
}

function RepublishedOfferPopup({
  closeAction,
  goToOfferAction,
}: {
  closeAction: () => void;
  goToOfferAction: () => void;
}) {
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

/**
 * the republished offer gets a new id, so it needs its own instant trade
 * declaration, decided from the new offer's own payment data.
 */
async function declareInstantTrade(sellOfferId: string) {
  const { result: newOffer } = await peachAPI.private.peach069.getSellOfferById(
    { sellOfferId },
  );
  if (!newOffer) {
    logError("instantTradeSignature: republished offer not found");
    return;
  }
  if (newOffer.instantTradeSignature) return;
  await submitInstantTradeSignature(newOffer);
}
