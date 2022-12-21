import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Loading, Text } from '../../components'

import { useHeaderSetup } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

const headerConfig = { title: i18n('restoreBackup.title'), hideGoBackButton: true, theme: 'inverted' as const }

export default (): ReactElement => {
  useHeaderSetup(headerConfig)

  return (
    <View style={tw`h-full flex justify-center items-center`}>
      <Text style={tw`h4 text-center text-primary-background-light`}>{i18n('restoreBackup.restoringBackup')}</Text>
      <Text style={tw`body-l text-center text-primary-background-light`}>{i18n('newUser.oneSec')}</Text>
      <Loading style={tw`w-32 h-32`} color={tw`text-primary-mild-1`.color} />
    </View>
  )
}
