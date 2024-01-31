import { View } from "react-native";
import { Icon } from "../../../../components/Icon";
import { PeachText } from "../../../../components/text/PeachText";
import tw from "../../../../styles/tailwind";
import i18n from "../../../../utils/i18n";
const items = [
  { id: "edit", text: "writeItDown", color: tw.color("success-main") },
  { id: "cameraOff", text: "noPictures", color: tw.color("error-main") },
  { id: "cloudOff", text: "noDigital", color: tw.color("error-main") },
] as const;

export const SecurityInfo = () => (
  <View style={tw`grow`}>
    <PeachText style={tw`text-center subtitle-1`}>
      {i18n("settings.backups.seedPhrase.toRestore")}
    </PeachText>
    <PeachText style={tw`h6 text-center mt-[45px]`}>
      {i18n("settings.backups.seedPhrase.keepSecure")}
    </PeachText>
    {items.map(({ id, text, color }) => (
      <View key={id} style={tw`flex-row items-center mt-6`}>
        <Icon id={id} style={tw`w-11 h-11`} color={color} />
        <PeachText style={tw`flex-1 pl-4`}>
          {i18n(`settings.backups.seedPhrase.${text}`)}
        </PeachText>
      </View>
    ))}
  </View>
);
