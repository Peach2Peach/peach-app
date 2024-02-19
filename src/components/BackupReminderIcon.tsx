import { useStackNavigation } from "../hooks/useStackNavigation";
import { ErrorPopup } from "../popups/ErrorPopup";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import tw from "../styles/tailwind";
import { TouchableIcon } from "./TouchableIcon";
import { useClosePopup, useSetPopup } from "./popup/GlobalPopup";
import { PopupAction } from "./popup/PopupAction";
import { ClosePopupAction } from "./popup/actions/ClosePopupAction";
import { useTranslate } from "@tolgee/react";

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
  const navigation = useStackNavigation();
  const { t } = useTranslate("error");

  return (
    <ErrorPopup
      title={t("error.firstBackup.title")}
      content={t("error.firstBackup.description")}
      actions={
        <>
          <ClosePopupAction />
          <PopupAction
            iconId="arrowRightCircle"
            label={t("error.firstBackup.action")}
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
