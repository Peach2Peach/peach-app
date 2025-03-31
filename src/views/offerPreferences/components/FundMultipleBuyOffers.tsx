import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { Checkbox } from "../../../components/inputs/Checkbox";
import { NumberStepper } from "../../../components/inputs/NumberStepper";
import { useOfferPreferences } from "../../../store/offerPreferenes/useOfferPreferences";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

const FUND_MULTI_MIN = 3;
const FUND_MULTI_MAX = 21;

export const FundMultipleBuyOffers = () => {
  const [multi, setMulti] = useOfferPreferences(
    (state) => [state.multiBuy, state.setMultiBuy],
    shallow,
  );

  const toggleFundMultiple = () => setMulti(multi ? undefined : FUND_MULTI_MIN);

  return (
    <View style={tw`gap-3`}>
      <Checkbox checked={!!multi} onPress={toggleFundMultiple} green>
        {i18n("offer.createMultipleBuy")}
      </Checkbox>
      {!!multi && (
        <NumberStepper
          value={multi}
          onChange={setMulti}
          min={FUND_MULTI_MIN}
          max={FUND_MULTI_MAX}
          isBuy={true}
        />
      )}
    </View>
  );
};
