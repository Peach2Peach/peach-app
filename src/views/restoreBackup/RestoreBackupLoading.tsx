import React, { ReactElement, useMemo } from 'react'
import { View } from 'react-native'
import { Loading, Text } from '../../components'

import { useHeaderSetup } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export default (): ReactElement => {
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('restoreBackup.title'),
        theme: 'inverted',
        hideGoBackButton: true,
      }),
      [],
    ),
  )

  return (
    <View style={tw`h-full flex justify-center items-center`}>
      <Text style={tw`h4 text-center text-primary-background-light`}>{i18n('restoreBackup.restoringBackup')}</Text>
      <Text style={tw`body-l text-center text-primary-background-light`}>{i18n('newUser.oneSec')}</Text>
      <Loading style={tw`w-32 h-32`} color={tw`text-primary-mild`.color} />
    </View>
  )
}
