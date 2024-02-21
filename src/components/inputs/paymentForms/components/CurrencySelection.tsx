import { View } from "react-native";
import tw from "../../../../styles/tailwind";
import { getPaymentMethodInfo } from "../../../../utils/paymentMethod/getPaymentMethodInfo";
import { PeachText } from "../../../text/PeachText";
import { CurrencyItem } from "../../CurrencyItem";
import { tolgee } from "../../../../tolgee";

type Props = ComponentProps & {
  paymentMethod: PaymentMethod;
  selectedCurrencies: Currency[];
  onToggle: (currencies: Currency) => void;
};

export const CurrencySelection = ({
  paymentMethod,
  selectedCurrencies,
  onToggle,
  style,
}: Props) => (
  <View style={style}>
    <View style={tw`flex-row items-center`}>
      <PeachText style={tw`input-label`}>
        {tolgee.t("form.additionalCurrencies", { ns: "form" })}
      </PeachText>
    </View>
    <View style={tw`flex-row flex-wrap gap-2 mt-1`}>
      {getPaymentMethodInfo(paymentMethod)?.currencies.map((currency) => (
        <CurrencyItem
          key={currency}
          label={currency}
          isSelected={selectedCurrencies.includes(currency)}
          onPress={() =>
            !selectedCurrencies.includes(currency) ||
            selectedCurrencies.length > 1
              ? onToggle(currency)
              : null
          }
        />
      ))}
    </View>
  </View>
);
