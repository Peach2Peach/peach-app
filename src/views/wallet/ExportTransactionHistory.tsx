import { View } from "react-native";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { PeachText } from "../../components/text/PeachText";
import { writeCSV } from "../../hooks/writeCSV";
import { useThemeStore } from "../../store/theme"; // Import the theme store
import tw from "../../styles/tailwind";
import { toShortDateFormat } from "../../utils/date/toShortDateFormat";
import { createCSV } from "../../utils/file/createCSV";
import i18n from "../../utils/i18n";
import { isDefined } from "../../utils/validation/isDefined";
import { useTxSummaries } from "./helpers/useTxSummaries";

export const ExportTransactionHistory = () => {
  const queriesData = useTxSummaries();
  const { isDarkMode } = useThemeStore(); // Access dark mode state

  const onPress = async () => {
    const transactionSummaries = queriesData
      .map((query) => query.data)
      .filter(isDefined);
    const csvValue = createCSVValue(transactionSummaries);
    await writeCSV(csvValue, "transaction-history.csv");
  };

  return (
    <Screen header={i18n("wallet.exportHistory.title")}>
      <View style={tw`justify-center gap-8 grow`}>
        <PeachText
          style={tw`body-l ${isDarkMode ? "text-primary-background-light-color" : "text-black-100"}`}
        >
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
  const headers = ["Date", "Type", "Amount", "Transaction ID"];
  const fields = {
    Date: ({ date }: TransactionSummary) => toShortDateFormat(date, true),
    Type: ({ type }: TransactionSummary) => type,
    Amount: ({ amount }: TransactionSummary) => amount,
    "Transaction ID": ({ id }: TransactionSummary) => id,
  };

  return createCSV(transactionSummaries, headers, fields);
}
