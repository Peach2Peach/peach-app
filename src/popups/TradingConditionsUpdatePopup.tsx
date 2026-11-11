import { ParsedPeachText } from "../components/text/ParsedPeachText";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { InfoPopup } from "./InfoPopup";

export type TradingConditionsAudience = "buyer" | "seller";

const TEXT_KEY = {
  buyer: "tradingConditionsUpdate.buyer.text",
  seller: "tradingConditionsUpdate.seller.text",
} as const;

export function TradingConditionsUpdatePopup({
  audience,
}: {
  audience: TradingConditionsAudience;
}) {
  return (
    <InfoPopup
      title={i18n("tradingConditionsUpdate.title")}
      content={
        <ParsedPeachText
          style={tw`text-black-100`}
          parse={[
            {
              pattern: new RegExp(
                i18n.break("tradingConditionsUpdate.text.bold"),
                "u",
              ),
              style: tw`font-baloo-bold`,
            },
          ]}
        >
          {i18n(TEXT_KEY[audience])}
        </ParsedPeachText>
      }
    />
  );
}
