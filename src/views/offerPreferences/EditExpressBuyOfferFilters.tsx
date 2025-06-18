import { shallow } from "zustand/shallow";
import { Screen } from "../../components/Screen";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { useExpressBuyFilterPreferences } from "../../store/useExpressBuyFilterPreferences/useExpressBuyFilterPreferences";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { AmountSelectorComponent } from "./components/AmountSelectorComponent";
import { PreferenceMethods } from "./components/PreferenceMethods";
import { useTradingAmountLimits } from "./utils/useTradingAmountLimits";

export function EditExpressBuyOfferFilters() {
  const [minAmountLimit, maxAmountLimit] = useTradingAmountLimits("buy");
  const { minAmount, maxAmount, setMinAmount, setMaxAmount } =
    useExpressBuyFilterPreferences(
      (state) => ({
        minAmount: state.minAmount,
        maxAmount: state.maxAmount,
        setMinAmount: state.setMinAmount,
        setMaxAmount: state.setMaxAmount,
      }),
      shallow,
    );
  const rangeIsWithinLimits =
    minAmount >= minAmountLimit && maxAmount <= maxAmountLimit;
  if (!rangeIsWithinLimits) {
    setMinAmount(minAmountLimit);
    setMaxAmount(maxAmountLimit);
  }

  return <ScreenContent />;
}

function ScreenContent() {
  useSettingsStore((state) => state.locale);

  return (
    <Screen
      header={i18n("offer.expressBuy.filter.edit.title")}
      style={tw`gap-6`}
    >
      <AmountSelector setIsSliding={() => {}} />
      <PreferenceMethods type="buy" expressFilter />
    </Screen>
  );
}

function AmountSelector({
  setIsSliding,
}: {
  setIsSliding: (isSliding: boolean) => void;
}) {
  const {
    minAmount,
    maxAmount,
    maxPremium,
    setMinAmount,
    setMaxAmount,
    setMaxPremium,
  } = useExpressBuyFilterPreferences(
    (state) => ({
      minAmount: state.minAmount,
      maxAmount: state.maxAmount,
      maxPremium: state.maxPremium,
      setMinAmount: state.setMinAmount,
      setMaxAmount: state.setMaxAmount,
      setMaxPremium: state.setMaxPremium,
    }),
    shallow,
  );

  const handleAmountChange = (newAmount: [number, number]) => {
    setMinAmount(newAmount[0]);
    setMaxAmount(newAmount[1]);
  };

  return (
    <AmountSelectorComponent
      setIsSliding={setIsSliding}
      range={[minAmount, maxAmount]}
      setRange={handleAmountChange}
      maxPremium={maxPremium}
      setMaxPremium={setMaxPremium}
      showCompetingOffers={false}
    />
  );
}
