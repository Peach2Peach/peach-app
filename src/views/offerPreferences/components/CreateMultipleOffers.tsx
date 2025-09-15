import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { Checkbox } from "../../../components/inputs/Checkbox";
import { NumberStepper } from "../../../components/inputs/NumberStepper";
import { useOfferPreferences } from "../../../store/offerPreferenes/useOfferPreferences";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

const CREATE_MULTI_MIN = 2;
const CREATE_MULTI_MAX = 21;

export const CreateMultipleOffers = () => {
  const [multi, setMulti] = useOfferPreferences(
    (state) => [state.multi, state.setMulti],
    shallow,
  );

  const toggleCreateMultiple = () =>
    setMulti(multi ? undefined : CREATE_MULTI_MIN);

  return (
    <View style={tw`gap-3`}>
      <Checkbox checked={!!multi} onPress={toggleCreateMultiple}>
        {i18n("offer.createMultiple")}
      </Checkbox>
      {!!multi && (
        <NumberStepper
          value={multi}
          onChange={setMulti}
          min={CREATE_MULTI_MIN}
          max={CREATE_MULTI_MAX}
        />
      )}
    </View>
  );
};
