import { View } from "react-native";
import { Icon } from "../../components/Icon";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";
import { useTranslate } from "@tolgee/react";

export const RestoreSuccess = () => {
  const { t } = useTranslate();

  return (
    <View style={tw`items-center justify-center gap-16 grow`}>
      <View>
        <PeachText style={tw`text-center h4 text-primary-background-light`}>
          {t("restoreBackup.backupRestored")}
        </PeachText>
        <PeachText style={tw`text-center body-l text-primary-background-light`}>
          {t("restoreBackup.welcomeBack")}
        </PeachText>
      </View>
      <Icon id="save" size={128} color={tw.color("primary-background-light")} />
    </View>
  );
};
