import React, { ReactElement, useMemo } from 'react'
import { View } from 'react-native'
import { Icon, Text } from '../../components'
import { PrimaryButton } from '../../components/buttons'

import { useHeaderSetup, useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from './headerIcons'

type CreateAccountErrorProps = {
  err: string
}

export default ({ err }: CreateAccountErrorProps): ReactElement => {
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('welcome.welcomeToPeach.title'),
        hideGoBackButton: true,
        icons: headerIcons,
        theme: 'inverted',
      }),
      [],
    ),
  )
  const navigation = useNavigation()
  const goToContact = () => navigation.navigate('reportFullScreen')
  const goToRestoreBackup = () => navigation.navigate('restoreBackup')

  return (
    <View style={tw`h-full flex justify-between`}>
      <View style={tw`h-full flex-shrink flex justify-center items-center`}>
        <Text style={tw`h4 text-center text-primary-background-light`}>{i18n('newUser.title.create')}</Text>
        <Text style={tw`body-l text-center text-primary-background-light`}>{i18n(`${err}.text`)}</Text>
        <Icon id="userX" style={tw`w-32 h-32 mt-16`} color={tw`text-primary-background-light`.color} />
      </View>
      <View style={tw`w-full flex flex-col items-center mb-8`}>
        <PrimaryButton testID="createAccount-contactUs" onPress={goToContact} white narrow iconId="plusCircle">
          {i18n('contactUs')}
        </PrimaryButton>
        <PrimaryButton
          testID="createAccount-restoreBackup"
          onPress={goToRestoreBackup}
          style={tw`mt-2`}
          iconId="save"
          white
          border
          narrow
        >
          {i18n('restore')}
        </PrimaryButton>
      </View>
    </View>
  )
}
