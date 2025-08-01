import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { Checkbox } from "../../../components/inputs/Checkbox";
import { NumberStepper } from "../../../components/inputs/NumberStepper";
import { useOfferPreferences } from "../../../store/offerPreferenes/useOfferPreferences";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

const CREATE_MULTI_MIN = 3;
const CREATE_MULTI_MAX = 21;

export const CreateMultipleOffers = () => {
  const [buyOfferMulti, setBuyOfferMulti] = useOfferPreferences(
    (state) => [state.buyOfferMulti, state.setBuyOfferMulti],
    shallow,
  );

  const toggleCreateMultiple = () => {
    setBuyOfferMulti(buyOfferMulti ? undefined : CREATE_MULTI_MIN);
  };

  return (
    <View style={tw`gap-3`}>
      <Checkbox checked={!!buyOfferMulti} onPress={toggleCreateMultiple} green>
        {i18n("offer.createMultiple")}
      </Checkbox>
      {!!buyOfferMulti && (
        <NumberStepper
          value={buyOfferMulti}
          onChange={setBuyOfferMulti}
          min={CREATE_MULTI_MIN}
          max={CREATE_MULTI_MAX}
        />
      )}
    </View>
  );
};
