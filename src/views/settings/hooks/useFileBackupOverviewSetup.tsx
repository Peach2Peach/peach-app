import { useHeaderSetup } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useSettingsStore } from '../../../store/useSettingsStore'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'

export const useFileBackupOverviewSetup = () => {
  const lastFileBackupDate = useSettingsStore((state) => state.lastFileBackupDate)

  const showPopup = useShowHelp('fileBackup')
  useHeaderSetup({
    title: i18n('settings.backups.fileBackup.title'),
    icons: [{ ...headerIcons.help, onPress: showPopup }],
  })

  return {
    lastFileBackupDate,
  }
}
