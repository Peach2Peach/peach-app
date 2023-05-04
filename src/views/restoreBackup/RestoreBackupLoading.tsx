import { ReactElement } from 'react'
import { View } from 'react-native'
import { Loading, Text } from '../../components'

import { useHeaderSetup } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export default (): ReactElement => {
  useHeaderSetup({ title: i18n('restoreBackup.title'), hideGoBackButton: true, theme: 'inverted' })

  return (
    <View style={tw`flex items-center justify-center h-full`}>
      <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('restoreBackup.restoringBackup')}</Text>
      <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('newUser.oneSec')}</Text>
      <Loading style={tw`w-32 h-32`} color={tw`text-primary-mild-1`.color} />
    </View>
  )
}
