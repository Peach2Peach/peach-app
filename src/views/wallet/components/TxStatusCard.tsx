import { BitcoinAmountInfo } from "../../../components/statusCard/BitcoinAmountInfo";
import { StatusCard } from "../../../components/statusCard/StatusCard";
import { StatusInfo } from "../../../components/statusCard/StatusInfo";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { getShortDateFormat } from "../../../utils/date/getShortDateFormat";
import { getTxSummaryTitle } from "../helpers/getTxSummaryTitle";
import { TransactionIcon } from "./TransactionIcon";
import { levelMap } from "./levelMap";

type Props = {
  item: Pick<TransactionSummary, "amount" | "chain" | "type" | "date" | "id">;
};

export const TxStatusCard = ({
  item: { type, chain, amount, date, id },
}: Props) => {
  const navigation = useStackNavigation();

  return (
    <StatusCard
      onPress={() => {
        navigation.navigate(
          chain === "bitcoin"
            ? "transactionDetails"
            : "transactionDetailsLiquid",
          { txId: id },
        );
      }}
      color={levelMap[type]}
      statusInfo={
        <StatusInfo
          title={getTxSummaryTitle(type)}
          icon={<TransactionIcon type={type} size={17} />}
          subtext={getShortDateFormat(date)}
        />
      }
      amountInfo={<BitcoinAmountInfo amount={amount} />}
    />
  );
};
