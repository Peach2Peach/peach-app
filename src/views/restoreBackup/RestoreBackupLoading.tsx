import { View } from "react-native";
import { Loading } from "../../components/animation/Loading";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";
import { useTranslate } from "@tolgee/react";

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
      <Loading style={tw`w-32 h-32`} color={tw.color("primary-mild-1")} />
    </View>
  );
};
