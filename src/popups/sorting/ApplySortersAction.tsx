import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useClosePopup } from "../../components/popup/GlobalPopup";
import { PopupAction } from "../../components/popup/PopupAction";
import { matchesKeys } from "../../views/search/hooks/useOfferMatches";
import { useTranslate } from "@tolgee/react";

export function ApplySortersAction({
  setSorterAction,
}: {
  setSorterAction: () => void;
}) {
  const queryClient = useQueryClient();
  const closePopup = useClosePopup();
  const { t } = useTranslate("global");

  const applySorters = useCallback(async () => {
    setSorterAction();
    await queryClient.invalidateQueries({ queryKey: matchesKeys.matches });
    closePopup();
  }, [closePopup, queryClient, setSorterAction]);

  return (
    <PopupAction
      onPress={applySorters}
      label={t("apply")}
      iconId={"checkSquare"}
      reverseOrder
    />
  );
}
