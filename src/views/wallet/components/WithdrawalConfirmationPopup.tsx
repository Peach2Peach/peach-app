import { PartiallySignedTransaction } from "bdk-rn";
import { useClosePopup } from "../../../components/popup/GlobalPopup";
import { PopupAction } from "../../../components/popup/PopupAction";
import { PopupComponent } from "../../../components/popup/PopupComponent";
import { useHandleTransactionError } from "../../../hooks/error/useHandleTransactionError";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import i18n from "../../../utils/i18n";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { ConfirmTxPopup } from "../../fundEscrow/hooks/ConfirmTxPopup";

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
  const closePopup = useClosePopup();
  const setSelectedUTXOIds = useWalletState(
    (state) => state.setSelectedUTXOIds,
  );
  const navigation = useStackNavigation();
  const handleTransactionError = useHandleTransactionError();

  const confirm = async () => {
    if (!peachWallet) throw new Error("Peach wallet not set");
    try {
      await peachWallet.signAndBroadcastPSBT(psbt);
    } catch (e) {
      handleTransactionError(e);
    }
    setSelectedUTXOIds([]);
    closePopup();
    navigation.navigateDeprecated("homeScreen", { screen: "wallet" });
  };

  return (
    <PopupComponent
      title={i18n("wallet.confirmWithdraw.title")}
      content={
        <ConfirmTxPopup
          {...{ amount, address, fee, feeRate }}
          text={i18n("wallet.sendBitcoin.youreSending")}
        />
      }
      actions={
        <>
          <PopupAction
            label={i18n("cancel")}
            iconId="xCircle"
            onPress={closePopup}
          />
          <PopupAction
            label={i18n("wallet.confirmWithdraw.confirm")}
            iconId="arrowRightCircle"
            onPress={confirm}
            reverseOrder
          />
        </>
      }
    />
  );
}
