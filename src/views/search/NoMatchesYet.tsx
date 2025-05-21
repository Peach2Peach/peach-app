import { View } from "react-native";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

export function NoMatchesYet() {
  return (
    <View style={tw`items-center justify-center flex-1 gap-10px`}>
      <PeachText style={tw`text-center h5 `}>
        {i18n("search.noTradeRequestsYet")}
      </PeachText>
      <PeachText style={tw`text-center subtitle-2`}>
        {i18n("search.weWillNotifyYouTradeRequest")}
      </PeachText>
    </View>
  );
}
