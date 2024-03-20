import { useSetOverlay } from "../../Overlay";
import { OverlayComponent } from "../../components/OverlayComponent";
import { Button } from "../../components/buttons/Button";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useConfigStore } from "../../store/configStore/configStore";
import tw from "../../styles/tailwind";
import { useTranslate } from "@tolgee/react";

export const GroupHugAnnouncement = ({ offerId }: { offerId: string }) => {
  const navigation = useStackNavigation();
  const setHasSeenGroupHugAnnouncement = useConfigStore(
    (state) => state.setHasSeenGroupHugAnnouncement,
  );
  const setOverlay = useSetOverlay();
  const { t } = useTranslate("batching");

  const goToSettings = () => {
    setHasSeenGroupHugAnnouncement(true);
    setOverlay(undefined);
    navigation.reset({
      index: 1,
      routes: [
        { name: "homeScreen", params: { screen: "settings" } },
        { name: "transactionBatching" },
      ],
    });
  };
  const close = () => {
    setHasSeenGroupHugAnnouncement(true);
    setOverlay(undefined);
    navigation.navigate("explore", { offerId });
  };

  return (
    <OverlayComponent
      title={t("grouphug.announcement.title")}
      text={t("grouphug.announcement.text")}
      buttons={
        <>
          <Button
            style={tw`bg-primary-background-light`}
            textColor={tw.color("primary-main")}
            onPress={goToSettings}
          >
            {t("grouphug.goToSettings")}
          </Button>
          <Button onPress={close} ghost>
            {t("close", { ns: "global" })}
          </Button>
        </>
      }
    />
  );
};
