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
import { round } from "../../../utils/math/round";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { useTranslate } from "@tolgee/react";

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
  const { t } = useTranslate("wallet");
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
      title={t("wallet.bumpNetworkFees.confirmRbf.title")}
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
            label={t("cancel", { ns: "global" })}
            iconId="xCircle"
            onPress={closePopup}
          />
          <LoadingPopupAction
            label={t("fundFromPeachWallet.confirm.confirmAndSend")}
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
  const { t } = useTranslate("wallet");

  return (
    <View style={tw`gap-3`}>
      <PeachText>
        <PeachText style={tw`font-baloo-bold`}>
          {t("wallet.bumpNetworkFees.confirmRbf.oldFee")}
        </PeachText>
        {"\n\n"}
        {oldFeeRate} {t("satPerByte", { ns: "global" })} * {bytes}{" "}
        {t("bytes", { ns: "global" })} =
      </PeachText>
      <View>
        <BTCAmount amount={oldFee} size="medium" />
        <PeachText style={tw`text-primary-main`}>
          {t("wallet.bumpNetworkFees.confirmRbf.percentOfTx", {
            percent: String(round((oldFee / sendingAmount) * CENT, 1)),
          })}
        </PeachText>
      </View>
      <PeachText>
        <PeachText style={tw`font-baloo-bold`}>
          {t("wallet.bumpNetworkFees.confirmRbf.newFee")}
        </PeachText>
        {"\n\n"}
        {newFeeRate} {t("satPerByte", { ns: "global" })} * {bytes}{" "}
        {t("bytes", { ns: "global" })} =
      </PeachText>
      <View>
        <BTCAmount amount={newFee} size="medium" />
        <PeachText style={tw`text-primary-main`}>
          {t("wallet.bumpNetworkFees.confirmRbf.percentOfTx", {
            percent: String(round((newFee / sendingAmount) * CENT, 1)),
          })}
        </PeachText>
      </View>
      {hasNoChange && <NoChangeWarning />}
    </View>
  );
}

function NoChangeWarning() {
  const { t } = useTranslate("wallet");
  return (
    <View style={tw`flex-row items-center gap-4`}>
      <Icon id="alertTriangle" size={32} color={tw.color("black-100")} />
      <PeachText>{t("wallet.bumpNetworkFees.confirmRbf.noChange")}</PeachText>
    </View>
  );
}
