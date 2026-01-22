import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { ContractSummary } from "../../peach-api/src/@types/contract";
import { OfferSummary } from "../../peach-api/src/@types/offer";
import { useStartRefundPopup } from "../popups/useStartRefundPopup";
import { isSellOffer } from "../utils/offer/isSellOffer";
import { peachAPI } from "../utils/peachAPI";
import { isContractSummary } from "../views/yourTrades/utils/isContractSummary";
import { getNavigationDestinationForOffer } from "../views/yourTrades/utils/navigation/getNavigationDestinationForOffer";
import { getNavigationDestinationForPeach069BuyOffer } from "../views/yourTrades/utils/navigation/getNavigationDestinationForPeach069BuyOffer";
import { offerKeys } from "./query/useOfferDetail";
import { useStackNavigation } from "./useStackNavigation";

export const useTradeNavigation = (item: OfferSummary | ContractSummary) => {
  const navigation = useStackNavigation();
  const showStartRefundPopup = useStartRefundPopup();
  const queryClient = useQueryClient();
  // const { mutateAsync } = useCreateEscrow({ isSellOffer: false });

  const navigateToOfferOrContract = useCallback(async () => {
    const destination = isContractSummary(item)
      ? (["contract", { contractId: item.id }] as const)
      : item.amountSats //TODO: fix this
        ? getNavigationDestinationForPeach069BuyOffer(item)
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

    // // this is for contracts that need funding
    // if (item.tradeStatus === "createEscrow" && "offerId" in item) {
    //   await mutateAsync([item.offerId]);
    // }
    // the code above has been commented because we are relying on the
    // contract screen to perform the escrow creation.
    // we had some bugs where the escrow was not funded fast enough, and the contract
    // showed up without an escrow. therefore this is now done only at that screen

    navigation.navigate(...destination);
  }, [item, navigation, queryClient, showStartRefundPopup]);

  return navigateToOfferOrContract;
};
