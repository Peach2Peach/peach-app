import { View } from "react-native";
import { Icon } from "../../components/Icon";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";
import { tolgee } from "../../tolgee";

export const RestoreSuccess = () => (
  <View style={tw`items-center justify-center gap-16 grow`}>
    <View>
      <PeachText style={tw`text-center h4 text-primary-background-light`}>
        {tolgee.t("restoreBackup.backupRestored", { ns: "unassigned" })}
      </PeachText>
      <PeachText style={tw`text-center body-l text-primary-background-light`}>
        {tolgee.t("restoreBackup.welcomeBack", { ns: "unassigned" })}
      </PeachText>
    </View>
    <Icon id="save" size={128} color={tw.color("primary-background-light")} />
  </View>
);
