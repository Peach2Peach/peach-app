import { NETWORK } from "@env";
import { Transaction } from "bitcoinjs-lib";
import { useMemo } from "react";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { isRBFEnabled } from "../../../utils/bitcoin/isRBFEnabled";
import { showTransaction } from "../../../utils/bitcoin/showTransaction";
import { canBumpNetworkFees } from "../helpers/canBumpNetworkFees";
import { useGetTransactionDestinationAddress } from "../helpers/useGetTransactionDestinationAddress";

const incomingTxType: TransactionType[] = ["DEPOSIT", "REFUND", "TRADE"];

type Props = {
  transactionDetails: Transaction;
  transactionSummary: TransactionSummary;
};
export const useTransactionDetailsInfoSetup = ({
  transactionDetails,
  transactionSummary,
}: Props) => {
  const navigation = useStackNavigation();
  const receivingAddress = useGetTransactionDestinationAddress({
    outs: transactionDetails.outs || [],
    incoming: incomingTxType.includes(transactionSummary.type),
  });
  const rbfEnabled = transactionDetails && isRBFEnabled(transactionDetails);
  const canBumpFees = useMemo(
    () => rbfEnabled && canBumpNetworkFees(transactionSummary),
    [rbfEnabled, transactionSummary],
  );
  const goToBumpNetworkFees = () =>
    navigation.navigateDeprecated("bumpNetworkFees", {
      txId: transactionSummary.id,
    });
  const openInExplorer = () => showTransaction(transactionSummary.id, NETWORK);

  return {
    receivingAddress,
    canBumpFees,
    goToBumpNetworkFees,
    openInExplorer,
  };
};
