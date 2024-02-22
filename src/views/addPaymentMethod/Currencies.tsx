import { PeachScrollView } from "../../components/PeachScrollView";
import { RadioButtons } from "../../components/inputs/RadioButtons";
import { CURRENCIES } from "../../paymentMethods";
import { CurrencyType } from "../../store/offerPreferences/types";
import tw from "../../styles/tailwind";
import { tolgee } from "../../tolgee";
import { getCurrencyTypeFilter } from "./utils";

const getDisplayName = (c: Currency) => {
  if (c === "USDT") return tolgee.t(`currency.${c}`, { ns: "global" });
  if (c === "SAT")
    return tolgee.t("paymentMethod.lnurl", { ns: "paymentMethod" });
  // @ts-ignore
  return `${tolgee.t(`currency.${c}`, { ns: "global" })} (${c})`;
};

type Props = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  type: CurrencyType;
};

export const Currencies = ({ currency, setCurrency, type }: Props) => {
  const currencies = CURRENCIES.filter(getCurrencyTypeFilter(type)).map(
    (c) => ({
      value: c,
      display: getDisplayName(c),
    }),
  );
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
