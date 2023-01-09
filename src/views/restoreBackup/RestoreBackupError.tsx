import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Icon, Text } from '../../components'
import { PrimaryButton } from '../../components/buttons'

import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useBackupHeader } from './useBackupHeader'

type RestoreBackupErrorProps = {
  err: string
}

export default ({ err }: RestoreBackupErrorProps): ReactElement => {
  useBackupHeader()
  const navigation = useNavigation()
  const goToContact = () => navigation.navigate('contact')

  return (
    <View style={tw`h-full flex flex-shrink justify-between`}>
      <View style={tw`h-full flex-shrink flex justify-center items-center`}>
        <Text style={tw`h4 text-center text-primary-background-light`}>{i18n('restoreBackup.title')}</Text>
        <Text style={tw`body-l text-center text-primary-background-light`}>{i18n(`${err}.text`)}</Text>
        <Icon id="userX" style={tw`w-32 h-32 mt-16`} color={tw`text-primary-background-light`.color} />
      </View>
      <View style={tw`w-full flex flex-col items-center mb-8`}>
        <PrimaryButton testID="restoreBackup-contactUs" onPress={goToContact} white narrow>
          {i18n('contactUs')}
        </PrimaryButton>
      </View>
    </View>
  )
}
