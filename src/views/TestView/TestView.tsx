import { OptionButton, PeachScrollView } from '../../components'
import { useHeaderSetup, useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
const headerConfig = { title: 'test view' }
export default () => {
  useHeaderSetup(headerConfig)
  const navigation = useNavigation()
  const goToButtons = () => navigation.navigate('testViewButtons')
  const goToPopups = () => navigation.navigate('testViewPopups')
  const goToMessages = () => navigation.navigate('testViewMessages')
  const goToComponents = () => navigation.navigate('testViewComponents')
  const goToPNTesting = () => navigation.navigate('testViewPNs')
  const goToLoadingScreen = () => navigation.navigate('testViewLoading')

  return (
    <PeachScrollView
      style={tw`h-full bg-primary-mild-1`}
      contentContainerStyle={tw`flex items-center w-full px-6 py-10`}
    >
      <OptionButton onPress={goToButtons}>Buttons</OptionButton>
      <OptionButton style={tw`mt-4`} onPress={goToPopups}>
        Popups
      </OptionButton>
      <OptionButton style={tw`mt-4`} onPress={goToMessages}>
        Messages
      </OptionButton>
      <OptionButton style={tw`mt-4`} onPress={goToComponents}>
        Components
      </OptionButton>
      <OptionButton style={tw`mt-4`} onPress={goToPNTesting}>
        Push notifications
      </OptionButton>
      <OptionButton style={tw`mt-4`} onPress={goToLoadingScreen}>
        Loading Screen
      </OptionButton>
    </PeachScrollView>
  )
}
