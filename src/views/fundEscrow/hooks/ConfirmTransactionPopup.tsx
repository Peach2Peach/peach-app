import { useCallback } from "react";
import { useClosePopup } from "../../../components/popup/GlobalPopup";
import { PopupAction } from "../../../components/popup/PopupAction";
import { PopupComponent } from "../../../components/popup/PopupComponent";
import { LoadingPopupAction } from "../../../components/popup/actions/LoadingPopupAction";
import i18n from "../../../utils/i18n";

type Props = {
  title: string;
  content: JSX.Element;
  onConfirm: () => Promise<unknown>;
  onSuccess: () => void;
};

export function ConfirmTransactionPopup({
  title,
  content,
  onConfirm,
  onSuccess,
}: Props) {
  const closePopup = useClosePopup();
  const confirmAndSend = useCallback(async () => {
    await onConfirm();
    onSuccess();
    closePopup();
  }, [closePopup, onConfirm, onSuccess]);

  return (
    <PopupComponent
      title={title}
      content={content}
      actions={
        <>
          <PopupAction
            label={i18n("cancel")}
            iconId="xCircle"
            onPress={closePopup}
          />
          <LoadingPopupAction
            label={i18n("fundFromPeachWallet.confirm.confirmAndSend")}
            iconId="arrowRightCircle"
            onPress={confirmAndSend}
            reverseOrder
          />
        </>
      }
    />
  );
}
