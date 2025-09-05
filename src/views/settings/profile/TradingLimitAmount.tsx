import { View } from "react-native";
import { PeachText } from "../../../components/text/PeachText";
import { PriceFormat } from "../../../components/text/PriceFormat";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

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
}: Props) => {
  const { isDarkMode } = useThemeStore();

  return (
    <View style={style}>
      <PeachText
        style={tw`tooltip ${isDarkMode ? "text-backgroundLight-light" : "text-black-65"}`}
      >
        {i18n(`profile.tradingLimits.${type}`)}
        {"  "}
        <PriceFormat
          style={[textStyle, tw`text-primary-main`]}
          currency={displayCurrency}
          amount={amount}
          round
          includeCurrency={false}
        />
        <PeachText
          style={[
            textStyle,
            tw`${isDarkMode ? "text-backgroundLight-light" : "text-black-65"}`,
          ]}
        >
          {" / "}
        </PeachText>
        <PriceFormat
          style={[textStyle, tw`text-primary-mild-1`]}
          currency={displayCurrency}
          amount={limit}
          round
        />
      </PeachText>
    </View>
  );
};
