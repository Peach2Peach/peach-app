import { PartiallySignedTransaction } from "bdk-rn";
import { useClosePopup } from "../../../components/popup/GlobalPopup";
import { PopupAction } from "../../../components/popup/PopupAction";
import { PopupComponent } from "../../../components/popup/PopupComponent";
import { useHandleTransactionError } from "../../../hooks/error/useHandleTransactionError";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { ConfirmTxPopup } from "../../fundEscrow/hooks/ConfirmTxPopup";
import { useTranslate } from "@tolgee/react";

type Props = {
  amount: number;
  address: string;
  psbt: PartiallySignedTransaction;
  fee: number;
  feeRate: number;
};

export function WithdrawalConfirmationPopup({
  amount,
  address,
  psbt,
  fee,
  feeRate,
}: Props) {
  const { t } = useTranslate("wallet");

  const closePopup = useClosePopup();
  const setSelectedUTXOIds = useWalletState(
    (state) => state.setSelectedUTXOIds,
  );
  const navigation = useStackNavigation();
  const handleTransactionError = useHandleTransactionError();

  const confirm = async () => {
    try {
      await peachWallet.signAndBroadcastPSBT(psbt);
    } catch (e) {
      handleTransactionError(e);
    }
    setSelectedUTXOIds([]);
    closePopup();
    navigation.navigate("homeScreen", { screen: "wallet" });
  };

  return (
    <PopupComponent
      title={t("wallet.confirmWithdraw.title")}
      content={
        <ConfirmTxPopup
          {...{ amount, address, fee, feeRate }}
          text={t("wallet.sendBitcoin.youreSending")}
        />
      }
      actions={
        <>
          <PopupAction
            label={t("cancel", { ns: "global" })}
            iconId="xCircle"
            onPress={closePopup}
          />
          <PopupAction
            label={t("wallet.confirmWithdraw.confirm")}
            iconId="arrowRightCircle"
            onPress={confirm}
            reverseOrder
          />
        </>
      }
    />
  );
}
