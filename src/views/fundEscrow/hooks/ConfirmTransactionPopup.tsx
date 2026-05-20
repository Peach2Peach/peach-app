import { PartiallySignedTransaction } from "bdk-rn";
import { type ReactElement, useCallback } from "react";
import { useClosePopup } from "../../../components/popup/GlobalPopup";
import { PopupAction } from "../../../components/popup/PopupAction";
import { PopupComponent } from "../../../components/popup/PopupComponent";
import { LoadingPopupAction } from "../../../components/popup/actions/LoadingPopupAction";
import { useSetToast } from "../../../components/toast/Toast";
import { useHandleTransactionError } from "../../../hooks/error/useHandleTransactionError";
import i18n from "../../../utils/i18n";
import { peachWallet } from "../../../utils/wallet/setWallet";

type Props = {
  title: string;
  content: ReactElement;
  psbt: PartiallySignedTransaction;
  onSuccess: () => void;
};

export function ConfirmTransactionPopup({
  title,
  content,
  psbt,
  onSuccess,
}: Props) {
  const closePopup = useClosePopup();
  const handleTransactionError = useHandleTransactionError();
  const setToast = useSetToast();
  const confirmAndSend = useCallback(async () => {
    try {
      if (!peachWallet) {
        throw new Error("PeachWallet not set");
      }
      await peachWallet.signAndBroadcastPSBT(psbt);
      setToast({ msgKey: "fundFromPeachWallet.confirm.success", color: "yellow" });
      onSuccess();
    } catch (e) {
      handleTransactionError(e);
    } finally {
      closePopup();
    }
  }, [closePopup, handleTransactionError, onSuccess, psbt, setToast]);

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
