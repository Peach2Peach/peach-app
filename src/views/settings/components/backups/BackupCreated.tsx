import React from 'react'
import { View } from 'react-native'

import { Icon, Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

export const BackupCreated = () => (
  <View style={tw`h-full`}>
    <View style={tw`items-center flex-shrink h-full top-55`}>
      <Text style={tw`h4 text-primary-background-light`}>{i18n('settings.backups.fileBackup.created')}</Text>
      <Text style={tw`body-l text-primary-background-light`}>{i18n('settings.backups.fileBackup.safeNow')}</Text>
      <Icon id="save" style={tw`w-32 h-32 mt-17`} color={tw`text-primary-background-light`.color} />
    </View>
  </View>
)

export default BackupCreated
