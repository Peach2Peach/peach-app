import { MSINASECOND } from "../../../constants";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { ErrorPopup } from "../../../popups/ErrorPopup";
import i18n from "../../../utils/i18n";
import { useClosePopup } from "../../popup/GlobalPopup";
import { PopupAction } from "../../popup/PopupAction";
import { useSetToast } from "../../toast/Toast";
import { useRemovePaymentData } from "../hooks/useRemovePaymentData";

export function DeletePaymentMethodPopup({ id }: { id: string }) {
  const navigation = useStackNavigation();
  const closePopup = useClosePopup();
  const { mutate: removePaymentData } = useRemovePaymentData();
  const setToast = useSetToast();

  return (
    <ErrorPopup
      title={i18n("help.paymentMethodDelete.title")}
      content={i18n("help.paymentMethodDelete.description")}
      actions={
        <>
          <PopupAction
            label={i18n("delete")}
            iconId="trash"
            onPress={() => {
              removePaymentData(id, {
                onSuccess: () => {
                  navigation.goBack();
                  setToast({
                    msgKey: "help.paymentMethodDelete.success",
                    color: "yellow",
                    duration: MSINASECOND * 5,
                  });
                },
                onSettled: closePopup,
              });
            }}
          />
          <PopupAction
            label={i18n("neverMind")}
            iconId="xSquare"
            onPress={closePopup}
            reverseOrder
          />
        </>
      }
    />
  );
}
