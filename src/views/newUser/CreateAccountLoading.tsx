import { View } from 'react-native'
import { Loading, Text } from '../../components'
import { useOnboardingHeader } from '../../hooks/headers/useOnboardingHeader'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const CreateAccountLoading = () => {
  useOnboardingHeader({
    title: i18n('welcome.welcomeToPeach.title'),
    icons: [],
    hideGoBackButton: true,
  })
  return (
    <View style={tw`flex items-center justify-center h-full`}>
      <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('newUser.title.create')}</Text>
      <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('newUser.oneSec')}</Text>
      <Loading style={tw`w-32 h-32`} color={tw`text-primary-mild-1`.color} />
    </View>
  )
}
