import { useSetOverlay } from "../../Overlay";
import { OverlayComponent } from "../../components/OverlayComponent";
import { Button } from "../../components/buttons/Button";
import { useNavigation } from "../../hooks/useNavigation";
import { useConfigStore } from "../../store/configStore/configStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

export const GroupHugAnnouncement = ({ offerId }: { offerId: string }) => {
  const navigation = useNavigation();
  const setHasSeenGroupHugAnnouncement = useConfigStore(
    (state) => state.setHasSeenGroupHugAnnouncement,
  );
  const setOverlay = useSetOverlay();

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
      title={i18n("grouphug.announcement.title")}
      text={i18n("grouphug.announcement.text")}
      buttons={
        <>
          <Button
            style={tw`bg-primary-background-light`}
            textColor={tw`text-primary-main`}
            onPress={goToSettings}
          >
            {i18n("grouphug.goToSettings")}
          </Button>
          <Button onPress={close} ghost>
            {i18n("close")}
          </Button>
        </>
      }
    />
  );
};
