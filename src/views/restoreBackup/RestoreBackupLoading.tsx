import { View } from "react-native";
import { Loading } from "../../components/animation/Loading";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";
import { tolgee } from "../../tolgee";

export const RestoreBackupLoading = () => (
  <View style={tw`items-center justify-center h-full`}>
    <PeachText style={tw`text-center h4 text-primary-background-light`}>
      {tolgee.t("restoreBackup.restoringBackup", { ns: "unassigned" })}
    </PeachText>
    <PeachText style={tw`text-center body-l text-primary-background-light`}>
      {tolgee.t("newUser.oneSec", { ns: "unassigned" })}
    </PeachText>
    <Loading style={tw`w-32 h-32`} color={tw.color("primary-mild-1")} />
  </View>
);
