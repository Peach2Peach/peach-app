import { shallow } from "zustand/shallow";
import { Screen } from "../../components/Screen";
import { useExpressSellFilterPreferences } from "../../store/useExpressSellFilterPreference/useExpressSellFilterPreference";
import i18n from "../../utils/i18n";
import { AmountSelector } from "./Sell";

export function EditExpressSellOfferFilters() {
  const { amount, minPremium, setAmount, setMinPremium } =
    useExpressSellFilterPreferences(
      (state) => ({
        amount: state.amount,
        minPremium: state.minPremium,
        setAmount: state.setAmount,
        setMinPremium: state.setMinPremium,
      }),
      shallow,
    );

  return (
    <Screen header={i18n("offer.expressSell.filter.edit.title")}>
      <AmountSelector
        setIsSliding={() => {}}
        amount={amount}
        setAmount={setAmount}
        premium={minPremium}
        setPremium={setMinPremium}
        showCompetingSellOffers={false}
        minPremiumSearchCase
      />
    </Screen>
  );
}
