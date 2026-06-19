import { View } from "react-native";
import tw from "../../../../styles/tailwind";
import i18n, { useI18n } from "../../../../utils/i18n";
import { usePaymentMethodInfo } from "../../../../views/addPaymentMethod/usePaymentMethodInfo";
import { PeachText } from "../../../text/PeachText";
import { CurrencyItem } from "../../CurrencyItem";

type Props = ComponentProps & {
  paymentMethod: PaymentMethod;
  selectedCurrencies: Currency[];
  onToggle: (currencies: Currency) => void;
  disabled?: boolean;
  allSelected?: boolean;
  singleCase?: boolean;
};

export const CurrencySelection = ({
  paymentMethod,
  selectedCurrencies,
  onToggle,
  style,
  disabled,
  allSelected,
  singleCase,
}: Props) => {
  useI18n();
  const { data: paymentMethodInfo } = usePaymentMethodInfo(paymentMethod);

  const supportedCurrencies = paymentMethodInfo?.currencies ?? [];
  // when editing, the payment method may hold currencies that are no longer
  // supported. Render them too so the user can still de-select them.
  const unsupportedSelectedCurrencies = selectedCurrencies.filter(
    (currency) => !supportedCurrencies.includes(currency),
  );
  const currencies = [...supportedCurrencies, ...unsupportedSelectedCurrencies];

  return (
    <View style={style}>
      <View style={tw`flex-row items-center`}>
        <PeachText style={tw`input-label`}>
          {i18n(
            singleCase ? "form.finalCurrency" : "form.additionalCurrencies",
          )}
        </PeachText>
      </View>
      <View
        style={tw`flex-row flex-wrap gap-2 mt-1 ${singleCase ? "mb-4" : ""}`}
      >
        {currencies.map((currency) => (
          <CurrencyItem
            key={currency}
            label={currency}
            isSelected={allSelected || selectedCurrencies.includes(currency)}
            onPress={() =>
              !disabled &&
              (!selectedCurrencies.includes(currency) ||
                selectedCurrencies.length > 1)
                ? onToggle(currency)
                : null
            }
          />
        ))}
      </View>
    </View>
  );
};
