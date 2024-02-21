import { View } from "react-native";
import { Icon } from "../../../../components/Icon";
import { PeachText } from "../../../../components/text/PeachText";
import tw from "../../../../styles/tailwind";
import i18n from "../../../../utils/i18n";
import { tolgee } from "../../../../tolgee";
const items = [
  { id: "edit", text: "writeItDown", color: tw.color("success-main") },
  { id: "cameraOff", text: "noPictures", color: tw.color("error-main") },
  { id: "cloudOff", text: "noDigital", color: tw.color("error-main") },
] as const;

export const SecurityInfo = () => (
  <View style={tw`grow`}>
    <PeachText style={tw`text-center subtitle-1`}>
      {tolgee.t("settings.backups.seedPhrase.toRestore", {
        ns: "settings",
      })}
    </PeachText>
    <PeachText style={tw`h6 text-center mt-[45px]`}>
      {tolgee.t("settings.backups.seedPhrase.keepSecure", {
        ns: "settings",
      })}
    </PeachText>
    {items.map(({ id, text, color }) => (
      <View key={id} style={tw`flex-row items-center mt-6`}>
        <Icon id={id} style={tw`w-11 h-11`} color={color} />
        <PeachText style={tw`flex-1 pl-4`}>
          {tolgee.t(`settings.backups.seedPhrase.${text}`, {
            ns: "settings",
          })}
        </PeachText>
      </View>
    ))}
  </View>
);
