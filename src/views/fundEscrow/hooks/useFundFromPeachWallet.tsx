import { NETWORK } from "@env";
import { Address, PartiallySignedTransaction } from "bdk-rn";
import {
  ScriptAmount,
  TransactionDetails,
  TxBuilderResult,
} from "bdk-rn/lib/classes/Bindings";
import { Network } from "bdk-rn/lib/lib/enums";
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
import i18n from "../../../utils/i18n";
import { parseError } from "../../../utils/parseError";
import { isDefined } from "../../../utils/validation/isDefined";
import { peachWallet } from "../../../utils/wallet/setWallet";
import {
  buildTransaction,
  getScriptPubKeyFromAddress,
} from "../../../utils/wallet/transaction";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { useSyncWallet } from "../../wallet/hooks/useSyncWallet";
import { ConfirmTransactionPopup } from "./ConfirmTransactionPopup";
import { ConfirmTxPopup } from "./ConfirmTxPopup";
import { useOptimisticTxHistoryUpdate } from "./useOptimisticTxHistoryUpdate";

const getPropsFromFinishedTransaction = async (
  psbt: PartiallySignedTransaction,
) => {
  const tx = await psbt.extractTx();
  const outputs = await tx.output();
  const outputDetails = (
    await Promise.all(
      outputs.map(async (output) => ({
        address: (await peachWallet?.wallet?.isMine(output.script))
          ? undefined
          : await (
              await new Address().fromScript(output.script, NETWORK as Network)
            ).asString(),
        amount: output.value,
      })),
    )
  ).filter((output): output is { address: string; amount: number } =>
    isDefined(output.address),
  );

  const fee = await psbt.feeAmount();

  const amountToConfirm =
    outputDetails.reduce((sum, { amount }) => sum + amount, 0) + fee;

  return {
    amountToConfirm,
    fee,
    outputs: outputDetails,
  };
};

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

  const feeRate = useFeeRate();
  const setFundedFromPeachWallet = useWalletState(
    (state) => state.setFundedFromPeachWallet,
    shallow,
  );
  const setPopup = useSetPopup();

  const onSuccess = useCallback(
    ({ txDetails, offerId, address, addresses }: OnSuccessParams) => {
      optimisticTxHistoryUpdate(txDetails, [offerId]);
      setFundedFromPeachWallet(address);
      addresses.forEach(setFundedFromPeachWallet);
    },
    [optimisticTxHistoryUpdate, setFundedFromPeachWallet],
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
      if (!peachWallet) throw new Error("Peach wallet not defined");
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
        if (addresses.length > 0) {
          const splitAmount = Math.floor(amount / addresses.length);
          const recipients = await Promise.all(
            addresses.map(getScriptPubKeyFromAddress),
          );
          await transaction.setRecipients(
            recipients.map((script) => new ScriptAmount(script, splitAmount)),
          );
        }

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
          const { amountToConfirm, fee, outputs } =
            await getPropsFromFinishedTransaction(psbt);
          return setPopup(
            <ConfirmTransactionPopup
              title={i18n("fundFromPeachWallet.insufficientFunds.title")}
              content={
                <ConfirmTxPopup
                  totalAmount={amountToConfirm}
                  {...{ fee, feeRate, outputs }}
                  text={i18n(
                    "fundFromPeachWallet.insufficientFunds.description.1",
                  )}
                  secondText={i18n(
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
      const { amountToConfirm, fee, outputs } =
        await getPropsFromFinishedTransaction(psbt);

      return setPopup(
        <ConfirmTransactionPopup
          title={i18n("fundFromPeachWallet.confirm.title")}
          content={
            <ConfirmTxPopup
              text={i18n("fundFromPeachWallet.confirm.description")}
              totalAmount={amountToConfirm}
              {...{ feeRate, fee, outputs }}
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
  return (
    <PopupComponent
      title={i18n("fundFromPeachWallet.amountTooLow.title")}
      content={
        <View style={tw`gap-3`}>
          <PeachText>
            {i18n("fundFromPeachWallet.amountTooLow.description.1")}
          </PeachText>
          <BTCAmount amount={available} size="medium" />
          <PeachText>
            {i18n("fundFromPeachWallet.amountTooLow.description.2")}
          </PeachText>
          <BTCAmount amount={needed} size="medium" />
        </View>
      }
      actions={<ClosePopupAction style={tw`justify-center`} />}
    />
  );
}
