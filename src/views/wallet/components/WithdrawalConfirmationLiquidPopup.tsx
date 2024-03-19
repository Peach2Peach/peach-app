import { Transaction as LiquidTransaction } from "liquidjs-lib";
import { useClosePopup } from "../../../components/popup/GlobalPopup";
import { PopupAction } from "../../../components/popup/PopupAction";
import { PopupComponent } from "../../../components/popup/PopupComponent";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import i18n from "../../../utils/i18n";
import { peachAPI } from "../../../utils/peachAPI";
import { ConfirmTxPopup } from "../../fundEscrow/hooks/ConfirmTxPopup";
import { useSyncLiquidWallet } from "../hooks/useSyncLiquidWallet";

type Props = {
  amount: number;
  address: string;
  transaction: LiquidTransaction;
  fee: number;
  feeRate: number;
};

export function WithdrawalConfirmationLiquidPopup({
  amount,
  address,
  transaction,
  fee,
  feeRate,
}: Props) {
  const closePopup = useClosePopup();
  const navigation = useStackNavigation();
  const { refetch } = useSyncLiquidWallet();
  const confirm = async () => {
    const { result, error } = await peachAPI.public.liquid.postTx({
      tx: transaction.toHex(),
    });
    if (result) {
      refetch();
      navigation.navigate("homeScreen", { screen: "liquidWallet" });
    }
    if (error) throw Error(error.error);
    closePopup();
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
