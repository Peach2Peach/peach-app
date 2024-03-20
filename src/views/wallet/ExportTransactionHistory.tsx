import { View } from "react-native";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { PeachText } from "../../components/text/PeachText";
import { writeCSV } from "../../hooks/writeCSV";
import tw from "../../styles/tailwind";
import { toShortDateFormat } from "../../utils/date/toShortDateFormat";
import { createCSV } from "../../utils/file/createCSV";
import { isDefined } from "../../utils/validation/isDefined";
import { useTxSummaries } from "./helpers/useTxSummaries";
import { useTranslate } from "@tolgee/react";

export const ExportTransactionHistory = () => {
  const queriesData = useTxSummaries();

  const onPress = async () => {
    const transactionSummaries = queriesData
      .map((query) => query.data)
      .filter(isDefined);
    const csvValue = createCSVValue(transactionSummaries);
    await writeCSV(csvValue, "transaction-history.csv");
  };
  const { t } = useTranslate("wallet");

  return (
    <Screen header={t("wallet.exportHistory.title")}>
      <View style={tw`justify-center gap-8 grow`}>
        <PeachText style={tw`body-l`}>
          {`${t("wallet.exportHistory.description")}
  • ${t("wallet.exportHistory.description.point1")}
  • ${t("wallet.exportHistory.description.point2")}
  • ${t("wallet.exportHistory.description.point3")}
  • ${t("wallet.exportHistory.description.point4")}`}
        </PeachText>
      </View>
      <Button style={tw`self-center`} onPress={onPress}>
        {t("wallet.exportHistory.export")}
      </Button>
    </Screen>
  );
};

function createCSVValue(transactionSummaries: TransactionSummary[]) {
  const headers = ["Date", "Type", "Amount", "Transaction ID"];
  const fields = {
    Date: ({ date }: TransactionSummary) => toShortDateFormat(date, true),
    Type: ({ type }: TransactionSummary) => type,
    Amount: ({ amount }: TransactionSummary) => amount,
    "Transaction ID": ({ id }: TransactionSummary) => id,
  };

  return createCSV(transactionSummaries, headers, fields);
}
