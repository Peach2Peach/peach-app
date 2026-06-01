import { NETWORK } from "@env";
import { Address, Amount } from "bdk-rn";
import type { Psbt } from "bdk-rn";
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
import { peachAPI } from "../../../utils/peachAPI";
import { isDefined } from "../../../utils/validation/isDefined";
import { bdkNetwork, type WalletTx } from "../../../utils/wallet/bdkShim";
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

const getPropsFromFinishedTransaction = (psbt: Psbt) => {
  const tx = psbt.extractTx();
  const outputs = tx.output();
  const network = bdkNetwork(NETWORK);
  const outputDetails = outputs
    .map((output) => ({
      address: peachWallet?.wallet?.isMine(output.scriptPubkey)
        ? undefined
        : Address.fromScript(output.scriptPubkey, network).toString(),
      amount: Number(output.value.toSat()),
    }))
    .filter((output): output is { address: string; amount: number } =>
      isDefined(output.address),
    );

  let fee = 0;
  try {
    fee = Number(psbt.fee());
  } catch {
    fee = 0;
  }

  const amountToConfirm =
    outputDetails.reduce((sum, { amount }) => sum + amount, 0) + fee;

  return {
    amountToConfirm,
    fee,
    outputs: outputDetails,
  };
};

type FundFromWalletParams = {
  offerId?: string;
  contractId?: string;
  amount: number;
  fundingStatus?: FundingStatus["status"];
  address?: string;
  addresses?: string[];
};

type OnSuccessParams = {
  txDetails: WalletTx;
  offerId?: string;
  contractId?: string;
  address: string;
  addresses: string[];
  markOfferAsFundedByPeachWallet?: boolean;
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
    ({
      txDetails,
      offerId,
      contractId,
      address,
      addresses,
      markOfferAsFundedByPeachWallet,
    }: OnSuccessParams) => {
      if (offerId) optimisticTxHistoryUpdate(txDetails, [offerId]);

      // else if (contractId) TODO: add this to txHistoryUpdate

      setFundedFromPeachWallet(address);
      addresses.forEach(setFundedFromPeachWallet);
      if (
        markOfferAsFundedByPeachWallet &&
        (!addresses || addresses.length === 1) &&
        offerId
      ) {
        peachAPI.private.offer.setEscrowAsFundedByPeachWallet({ offerId });
      }
    },
    [optimisticTxHistoryUpdate, setFundedFromPeachWallet],
  );

  const fundFromPeachWallet = useCallback(
    async ({
      offerId,
      contractId,
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

      let psbt: Psbt;
      try {
        let transaction = await buildTransaction({ feeRate });
        if (addresses.length > 0) {
          const splitAmount = Math.floor(amount / addresses.length);
          const recipients = addresses.map(getScriptPubKeyFromAddress);
          transaction = transaction.setRecipients(
            recipients.map((script) => ({
              script,
              amount: Amount.fromSat(BigInt(splitAmount)),
            })),
          );
        }

        psbt = await peachWallet.finishTransaction(transaction);
      } catch (e) {
        const cause = Array.isArray(e) ? e[0] : e;
        const transactionError = parseError(cause);
        if (transactionError !== "INSUFFICIENT_FUNDS")
          return showErrorBanner(transactionError);

        if (addresses.length > 1 || !offerId) {
          // BDK's error message no longer reliably carries the amounts, so show
          // what we already know: the amount needed and the wallet's balance.
          return showErrorBanner("INSUFFICIENT_FUNDS", [
            String(amount),
            String(peachWallet.balance),
          ]);
        }

        // this is the case of funding a single escrow by draining the wallet

        try {
          const transaction = await buildTransaction({
            address,
            feeRate,
            shouldDrainWallet: true,
          });
          const drainPsbt = await peachWallet.finishTransaction(transaction);
          const { amountToConfirm, fee, outputs } =
            getPropsFromFinishedTransaction(drainPsbt);
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
              psbt={drainPsbt}
              onSuccess={(txDetails) =>
                onSuccess({
                  txDetails,
                  offerId,
                  contractId,
                  address,
                  addresses,
                  markOfferAsFundedByPeachWallet: true,
                })
              }
            />,
          );
        } catch (e2) {
          const drainError = parseError(Array.isArray(e2) ? e2[0] : e2);
          if (drainError === "INSUFFICIENT_FUNDS") {
            return showErrorBanner("INSUFFICIENT_FUNDS", [
              String(amount),
              String(peachWallet.balance),
            ]);
          }
          return handleTransactionError(e2);
        }
      }

      const { amountToConfirm, fee, outputs } =
        getPropsFromFinishedTransaction(psbt);

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
          onSuccess={(txDetails) =>
            onSuccess({ txDetails, offerId, contractId, address, addresses })
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
