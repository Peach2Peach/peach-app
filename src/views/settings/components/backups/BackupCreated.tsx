import React from 'react'
import { View } from 'react-native'

import { Icon, PrimaryButton, Text } from '../../../../components'
import { useNavigation } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

export const BackupCreated = () => {
  const navigation = useNavigation()
  const goToFileBackup = () => navigation.navigate('backups')
  return (
    <View style={tw`h-full`}>
      <View style={tw`items-center flex-shrink h-full top-55`}>
        <Text style={tw`h4 text-primary-background-light`}>{i18n('settings.backups.fileBackup.created')}</Text>
        <Text style={tw`body-l text-primary-background-light`}>{i18n('settings.backups.fileBackup.safeNow')}</Text>
        <Icon id="save" style={tw`w-32 h-32 mt-17`} color={tw`text-primary-background-light`.color} />
      </View>
      <PrimaryButton white narrow style={tw`self-center mb-27`} onPress={goToFileBackup}>
        {i18n('back')}
      </PrimaryButton>
    </View>
  )
}

export default BackupCreated
