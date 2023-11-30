import { TouchableOpacity, View } from 'react-native'
import { Icon } from '../../components'
import { useShowBackupReminder } from '../../hooks/useShowBackupReminder'
import tw from '../../styles/tailwind'

export const BackupReminderIcon = () => {
  const showBackupReminder = useShowBackupReminder()

  return (
    <View style={tw`justify-center`}>
      <TouchableOpacity style={tw`absolute left-4`} onPress={showBackupReminder}>
        <Icon id="alertTriangle" style={tw`w-8 h-8`} color={tw.color('error-main')} />
      </TouchableOpacity>
    </View>
  )
}
