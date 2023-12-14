import { TouchableOpacity } from 'react-native'
import { useNavigation } from '../hooks'
import { ErrorPopup } from '../popups/ErrorPopup'
import { ClosePopupAction } from '../popups/actions'
import { FirstBackup } from '../popups/warning/FirstBackup'
import { usePopupStore } from '../store/usePopupStore'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { Icon } from './Icon'
import { PopupAction } from './popup'

export function BackupReminderIcon () {
  const setPopup = usePopupStore((state) => state.setPopup)
  const showBackupReminder = () => setPopup(<BackupReminderPopup />)

  return (
    <TouchableOpacity style={tw`self-center`} onPress={showBackupReminder}>
      <Icon id="alertTriangle" size={32} color={tw.color('error-main')} />
    </TouchableOpacity>
  )
}

function BackupReminderPopup () {
  const closePopup = usePopupStore((state) => state.closePopup)
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
