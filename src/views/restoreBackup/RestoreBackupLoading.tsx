import { View } from "react-native";
import { Loading } from "../../components/animation/Loading";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

export const RestoreBackupLoading = () => (
  <View style={tw`items-center justify-center h-full`}>
    <PeachText style={tw`text-center h4 text-primary-background-light`}>
      {i18n("restoreBackup.restoringBackup")}
    </PeachText>
    <PeachText style={tw`text-center body-l text-primary-background-light`}>
      {i18n("newUser.oneSec")}
    </PeachText>
    <Loading style={tw`w-32 h-32`} color={tw.color("primary-mild-1")} />
  </View>
);
