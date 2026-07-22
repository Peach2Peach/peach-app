import type { Psbt } from "bdk-rn";
import { useMemo } from "react";
import { useClosePopup } from "../../../components/popup/GlobalPopup";
import { PopupAction } from "../../../components/popup/PopupAction";
import { PopupComponent } from "../../../components/popup/PopupComponent";
import { LoadingPopupAction } from "../../../components/popup/actions/LoadingPopupAction";
import { useSetToast } from "../../../components/toast/Toast";
import { useHandleTransactionError } from "../../../hooks/error/useHandleTransactionError";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import i18n from "../../../utils/i18n";
import { error } from "../../../utils/log/error";
import { parseError } from "../../../utils/parseError";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { getPsbtOutputs } from "../../../utils/wallet/transaction";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { ConfirmTxPopup } from "../../fundEscrow/hooks/ConfirmTxPopup";

type Props = {
  amount: number;
  address: string;
  psbt: Psbt;
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
  const setToast = useSetToast();

  // show what the psbt actually pays out rather than what was requested, so a
  // mismatch between the two cannot slip past this last confirmation
  const outputs = useMemo(() => {
    try {
      const psbtOutputs = getPsbtOutputs(psbt, address);
      if (psbtOutputs.length) return psbtOutputs;
    } catch (e) {
      error(parseError(e));
    }
    return [{ address, amount }];
  }, [address, amount, psbt]);
  const totalAmount = outputs.reduce((sum, output) => sum + output.amount, 0);

  const confirm = async () => {
    if (!peachWallet) throw new Error("Peach wallet not set");
    try {
      await peachWallet.signAndBroadcastPSBT(psbt);
      setToast({ msgKey: "wallet.confirmWithdraw.success", color: "yellow" });
    } catch (e) {
      handleTransactionError(e);
    }
    setSelectedUTXOIds([]);
    closePopup();
    navigation.navigate("homeScreen", { screen: "wallet" });
  };

  return (
    <PopupComponent
      title={i18n("wallet.confirmWithdraw.title")}
      content={
        <ConfirmTxPopup
          totalAmount={totalAmount}
          outputs={outputs}
          text={i18n("wallet.sendBitcoin.youreSending")}
          {...{ fee, feeRate }}
        />
      }
      actions={
        <>
          <PopupAction
            label={i18n("cancel")}
            iconId="xCircle"
            onPress={closePopup}
          />
          <LoadingPopupAction
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
