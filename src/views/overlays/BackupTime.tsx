import { useSetOverlay } from "../../Overlay";
import { OverlayComponent } from "../../components/OverlayComponent";
import { Button } from "../../components/buttons/Button";
import { useNavigation } from "../../hooks/useNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { StackNavigation } from "../../utils/navigation/handlePushNotification";

type NavigationFunctionParams = Parameters<StackNavigation["navigate"]>;

export function BackupTime({
  navigationParams,
}: {
  navigationParams?: NavigationFunctionParams;
}) {
  const navigation = useNavigation();
  const setOverlay = useSetOverlay();
  const closeOverlay = () => setOverlay(undefined);
  const goToBackups = () => {
    closeOverlay();
    navigation.navigate("backups");
  };
  const skip = () => {
    closeOverlay();
    if (navigationParams) {
      navigation.navigate(...navigationParams);
    } else {
      navigation.navigate("homeScreen", { screen: "home" });
    }
  };

  return (
    <OverlayComponent
      title={i18n("backupTime.title")}
      text={i18n("backupTime.description.mandatory")}
      iconId="saveCircleInverted"
      buttons={
        <>
          <Button
            style={tw`bg-primary-background-light`}
            textColor={tw`text-primary-main`}
            onPress={goToBackups}
          >
            {i18n("backupTime.makeABackup")}
          </Button>
          <Button ghost onPress={skip}>
            {i18n("backupTime.skipForNow")}
          </Button>
        </>
      }
    />
  );
}
