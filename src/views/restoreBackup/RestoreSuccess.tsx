import { View } from "react-native";
import { Icon } from "../../components/Icon";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

export const RestoreSuccess = () => (
  <View style={tw`items-center justify-center gap-16 grow`}>
    <View>
      <PeachText style={tw`text-center h4 text-primary-background-light-color`}>
        {i18n("restoreBackup.backupRestored")}
      </PeachText>
      <PeachText
        style={tw`text-center body-l text-primary-background-light-color`}
      >
        {i18n("restoreBackup.welcomeBack")}
      </PeachText>
    </View>
    <Icon
      id="save"
      size={128}
      color={tw.color("primary-background-light-color")}
    />
  </View>
);
