import { View } from "react-native";
import { PeachScrollView } from "../../../components/PeachScrollView";
import { Screen } from "../../../components/Screen";
import { PeachText } from "../../../components/text/PeachText";
import { CopyAble } from "../../../components/ui/CopyAble";
import { useBoltzSwapStore } from "../../../store/useBoltzSwapStore";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { keys } from "../../../utils/object/keys";
import { offerIdToHex } from "../../../utils/offer/offerIdToHex";


export const Swaps = () => {
  const swaps = useBoltzSwapStore(state => state.swaps)
  return (
  <Screen header={i18n("settings.swaps")}>
    <PeachScrollView
        style={tw`grow`}
        contentContainerStyle={tw`justify-center grow`}
        contentStyle={tw`items-center gap-4`}
      >
      {keys(swaps).map(key => (
        <View style={tw`flex-row gap-4`}>
          <PeachText>{offerIdToHex(key)}</PeachText>
          <CopyAble value={JSON.stringify(swaps[key])} />
        </View>
      ))}
      </PeachScrollView>
  </Screen>
);
  }