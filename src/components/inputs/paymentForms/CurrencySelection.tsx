import { View } from "react-native";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { getPaymentMethodInfo } from "../../../utils/paymentMethod/getPaymentMethodInfo";
import { PeachText } from "../../text/PeachText";
import { CurrencyItem } from "../CurrencyItem";

type Props = {
  paymentMethod: PaymentMethod;
  selectedCurrencies: Currency[];
  onToggle: (currencies: Currency) => void;
};

export const CurrencySelection = ({
  paymentMethod,
  selectedCurrencies,
  onToggle,
}: Props) => (
  <View>
    <View style={tw`flex-row items-center`}>
      <PeachText style={tw`input-label`}>
        {i18n("form.additionalCurrencies")}
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
