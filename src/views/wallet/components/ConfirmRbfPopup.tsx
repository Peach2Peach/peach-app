import { PartiallySignedTransaction } from "bdk-rn";
import { Transaction } from "bitcoinjs-lib";
import { useCallback } from "react";
import { View } from "react-native";
import { Icon } from "../../../components/Icon";
import { BTCAmount } from "../../../components/bitcoin/BTCAmount";
import { useClosePopup } from "../../../components/popup/GlobalPopup";
import { PopupAction } from "../../../components/popup/PopupAction";
import { PopupComponent } from "../../../components/popup/PopupComponent";
import { LoadingPopupAction } from "../../../components/popup/actions/LoadingPopupAction";
import { PeachText } from "../../../components/text/PeachText";
import { CENT } from "../../../constants";
import { useHandleTransactionError } from "../../../hooks/error/useHandleTransactionError";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { round } from "../../../utils/math/round";
import { peachWallet } from "../../../utils/wallet/setWallet";

type Props = {
  currentFeeRate: number;
  newFeeRate: number;
  transaction: Transaction;
  sendingAmount: number;
  finishedTransaction: PartiallySignedTransaction;
  onSuccess: (txId: string) => void;
};

export function ConfirmRbfPopup({
  currentFeeRate,
  newFeeRate,
  transaction,
  sendingAmount,
  finishedTransaction,
  onSuccess,
}: Props) {
  const closePopup = useClosePopup();
  const handleTransactionError = useHandleTransactionError();

  const confirmAndSend = useCallback(async () => {
    try {
      if (!peachWallet) throw new Error("PeachWallet not set");
      const [txId] = await Promise.all([
        finishedTransaction.txid(),
        peachWallet.signAndBroadcastPSBT(finishedTransaction),
      ]);

      onSuccess(txId);
    } catch (e) {
      handleTransactionError(e);
    } finally {
      closePopup();
    }
  }, [closePopup, finishedTransaction, handleTransactionError, onSuccess]);

  return (
    <PopupComponent
      title={i18n("wallet.bumpNetworkFees.confirmRbf.title")}
      content={
        <ConfirmRbf
          oldFeeRate={currentFeeRate}
          newFeeRate={newFeeRate}
          bytes={transaction.virtualSize()}
          sendingAmount={sendingAmount}
          hasNoChange={transaction.outs.length === 1}
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

type ContentProps = {
  oldFeeRate: number;
  newFeeRate: number;
  bytes: number;
  sendingAmount: number;
  hasNoChange?: boolean;
};

function ConfirmRbf({
  oldFeeRate,
  newFeeRate,
  bytes,
  sendingAmount,
  hasNoChange,
}: ContentProps) {
  const oldFee = oldFeeRate * bytes;
  const newFee = newFeeRate * bytes;

  return (
    <View style={tw`gap-3`}>
      <PeachText style={tw`text-black-100`}>
        <PeachText style={tw`font-baloo-bold text-black-100`}>
          {i18n("wallet.bumpNetworkFees.confirmRbf.oldFee")}
        </PeachText>
        {oldFeeRate} {i18n("satPerByte")} * {bytes} {i18n("bytes")} =
      </PeachText>
      <View>
        <BTCAmount amount={oldFee} size="medium" textStyle={tw`text-black-100`} />
        <PeachText style={tw`text-primary-main`}>
          {i18n(
            "wallet.bumpNetworkFees.confirmRbf.percentOfTx",
            String(round((oldFee / sendingAmount) * CENT, 1)),
          )}
        </PeachText>
      </View>
      <PeachText style={tw`text-black-100`}>
        <PeachText style={tw`font-baloo-bold text-black-100`}>
          {i18n("wallet.bumpNetworkFees.confirmRbf.newFee")}
        </PeachText>
        {newFeeRate} {i18n("satPerByte")} * {bytes} {i18n("bytes")} =
      </PeachText>
      <View>
        <BTCAmount amount={newFee} size="medium" textStyle={tw`text-black-100`}/>
        <PeachText style={tw`text-primary-main`}>
          {i18n(
            "wallet.bumpNetworkFees.confirmRbf.percentOfTx",
            String(round((newFee / sendingAmount) * CENT, 1)),
          )}
        </PeachText>
      </View>
      {hasNoChange && <NoChangeWarning />}
    </View>
  );
}

function NoChangeWarning() {
  return (
    <View style={tw`flex-row items-center gap-4`}>
      <Icon id="alertTriangle" size={32} color={tw.color("black-100")} />
      <PeachText>
        {i18n("wallet.bumpNetworkFees.confirmRbf.noChange")}
      </PeachText>
    </View>
  );
}
