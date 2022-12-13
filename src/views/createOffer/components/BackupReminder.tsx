import React from 'react'
import { View } from 'react-native'
import shallow from 'zustand/shallow'
import { Hint } from '../../../components'
import { useNavigation } from '../../../hooks'
import { useUserDataStore } from '../../../store'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const BackupReminder = () => {
  const navigation = useNavigation()
  const goToBackups = () => navigation.navigate('backups', {})
  const [showBackupReminder, setShowBackupReminder] = useUserDataStore(
    (state) => [state.settings.showBackupReminder, state.setShowBackupReminder],
    shallow,
  )
  const dismissBackupReminder = () => {
    setShowBackupReminder(false)
  }
  return showBackupReminder ? (
    <View style={tw`flex items-center mt-2`}>
      <Hint
        style={tw`max-w-xs`}
        title={i18n('hint.backup.title')}
        text={i18n('hint.backup.text')}
        icon="lock"
        onPress={goToBackups}
        onDismiss={dismissBackupReminder}
      />
    </View>
  ) : null
}
