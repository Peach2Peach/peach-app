import { PartiallySignedTransaction } from "bdk-rn";
import { useCallback } from "react";
import { useClosePopup } from "../../../components/popup/GlobalPopup";
import { PopupAction } from "../../../components/popup/PopupAction";
import { PopupComponent } from "../../../components/popup/PopupComponent";
import { LoadingPopupAction } from "../../../components/popup/actions/LoadingPopupAction";
import { useHandleTransactionError } from "../../../hooks/error/useHandleTransactionError";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { useTranslate } from "@tolgee/react";

type Props = {
  title: string;
  content: JSX.Element;
  psbt: PartiallySignedTransaction;
  onSuccess: () => void;
};

export function ConfirmTransactionPopup({
  title,
  content,
  psbt,
  onSuccess,
}: Props) {
  const { t } = useTranslate("global");
  const closePopup = useClosePopup();
  const handleTransactionError = useHandleTransactionError();
  const confirmAndSend = useCallback(async () => {
    try {
      await peachWallet.signAndBroadcastPSBT(psbt);
      onSuccess();
    } catch (e) {
      handleTransactionError(e);
    } finally {
      closePopup();
    }
  }, [closePopup, handleTransactionError, onSuccess, psbt]);

  return (
    <PopupComponent
      title={title}
      content={content}
      actions={
        <>
          <PopupAction
            label={t("cancel")}
            iconId="xCircle"
            onPress={closePopup}
          />
          <LoadingPopupAction
            label={t("fundFromPeachWallet.confirm.confirmAndSend", {
              ns: "unassigned",
            })}
            iconId="arrowRightCircle"
            onPress={confirmAndSend}
            reverseOrder
          />
        </>
      }
    />
  );
}
