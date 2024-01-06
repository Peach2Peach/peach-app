import { useNavigation } from '../hooks/useNavigation'
import { ErrorPopup } from '../popups/ErrorPopup'
import { ClosePopupAction } from '../popups/actions/ClosePopupAction'
import { FirstBackup } from '../popups/warning/FirstBackup'
import { useSettingsStore } from '../store/settingsStore'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { TouchableIcon } from './TouchableIcon'
import { useClosePopup, useSetPopup } from './popup/Popup'
import { PopupAction } from './popup/PopupAction'

export function BackupReminderIcon () {
  const setPopup = useSetPopup()
  const showBackupReminder = () => setPopup(<BackupReminderPopup />)
  const shouldShowReminder = useSettingsStore((state) => state.showBackupReminder)
  return (
    <TouchableIcon
      style={[tw`self-center`, !shouldShowReminder && tw`opacity-0`]}
      id="alertTriangle"
      iconSize={64}
      iconColor={tw.color('error-main')}
      onPress={showBackupReminder}
      disabled={!shouldShowReminder}
    />
  )
}

function BackupReminderPopup () {
  const closePopup = useClosePopup()
  const navigation = useNavigation()

  return (
    <ErrorPopup
      title={i18n('error.firstBackup.title')}
      content={<FirstBackup />}
      actions={
        <>
          <ClosePopupAction />
          <PopupAction
            iconId="arrowRightCircle"
            label={i18n('error.firstBackup.action')}
            onPress={() => {
              navigation.navigate('backups')
              closePopup()
            }}
            reverseOrder
          />
        </>
      }
    />
  )
}
