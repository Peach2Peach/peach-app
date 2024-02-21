import { View } from "react-native";
import { PeachText } from "../../../components/text/PeachText";
import { PriceFormat } from "../../../components/text/PriceFormat";
import tw from "../../../styles/tailwind";
import { tolgee } from "../../../tolgee";

const textStyle = tw`font-bold tooltip`;

type Props = ComponentProps & {
  amount: number;
  limit: number;
  displayCurrency: Currency;
  type: "daily" | "monthly" | "yearly";
};
export const TradingLimitAmount = ({
  amount,
  limit,
  displayCurrency,
  style,
  type,
}: Props) => (
  <View style={style}>
    <PeachText style={tw`tooltip text-black-65`}>
      {tolgee.t(`profile.tradingLimits.${type}`, { ns: "profile" })}
      {"  "}
      <PriceFormat
        style={[textStyle, tw`text-primary-main`]}
        currency={displayCurrency}
        amount={amount}
        round
      />
      <PeachText style={[textStyle, tw`text-black-65`]}> / </PeachText>
      <PriceFormat
        style={[textStyle, tw`text-primary-mild-1`]}
        currency={displayCurrency}
        amount={limit}
        round
      />
    </PeachText>
  </View>
);
