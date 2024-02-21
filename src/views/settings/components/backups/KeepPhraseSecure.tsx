import { View } from "react-native";
import { Icon } from "../../../../components/Icon";
import { PeachText } from "../../../../components/text/PeachText";
import tw from "../../../../styles/tailwind";
import { tolgee } from "../../../../tolgee";

export const KeepPhraseSecure = () => (
  <View style={tw`items-center`}>
    <PeachText style={tw`self-center h6`}>
      {tolgee.t("settings.backups.seedPhrase.keepSecure", { ns: "settings" })}
    </PeachText>
    <View style={tw`flex-row items-center mt-6`}>
      <Icon id="unlock" color={tw.color("black-65")} style={tw`w-12 h-12`} />
      <PeachText style={tw`pl-4 shrink`}>
        {tolgee.t("settings.backups.seedPhrase.storeSafely", {
          ns: "settings",
        })}
      </PeachText>
    </View>
  </View>
);
