import { TouchableOpacity, View } from "react-native";
import { shallow } from "zustand/shallow";
import { Icon } from "../../../components/Icon";
import { Checkbox } from "../../../components/inputs/Checkbox";
import { PeachText } from "../../../components/text/PeachText";
import { useOfferPreferences } from "../../../store/offerPreferenes/useOfferPreferences";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

const FUND_MULTI_MIN = 3;
const FUND_MULTI_MAX = 21;

export const FundMultipleOffers = () => {
  useSettingsStore((state) => state.locale);
  const [multi, setMulti] = useOfferPreferences(
    (state) => [state.sellMultiOffers, state.setSellMultiOffers],
    shallow,
  );

  const toggleFundMultiple = () => setMulti(multi ? undefined : FUND_MULTI_MIN);

  return (
    <View style={tw`gap-3`}>
      <Checkbox checked={!!multi} onPress={toggleFundMultiple}>
        {i18n("offer.fundMultiple")}
      </Checkbox>
      <NumberStepper />
    </View>
  );
};
export const CreateMultipleOffers = () => {
  const [multi, setMulti] = useOfferPreferences(
    (state) => [state.buyMultiOffers, state.setBuyMultiOffers],
    shallow,
  );

  const toggleFundMultiple = () => setMulti(multi ? undefined : FUND_MULTI_MIN);

  return (
    <View style={tw`gap-3`}>
      <Checkbox checked={!!multi} onPress={toggleFundMultiple} green>
        {i18n("offer.createMultiple")}
      </Checkbox>
      <NumberStepper isBuy />
    </View>
  );
};

function NumberStepper({ isBuy = false }) {
  const [
    buyMultiOffers,
    setBuyMultiOffers,
    sellMultiOffers,
    setSellMultiOffers,
  ] = useOfferPreferences(
    (state) => [
      state.buyMultiOffers,
      state.setBuyMultiOffers,
      state.sellMultiOffers,
      state.setSellMultiOffers,
    ],
    shallow,
  );
  const multi = isBuy ? buyMultiOffers : sellMultiOffers;
  const setMulti = isBuy ? setBuyMultiOffers : setSellMultiOffers;

  const { isDarkMode } = useThemeStore();
  if (multi === undefined) return null;

  const decrease = () => setMulti(Math.max(multi - 1, FUND_MULTI_MIN));
  const increase = () => setMulti(Math.min(multi + 1, FUND_MULTI_MAX));

  const canDecrease = multi > FUND_MULTI_MIN;
  const canIncrease = multi < FUND_MULTI_MAX;

  return (
    <View style={tw`flex-row gap-3`}>
      <TouchableOpacity
        onPress={decrease}
        accessibilityHint={i18n("number.decrease")}
        disabled={!canDecrease}
        style={!canDecrease && tw`opacity-50`}
      >
        <Icon
          id="minusCircle"
          size={24}
          color={tw.color(isBuy ? "success-main" : "primary-main")}
        />
      </TouchableOpacity>
      <PeachText
        style={[
          tw`w-12 text-center h5`,
          tw`text-${isDarkMode ? "backgroundLight" : "black-100"}`,
        ]}
      >
        x {multi}
      </PeachText>
      <TouchableOpacity
        onPress={increase}
        accessibilityHint={i18n("number.increase")}
        disabled={!canIncrease}
        style={!canIncrease && tw`opacity-50`}
      >
        <Icon
          id="plusCircle"
          size={24}
          color={tw.color(isBuy ? "success-main" : "primary-main")}
        />
      </TouchableOpacity>
    </View>
  );
}
