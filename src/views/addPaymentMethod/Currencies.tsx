import { Currency } from "../../../peach-api/src/@types/global";
import { PeachScrollView } from "../../components/PeachScrollView";
import { RadioButtons } from "../../components/inputs/RadioButtons";
import { CurrencyType } from "../../store/offerPreferenes/types";
import tw from "../../styles/tailwind";
import { uniqueArray } from "../../utils/array/uniqueArray";
import i18n from "../../utils/i18n";
import { getCurrencyTypeFilter } from "./getCurrencyTypeFilter";
import { usePaymentMethods } from "./usePaymentMethodInfo";

const getDisplayName = (c: Currency) => {
  if (c === "USDT") return i18n(`currency.${c}`);
  if (c === "SAT") return i18n("paymentMethod.lnurl");
  return `${i18n(`currency.${c}`)} (${c})`;
};

type Props = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  type: CurrencyType;
};

export const Currencies = ({ currency, setCurrency, type }: Props) => {
  const { data: paymentMethods } = usePaymentMethods();

  if (!paymentMethods) return null;

  const currencies = paymentMethods
    .reduce((arr: Currency[], info) => arr.concat(info.currencies), [])
    .filter(uniqueArray)
    .filter(getCurrencyTypeFilter(type))
    .map((c) => ({
      value: c,
      display: getDisplayName(c),
    }));
  return (
    <PeachScrollView
      contentContainerStyle={[tw`justify-center grow py-sm`, tw`md:py-md`]}
    >
      <RadioButtons
        items={currencies}
        selectedValue={currency}
        onButtonPress={setCurrency}
      />
    </PeachScrollView>
  );
};
