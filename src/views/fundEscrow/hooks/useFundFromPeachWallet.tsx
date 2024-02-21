import { PartiallySignedTransaction } from "bdk-rn";
import {
  TransactionDetails,
  TxBuilderResult,
} from "bdk-rn/lib/classes/Bindings";
import { useCallback } from "react";
import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { BTCAmount } from "../../../components/bitcoin/BTCAmount";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import { PopupComponent } from "../../../components/popup/PopupComponent";
import { ClosePopupAction } from "../../../components/popup/actions/ClosePopupAction";
import { PeachText } from "../../../components/text/PeachText";
import { useHandleTransactionError } from "../../../hooks/error/useHandleTransactionError";
import { useFeeRate } from "../../../hooks/useFeeRate";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { useConfigStore } from "../../../store/configStore/configStore";
import tw from "../../../styles/tailwind";
import { parseError } from "../../../utils/parseError";
import { peachWallet } from "../../../utils/wallet/setWallet";
import {
  buildTransaction,
  setMultipleRecipients,
} from "../../../utils/wallet/transaction";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { useSyncWallet } from "../../wallet/hooks/useSyncWallet";
import { ConfirmTransactionPopup } from "./ConfirmTransactionPopup";
import { ConfirmTxPopup } from "./ConfirmTxPopup";
import { useOptimisticTxHistoryUpdate } from "./useOptimisticTxHistoryUpdate";
import { useTranslate } from "@tolgee/react";

const getPropsFromFinishedTransaction = async (
  psbt: PartiallySignedTransaction,
  { sent, received }: TransactionDetails,
) => ({
  amountToConfirm: sent - received,
  fee: await psbt.feeAmount(),
});

type FundFromWalletParams = {
  offerId: string;
  amount: number;
  fundingStatus?: FundingStatus["status"];
  address?: string;
  addresses?: string[];
};

type OnSuccessParams = {
  txDetails: TransactionDetails;
  offerId: string;
  address: string;
  addresses: string[];
};

export const useFundFromPeachWallet = () => {
  const minTradingAmount = useConfigStore((state) => state.minTradingAmount);
  const showErrorBanner = useShowErrorBanner();
  const handleTransactionError = useHandleTransactionError();
  const optimisticTxHistoryUpdate = useOptimisticTxHistoryUpdate();
  const { refetch: syncPeachWallet } = useSyncWallet();
  const { t } = useTranslate("unassigned");

  const feeRate = useFeeRate();
  const [setFundedFromPeachWallet, unregisterFundMultiple] = useWalletState(
    (state) => [state.setFundedFromPeachWallet, state.unregisterFundMultiple],
    shallow,
  );
  const setPopup = useSetPopup();

  const onSuccess = useCallback(
    ({ txDetails, offerId, address, addresses }: OnSuccessParams) => {
      optimisticTxHistoryUpdate(txDetails, offerId);
      unregisterFundMultiple(address);
      setFundedFromPeachWallet(address);
      addresses.forEach(setFundedFromPeachWallet);
    },
    [
      optimisticTxHistoryUpdate,
      setFundedFromPeachWallet,
      unregisterFundMultiple,
    ],
  );

  const fundFromPeachWallet = useCallback(
    async ({
      offerId,
      amount,
      fundingStatus = "NULL",
      address,
      addresses = [],
    }: FundFromWalletParams) => {
      if (!address || !amount || fundingStatus !== "NULL") return undefined;
      await syncPeachWallet();
      if (peachWallet.balance < (addresses.length || 1) * minTradingAmount) {
        return setPopup(
          <AmountTooLowPopup
            available={peachWallet.balance}
            needed={(addresses.length || 1) * minTradingAmount}
          />,
        );
      }

      let finishedTransaction: TxBuilderResult;
      try {
        const transaction = await buildTransaction({ feeRate });
        if (addresses.length > 0)
          await setMultipleRecipients(transaction, amount, addresses);

        finishedTransaction = await peachWallet.finishTransaction(transaction);
      } catch (e) {
        const transactionError = parseError(Array.isArray(e) ? e[0] : e);
        if (transactionError !== "INSUFFICIENT_FUNDS")
          return showErrorBanner(transactionError);

        if (addresses.length > 1) {
          const { available } = Array.isArray(e) ? e[1] : { available: 0 };
          return showErrorBanner("INSUFFICIENT_FUNDS", [amount, available]);
        }

        try {
          const transaction = await buildTransaction({
            address,
            feeRate,
            shouldDrainWallet: true,
          });
          finishedTransaction =
            await peachWallet.finishTransaction(transaction);
          const { txDetails, psbt } = finishedTransaction;
          const { amountToConfirm, fee } =
            await getPropsFromFinishedTransaction(psbt, txDetails);
          return setPopup(
            <ConfirmTransactionPopup
              title={t("fundFromPeachWallet.insufficientFunds.title")}
              content={
                <ConfirmTxPopup
                  amount={amountToConfirm}
                  {...{ address, fee, feeRate }}
                  text={t(
                    "fundFromPeachWallet.insufficientFunds.description.1",
                  )}
                  secondText={t(
                    "fundFromPeachWallet.insufficientFunds.description.2",
                  )}
                />
              }
              psbt={psbt}
              onSuccess={() =>
                onSuccess({ txDetails, offerId, address, addresses })
              }
            />,
          );
        } catch (e2) {
          return handleTransactionError(e2);
        }
      }

      const { txDetails, psbt } = finishedTransaction;
      const { amountToConfirm, fee } = await getPropsFromFinishedTransaction(
        psbt,
        txDetails,
      );
      return setPopup(
        <ConfirmTransactionPopup
          title={t("fundFromPeachWallet.confirm.title")}
          content={
            <ConfirmTxPopup
              text={t("fundFromPeachWallet.confirm.description")}
              amount={amountToConfirm}
              {...{ address, feeRate, fee }}
            />
          }
          psbt={psbt}
          onSuccess={() =>
            onSuccess({ txDetails, offerId, address, addresses })
          }
        />,
      );
    },
    [
      feeRate,
      handleTransactionError,
      minTradingAmount,
      onSuccess,
      setPopup,
      showErrorBanner,
      syncPeachWallet,
    ],
  );

  return fundFromPeachWallet;
};

function AmountTooLowPopup({
  available,
  needed,
}: {
  available: number;
  needed: number;
}) {
  const { t } = useTranslate("unassigned");
  return (
    <PopupComponent
      title={t("fundFromPeachWallet.amountTooLow.title")}
      content={
        <View style={tw`gap-3`}>
          <PeachText>
            {t("fundFromPeachWallet.amountTooLow.description.1")}
          </PeachText>
          <BTCAmount amount={available} size="medium" />
          <PeachText>
            {t("fundFromPeachWallet.amountTooLow.description.2")}
          </PeachText>
          <BTCAmount amount={needed} size="medium" />
        </View>
      }
      actions={<ClosePopupAction style={tw`justify-center`} />}
    />
  );
}
