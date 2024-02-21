import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { ErrorPopup } from "../../../popups/ErrorPopup";
import { useClosePopup } from "../../popup/GlobalPopup";
import { PopupAction } from "../../popup/PopupAction";
import { useRemovePaymentData } from "../hooks/useRemovePaymentData";
import { useTranslate } from "@tolgee/react";

export function DeletePaymentMethodPopup({ id }: { id: string }) {
  const navigation = useStackNavigation();
  const closePopup = useClosePopup();
  const { mutate: removePaymentData } = useRemovePaymentData();
  const { t } = useTranslate("help");

  return (
    <ErrorPopup
      title={t("help.paymentMethodDelete.title")}
      content={t("help.paymentMethodDelete.description")}
      actions={
        <>
          <PopupAction
            label={t("delete", { ns: "global" })}
            iconId="trash"
            onPress={() => {
              removePaymentData(id, {
                onSuccess: () => navigation.goBack(),
                onSettled: closePopup,
              });
            }}
          />
          <PopupAction
            label={t("neverMind", { ns: "unassigned" })}
            iconId="xSquare"
            onPress={closePopup}
            reverseOrder
          />
        </>
      }
    />
  );
}
