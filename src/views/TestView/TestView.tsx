import { View } from 'react-native'
import { OptionButton, PeachScrollView } from '../../components'
import { useHeaderSetup, useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
const headerConfig = { title: 'test view' }
export default () => {
  useHeaderSetup(headerConfig)
  const navigation = useNavigation()
  const goToPeachWalletTesting = () => navigation.navigate('testViewPeachWallet')
  const goToButtons = () => navigation.navigate('testViewButtons')
  const goToPopups = () => navigation.navigate('testViewPopups')
  const goToMessages = () => navigation.navigate('testViewMessages')
  const goToComponents = () => navigation.navigate('testViewComponents')
  const goToPNTesting = () => navigation.navigate('testViewPNs')
  const goToLoadingScreen = () => navigation.navigate('testViewLoading')

  return (
    <PeachScrollView
      style={tw`h-full bg-primary-mild-1 `}
      contentContainerStyle={tw`flex items-center w-full px-6 py-10`}
    >
      <View style={tw`gap-4`}>
        <OptionButton onPress={goToPeachWalletTesting}>Peach wallet</OptionButton>
        <OptionButton onPress={goToButtons}>Buttons</OptionButton>
        <OptionButton onPress={goToPopups}>Popups</OptionButton>
        <OptionButton onPress={goToMessages}>Messages</OptionButton>
        <OptionButton onPress={goToComponents}>Components</OptionButton>
        <OptionButton onPress={goToPNTesting}>Push notifications</OptionButton>
        <OptionButton onPress={goToLoadingScreen}>Loading Screen</OptionButton>
      </View>
    </PeachScrollView>
  )
}
