import { shallow } from 'zustand/shallow'
import { FirstBackup } from '../popups/warning/FirstBackup'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'
import { useNavigation } from './useNavigation'
import { useCallback } from 'react'

export const useShowBackupReminder = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const navigation = useNavigation()
  const showBackupReminder = useCallback(
    () =>
      setPopup({
        title: i18n('error.firstBackup.title'),
        content: <FirstBackup />,
        visible: true,
        action2: {
          callback: closePopup,
          label: i18n('close'),
          icon: 'xSquare',
        },
        action1: {
          icon: 'arrowRightCircle',
          label: i18n('error.firstBackup.action'),
          callback: () => {
            navigation.navigate('backups')
            closePopup()
          },
        },
        level: 'ERROR',
      }),
    [setPopup],
  )

  return showBackupReminder
}
