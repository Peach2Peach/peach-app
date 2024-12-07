import { View } from "react-native";
import { useSetGlobalOverlay } from "../../../../Overlay";
import { Icon } from "../../../../components/Icon";
import { Button } from "../../../../components/buttons/Button";
import { PeachText } from "../../../../components/text/PeachText";
import { useStackNavigation } from "../../../../hooks/useStackNavigation";
import tw from "../../../../styles/tailwind";
import i18n from "../../../../utils/i18n";

export const BackupCreated = () => {
  const navigation = useStackNavigation();
  const setOverlay = useSetGlobalOverlay();
  const goToFileBackup = () => {
    setOverlay(undefined);
    navigation.navigate("backups");
  };
  return (
    <>
      <View style={tw`items-center justify-center grow`}>
        <PeachText style={tw`h4 text-primary-background-light`}>
          {i18n("settings.backups.fileBackup.created")}
        </PeachText>
        <PeachText style={tw`body-l text-primary-background-light`}>
          {i18n("settings.backups.fileBackup.safeNow")}
        </PeachText>
        <Icon
          id="save"
          style={tw`w-32 h-32 mt-17`}
          color={tw.color("primary-background-light")}
        />
      </View>
      <Button
        style={tw`self-center bg-primary-background-light`}
        textColor={tw.color("primary-main")}
        onPress={goToFileBackup}
      >
        {i18n("back")}
      </Button>
    </>
  );
};
