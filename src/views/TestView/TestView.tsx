import { View } from 'react-native'
import { OptionButton, PeachScrollView } from '../../components'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'

export const TestView = () => {
  const navigation = useNavigation()
  const goToPeachWalletTesting = () => navigation.navigate('testViewPeachWallet')
  const goToButtons = () => navigation.navigate('testViewButtons')
  const goToPopups = () => navigation.navigate('testViewPopups')
  const goToMessages = () => navigation.navigate('testViewMessages')
  const goToComponents = () => navigation.navigate('testViewComponents')
  const goToPNTesting = () => navigation.navigate('testViewPNs')

  return (
    <PeachScrollView
      style={tw`h-full bg-primary-mild-1`}
      contentContainerStyle={tw`flex items-center w-full px-6 py-10`}
    >
      <View style={tw`gap-4`}>
        <OptionButton onPress={goToPeachWalletTesting}>Peach wallet</OptionButton>
        <OptionButton onPress={goToButtons}>Buttons</OptionButton>
        <OptionButton onPress={goToPopups}>Popups</OptionButton>
        <OptionButton onPress={goToMessages}>Messages</OptionButton>
        <OptionButton onPress={goToComponents}>Components</OptionButton>
        <OptionButton onPress={goToPNTesting}>Push notifications</OptionButton>
      </View>
    </PeachScrollView>
  )
}
