import { View } from "react-native";
import { Currency } from "../../../../peach-api/src/@types/global";
import { SATSINBTC } from "../../../constants";
import tw from "../../../styles/tailwind";
import { BTCAmount } from "../../bitcoin/BTCAmount";
import { PeachText } from "../../text/PeachText";
import { PriceFormat } from "../../text/PriceFormat";
import { PremiumText } from "./PremiumText";
import { useTranslate } from "@tolgee/react";

type Props = {
  amount: number;
  price: number;
  currency: Currency;
  premium: number;
};
export function PriceInfo({ amount, price, currency, premium }: Props) {
  const btcPrice = Math.round((price / amount) * SATSINBTC);
  const { t } = useTranslate("global");
  return (
    <View style={tw`items-center`}>
      <View style={tw`items-center justify-center h-7`}>
        <BTCAmount amount={amount} size="medium" />
      </View>
      <PeachText style={tw`text-center`}>
        <PriceFormat
          style={tw`subtitle-1`}
          currency={currency}
          amount={price}
        />
        <PremiumText premium={premium} />
      </PeachText>
      <PeachText style={tw`subtitle-1`}>
        {btcPrice} {t(currency)} / {t("btc")} {/* TODO: understand and fix*/}
      </PeachText>
    </View>
  );
}
