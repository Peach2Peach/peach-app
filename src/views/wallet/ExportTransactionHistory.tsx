import { Payment } from "@breeztech/react-native-breez-sdk";
import { View } from "react-native";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { PeachText } from "../../components/text/PeachText";
import { MSINASECOND } from "../../constants";
import { useRoute } from "../../hooks/useRoute";
import { writeCSV } from "../../hooks/writeCSV";
import tw from "../../styles/tailwind";
import { toShortDateFormat } from "../../utils/date/toShortDateFormat";
import { createCSV } from "../../utils/file/createCSV";
import i18n from "../../utils/i18n";
import { keys } from "../../utils/object/keys";
import { isDefined } from "../../utils/validation/isDefined";
import { useTxSummaries } from "./helpers/useTxSummaries";
import { useTxSummariesLiquid } from "./helpers/useTxSummariesLiquid";
import { useLightningPayments } from "./hooks/useLightningPayments";
import { MSAT_PER_SAT } from "./hooks/useLightningWalletBalance";

export const ExportTransactionHistory = () => {
  const { chain } = useRoute<"exportTransactionHistory">().params;
  const queriesDataBitcoin = useTxSummaries();
  const queriesDataLiquid = useTxSummariesLiquid();
  const { data: lightningPayments } = useLightningPayments();

  const onPress = async () => {
    const transactionSummaries = (
      chain === "bitcoin" ? queriesDataBitcoin : queriesDataLiquid
    )
      .map((query) => query.data)
      .filter(isDefined);
    const csvValue =
      chain === "lightning"
        ? createCSVValueLightning(lightningPayments)
        : createCSVValue(transactionSummaries);
    await writeCSV(csvValue, "transaction-history.csv");
  };

  return (
    <Screen header={i18n("wallet.exportHistory.title")}>
      <View style={tw`justify-center gap-8 grow`}>
        <PeachText style={tw`body-l`}>
          {`${i18n("wallet.exportHistory.description")}
  • ${i18n("wallet.exportHistory.description.point1")}
  • ${i18n("wallet.exportHistory.description.point2")}
  • ${i18n("wallet.exportHistory.description.point3")}
  • ${i18n("wallet.exportHistory.description.point4")}`}
        </PeachText>
      </View>
      <Button style={tw`self-center`} onPress={onPress}>
        {i18n("wallet.exportHistory.export")}
      </Button>
    </Screen>
  );
};

function createCSVValue(transactionSummaries: TransactionSummary[]) {
  const fields = {
    Date: ({ date }: TransactionSummary) => toShortDateFormat(date, true),
    Type: ({ type }: TransactionSummary) => type,
    Amount: ({ amount }: TransactionSummary) => amount,
    "Transaction ID": ({ id }: TransactionSummary) => id,
  };

  return createCSV(transactionSummaries, keys(fields), fields);
}

function createCSVValueLightning(payments: Payment[]) {
  const fields = {
    Date: ({ paymentTime }: Payment) =>
      toShortDateFormat(new Date(paymentTime * MSINASECOND), true),
    Type: ({ paymentType }: Payment) => paymentType,
    Amount: ({ amountMsat }: Payment) => amountMsat / MSAT_PER_SAT,
    ID: ({ id }: Payment) => id,
  };

  return createCSV(payments, keys(fields), fields);
}
