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
  const { t } = useTranslate();

  return (
    <ErrorPopup
      title={t("help.paymentMethodDelete.title", { ns: "help" })}
      content={t("help.paymentMethodDelete.description", { ns: "help" })}
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
            label={t("neverMind")}
            iconId="xSquare"
            onPress={closePopup}
            reverseOrder
          />
        </>
      }
    />
  );
}
