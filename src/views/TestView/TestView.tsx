import { View } from 'react-native'
import { Screen } from '../../components/Screen'
import { OptionButton } from '../../components/buttons/OptionButton'
import { useNavigation } from '../../hooks/useNavigation'
import tw from '../../styles/tailwind'

export const TestView = () => {
  const navigation = useNavigation()
  const goToPeachWalletTesting = () => navigation.navigate('testViewPeachWallet')
  const goToPNTesting = () => navigation.navigate('testViewPNs')

  return (
    <Screen>
      <View style={tw`justify-center gap-4 grow`}>
        <OptionButton onPress={goToPeachWalletTesting}>Peach wallet</OptionButton>
        <OptionButton onPress={goToPNTesting}>Push notifications</OptionButton>
      </View>
    </Screen>
  )
}
