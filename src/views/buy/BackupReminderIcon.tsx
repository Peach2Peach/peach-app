import { TouchableOpacity } from 'react-native'
import { Icon } from '../../components'
import { useShowBackupReminder } from '../../hooks/useShowBackupReminder'
import tw from '../../styles/tailwind'

export const BackupReminderIcon = () => {
  const showBackupReminder = useShowBackupReminder()

  return (
    <TouchableOpacity onPress={showBackupReminder}>
      <Icon id="alertTriangle" size={32} color={tw.color('error-main')} />
    </TouchableOpacity>
  )
}
