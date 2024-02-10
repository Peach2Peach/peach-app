import { useNavigation } from "../hooks/useNavigation";
import { ErrorPopup } from "../popups/ErrorPopup";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { TouchableIcon } from "./TouchableIcon";
import { useClosePopup, useSetPopup } from "./popup/GlobalPopup";
import { PopupAction } from "./popup/PopupAction";
import { ClosePopupAction } from "./popup/actions/ClosePopupAction";

export function BackupReminderIcon() {
  const setPopup = useSetPopup();
  const showBackupReminder = () => setPopup(<BackupReminderPopup />);
  const shouldShowReminder = useSettingsStore(
    (state) => state.showBackupReminder,
  );
  return (
    <TouchableIcon
      style={[tw`self-center`, !shouldShowReminder && tw`opacity-0`]}
      id="alertTriangle"
      iconSize={64}
      iconColor={tw.color("error-main")}
      onPress={showBackupReminder}
      disabled={!shouldShowReminder}
    />
  );
}

function BackupReminderPopup() {
  const closePopup = useClosePopup();
  const navigation = useNavigation();

  return (
    <ErrorPopup
      title={i18n("error.firstBackup.title")}
      content={i18n("error.firstBackup.description")}
      actions={
        <>
          <ClosePopupAction />
          <PopupAction
            iconId="arrowRightCircle"
            label={i18n("error.firstBackup.action")}
            onPress={() => {
              navigation.navigate("backups");
              closePopup();
            }}
            reverseOrder
          />
        </>
      }
    />
  );
}
