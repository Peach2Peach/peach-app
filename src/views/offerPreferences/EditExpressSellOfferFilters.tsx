import { shallow } from "zustand/shallow";
import { Screen } from "../../components/Screen";
import { useExpressSellFilterPreferences } from "../../store/useExpressSellFilterPreference/useExpressSellFilterPreference";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { AmountSelector } from "./Sell";

export function EditExpressSellOfferFilters() {
  const { amount, premium, setAmount, setPremium } =
    useExpressSellFilterPreferences(
      (state) => ({
        amount: state.amount || 20000,
        premium: state.premium,
        setAmount: state.setAmount,
        setPremium: state.setPremium,
      }),
      shallow,
    );

  return (
    <Screen
      header={i18n("offer.expressSell.filter.edit.title")}
      style={tw`gap-6`}
    >
      <AmountSelector
        setIsSliding={() => {}}
        amount={amount}
        setAmount={setAmount}
        premium={premium}
        setPremium={setPremium}
        showCompetingSellOffers={false}
        minPremiumSearchCase
      />
      {/* <PreferenceMethodsForFilter type="sell" /> */}
    </Screen>
  );
}
