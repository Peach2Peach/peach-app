import { useSetOverlay } from "../../Overlay";
import { OverlayComponent } from "../../components/OverlayComponent";
import { Button } from "../../components/buttons/Button";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import { StackNavigation } from "../../utils/navigation/handlePushNotification";
import { useTranslate } from "@tolgee/react";

type NavigationFunctionParams = Parameters<StackNavigation["navigate"]>;

export function BackupTime({
  navigationParams,
}: {
  navigationParams?: NavigationFunctionParams;
}) {
  const navigation = useStackNavigation();
  const setOverlay = useSetOverlay();
  const { t } = useTranslate();
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
      title={t("backupTime.title")}
      text={t("backupTime.description.mandatory")}
      iconId="saveCircleInverted"
      buttons={
        <>
          <Button
            style={tw`bg-primary-background-light`}
            textColor={tw.color("primary-main")}
            onPress={goToBackups}
          >
            {t("backupTime.makeABackup")}
          </Button>
          <Button ghost onPress={skip}>
            {t("backupTime.skipForNow")}
          </Button>
        </>
      }
    />
  );
}
