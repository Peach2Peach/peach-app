import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { ContractSummary } from "../../peach-api/src/@types/contract";
import { OfferSummary } from "../../peach-api/src/@types/offer";
import { useStartRefundPopup } from "../popups/useStartRefundPopup";
import { isSellOffer } from "../utils/offer/isSellOffer";
import { peachAPI } from "../utils/peachAPI";
import { useCreateEscrow } from "../views/fundEscrow/hooks/useCreateEscrow";
import { isContractSummary } from "../views/yourTrades/utils/isContractSummary";
import { getNavigationDestinationForOffer } from "../views/yourTrades/utils/navigation/getNavigationDestinationForOffer";
import { offerKeys } from "./query/useOfferDetail";
import { useStackNavigation } from "./useStackNavigation";

export const useTradeNavigation = (item: OfferSummary | ContractSummary) => {
  const navigation = useStackNavigation();
  const showStartRefundPopup = useStartRefundPopup();
  const queryClient = useQueryClient();
  const { mutateAsync } = useCreateEscrow();

  const navigateToOfferOrContract = useCallback(async () => {
    const destination = isContractSummary(item)
      ? (["contract", { contractId: item.id }] as const)
      : getNavigationDestinationForOffer(item);
    if (item.tradeStatus === "refundTxSignatureRequired") {
      const offerId = isContractSummary(item) ? item.offerId : item.id;
      const { result: sellOffer } =
        await peachAPI.private.offer.getOfferDetails({ offerId });
      if (sellOffer && isSellOffer(sellOffer)) {
        queryClient.setQueryData(offerKeys.detail(sellOffer.id), sellOffer);
        showStartRefundPopup(sellOffer);
        return;
      }
    }

    if (item.tradeStatus === "createEscrow" && "offerId" in item) {
      await mutateAsync([item.offerId]);
    }

    navigation.navigate(...destination);
  }, [item, navigation, queryClient, showStartRefundPopup]);

  return navigateToOfferOrContract;
};
