import { useCallback } from "react";
import { isContractId } from "../utils/contract/isContractId";
import { peachAPI } from "../utils/peachAPI";
import { getNavigationDestinationForOffer } from "../views/yourTrades/utils/navigation/getNavigationDestinationForOffer";
import { useStackNavigation } from "./useStackNavigation";

export const useGoToOfferOrContract = () => {
  const navigation = useStackNavigation();

  const goToOfferOrContract = useCallback(
    async (id: string) => {
      if (isContractId(id)) {
        navigation.navigateDeprecated("contract", { contractId: id });
      } else {
        const { result: newOffer } =
          await peachAPI.private.offer.getOfferDetails({ offerId: id });
        if (!newOffer) return;
        const destination = getNavigationDestinationForOffer(newOffer);
        navigation.navigateDeprecated(...destination);
      }
    },
    [navigation],
  );

  return goToOfferOrContract;
};
