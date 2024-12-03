import { View } from "react-native";
import { Icon } from "../../../../components/Icon";
import { PeachText } from "../../../../components/text/PeachText";
import tw from "../../../../styles/tailwind";
import i18n from "../../../../utils/i18n";

export const KeepPhraseSecure = () => (
  <View style={tw`items-center`}>
    <PeachText style={tw`self-center h6`}>
      {i18n("settings.backups.seedPhrase.keepSecure")}
    </PeachText>
    <View style={tw`flex-row items-center mt-6`}>
      <Icon
        id="unlock"
        color={tw.color("primary-main")}
        style={tw`w-12 h-12`}
      />
      <PeachText style={tw`pl-4 shrink`}>
        {i18n("settings.backups.seedPhrase.storeSafely")}
      </PeachText>
    </View>
  </View>
);
