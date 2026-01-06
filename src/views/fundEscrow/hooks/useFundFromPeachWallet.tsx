import { NETWORK } from "@env";
import {
  Address,
  Amount,
  Psbt,
  PsbtInterface,
  TransactionInterface
} from "bdk-rn";
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
import { convertBitcoinNetworkToBDKNetwork } from "../../../utils/bitcoin/convertBitcoinNetworkToBDKNetwork";
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

const getPropsFromFinishedTransaction = async (psbt: Psbt) => {
  console.log("in...")
  const tx = psbt.extractTx();
  console.log("out...")
  const outputs = tx.output();
  const outputDetails = outputs
    .map((output) => ({
      address: peachWallet?.wallet?.isMine(output.scriptPubkey)
        ? undefined
        : Address.fromScript(
            output.scriptPubkey,
            convertBitcoinNetworkToBDKNetwork(NETWORK),
          ).toQrUri(),
      amount: Number(output.value.toSat()),
    }))

    .filter((output): output is { address: string; amount: number } =>
      isDefined(output.address),
    );

  const fee = Number(psbt.fee());

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
  txDetails: TransactionInterface;
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
      // optimisticTxHistoryUpdate(txDetails, [offerId]); TODO: BDK: WORK ON THIS
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

      let finishedTransaction: PsbtInterface;
      try {
        console.log("a1..");
        let transaction = await buildTransaction({ feeRate });
        console.log("a2..");
        if (addresses.length > 0) {
          console.log("a3..");
          const splitAmount = Math.floor(amount / addresses.length);
          console.log("a31..");
          const recipients = await Promise.all(
            addresses.map(getScriptPubKeyFromAddress),
          );
          

          for (let i = 0; i < recipients.length; i++) {
            
            transaction= transaction.addRecipient(
              recipients[i],
              Amount.fromSat(BigInt(splitAmount)),
            );
          }

          // transaction?.addRecipient(script);
          // transaction?.setRecipients(
          //   recipients.map((script) =>
          //     ScriptAmount.create(script, splitAmount),
          //   ),
          // );
        }
        console.log("a4..");

        finishedTransaction = await peachWallet.finishTransaction(transaction);
        console.log("finishedTransaction",finishedTransaction)
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

          const potentialTx = finishedTransaction.extractTx()
          const outputs = potentialTx.output().map( (x) => { 
            if (peachWallet?.wallet?.isMine(x.scriptPubkey)) return undefined;
            return {amount: Number(x.value.toSat()), 
                        address: Address.fromScript(x.scriptPubkey,convertBitcoinNetworkToBDKNetwork(NETWORK)).toQrUri() 
                      
                      }} ).filter(item => !!item)
          const fee = Number(finishedTransaction.fee())
          
          const amountToConfirm = potentialTx.output().reduce( (sum,item) => sum + Number(item.value.toSat()),0 )
          // const { txDetails, psbt } = finishedTransaction;
          console.log("zizi")
          // const { amountToConfirm, fee, outputs } =
          //   await getPropsFromFinishedTransaction(psbt);
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
              psbt={finishedTransaction}
              onSuccess={() =>
                onSuccess({ txDetails:potentialTx, offerId, address, addresses })
              }
            />,
          );
        } catch (e2) {
          return handleTransactionError(e2);
        }
      }


      
      console.log("SADFDJK")

      const potentialTx = finishedTransaction.extractTx()
      const outputs = potentialTx.output().map( (x) => { 
        if (peachWallet?.wallet?.isMine(x.scriptPubkey)) return undefined;
        return {amount: Number(x.value.toSat()), 
                    address: Address.fromScript(x.scriptPubkey,convertBitcoinNetworkToBDKNetwork(NETWORK)).toQrUri() 
                  
                  }} ).filter(item => !!item)
      const fee = Number(finishedTransaction.fee())
      
      const amountToConfirm = potentialTx.output().reduce( (sum,item) => sum + Number(item.value.toSat()),0 )

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
          psbt={finishedTransaction}
          onSuccess={() =>
            onSuccess({ txDetails:potentialTx, offerId, address, addresses })
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
