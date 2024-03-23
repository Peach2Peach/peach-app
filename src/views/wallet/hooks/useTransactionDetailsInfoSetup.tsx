import { Transaction as BitcoinTransaction } from "bitcoinjs-lib";
import { Transaction as LiquidTransaction } from "liquidjs-lib";
import { useMemo } from "react";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { isRBFEnabled } from "../../../utils/bitcoin/isRBFEnabled";
import { getAddressChain } from "../../../utils/blockchain/getAddressChain";
import { showTransaction } from "../../../utils/blockchain/showTransaction";
import { canBumpNetworkFees } from "../helpers/canBumpNetworkFees";
import { useGetTransactionDestinationAddress } from "../helpers/useGetTransactionDestinationAddress";

const incomingTxType: TransactionType[] = ["DEPOSIT", "REFUND", "TRADE"];

type Props = {
  transactionDetails: BitcoinTransaction | LiquidTransaction;
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
    chain:
      transactionDetails instanceof BitcoinTransaction ? "bitcoin" : "liquid",
  });
  const rbfEnabled = transactionDetails && isRBFEnabled(transactionDetails);
  const canBumpFees = useMemo(
    () => rbfEnabled && canBumpNetworkFees(transactionSummary),
    [rbfEnabled, transactionSummary],
  );
  const goToBumpNetworkFees = () =>
    navigation.navigate("bumpNetworkFees", { txId: transactionSummary.id });
  const openInExplorer = () =>
    showTransaction(transactionSummary.id, getAddressChain(receivingAddress));

  return {
    receivingAddress,
    canBumpFees,
    goToBumpNetworkFees,
    openInExplorer,
  };
};
