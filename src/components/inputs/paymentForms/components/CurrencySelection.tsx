import { View } from "react-native";
import tw from "../../../../styles/tailwind";
import { getPaymentMethodInfo } from "../../../../utils/paymentMethod/getPaymentMethodInfo";
import { PeachText } from "../../../text/PeachText";
import { CurrencyItem } from "../../CurrencyItem";
import { useTranslate } from "@tolgee/react";

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
}: Props) => {
  const { t } = useTranslate("form");

  return (
    <View style={style}>
      <View style={tw`flex-row items-center`}>
        <PeachText style={tw`input-label`}>
          {t("form.additionalCurrencies")}
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
};
