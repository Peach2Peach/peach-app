import { ParsedPeachText } from "../components/text/ParsedPeachText";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { InfoPopup } from "./InfoPopup";

export function TradingConditionsUpdatePopup() {
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
          {i18n("tradingConditionsUpdate.text")}
        </ParsedPeachText>
      }
    />
  );
}
