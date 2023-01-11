import React from 'react'
import { View } from 'react-native'

import { Icon, PrimaryButton, Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

const translationPath = 'settings.backups.fileBackup.'
export const BackupCreated = () => (
  <View style={tw`h-full`}>
    <View style={tw`items-center flex-shrink h-full top-55`}>
      <Text style={tw`h4 text-primary-background-light`}>{i18n(translationPath + 'created')}</Text>
      <Text style={tw`body-l text-primary-background-light`}>{i18n(translationPath + 'safeNow')}</Text>
      <Icon id="save" style={tw`w-32 h-32 mt-17`} color={tw`text-primary-background-light`.color} />
    </View>
    <PrimaryButton white narrow style={tw`self-center mb-27`}>
      {i18n('back')}
    </PrimaryButton>
  </View>
)

export default BackupCreated
