import { useTranslate } from "@tolgee/react";
import { View } from "react-native";
import { Loading } from "../../components/Loading";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";

export const RestoreBackupLoading = () => {
  const { t } = useTranslate();

  return (
    <View style={tw`items-center justify-center h-full`}>
      <PeachText style={tw`text-center h4 text-primary-background-light`}>
        {t("restoreBackup.restoringBackup")}
      </PeachText>
      <PeachText style={tw`text-center body-l text-primary-background-light`}>
        {t("newUser.oneSec")}
      </PeachText>
      <Loading size="large" color={tw.color("primary-mild-1")} />
    </View>
  );
};
