import { View } from "react-native";
import { ContractSummary } from "../../../peach-api/src/@types/contract";
import { OfferSummary } from "../../../peach-api/src/@types/offer";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { PeachText } from "../../components/text/PeachText";
import { THOUSANDS_GROUP } from "../../constants";
import { useTradeSummaries } from "../../hooks/query/useTradeSummaries";
import { writeCSV } from "../../hooks/writeCSV";
import tw from "../../styles/tailwind";
import { sortByKey } from "../../utils/array/sortByKey";
import { contractIdToHex } from "../../utils/contract/contractIdToHex";
import { toShortDateFormat } from "../../utils/date/toShortDateFormat";
import { createCSV } from "../../utils/file/createCSV";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { groupChars } from "../../utils/string/groupChars";
import { priceFormat } from "../../utils/string/priceFormat";
import { getThemeForTradeItem } from "./utils/getThemeForTradeItem";
import { isContractSummary } from "./utils/isContractSummary";
import { useTranslate } from "@tolgee/react";

export function ExportTradeHistory() {
  const { summaries } = useTradeSummaries();
  const { t } = useTranslate("unassigned");

  const onPress = async () => {
    const csvValue = createCSVValue(
      summaries["yourTrades.history"].sort(sortByKey("creationDate")),
    );
    await writeCSV(csvValue, "trade-history.csv");
  };

  return (
    <Screen header={t("exportTradeHistory.title")}>
      <View style={tw`justify-center gap-8 grow`}>
        <PeachText style={tw`body-l`}>
          {`${t("exportTradeHistory.description")}

  • ${t("exportTradeHistory.date")}
  • ${t("exportTradeHistory.tradeID")}
  • ${t("exportTradeHistory.type")}
  • ${t("exportTradeHistory.amount")}
  • ${t("exportTradeHistory.price")}`}
        </PeachText>
      </View>
      <Button style={tw`self-center`} onPress={onPress}>
        {t("exportTradeHistory.export")}
      </Button>
    </Screen>
  );
}

function createCSVValue(tradeSummaries: (OfferSummary | ContractSummary)[]) {
  const headers = ["Date", "Trade ID", "Type", "Amount", "Price", "Currency"];
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
