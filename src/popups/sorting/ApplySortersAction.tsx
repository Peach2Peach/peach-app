import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useClosePopup } from "../../components/popup/GlobalPopup";
import { PopupAction } from "../../components/popup/PopupAction";
import i18n from "../../utils/i18n";
import { matchesKeys } from "../../views/search/hooks/useOfferMatches";

export function ApplySortersAction({
  setSorterAction,
}: {
  setSorterAction: () => void;
}) {
  const queryClient = useQueryClient();
  const closePopup = useClosePopup();

  const applySorters = useCallback(async () => {
    setSorterAction();
    await queryClient.invalidateQueries({ queryKey: matchesKeys.matches });
    closePopup();
  }, [closePopup, queryClient, setSorterAction]);

  return (
    <PopupAction
      onPress={applySorters}
      label={i18n("apply")}
      iconId={"checkSquare"}
      reverseOrder
    />
  );
}
