import { View } from "react-native";
import { ContractSummary } from "../../../peach-api/src/@types/contract";
import { OfferSummary } from "../../../peach-api/src/@types/offer";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { PeachText } from "../../components/text/PeachText";
import { THOUSANDS_GROUP } from "../../constants";
import { useTradeSummaries } from "../../hooks/query/useTradeSummaries";
import { writeCSV } from "../../hooks/writeCSV";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import { sortByKey } from "../../utils/array/sortByKey";
import { contractIdToHex } from "../../utils/contract/contractIdToHex";
import { toShortDateFormat } from "../../utils/date/toShortDateFormat";
import { createCSV } from "../../utils/file/createCSV";
import i18n from "../../utils/i18n";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { groupChars } from "../../utils/string/groupChars";
import { priceFormat } from "../../utils/string/priceFormat";
import { getThemeForTradeItem } from "./utils/getThemeForTradeItem";
import { isContractSummary } from "./utils/isContractSummary";

export function ExportTradeHistory() {
  const { summaries } = useTradeSummaries();
  const { isDarkMode } = useThemeStore();

  const onPress = async () => {
    const csvValue = createCSVValue(
      summaries["yourTrades.history"].sort(sortByKey("creationDate")),
    );
    await writeCSV(csvValue, "trade-history.csv");
  };

  return (
    <Screen header={i18n("exportTradeHistory.title")}>
      <View style={tw`justify-center gap-8 grow`}>
        <PeachText
          style={tw`body-l ${isDarkMode ? "text-primary-background-light-color" : "text-black-100"}`}
        >
          {`${i18n("exportTradeHistory.description")}

  • ${i18n("exportTradeHistory.date")}
  • ${i18n("exportTradeHistory.tradeID")}
  • ${i18n("exportTradeHistory.type")}
  • ${i18n("exportTradeHistory.amount")}
  • ${i18n("exportTradeHistory.price")}`}
        </PeachText>
      </View>
      <Button style={tw`self-center`} onPress={onPress}>
        {i18n("exportTradeHistory.export")}
      </Button>
    </Screen>
  );
}

function createCSVValue(tradeSummaries: (OfferSummary | ContractSummary)[]) {
  const headers = [
    "Date",
    "Trade ID",
    "Type",
    "Amount",
    "Price",
    "Currency",
    "Premium",
  ];
  const fields = {
    Date: (d: OfferSummary | ContractSummary) =>
      toShortDateFormat(d.creationDate),
    "Trade ID": (d: OfferSummary | ContractSummary) =>
      (isContractSummary(d)
        ? contractIdToHex(d.id)
        : offerIdToHex(d.id)
      ).replaceAll("‑", "-"),
    Type: getTradeSummaryType,
    Amount: (d: OfferSummary | ContractSummary) => {
      const { amount } = d;
      return String(amount);
    },
    Price: (d: OfferSummary | ContractSummary) => {
      const tradePrice =
        "price" in d
          ? d.currency === "SAT"
            ? groupChars(String(d.price), THOUSANDS_GROUP)
            : priceFormat(d.price)
          : "";
      const price = "price" in d ? `${tradePrice}` : "";
      return price;
    },
    Currency: (d: OfferSummary | ContractSummary) =>
      "currency" in d ? d.currency : "",

    Premium: (d: OfferSummary | ContractSummary) =>
      "premium" in d ? d.premium : "",
  };

  return createCSV(tradeSummaries, headers, fields);
}

function getTradeSummaryType(tradeSummary: OfferSummary | ContractSummary) {
  const { iconId } = getThemeForTradeItem(tradeSummary);
  const sellerLostDispute =
    iconId === "alertOctagon" &&
    "disputeWinner" in tradeSummary &&
    tradeSummary.disputeWinner === "buyer";

  if (iconId === "buy") {
    return "bought";
  } else if (iconId === "sell" || sellerLostDispute) {
    return "sold";
  }
  return "canceled";
}
