import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { Checkbox } from "../../../components/inputs/Checkbox";
import { NumberStepper } from "../../../components/inputs/NumberStepper";
import { useOfferPreferences } from "../../../store/offerPreferenes/useOfferPreferences";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

const FUND_MULTI_MIN = 3;

export const FundMultipleOffers = () => {
  const [multi, setMulti] = useOfferPreferences(
    (state) => [state.multi, state.setMulti],
    shallow,
  );
  const toggleFundMultiple = () => setMulti(multi ? undefined : FUND_MULTI_MIN);

  return (
    <View style={tw`gap-3`}>
      <Checkbox checked={!!multi} onPress={toggleFundMultiple}>
        {i18n("offer.fundMultiple")}
      </Checkbox>
      {!!multi && (
        <NumberStepper
          value={multi}
          onChange={setMulti}
          min={FUND_MULTI_MIN}
          max={10}
        />
      )}
    </View>
  );
};
